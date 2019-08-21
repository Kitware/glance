import vtkDistance2DWidget from 'paraview-glance/src/vtk/Distance2DWidget';

export default [
  {
    name: 'Length',
    widgetClass: vtkDistance2DWidget,
    measurementCallback: (w) => w.getDistance(),
    prepareWidget: (viewWidget) => {
      viewWidget.setCircleProps({
        'stroke-width': 3,
        fill: 'transparent',
        r: 8,
        stroke: '#ff0000',
      });
      viewWidget.setLineProps({
        stroke: '#ff0000',
        'stroke-width': 2,
      });
      // TODO match SVG circle
      viewWidget
        .getWidgetState()
        .getMoveHandle()
        .setScale1(10);
      viewWidget.setHandleVisibility(false);
    },
    onSliceUpdate: (widget, axis, slice) => {
      const manipulator = widget.getManipulator();
      const normal = [0, 0, 0];
      normal[axis] = 1;

      // representation is in XYZ, not IJK, so slice is in world space
      const position = normal.map((c) => c * slice);

      // since normal points away from camera, have handle normal point
      // towards camera so the paint widget can render the handle on top
      // of the image.
      manipulator.setNormal(normal);
      manipulator.setOrigin(position);
    },
    isWidgetFinalized: (state) => state.getHandleList().length === 2,
  },
  // {
  //   name: 'Angle',
  //   widgetClass: vtkAngleWidget,
  //   measurementCallback: (w) => w.getAngle(),
  // },
];
