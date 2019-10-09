import { mapState } from 'vuex';

import { ViewTypes } from 'vtk.js/Sources/Widgets/Core/WidgetManager/Constants';

import PopUp from 'paraview-glance/src/components/widgets/PopUp';
import PalettePicker from 'paraview-glance/src/components/widgets/PalettePicker';
import toolList from 'paraview-glance/src/components/tools/MeasurementTools/tools';
import SourceSelect from 'paraview-glance/src/components/widgets/SourceSelect';
import ProxyManagerMixin from 'paraview-glance/src/mixins/ProxyManagerMixin';
import SvgIcon from 'paraview-glance/src/components/widgets/SvgIcon';
import { createPaletteCycler, WIDGETS } from 'paraview-glance/src/palette';
import { makeSubManager } from 'paraview-glance/src/utils';

const PALETTE = ['#ffee00'].concat(WIDGETS);

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
    axis: '',
    stateSub: makeSubManager(),
    name: '',
    extraInfo: '',
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
    SourceSelect,
  },
  data() {
    return {
      toolList,
      pendingTool: emptyTool(),
      tools: [], // [{ repId, ...emptyTool() }, ....]
      targetVolumeId: -1,
      palette: PALETTE,
      pendingViewWidgets: [],
      // only used when enabling the measurement tools
      nextTool: null,
      currentSlice: -1,
      threeDViewActive: false,
    };
  },
  computed: {
    ...mapState(['proxyManager']),
    targetVolume() {
      return this.proxyManager.getProxyById(this.targetVolumeId);
    },
    activeToolIndex: {
      get() {
        if (this.pendingTool.toolInfo) {
          const name = this.pendingTool.toolInfo.name;
          return this.toolList.findIndex((t) => t.name === name);
        }
        return -1;
      },
      set(index) {
        this.toggle(this.toolList[index]);
      },
    },
    show2DWarning() {
      return this.threeDViewActive && this.pendingTool.toolInfo;
    },
  },
  watch: {
    enabled(enabled) {
      if (enabled) {
        this.switchToTool(this.nextTool);
        this.nextTool = null;
      } else {
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
      if (proxyGroup === 'Representations') {
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
    onActiveViewChange(view) {
      this.threeDViewActive = view.getClassName() === 'vtkViewProxy';
    },
  },
  mounted() {
    this.threeDViewActive =
      this.proxyManager.getActiveView().getClassName() === 'vtkViewProxy';

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
    filterImages(source) {
      return source && source.getType() === 'vtkImageData';
    },
    setTargetVolume(sourceId) {
      this.targetVolumeId = sourceId;
    },
    toggle(toolInfo) {
      if (this.enabled) {
        if (!toolInfo) {
          this.disable();
        } else {
          this.switchToTool(toolInfo);
        }
      } else {
        this.nextTool = toolInfo;
        this.$emit('enable', true);
      }
    },
    disable() {
      this.removePendingTool();
      this.$emit('enable', false);
    },
    switchToTool(toolInfo) {
      if (this.pendingTool.toolInfo) {
        this.removePendingTool();
      }

      this.pendingTool.toolInfo = toolInfo;

      const widget = toolInfo.widgetClass.newInstance();
      this.pendingTool = Object.assign(this.pendingTool, {
        widget,
        color: this.paletteCycler.next(),
      });

      // add widget to views
      this.proxyManager
        .getViews()
        .forEach((view) => this.addToolToView(this.pendingTool, view));
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
            if (!viewWidget.hasFocus()) {
              widgetManager.releaseFocus();
              widgetManager.grabFocus(viewWidget);
            }

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
                .filter((vw) => vw !== viewWidget)
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
            const slice = Math.round(rep.getSlice());
            this.pendingTool = Object.assign(this.pendingTool, {
              repId: rep.getProxyId(),
              viewWidget,
              slice,
              axis: 'XYZ'[view.getAxis()],
            });

            // record current slice
            this.currentSlice = slice;

            if (toolInfo.isWidgetFinalized(widget.getWidgetState())) {
              this.finalizeToolPlacement();
            } else {
              // listen for tool final signal
              this.widgetStateSub.sub(
                widget.getWidgetState().onModified((state) => {
                  if (toolInfo.isWidgetFinalized(state)) {
                    this.widgetStateSub.unsub();
                    this.finalizeToolPlacement();
                  }
                })
              );
            }
          }, viewWidget.getPriority() + 1)
        );

        widgetManager.enablePicking();

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
      if (toolInfo.onWidgetStateUpdate) {
        stateSub.sub(
          widget
            .getWidgetState()
            .onModified(() => toolInfo.onWidgetStateUpdate(toolInstance))
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
      unsubList(this.viewSubs);
      this.widgetStateSub.unsub();
    },

    /* eslint-disable no-param-reassign */
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
    /* eslint-enable no-param-reassign */
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

      this.currentSlice = repSlice;

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
        const { viewWidget } = this.tools[idx];
        this.tools[idx].name = newName;
        this.tools[idx].toolInfo.setWidgetName(viewWidget, newName);
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
    getButtonStyle(toolName) {
      return [
        this.$style.toolButton,
        this.pendingTool.toolInfo && this.pendingTool.toolInfo.name === toolName
          ? this.$style.activeToolButton
          : null,
      ];
    },
  },
};
