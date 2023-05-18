import { WIDGETS } from 'paraview-glance/src/palette';
import { mapState } from 'vuex';
import ToolSvgPortal from 'paraview-glance/src/components/tools/ToolSvgPortal';
import Vue from 'vue';

// ----------------------------------------------------------------------------

export function updateProps(viewWidget, propsToUpdate) {
  const propNames = Object.keys(propsToUpdate);
  for (let i = 0; i < propNames.length; i++) {
    const name = propNames[i];
    const props = viewWidget[`get${name}Props`]();
    viewWidget[`set${name}Props`](Object.assign(props, propsToUpdate[name]));
  }
}

// ----------------------------------------------------------------------------

export default (toolName, extraComponent = {}) => ({
  name: `${toolName}Tool`,
  components: { ToolSvgPortal },
  props: {
    // should always be a valid proxy id
    targetPid: { required: true },
    /**
     * Structure of data:
     * {
     *   name: String,
     *   points[N]: [[xyz], ...],
     *   lockToSlice: Number|null,
     *   axis: 0|1|2|null,
     *   color: String,
     *   textSize: 12,
     * }
     */
    toolData: { required: true },
  },
  data() {
    return {
      name: `2D ${toolName}`,
      finalized: false,
      lockToSlice: null,
      axis: null,
      widgetPid: -1,
      targetViewId: -1,
      color: WIDGETS[0],
      textSize: 16,
      measurements: this.initialMeasurements(),
      measurementLabels: this.getMeasurementLabels(),
      initialSlicePlacement: null,
      mouseFocusedViewId: -1,
      svgComponent: extraComponent.svgComponent,
      // viewProxyId -> properties: { visible }
      viewWidgetProperties: {},
    };
  },
  computed: {
    targetProxy() {
      return this.$proxyManager.getProxyById(this.targetPid);
    },
    targetView() {
      return this.$proxyManager.getProxyById(this.targetViewId);
    },
    widgetProxy() {
      return this.$proxyManager.getProxyById(this.widgetPid);
    },
    targetRepresentation() {
      return this.$proxyManager.getRepresentation(
        this.targetProxy,
        this.targetView
      );
    },
    displayedMeasurements() {
      return this.getDisplayedMeasurements();
    },
    ...mapState('widgets', {
      distanceUnitSymbol: (state) => state.distanceUnitSymbol,
      distanceUnitFactor: (state) => state.distanceUnitFactor,
    }),
  },
  watch: extraComponent.watch || {},
  proxyManagerHooks: {
    onProxyModified(proxy) {
      if (proxy && proxy === this.targetRepresentation && this.widgetProxy) {
        if (this.finalized) {
          this.updateWidgetVisibility();
        } else if (
          this.initialSlicePlacement !== null &&
          Math.round(proxy.getSlice()) !== this.initialSlicePlacement
        ) {
          this.emitRemove();
        } else {
          this.updateOrientation();
        }
      }

      if (proxy === this.widgetProxy) {
        const state = this.widgetProxy.getWidgetState();
        const numberOfHandles = state.getHandleList().length;
        if (
          numberOfHandles === 1 &&
          this.targetViewId === -1 &&
          this.initialSlicePlacement === null
        ) {
          // bind to slice and view
          // assumes mouseFocusedViewId is not -1
          this.targetViewId = this.mouseFocusedViewId;
          // target rep should now exist
          this.initialSlicePlacement = Math.round(
            this.targetRepresentation.getSlice()
          );
          this.constrainPickableViews(this.targetViewId);
        }

        if (!this.finalized && this.donePlacing()) {
          this.lockToSlice = this.initialSlicePlacement;
          this.axis = this.targetView.getAxis();
          // widget is finalized
          this.finalized = true;
        }

        this.updateMeasurements();

        if (this.finalized) {
          this.saveData();
        }
      }
    },
  },
  mounted() {
    const proxy = this.$proxyManager.createProxy('Widgets', toolName);
    this.widgetPid = proxy.getProxyId();

    if (this.toolData) {
      const { name, lockToSlice, points, color, textSize, axis } =
        this.toolData;
      this.name = name;
      this.lockToSlice = lockToSlice;
      this.color = color;
      this.textSize = textSize;

      const view = this.$proxyManager
        .getViews()
        .filter((v) => v.isA('vtkView2DProxy'))
        .find((v) => v.getAxis() === axis);
      if (!view) {
        throw new Error('Cannot restore saved data: invalid axis');
      }
      this.targetViewId = view.getProxyId();

      // maybe I should verify the structure of toolData against a schema...
      const widgetState = proxy.getWidgetState();
      for (let i = 0; i < points.length; i++) {
        const handle = widgetState.addHandle();
        handle.setOrigin(...points[i]);
      }

      this.finalized = true;
    }

    this.addWidgetToViews(proxy);

    if (this.finalized) {
      this.updateMeasurements();
      this.updateWidgetVisibility();
    }
  },
  beforeDestroy() {
    this.remove();
  },
  methods: {
    addWidgetToViews(proxy) {
      if (this.targetProxy) {
        proxy
          .getWidget()
          .placeWidget(this.targetProxy.getDataset().getBounds());
      }

      const view3dHandler = (view, widgetManager, viewWidget) => {
        widgetManager.removeWidget(viewWidget);
      };

      const view2dHandler = (view, widgetManager, viewWidget) => {
        this.setupViewWidget(viewWidget);

        // start off invisible, unless we have a pre-defined axis
        this.setVisibility(viewWidget, view, this.axis === view.getAxis());

        const moveSub = view.getInteractor().onMouseMove(() => {
          if (this.targetViewId !== -1) {
            return;
          }
          if (view.getProxyId() === this.mouseFocusedViewId) {
            return;
          }
          this.mouseFocusedViewId = view.getProxyId();

          this.updateOrientation();

          if (!viewWidget.getVisibility()) {
            this.setVisibility(viewWidget, view, true);
            proxy
              .getAllViewWidgets()
              .filter(([vw]) => vw !== viewWidget)
              .forEach(([vw, view_]) => this.setVisibility(vw, view_, false));

            // render visibility changes
            widgetManager.renderWidgets();
            this.$proxyManager.renderAllViews();
          }
          // higher event listener priority
        }, viewWidget.getPriority() + 1);

        widgetManager.grabFocus(viewWidget);
        // re-render widget reps
        widgetManager.enablePicking();

        return [moveSub.unsubscribe];
      };

      proxy.addToViews();
      proxy.executeViewFuncs({
        View3D: view3dHandler,
        View2D_X: view2dHandler,
        View2D_Y: view2dHandler,
        View2D_Z: view2dHandler,
      });
    },
    updateOrientation() {
      // view will be a 2D view
      const view =
        this.targetView ||
        this.$proxyManager.getProxyById(this.mouseFocusedViewId);

      const rep = this.$proxyManager.getRepresentation(this.targetProxy, view);
      const slice = Math.round(rep.getSlice());
      const axis = view.getAxis();

      const manipulator = this.widgetProxy.getWidget().getManipulator();
      const normal = [0, 0, 0];
      normal[axis] = 1;

      // representation is in XYZ, not IJK, so slice is in world space
      const position = normal.map((c) => c * slice);

      // since normal points away from camera, have handle normal point
      // towards camera so the paint widget can render the handle on top
      // of the image.
      manipulator.setUserNormal(normal);
      manipulator.setUserOrigin(position);
    },
    toggleLock() {
      if (this.lockToSlice === null) {
        this.lockToSlice = Math.round(this.targetRepresentation.getSlice());
      } else {
        this.lockToSlice = null;
      }
      this.updateWidgetVisibility();
    },
    updateWidgetVisibility() {
      const viewWidget = this.widgetProxy.getViewWidget(this.targetView);
      if (!viewWidget) {
        return;
      }

      const slice = Math.round(this.targetRepresentation.getSlice());
      this.setVisibility(
        viewWidget,
        this.targetView,
        this.lockToSlice === null || this.lockToSlice === slice
      );
      this.renderViewWidgets();
    },
    remove() {
      if (this.widgetProxy) {
        this.widgetProxy.releaseFocus();
        this.widgetProxy.removeFromViews();
        this.$proxyManager.deleteProxy(this.widgetProxy);
        this.widgetPid = -1;
      }
    },
    setVisibility(viewWidget, view, visible) {
      const id = view.getProxyId();
      Vue.set(this.viewWidgetProperties, view.getProxyId(), {
        ...this.viewWidgetProperties[id],
        visible,
      });
      viewWidget.setVisibility(visible);
    },
    setName(name) {
      this.name = name;
      this.saveData();
    },
    setColor(colorHex) {
      this.color = colorHex;
      this.saveData();
    },
    setTextSize(size) {
      this.textSize = size;
      this.saveData();
    },
    renderViewWidgets() {
      this.$proxyManager.getViews().forEach((view) => {
        const manager = view.getReferenceByName('widgetManager');
        if (manager) {
          manager.renderWidgets();
          view.renderLater();
        }
      });
    },
    saveData() {
      const state = this.widgetProxy.getWidgetState();
      const data = {
        name: this.name,
        lockToSlice: this.lockToSlice,
        points: state.getHandleList().map((handle) => handle.getOrigin()),
        color: this.color,
        textSize: this.textSize,
        axis: this.targetView.getAxis(),
      };
      this.$emit('saveData', data);
    },
    emitRemove() {
      this.$emit('remove');
    },
    constrainPickableViews(onlyPickableViewId) {
      this.$proxyManager.getViews().forEach((view) => {
        const viewWidget = this.widgetProxy.getViewWidget(view);
        if (viewWidget) {
          viewWidget.setPickable(view.getProxyId() === onlyPickableViewId);
        }
      });
    },
    initialMeasurements() {
      throw new Error('initialMeasurements not implemented');
    },
    getMeasurementLabels() {
      throw new Error('getMeasurementLabels not implemented');
    },
    getDisplayedMeasurements() {
      throw new Error('getDisplayedMeasurements not implemented');
    },
    updateMeasurements() {
      throw new Error('updateMeasurements not implemented');
    },
    donePlacing() {
      throw new Error('donePlacing not implemented');
    },
    setupViewWidget(/* viewWidget */) {
      throw new Error('setupViewWidget not implemented');
    },
    ...(extraComponent.methods || {}),
  },
  template: `
    <div>
      <slot
        :finalized="finalized"
        :tool-name="name"
        :color="color"
        :text-size="textSize"
        :measurements="displayedMeasurements"
        :labels="measurementLabels"
        :toggle-lock="toggleLock"
        :remove="emitRemove"
        :set-name="setName"
        :set-color="setColor"
        :set-text-size="setTextSize"
      />
      <tool-svg-portal v-if="svgComponent">
        <template #default="{ viewProxyId }">
          <component
            v-if="viewProxyId in viewWidgetProperties""
            :is="svgComponent"
            :widget-state="widgetProxy.getWidgetState()"
            :view-proxy-id="viewProxyId"
            :visible="viewWidgetProperties[viewProxyId].visible"
            :finalized="finalized"
            :tool-name="name"
            :color="color"
            :text-size="textSize"
            :measurements="displayedMeasurements"
            :labels="measurementLabels"
          />
        </template>
      </tool-svg-portal>
    </div>
  `,
});
