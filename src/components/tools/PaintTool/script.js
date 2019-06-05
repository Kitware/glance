import { mapState } from 'vuex';

import macro from 'vtk.js/Sources/macro';
import vtkPaintWidget from 'vtk.js/Sources/Widgets/Widgets3D/PaintWidget';
import vtkPaintFilter from 'vtk.js/Sources/Filters/General/PaintFilter';
import { ViewTypes } from 'vtk.js/Sources/Widgets/Core/WidgetManager/Constants';

import vtkLabelMap from 'paraview-glance/src/vtk/LabelMap';
import ReaderFactory from 'paraview-glance/src/io/ReaderFactory';
import utils from 'paraview-glance/src/utils';
import PalettePicker from 'paraview-glance/src/components/widgets/PalettePicker';
import PopUp from 'paraview-glance/src/components/widgets/PopUp';
import { SPECTRAL } from 'paraview-glance/src/palette';
import ProxyManagerMixin from 'paraview-glance/src/mixins/ProxyManagerMixin';

const { vtkErrorMacro } = macro;
const { makeSubManager, forAllViews } = utils;

// ----------------------------------------------------------------------------

function linkInteractors(sourceView, destView) {
  const srcInt = sourceView.getInteractor();
  const dstInt = destView.getInteractor();
  const sync = {}; // dummy unique object for animation requesting

  let startSub;

  if (srcInt.isAnimating()) {
    dstInt.requestAnimation(sync);
  } else {
    startSub = srcInt.onStartAnimation(() => {
      dstInt.requestAnimation(sync);
    });
  }

  const endSub = srcInt.onEndAnimation(() => {
    dstInt.cancelAnimation(sync);
    // setTimeout(dstInt.render, 0);
  });

  return {
    unsubscribe: () => {
      startSub && startSub.unsubscribe();
      endSub.unsubscribe();
    },
  };
}

// ----------------------------------------------------------------------------

