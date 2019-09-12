import { mapState } from 'vuex';

import macro from 'vtk.js/Sources/macro';
import vtkDistanceWidget from 'vtk.js/Sources/Widgets/Widgets3D/DistanceWidget';
import { ViewTypes } from 'vtk.js/Sources/Widgets/Core/WidgetManager/Constants';

import PopUp from 'paraview-glance/src/components/widgets/PopUp';
import PalettePicker from 'paraview-glance/src/components/widgets/PalettePicker';
import toolList from 'paraview-glance/src/components/tools/MeasurementTools/tools';
import utils from 'paraview-glance/src/utils';
import ProxyManagerMixin from 'paraview-glance/src/mixins/ProxyManagerMixin';
import SvgIcon from 'paraview-glance/src/components/widgets/SvgIcon';
import { createPaletteCycler, SPECTRAL } from 'paraview-glance/src/palette';

const { vtkErrorMacro } = macro;
const { makeSubManager, forAllViews } = utils;

const PALETTE = ['#ffee00'].concat(SPECTRAL);

function unsubList(list) {
  while (list.length) {
    list.pop().unsubscribe();
  }
}

function emptyTool() {
  return {
    toolInfo: null,
    widget: null,
    viewWidget: null,
    repId: -1,
    slice: -1,
    stateSub: makeSubManager(),
    measurement: null,
    name: '',
    size: 16,
    color: PALETTE[0],
  };
}

// ----------------------------------------------------------------------------

