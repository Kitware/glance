import macro from 'vtk.js/Sources/macro';
import vtkImageCroppingRegionsWidget from 'vtk.js/Sources/Interaction/Widgets/ImageCroppingRegionsWidget';
import vtkImageCropFilter from 'vtk.js/Sources/Filters/General/ImageCropFilter';

const CropWidget = {
  subscription: null,

  new() {
    const widget = vtkImageCroppingRegionsWidget.newInstance();

    if (this.widgets.length === 0) {
      this.state = {
        volumeMapper: null,
        widgetState: null,
        cropFilter: null,
      };
    }

    return widget;
  },

  enable(widget) {
    if (!widget.getEnabled()) {
      widget.setEnabled(true);

      // rewire volume mapper
      if (!this.state.cropFilter) {
        // first widget, so set initial state
        this.state = {
          volumeMapper: widget.getVolumeMapper(),
          widgetState: widget.getWidgetState(),
        };

        // rewire volume mapper
        this.state.cropFilter = vtkImageCropFilter.newInstance();
        const imageData = this.state.volumeMapper.getInputData();
        this.state.cropFilter.setInputData(imageData);
        this.state.volumeMapper.setInputConnection(
          this.state.cropFilter.getOutputPort()
        );

        this.state.cropFilter.setCroppingPlanes(this.state.widgetState.planes);

        this.state.setCroppingPlanes = macro.debounce(
          this.state.cropFilter.setCroppingPlanes,
          100
        );
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
      // Used the debounced version
      this.state.setCroppingPlanes(this.state.widgetState.planes);
    }
    this.inUpdate = false;
  },
};

export default CropWidget;
