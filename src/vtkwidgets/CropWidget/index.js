import macro from 'vtk.js/Sources/macro';
import vtkImageCroppingRegionsWidget from 'vtk.js/Sources/Interaction/Widgets/ImageCroppingRegionsWidget';

const CropWidget = {
  subscription: null,

  new() {
    const widget = vtkImageCroppingRegionsWidget.newInstance();

    if (this.widgets.length === 0) {
      this.state = {};
    }

    return widget;
  },

  enable(widget, representation) {
    if (!widget.getEnabled()) {
      widget.setEnabled(true);

      if (!this.state.representation) {
        // first widget, so set initial state
        this.state = {
          representation,
          volumeMapper: widget.getVolumeMapper(),
          widgetState: widget.getWidgetState(),
          setCroppingPlanes: macro.debounce(
            representation.setCroppingPlanes,
            100
          ),
        };

        this.state.setCroppingPlanes(this.state.widgetState.planes);
      }

      // Update widget with current state
      widget.updateWidgetState(this.state.widgetState);

      // Ensure any widget update will update state
      this.subscription = widget.onModified(() =>
        this.updateState({
          widgetState: widget.getWidgetState(),
        })
      );
    }
  },

  disable(widget) {
    if (widget.getEnabled()) {
      widget.setEnabled(false);
      if (this.subscription) {
        this.subscription.unsubscribe();
        this.subscription = null;
      }
    }
  },

  onBeforeDestroy(widget) {
    this.disable(widget);
    widget.delete();

    // destroy state when all crop widgets are destroyed
    if (this.widgets.length === 0) {
      this.state = {};
    }
  },

  onStateChange(newState) {
    if (this.inUpdate) {
      return;
    }
    this.inUpdate = true;
    this.widgets.forEach((widget) =>
      widget.updateWidgetState(newState.widgetState)
    );
    if (this.state.widgetState.planes) {
      this.state.setCroppingPlanes(this.state.widgetState.planes);
    }
    this.inUpdate = false;
  },
};

export default CropWidget;
