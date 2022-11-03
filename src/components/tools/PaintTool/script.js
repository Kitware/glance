import { mapState, mapActions } from 'vuex';

import vtkDataArray from '@kitware/vtk.js/Common/Core/DataArray';
import vtkPaintFilter from '@kitware/vtk.js/Filters/General/PaintFilter';
import { SlicingMode } from '@kitware/vtk.js/Rendering/Core/ImageMapper/Constants';

import vtkLabelMap from 'paraview-glance/src/vtk/LabelMap';
import PalettePicker from 'paraview-glance/src/components/widgets/PalettePicker';
import PopUp from 'paraview-glance/src/components/widgets/PopUp';
import SourceSelect from 'paraview-glance/src/components/widgets/SourceSelect';

import {
  createRepresentationInAllViews,
  makeSubManager,
} from 'paraview-glance/src/utils';
import { SPECTRAL } from 'paraview-glance/src/palette';

const SYNC = 'PaintToolSync';
const NEW_LABELMAP = -2;

// ----------------------------------------------------------------------------

function fromHex(colorStr) {
  const hex = colorStr.slice(1); // remove leading #
  const colorArray = [];
  for (let i = 0; i < hex.length; i += 2) {
    colorArray.push(Number.parseInt(hex.slice(i, i + 2), 16));
  }
  return colorArray;
}

// ----------------------------------------------------------------------------

function createLabelMapFromImage(imageData) {
  /* eslint-disable-next-line import/no-named-as-default-member */
  const labelMap = vtkLabelMap.newInstance(
    imageData.get('spacing', 'origin', 'direction')
  );
  labelMap.setDimensions(imageData.getDimensions());

  const values = new Uint16Array(imageData.getNumberOfPoints());
  /* eslint-disable-next-line import/no-named-as-default-member */
  const dataArray = vtkDataArray.newInstance({
    numberOfComponents: 1,
    values,
  });
  labelMap.getPointData().setScalars(dataArray);

  labelMap.computeTransforms();
  return labelMap;
}

// ----------------------------------------------------------------------------

