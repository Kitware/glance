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

      if (this.widgets.length > 1) {
        // use existing state
        widget.updateWidgetState(this.state.widgetState);
      } else {
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
      }

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
      this.subscription.unsubscribe();
      this.subscription = null;
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
    this.widgets.forEach((widget) =>
      widget.updateWidgetState(newState.widgetState)
    );
    this.state.cropFilter.setCroppingPlanes(this.state.widgetState.planes);
  },
};

export default CropWidget;