export default {
  name: 'PaintTool',
  components: {
    PalettePicker,
    PopUp,
  },
  mixins: [ProxyManagerMixin],
  data() {
    return {
      master: null,
      labelmapProxy: null,
      // for view purpose only
      // [ { label, color, opacity }, ... ], sorted by label asc
      colormapArray: [],
      widget: null,
      enabled: false,
      label: 1,
      radius: 5,
      palette: SPECTRAL,
      nextPaletteColorIdx: 0,
    };
  },
  computed: {
    ...mapState(['proxyManager']),
    masterSelection() {
      if (this.master) {
        return {
          name: this.master.getName(),
          sourceId: this.master.getProxyId(),
        };
      }
      return null;
    },
    labelmapSelection() {
      if (this.labelmapProxy) {
        return {
          name: this.labelmapProxy.getName(),
          sourceId: this.labelmapProxy.getProxyId(),
        };
      }
      return null;
    },
  },
  proxyManager: {
    onProxyRegistrationChange(info) {
      const { proxyGroup, action, proxyId } = info;
      if (proxyGroup === 'Sources') {
        if (action === 'unregister') {
          if (this.master && proxyId === this.master.getProxyId()) {
            this.master = null;
            this.enabled = false;
          }
          if (
            this.labelmapProxy && proxyId === this.labelmapProxy.getProxyId()
          ) {
            this.labelmapProxy = null;
          }
        }
        // update image selection
        this.$forceUpdate();
      }
    },
  },
  mounted() {
    this.widget = vtkPaintWidget.newInstance();
    this.widget.setRadius(this.radius);
    this.filter = null;
    this.view3D = null;

    this.subs = [];
    this.labelmapSub = makeSubManager();
  },
  beforeDestroy() {
    this.view3D = null;
    this.labelmapSub.unsub();

    while (this.subs.length) {
      this.subs.pop().unsubscribe();
    }
  },
  watch: {
    label(label) {
      if (label < 0) {
        this.label = 0;
      } else if (label !== Math.round(label)) {
        // also handles case if label is a numerical string
        this.label = Math.round(label);
      }
      this.filter.setLabel(this.label);
    },
    radius(radius) {
      if (radius < 0) {
        this.radius = 0;
      } else if (radius !== Math.round(radius)) {
        // also handles case if label is a numerical string
        this.radius = Math.round(radius);
      }
      this.filter.setRadius(this.radius);
      this.widget.setRadius(this.radius);
    },
    enabled(enabled) {
      if (enabled) {
        this.addWidgetToViews();
      } else {
        this.removeWidgetFromViews();

        while (this.subs.length) {
          this.subs.pop().unsubscribe();
        }
      }

      this.proxyManager.renderAllViews();
    },
  },
  methods: {
    getNextColorArray() {
      const color = this.palette[this.nextPaletteColorIdx];
      this.nextPaletteColorIdx =
        (this.nextPaletteColorIdx + 1) % this.palette.length;
      return this.fromHex(color);
    },
    asHex(colorArray) {
      return (
        '#' + colorArray.map((c) => ('00' + c.toString(16)).slice(-2)).join('')
      );
    },
    fromHex(colorStr) {
      const hex = colorStr.slice(1); // remove leading #
      const colorArray = [];
      for (let i = 0; i < hex.length; i += 2) {
        colorArray.push(Number.parseInt(hex.slice(i, i + 2), 16));
      }
      return colorArray;
    },
    getBrushSizeMax() {
      if (this.labelmapProxy) {
        const dims = this.labelmapProxy
          .getDataset()
          .getImageRepresentation()
          .getDimensions();
        return Math.floor(Math.max(...dims) / 2);
      }
      return 100;
    },
    getVolumes() {
      return this.proxyManager
        .getSources()
        .filter((s) => s.getType() === 'vtkImageData')
        .map((s) => ({
          name: s.getName(),
          sourceId: s.getProxyId(),
        }));
    },
    getLabelmaps() {
      const labelmaps = this.proxyManager
        .getSources()
        .filter((s) => s.getType() === 'vtkLabelMap')
        .map((s) => ({
          name: s.getName(),
          sourceId: s.getProxyId(),
        }));

      labelmaps.unshift({
        name: 'Create new labelmap',
        sourceId: 'CREATE_NEW_LABELMAP',
      });
      return labelmaps;
    },
    setMasterVolume(sourceId) {
      this.master = this.proxyManager.getProxyById(sourceId);

      if (this.enabled) {
        // refresh widgets when backing image changes
        this.removeWidgetFromViews();
        this.addWidgetToViews();
      }

      if (!this.master && this.enabled) {
        this.removeWidgetFromViews();
      }
    },
    setLabelMap(selected) {
      if (selected === 'CREATE_NEW_LABELMAP') {
        this.filter = vtkPaintFilter.newInstance();
        this.filter.setBackgroundImage(this.master.getDataset());
        this.filter.setRadius(this.radius);
        this.filter.setLabel(this.label);

        const paintImage = this.filter.getOutputData();
        /* eslint-disable-next-line import/no-named-as-default-member */
        const labelmap = vtkLabelMap.newInstance({
          imageRepresentation: paintImage,
        });

        ReaderFactory.registerReadersToProxyManager(
          [
            {
              name: `Labelmap for ${this.master.getName()}`,
              dataset: labelmap,
            },
          ],
          this.proxyManager
        );
        this.labelmapProxy = this.proxyManager.getActiveSource();

        // set color of label 1
        const color = this.getNextColorArray();
        labelmap.setLabelColor(1, color);

        // activate master source b/c we can't window/level nor slice scroll
        // on the labelmap proxy due to lack of property domains on the
        // labelmap proxy.
        this.master.activate();
      } else {
        this.labelmapProxy = this.proxyManager.getProxyById(selected);
      }

      if (this.labelmapProxy) {
        const labelmap = this.labelmapProxy.getDataset();
        const updateColorMap = () => {
          const cm = labelmap.getColorMap();
          const numComp = (a, b) => a - b;
          this.colormapArray = Object.keys(cm)
            .sort(numComp)
            .map((label) => ({
              label: Number(label), // object keys are always strings
              color: cm[label].slice(0, 3),
              opacity: cm[label][3],
            }));
        };
        this.labelmapSub.sub(labelmap.onModified(updateColorMap));
        // initialize colormap
        updateColorMap();
      }
    },
    setLabelColor(label, colorStr) {
      const lb = this.labelmapProxy.getDataset();
      const cm = lb.getColorMap();
      const origColor = cm[label];
      const colorArray = this.fromHex(colorStr);
      if (colorArray.length === 3) {
        lb.setLabelColor(label, [...colorArray, origColor[3]]);

        this.$forceUpdate();
        this.proxyManager.renderAllViews();
      }
    },
    setLabelOpacity(label, opacityInput) {
      const lb = this.labelmapProxy.getDataset();
      const cm = lb.getColorMap();
      const color = cm[label].slice();
      if (opacityInput) {
        // input is in [0, 255]
        color[3] = Number(opacityInput);
        lb.setLabelColor(label, color);
      }

      this.$forceUpdate();
      this.proxyManager.renderAllViews();
    },
    addLabel() {
      const labels = this.colormapArray.map((cm) => cm.label);
      // find next available label
      let newLabel = 0;
      while (labels.length) {
        const l = labels.shift();
        if (l - newLabel > 1) {
          newLabel++;
          break;
        }
        if (labels.length === 0) {
          newLabel = l + 1;
          break;
        }
        newLabel = l;
      }
      this.label = newLabel;

      const newColor = this.getNextColorArray();
      this.labelmapProxy.getDataset().setLabelColor(newLabel, newColor);

      this.$forceUpdate();
    },
    deleteLabel(label) {
      this.labelmapProxy.getDataset().removeLabel(label);

      // clear label from paintFilter's output image
      // this will update the internal painted image.
      const paintedImage = this.filter.getOutputData();
      const data = paintedImage
        .getPointData()
        .getScalars()
        .getData();
      for (let i = 0; i < data.length; i++) {
        if (data[i] === label) {
          data[i] = 0;
        }
      }

      // set this.label to a valid label (0 is always valid)
      this.label = 0;

      this.proxyManager.renderAllViews();
      this.$forceUpdate();
    },
    undo() {
      this.filter.undo();
      this.proxyManager.renderAllViews();
    },
    redo() {
      this.filter.redo();
      this.proxyManager.renderAllViews();
    },
    colorToBackgroundCSS(cmArray, index) {
      const { color, opacity } = cmArray[index];
      const rgba = [...color, opacity / 255];
      return {
        backgroundColor: `rgba(${rgba.join(',')})`,
      };
    },
    addWidgetToViews() {
      // helper method to update handle pos from slice
      const updateHandleFromSlice = (representation, view) => {
        const position = [0, 0, 0];
        // representation is in XYZ, not IJK, so slice is in world space
        position[view.getAxis()] = representation.getSlice();
        this.widget.getManipulator().setOrigin(position);
      };

      // helper method to update handle orientation
      const updateHandleOrientation = (view) => {
        if (view.isA('vtkView2DProxy')) {
          const normal = view.getCamera().getDirectionOfProjection();
          const handle = this.widget.getWidgetState().getHandle();
          const manipulator = this.widget.getManipulator();
          // since normal points away from camera, have handle normal point
          // towards camera so the paint widget can render the handle on top
          // of the image.
          handle.rotateFromDirections(
            handle.getDirection(),
            normal.map((n) => n * -1)
          );
          manipulator.setNormal(normal);
        }
      };

      // find 3d view; assume it always exists
      this.view3D = this.proxyManager
        .getViews()
        .find((v) => v.getClassName() === 'vtkViewProxy');
      if (!this.view3D) {
        vtkErrorMacro('Could not find a 3D view!');
        return;
      }

      // add widget to views
      this.subs.push(
        forAllViews(this.proxyManager, (view) => {
          const widgetManager = view.getReferenceByName('widgetManager');
          if (view.isA('vtkView2DProxy')) {
            const viewWidget = widgetManager.addWidget(
              this.widget,
              ViewTypes.SLICE
            );

            widgetManager.grabFocus(this.widget);

            // tell labelmap slice who the master slice is
            const masterRep = this.proxyManager.getRepresentation(
              this.master,
              view
            );

            const rep = this.proxyManager.getRepresentation(
              this.labelmapProxy,
              view
            );
            rep.setMasterSlice(masterRep);

            // update handle position on mouse move from slice position and
            // handle position
            this.subs.push(
              view.getInteractor().onStartMouseMove((callData) => {
                updateHandleOrientation(view);

                // Update handle based on master representation.
                // If we go based on labelmap representation,
                // we run the risk of creating the labelmap rep before the
                // master rep, which would result in the labelmap rep rendering
                // first, and thus rendering behind the master slice rep.
                const rep = this.proxyManager.getRepresentation(
                  this.master,
                  view
                );
                updateHandleFromSlice(rep, view);
              })
            );
            // link interactors
            this.subs.push(linkInteractors(view, this.view3D));

            this.subs.push(
              rep.onModified(() => updateHandleFromSlice(rep, view))
            );

            viewWidget.onStartInteractionEvent(() => {
              this.filter.startStroke();
              this.filter.addPoint(
                this.widget.getWidgetState().getTrueOrigin()
              );
            });

            viewWidget.onInteractionEvent(() => {
              if (viewWidget.getPainting()) {
                this.filter.addPoint(
                  this.widget.getWidgetState().getTrueOrigin()
                );
              }
            });

            viewWidget.onEndInteractionEvent(() => {
              this.filter.addPoint(
                this.widget.getWidgetState().getTrueOrigin()
              );
              this.filter.endStroke();
            });

            this.proxyManager.renderAllViews();
          } else {
            // all other views assumed to be 3D views
            widgetManager.disablePicking();
            widgetManager.addWidget(this.widget, ViewTypes.VOLUME);
          }
        })
      );

      // first handle orientation update
      updateHandleOrientation(this.proxyManager.getActiveView());
    },
    removeWidgetFromViews() {
      while (this.subs.length) {
        this.subs.pop().unsubscribe();
      }

      this.proxyManager.getViews().forEach((view) => {
        const widgetManager = view.getReferenceByName('widgetManager');
        if (widgetManager) {
          widgetManager.releaseFocus();
          widgetManager.removeWidget(this.widget);
        }
      });
    },
  },
};