export default {
  name: 'PaintTool',
  inject: ['girderRest'],
  components: {
    PalettePicker,
    PopUp,
    SourceSelect,
  },
  props: ['enabled'],
  data() {
    return {
      targetImageId: -1, // target image to paint
      activeLabelmapId: -1,
      internalLabelmaps: [],
      widgetId: -1,
      editingName: false,
      editableLabelmapName: '',
      brushSizeMax: 100,
      radius: 5,
      brush2D: false,
      // for view purpose only
      // [ { label, color, opacity }, ... ], sorted by label asc
      colormapArray: [],
    };
  },
  computed: {
    ...mapState('widgets', {
      imageToLabelmaps: (state) => state.imageToLabelmaps,
      labelmapToImage: (state) => state.labelmapToImage,
      labelmapStates: (state) => state.labelmapStates,
    }),
    labelmaps() {
      return [
        {
          name: 'Create new labelmap',
          sourceId: NEW_LABELMAP,
        },
      ].concat(this.internalLabelmaps);
    },
    activeLabel() {
      if (this.activeLabelmapState) {
        return this.activeLabelmapState.selectedLabel;
      }
      return -1;
    },
    activeLabelmapProxy() {
      return this.$proxyManager.getProxyById(this.activeLabelmapId);
    },
    activeLabelmapParentImageProxy() {
      return this.$proxyManager.getProxyById(
        this.labelmapToImage[this.activeLabelmapId]
      );
    },
    activeLabelmapState() {
      return this.labelmapStates[this.activeLabelmapId];
    },
    targetImageProxy() {
      return this.$proxyManager.getProxyById(this.targetImageId);
    },
    labelmapSelection() {
      if (this.activeLabelmapProxy) {
        return {
          name: this.editableLabelmapName || this.activeLabelmapProxy.getName(),
          sourceId: this.activeLabelmapProxy.getProxyId(),
        };
      }
      return null;
    },
    canPaint() {
      return this.targetImageId > -1 && this.activeLabelmapId > -1;
    },
    paintProxy() {
      return this.$proxyManager.getProxyById(this.widgetId);
    },
  },
  watch: {
    editableLabelmapName(name) {
      if (this.activeLabelmapProxy) {
        this.activeLabelmapProxy.setName(name);
      }
    },
    activeLabel(label) {
      if (this.filter) {
        this.filter.setLabel(label);
      }
    },
    radius(radius) {
      if (this.filter) {
        this.filter.setRadius(radius);
      }
      if (this.paintProxy) {
        this.paintProxy.getWidget().setRadius(radius);
      }
    },
    enabled(enabled) {
      if (enabled) {
        this.enablePainting();
      } else {
        this.disablePainting();
      }
    },
    activeLabelmapProxy() {
      if (this.activeLabelmapProxy) {
        this.editableLabelmapName = this.activeLabelmapProxy.getName();

        const dims = this.activeLabelmapProxy.getDataset().getDimensions();
        this.brushSizeMax = Math.floor(Math.max(...dims) / 2);

        const labelmap = this.activeLabelmapProxy.getDataset();
        this.labelmapSub.sub(labelmap.onModified(this.updateColorMap));
        this.updateColorMap();
      } else {
        this.labelmapSub.unsub();
      }

      // always hide renaming field if we switch labelmaps
      this.editingName = false;
    },
  },
  proxyManagerHooks: {
    onProxyModified(proxy) {
      if (
        this.enabled &&
        proxy.getProxyGroup() === 'Representations' &&
        proxy.getInput() === this.activeLabelmapProxy &&
        this.mousedViewId > -1
      ) {
        const view = this.$proxyManager.getProxyById(this.mousedViewId);
        this.updateHandleSlice(view);
      }

      if (
        proxy.getProxyGroup() === 'Sources' &&
        proxy.getProxyName() === 'LabelMap'
      ) {
        const entry = this.internalLabelmaps.find(
          (l) => l.sourceId === proxy.getProxyId()
        );
        if (entry) {
          entry.name = proxy.getName();
        }
      }
    },
    onProxyCreated({ proxy, proxyGroup, proxyName, proxyId }) {
      if (proxyGroup === 'Sources' && proxyName === 'LabelMap') {
        this.internalLabelmaps.push({
          name: proxy.getName(),
          sourceId: proxyId,
        });
      }
    },
    onProxyDeleted({ proxyGroup, proxyName, proxyId }) {
      if (proxyGroup === 'Sources' && proxyName === 'LabelMap') {
        const idx = this.internalLabelmaps.findIndex(
          (l) => l.sourceId === proxyId
        );
        if (idx > -1) {
          this.internalLabelmaps.splice(idx, 1);
        }
      }

      if (proxyId === this.activeLabelmapId) {
        this.activeLabelmapId = -1;
        this.$emit('enable', false);
      } else if (proxyId === this.targetImageId) {
        this.targetImageId = -1;
        this.$emit('enable', false);
      }
    },
  },
  created() {
    this.palette = SPECTRAL;
    this.mousedViewId = -1;
    this.filter = null;
    this.labelmapSub = makeSubManager();

    // populate initial labelmap list
    this.internalLabelmaps = this.$proxyManager
      .getSources()
      .filter((s) => s.getProxyName() === 'LabelMap')
      .map((s) => ({
        name: s.getName(),
        sourceId: s.getProxyId(),
      }));
  },
  beforeDestroy() {
    if (this.enabled) {
      this.disablePainting();
    }
    this.labelmapSub.unsub();
  },
  methods: {
    ...mapActions({
      addLabelmapToImage(dispatch, labelmapId, imageId) {
        return dispatch('widgets/addLabelmapToImage', { imageId, labelmapId });
      },
      setLabelmapState(dispatch, labelmapId, labelmapState) {
        return dispatch('widgets/setLabelmapState', {
          labelmapId,
          labelmapState,
        });
      },
      deleteLabelmapInternal(dispatch, labelmapId) {
        return dispatch('widgets/deleteLabelmap', labelmapId);
      },
    }),
    setRadius(r) {
      this.radius = Math.max(1, Math.round(r));
    },
    setLabel(l) {
      const lmState = this.activeLabelmapState;
      if (lmState) {
        lmState.selectedLabel = Number(l);
      }
    },
    editName() {
      if (this.labelmapSelection) {
        this.editingName = !this.editingName;
      }
    },
    deleteLabelmap() {
      if (this.activeLabelmapProxy) {
        this.deleteLabelmapInternal(this.activeLabelmapProxy.getProxyId());
        this.$proxyManager.deleteProxy(this.activeLabelmapProxy);
      }
    },
    filterImageData(source) {
      return (
        source.getProxyName() === 'TrivialProducer' &&
        source.getType() === 'vtkImageData'
      );
    },
    asHex(colorArray) {
      return `#${colorArray
        .map((c) => `00${c.toString(16)}`.slice(-2))
        .join('')}`;
    },
    setTargetVolume(sourceId) {
      this.targetImageId = sourceId;
      this.$emit('enable', false);
    },
    setLabelMap(selectionId) {
      this.filter = vtkPaintFilter.newInstance();

      if (selectionId === NEW_LABELMAP) {
        const backgroundImage = this.targetImageProxy.getDataset();
        this.filter.setBackgroundImage(backgroundImage);

        const lmProxy = this.$proxyManager.createProxy('Sources', 'LabelMap');
        const lmProxyId = lmProxy.getProxyId();
        this.activeLabelmapId = lmProxyId;

        this.addLabelmapToImage(lmProxyId, this.targetImageId);
        const labelmapNum = this.imageToLabelmaps[this.targetImageId].length;

        // stores state associated with each labelmap
        const lmState = {
          // selected label in the labelmap
          selectedLabel: 1,
          // the last generated color index
          lastColorIndex: 0,
        };
        this.setLabelmapState(lmProxyId, lmState);

        const baseImageName = this.targetImageProxy.getName();
        lmProxy.setName(`Labelmap ${labelmapNum} ${baseImageName}`);

        const labelMap = createLabelMapFromImage(backgroundImage);
        labelMap.setLabelColor(lmState.selectedLabel, fromHex(this.palette[0]));

        lmProxy.setInputData(labelMap);
        this.filter.setLabelMap(labelMap);

        createRepresentationInAllViews(this.$proxyManager, lmProxy);
        this.$proxyManager.renderAllViews();
      } else {
        const lmProxy = this.$proxyManager.getProxyById(selectionId);
        if (lmProxy) {
          this.activeLabelmapId = lmProxy.getProxyId();
          this.filter.setLabelMap(lmProxy.getDataset());
        }
      }

      this.filter.setLabel(this.activeLabelmapState.selectedLabel);
      this.filter.setRadius(this.radius);

      // need this so we can window/level/slice the original dataset
      this.$proxyManager.getViews().forEach((view) => {
        const source = this.targetImageProxy;
        const rep = this.$proxyManager.getRepresentation(source, view);
        if (view.bindRepresentationToManipulator && rep) {
          view.bindRepresentationToManipulator(rep);
        }
      });
    },
    updateColorMap() {
      const proxy = this.activeLabelmapProxy;
      if (proxy) {
        const labelmap = proxy.getDataset();
        const cm = labelmap.getColorMap();
        const numComp = (a, b) => a - b;
        this.colormapArray = Object.keys(cm)
          .sort(numComp)
          .map((label) => ({
            label: Number(label), // object keys are always strings
            color: cm[label].slice(0, 3),
            opacity: cm[label][3],
          }));
      }
    },
    setLabelColor(label, colorStr) {
      const lb = this.activeLabelmapProxy.getDataset();
      const cm = lb.getColorMap();
      const origColor = cm[label];
      const colorArray = fromHex(colorStr);
      if (colorArray.length === 3) {
        lb.setLabelColor(label, [...colorArray, origColor[3]]);
        this.$proxyManager.renderAllViews();
      }
    },
    setLabelOpacity(label, opacityInput) {
      const lb = this.activeLabelmapProxy.getDataset();
      const cm = lb.getColorMap();
      const color = cm[label].slice();
      if (opacityInput) {
        // input is in [0, 255]
        color[3] = Number(opacityInput);
        lb.setLabelColor(label, color);
      }

      this.$proxyManager.renderAllViews();
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

      const lmState = this.activeLabelmapState;
      const colorIndex = (lmState.lastColorIndex + 1) % this.palette.length;
      const newColor = fromHex(this.palette[colorIndex]);

      this.activeLabelmapProxy.getDataset().setLabelColor(newLabel, newColor);
      lmState.lastColorIndex = colorIndex;

      this.setLabel(newLabel);
    },
    deleteLabel(label) {
      const labelmap = this.activeLabelmapProxy.getDataset();
      labelmap.removeLabel(label);

      // clear label
      const data = labelmap.getPointData().getScalars().getData();
      for (let i = 0; i < data.length; i++) {
        if (data[i] === label) {
          data[i] = 0;
        }
      }

      // set this.label to a valid label (0 is always valid)
      this.setLabel(0);

      this.$proxyManager.renderAllViews();
    },
    undo() {
      this.filter.undo();
      this.$proxyManager.renderAllViews();
    },
    redo() {
      this.filter.redo();
      this.$proxyManager.renderAllViews();
    },
    colorToBackgroundCSS(cmArray, index) {
      const { color, opacity } = cmArray[index];
      const rgba = [...color, opacity / 255];
      return {
        backgroundColor: `rgba(${rgba.join(',')})`,
      };
    },
    updateHandleSlice(view) {
      const position = [0, 0, 0];
      const manipulator = this.paintProxy.getWidget().getManipulator();
      const representation = this.$proxyManager.getRepresentation(
        this.targetImageProxy,
        view
      );
      // representation is in XYZ, not IJK, so slice is in world space
      position[view.getAxis()] = representation.getSlice();
      manipulator.setHandleOrigin(position);
    },
    enablePainting() {
      const paintProxy = this.$proxyManager.createProxy('Widgets', 'Paint');
      paintProxy.getWidget().setRadius(this.radius);
      paintProxy
        .getWidget()
        .placeWidget(this.activeLabelmapProxy.getDataset().getBounds());

      this.widgetId = paintProxy.getProxyId();
      this.mousedViewId = -1;

      const view3DHandler = (view) => {
        // sync animations across views
        view.getInteractor().requestAnimation(SYNC);

        // cleanup func
        return () => {
          view.getInteractor().cancelAnimation(SYNC);
        };
      };

      const view2DHandler = (view, widgetManager, viewWidget) => {
        // sync animations across views
        view.getInteractor().requestAnimation(SYNC);

        widgetManager.grabFocus(viewWidget);

        // listeners must have higher priority than widgets
        const priority = viewWidget.getPriority() + 1;

        const vsub = view.getInteractor().onMouseMove(() => {
          if (this.mousedViewId === view.getProxyId()) {
            return;
          }
          this.mousedViewId = view.getProxyId();

          this.updateHandleSlice(view);
        }, priority);

        const s1 = viewWidget.onStartInteractionEvent(() => {
          if (this.brush2D) {
            this.filter.setSlicingMode(SlicingMode['XYZ'[view.getAxis()]]);
          } else {
            this.filter.setSlicingMode(SlicingMode.NONE);
          }
          this.filter.startStroke();
          this.filter.addPoint(
            this.paintProxy.getWidgetState().getTrueOrigin()
          );
        });

        const s2 = viewWidget.onInteractionEvent(() => {
          if (viewWidget.getPainting()) {
            this.filter.addPoint(
              this.paintProxy.getWidgetState().getTrueOrigin()
            );
          }
        });

        const s3 = viewWidget.onEndInteractionEvent(() => {
          this.filter.addPoint(
            this.paintProxy.getWidgetState().getTrueOrigin()
          );
          this.filter.endStroke();
        });

        // cleanup funcs
        return [
          () => view.getInteractor().cancelAnimation(SYNC),
          vsub.unsubscribe,
          s1.unsubscribe,
          s2.unsubscribe,
          s3.unsubscribe,
        ];
      };

      paintProxy.addToViews();

      paintProxy.executeViewFuncs({
        View3D: view3DHandler,
        View2D_X: view2DHandler,
        View2D_Y: view2DHandler,
        View2D_Z: view2DHandler,
      });
    },
    disablePainting() {
      this.paintProxy.removeFromViews();
      this.$proxyManager.deleteProxy(this.paintProxy);
      this.widgetId = -1;
    },
    upload() {
      setTimeout(() => {
        const proxy = this.activeLabelmapProxy;
        const parentImageProxy = this.activeLabelmapParentImageProxy;
        if (proxy && parentImageProxy) {
          if (parentImageProxy.getKey('girderProvenance')) {
            proxy.setKey(
              'girderProvenance',
              parentImageProxy.getKey('girderProvenance')
            );
          }
          this.$root.$emit('girder_upload_proxy', this.activeLabelmapId);
        }
      }, 10);
    },
  },
};
