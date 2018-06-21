import macro from 'vtk.js/Sources/macro';
import vtkImageCroppingRegionsWidget from 'vtk.js/Sources/Interaction/Widgets/ImageCroppingRegionsWidget';

let updateInProgress = false;

// ----------------------------------------------------------------------------

function update(ctx) {
  if (updateInProgress) {
    return;
  }
  updateInProgress = true;
  const { widgetState, setCroppingPlanes } = ctx.state;

  // Update widgets
  for (let i = 0; i < ctx.widgets.length; i++) {
    ctx.widgets[i].widget.updateWidgetState(widgetState);
  }

  // Update filter
  setCroppingPlanes(widgetState.planes);
  updateInProgress = false;
}

// ----------------------------------------------------------------------------

function newWidget() {
  return vtkImageCroppingRegionsWidget.newInstance();
}

// ----------------------------------------------------------------------------

/* eslint-disable no-param-reassign */
function enable(widget, ctx) {
  if (!widget.getEnabled()) {
    widget.setEnabled(true);

    if (!ctx.state.setCroppingPlanes) {
      // first widget, so set initial state
      ctx.state.setCroppingPlanes = macro.debounce(
        ctx.proxy.setCroppingPlanes,
        100
      );

      ctx.state.widgetState = widget.getWidgetState();
      ctx.state.setCroppingPlanes(ctx.state.widgetState.planes);
    }

    // Update widget with current state
    widget.updateWidgetState(ctx.state.widgetState);

    // Ensure any widget update will update state
    return widget.onModified(() => {
      ctx.state.widgetState = widget.getWidgetState();
      update(ctx);
    });
  }
  return [];
}

// ----------------------------------------------------------------------------

function disable(widget) {
  if (widget.getEnabled()) {
    widget.setEnabled(false);
  }
}

// ----------------------------------------------------------------------------

function onBeforeDestroy(widget) {
  disable(widget);
  widget.delete();
}

// ----------------------------------------------------------------------------

export default {
  newWidget,
  enable,
  disable,
  onBeforeDestroy,
};