export default {
  name: 'MeasurementTools',
  mixins: [ProxyManagerMixin],
  props: ['enabled'],
  components: {
    PopUp,
    PalettePicker,
    SvgIcon,
  },
  data() {
    return {
      toolList,
      pendingTool: emptyTool(),
      tools: [], // [{ repId, ...emptyTool() }, ....]
      targetVolumeId: -1,
      palette: PALETTE,
      pendingViewWidgets: [],
    };
  },
  computed: {
    ...mapState(['proxyManager']),
    targetVolume() {
      return this.proxyManager.getProxyById(this.targetVolumeId);
    },
    volumeSelection() {
      if (this.targetVolume) {
        return {
          name: this.targetVolume.getName(),
          sourceId: this.targetVolume.getProxyId(),
        };
      }
      return null;
    },
  },
  watch: {
    enabled(enabled) {
      if (enabled) {
        const { toolInfo } = this.pendingTool;
        if (!toolInfo) {
          throw new Error('No tool enabled. This should not happen.');
        }

        const widget = toolInfo.widgetClass.newInstance();
        this.pendingTool = Object.assign(this.pendingTool, {
          widget,
          color: this.paletteCycler.next(),
        });

        // add widget to views
        this.proxyManager
          .getViews()
          .forEach((view) => this.addToolToView(this.pendingTool, view));
      } else {
        // remove a pending tool if we disable measurements
        this.removePendingTool();
      }
    },
    targetVolumeId() {
      if (this.enabled) {
        this.disable();
      }
    },
  },
  proxyManager: {
    onProxyRegistrationChange(info) {
      const { proxyGroup, action, proxy, proxyId } = info;
      if (proxyGroup === 'Sources') {
        if (action === 'unregister') {
          if (proxyId === this.targetVolumeId) {
            this.targetVolumeId = -1;
          }
        }
        // update image selection
        this.$forceUpdate();
      } else if (proxyGroup === 'Representations') {
        if (action === 'register' && proxy.isA('vtkSliceRepresentationProxy')) {
          // listen to all slice representations
          // a bit expensive for reps that don't have measurements on them
          this.repSubs.push(proxy.onModified(this.onRepUpdate));
        } else if (action === 'unregister') {
          // remove tools associated with the deleted representation
          this.tools
            .filter((tool) => tool.repId === proxyId)
            .forEach((tool) => this.removeTool(tool));
          this.tools = this.tools.filter((tool) => tool.repId !== proxyId);
        }
      } else if (proxyGroup === 'Views' && action === 'register') {
        const { widget, repId } = this.pendingTool;
        if (widget && repId === -1) {
          this.addToolToView(this.pendingTool, proxy);
        }
      }
    },
  },
  mounted() {
    this.paletteCycler = createPaletteCycler(this.palette);
    // used during the duration of widget placement
    this.viewSubs = [];
    // used to show/hide widgets per slice
    this.repSubs = [];
    this.widgetStateSub = makeSubManager();
  },
  beforeDestroy() {
    this.addWidgetSub.unsub();
    this.widgetStateSub.unsub();
    unsubList(this.repSubs);
    unsubList(this.viewSubs);
  },
  methods: {
    getVolumes() {
      return this.proxyManager
        .getSources()
        .filter((s) => s.getType() === 'vtkImageData')
        .map((s) => ({
          name: s.getName(),
          sourceId: s.getProxyId(),
        }));
    },
    setTargetVolume(sourceId) {
      this.targetVolumeId = sourceId;
    },
    enable(toolName) {
      const toolInfo = this.toolList.find((info) => info.name === toolName);
      if (!toolInfo) {
        throw new Error('Failed to find tool. This should not happen.');
      }

      if (this.pendingTool.toolInfo) {
        throw new Error(
          'Cannot enable widget when one is pending. This should not happen.'
        );
      }

      // We wait for the "enabled" prop to switch to true.
      // Enabling a tool when "enabled" is true should not happen. If it does,
      // those enable requests will be ignored.
      this.pendingTool.toolInfo = toolInfo;
      this.$emit('enable', true);
    },
    disable() {
      this.removePendingTool();
      unsubList(this.viewSubs);
      this.$emit('enable', false);
    },
    addToolToView(tool, view) {
      const widgetManager = view.getReferenceByName('widgetManager');
      if (view.isA('vtkView2DProxy')) {
        const { toolInfo, widget, size, color } = tool;
        const viewWidget = widgetManager.addWidget(widget, ViewTypes.SLICE);

        this.pendingViewWidgets.push(viewWidget);

        // style the view widget
        toolInfo.prepareWidget(viewWidget);
        toolInfo.setWidgetSize(viewWidget, size);
        toolInfo.setWidgetColor(viewWidget, color);

        // start the view widget as not visible. This is to simplify
        // the onMouseMove logic below.
        viewWidget.setVisibility(false);

        // update widget when moving between views
        // subscribe with a higher priority than the viewWidget
        this.viewSubs.push(
          view.getInteractor().onMouseMove(() => {
            const rep = this.proxyManager.getRepresentation(
              this.targetVolume,
              view
            );
            const slice = Math.round(rep.getSlice());
            toolInfo.onSliceUpdate(widget, viewWidget, view.getAxis(), slice);

            // hide the other view widgets
            if (!viewWidget.getVisibility()) {
              viewWidget.setVisibility(true);
              this.pendingViewWidgets
                .filter((vw) => vw != viewWidget)
                .forEach((vw) => vw.setVisibility(false));
              // Need to update current widget for render
              widgetManager.enablePicking();
              this.proxyManager.renderAllViews();
            }
          }, viewWidget.getPriority() + 1)
        );

        // wait for first click. This is when we bind the widget to the
        // view and representation.
        this.viewSubs.push(
          view.getInteractor().onLeftButtonPress(() => {
            // unsub from onMouseMove (from above)
            unsubList(this.viewSubs);

            // remove widgets from other views
            this.proxyManager
              .getViews()
              .filter((v) => v !== view)
              .forEach((v) => this.removeWidgetFromView(widget, v));

            this.pendingViewWidgets = [];

            if (!viewWidget.getVisibility()) {
              viewWidget.setVisibility(true);
              widgetManager.enablePicking();
              view.renderLater();
            }

            // ensure we retain focus of the widget in this view
            // this is a hack to re-gain focus of our widget, since
            // calling releaseFocus() on other widgetManagers clears the
            // active state of the widget.
            widgetManager.releaseFocus();
            widgetManager.grabFocus(widget);

            // bind widget to view, rep and slice
            const rep = this.proxyManager.getRepresentation(
              this.targetVolume,
              view
            );
            this.pendingTool = Object.assign(this.pendingTool, {
              repId: rep.getProxyId(),
              viewWidget,
              slice: Math.round(rep.getSlice()),
            });

            // listen for tool final signal
            this.widgetStateSub.sub(
              widget.getWidgetState().onModified((state) => {
                if (toolInfo.isWidgetFinalized(state)) {
                  this.widgetStateSub.unsub();
                  this.finalizeToolPlacement();
                }
              })
            );
          }, viewWidget.getPriority() + 1)
        );

        widgetManager.enablePicking();
        widgetManager.releaseFocus();
        widgetManager.grabFocus(widget);

        view.renderLater();
      }
    },
    finalizeToolPlacement() {
      // finalize widget by adding it to active tool list
      const toolInstance = this.pendingTool;
      this.tools.push(toolInstance);

      this.pendingTool = emptyTool();

      const { toolInfo, widget, stateSub } = toolInstance;
      // attach widget state listener
      // TODO unsub when removing the widget
      if (toolInfo.onWidgetStateUpdate) {
        stateSub.sub(
          widget.getWidgetState().onModified((state) => {
            toolInfo.onWidgetStateUpdate(toolInstance);
            toolInstance.measurement = toolInfo.measurementCallback(widget);
          })
        );
      }

      // we're done with our focused widget
      this.disable();
    },
    removePendingTool() {
      const { widget } = this.pendingTool;
      if (widget) {
        this.proxyManager
          .getViews()
          .forEach((view) => this.removeWidgetFromView(widget, view));
      }
      this.pendingTool = emptyTool();
    },
    removeTool(tool) {
      this.proxyManager
        .getViews()
        .forEach((view) => this.removeWidgetFromView(tool.widget, view));
      tool.stateSub.unsub();
      tool.widget.delete();
      tool.viewWidget.delete();
      tool.widget = null;
      tool.viewWidget = null;
    },
    removeWidgetFromView(widget, view) {
      const widgetManager = view.getReferenceByName('widgetManager');
      if (widgetManager) {
        widgetManager.releaseFocus();
        widgetManager.removeWidget(widget);
        view.renderLater();
      }
    },
    onRepUpdate(rep) {
      const repSlice = Math.round(rep.getSlice());
      if (this.pendingTool.repId === rep.getProxyId()) {
        if (repSlice !== this.pendingTool.slice) {
          this.disable();
        }
      }

      const id = rep.getProxyId();
      const toolsInScene = this.tools.filter((tool) => tool.repId === id);
      const widgetManagersToUpdate = new Set();
      for (let i = 0; i < toolsInScene.length; i++) {
        const { viewWidget, slice } = toolsInScene[i];
        const changed = viewWidget.setVisibility(repSlice === slice);
        if (changed) {
          widgetManagersToUpdate.add(viewWidget.getWidgetManager());
        }
      }

      const views = this.proxyManager.getViews();
      for (let i = 0; i < views.length; i++) {
        const wm = views[i].getReferenceByName('widgetManager');
        if (wm && widgetManagersToUpdate.has(wm)) {
          wm.enablePicking();
          views[i].renderLater();
        }
      }
    },
    setToolName(idx, newName) {
      if (idx >= 0 && idx < this.tools.length) {
        this.tools[idx].name = newName;
      }
    },
    setToolColor(idx, newColorHex) {
      if (idx >= 0 && idx < this.tools.length) {
        const { toolInfo, viewWidget } = this.tools[idx];
        toolInfo.setWidgetColor(viewWidget, newColorHex);
        this.tools[idx].color = newColorHex;

        // hacky way to update color selection and svg
        this.$forceUpdate();
        this.proxyManager.renderAllViews();
      }
    },
    setToolSize(idx, newSize) {
      if (idx >= 0 && idx < this.tools.length) {
        const { toolInfo, viewWidget } = this.tools[idx];
        toolInfo.setWidgetSize(viewWidget, newSize);
        this.tools[idx].size = newSize;

        // hacky way to re-render svg
        this.proxyManager.renderAllViews();
      }
    },
    deleteTool(idx) {
      if (idx >= 0 && idx < this.tools.length) {
        const [deletedTool] = this.tools.splice(idx, 1);
        this.removeTool(deletedTool);
      }
    },
    focusWidget(idx) {
      if (idx >= 0 && idx < this.tools.length) {
        const { repId, slice } = this.tools[idx];
        const rep = this.proxyManager.getProxyById(repId);
        if (rep) {
          rep.setSlice(slice);
        }
      }
    },
  },
};
