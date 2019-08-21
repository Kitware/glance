import { mapState } from 'vuex';

import macro from 'vtk.js/Sources/macro';
import vtkDistanceWidget from 'vtk.js/Sources/Widgets/Widgets3D/DistanceWidget';
import { ViewTypes } from 'vtk.js/Sources/Widgets/Core/WidgetManager/Constants';

import toolsList from 'paraview-glance/src/components/tools/MeasurementTools/tools';
import utils from 'paraview-glance/src/utils';
import ProxyManagerMixin from 'paraview-glance/src/mixins/ProxyManagerMixin';

const { vtkErrorMacro } = macro;
const { makeSubManager, forAllViews } = utils;

function unsubList(list) {
  while (list.length) {
    list.pop().unsubscribe();
  }
}

function emptyPendingTool() {
  return {
    tool: null,
    widget: null,
    viewWidget: null,
    associatedRep: null,
    associatedView: null,
    slice: -1,
  };
}

// ----------------------------------------------------------------------------

export default {
  name: 'MeasurementTools',
  mixins: [ProxyManagerMixin],
  props: ['enabled'],
  data() {
    return {
      tools: toolsList,
      pendingTool: emptyPendingTool(),
      activeToolRepMap: {}, // repId -> [<pendingTool obj>, ...]
      targetVolumeId: -1,
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
        const { tool } = this.pendingTool;
        if (!tool) {
          throw new Error('No tool enabled. This should not happen.');
        }

        const widget = tool.widgetClass.newInstance();
        this.pendingTool = Object.assign(this.pendingTool, { widget });

        // add widget to views
        this.proxyManager
          .getViews()
          .forEach((view) => this.addToolToView(tool, widget, view));
      } else {
        // remove a pending tool if we disable measurements
        this.removePendingTool();
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
            this.removePendingTool();
            unsubList(this.viewSubs);
          }
          this.$emit('enable', false);
        }
        // update image selection
        this.$forceUpdate();
      } else if (proxyGroup === 'Representations') {
        if (
          action === 'register' &&
          proxy.isA('vtkSliceRepresentationProxy')
        ) {
          // listen to all slice representations
          // a bit expensive for reps that don't have measurements on them
          this.repSubs.push(proxy.onModified(this.onRepUpdate));
        } else if (
          action === 'unregister' &&
          proxyId in this.activeToolRepMap
        ) {
          const tools = this.activeToolRepMap[proxyId];
          for (let i = 0; i < widgets.length; i++) {
            const { widget, view } = tools[i];
            const widgetManager = view.getReferenceByName('widgetManager');
            widgetManager.removeWidget(widget);
          }
          delete this.activeToolRepMap[proxyId];
        }
      } else if (proxyGroup === 'Views' && action === 'register') {
        const { tool, widget, associatedRep } = this.pendingTool;
        if (widget && !associatedRep) {
          this.addToolToView(tool, widget, proxy);
        }
      }
    },
  },
  mounted() {
    this.tools = toolsList;

    this.repSubs = [];
    this.viewSubs = [];
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
    enableWidget(toolName) {
      const tool = this.tools.find((tool) => tool.name === toolName);
      if (!tool) {
        throw new Error('Failed to find tool. This should not happen.');
      }

      if (this.pendingTool.tool) {
        throw new Error('Cannot enable widget when one is pending. This should not happen.');
      }

      // We wait for the "enabled" prop to switch to true.
      // Enabling a tool when "enabled" is true should not happen. If it does,
      // those enable requests will be ignored.
      this.pendingTool.tool = tool;
      this.$emit('enable', true);
    },
    addToolToView(tool, widget, view) {
      const widgetManager = view.getReferenceByName('widgetManager');
      if (view.isA('vtkView2DProxy')) {
        const viewWidget = widgetManager.addWidget(
          widget,
          ViewTypes.SLICE
        );

        tool.prepareWidget(viewWidget);

        // update widget when moving between views
        // subscribe with a higher priority than the viewWidget
        this.viewSubs.push(
          view.getInteractor().onMouseMove(() => {
            const rep = this.proxyManager.getRepresentation(
              this.targetVolume,
              view
            );
            tool.onSliceUpdate(widget, view.getAxis(), rep.getSlice());
          }, viewWidget.getPriority() + 1)
        );

        // wait for first click. This is when we bind the widget to the
        // view and representation.
        this.viewSubs.push(
          view.getInteractor().onLeftButtonPress(() => {
            unsubList(this.viewSubs);

            // remove widgets from other views
            this.proxyManager
              .getViews()
              .filter((v) => v !== view)
              .forEach((v) => this.removeWidgetFromView(widget, v));

            // ensure we retain focus of the widget in this view
            // this is a hack to re-gain focus of our widget, since
            // calling releaseFocus() on other widgetManagers clears the
            // active state of the widget.
            widgetManager.releaseFocus();
            widgetManager.grabFocus(widget);

            // bind widget to view, rep and slice
            const rep = 
              this.proxyManager.getRepresentation(this.targetVolume, view);
            this.pendingTool.associatedRep = rep;
            this.pendingTool.viewWidget = viewWidget;
            this.pendingTool.slice = Math.round(rep.getSlice());

            // listen for tool final signal
            this.widgetStateSub.sub(
              widget.getWidgetState().onModified((state) => {
                if (tool.isWidgetFinalized(state)) {
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
      const { associatedRep } = this.pendingTool;
      const id = associatedRep.getProxyId();
      if (!(id in this.activeToolRepMap)) {
        this.activeToolRepMap[id] = [];
      }
      this.activeToolRepMap[id].push(this.pendingTool);
      this.pendingTool = emptyPendingTool();

      // we're done with our focused widget
      this.$emit('enable', false);
    },
    removePendingTool() {
      const { widget, associatedRep } = this.pendingTool;
      if (widget) {
        this.proxyManager.getViews().forEach((view) =>
          this.removeWidgetFromView(widget, view)
        );

        this.pendingTool = emptyPendingTool();
      }
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
      if (this.pendingTool.associatedRep === rep) {
        if (rep.getSlice() !== this.pendingTool.slice) {
          this.removePendingTool();
        }
      }

      const id = rep.getProxyId();
      const toolsInScene = this.activeToolRepMap[id] || [];
      const repSlice = rep.getSlice();
      for (let i = 0; i < toolsInScene.length; i++) {
        const { viewWidget, slice } = toolsInScene[i];
        const changed = viewWidget.setVisibility(repSlice === slice);
        if (changed) {
          // this will re-render the widget visibility
          viewWidget.getWidgetManager().enablePicking();
        }
      }

      // Maybe I can only render the 2D views where widgets updated.
      // For now, this will work just fine.
      this.proxyManager.renderAllViews();
    },
  },
};