import vtkDistance2DWidget from 'paraview-glance/src/vtk/Distance2DWidget';
import vtkAngleWidget from 'paraview-glance/src/vtk/AngleWidget';
import vtkTextWidget from 'paraview-glance/src/vtk/TextWidget';

export default [
  {
    name: 'Length',
    icon: 'length-tool', // from static/icons/
    label: 'Length',
    widgetClass: vtkDistance2DWidget,
    prepareWidget: (viewWidget) => {
      viewWidget.setCircleProps({
        'stroke-width': 3,
        fill: 'transparent',
        r: 8,
        stroke: '#ffee00',
      });
      viewWidget.setLineProps({
        stroke: '#ffee00',
        'stroke-width': 2,
      });
      viewWidget.setTextProps({
        fill: '#ffee00',
        dx: 12,
        dy: -12,
      });
      viewWidget.setText('');
      viewWidget.setHandleVisibility(false);
    },
    onSliceUpdate: (widget, viewWidget, axis, slice) => {
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
    // tool structure: refer to emptyTool() in MeasurementTools
    onWidgetStateUpdate: (tool) => {
      const { widget, viewWidget } = tool;
      const d = `${widget.getDistance().toFixed(3)} mm`;
      viewWidget.setText(d);
      // set tool's extra info
      /* eslint-disable-next-line no-param-reassign */
      tool.extraInfo = d;
    },
    setWidgetColor: (viewWidget, colorHex) => {
      viewWidget.setCircleProps(
        Object.assign(viewWidget.getCircleProps(), {
          stroke: colorHex,
        })
      );
      viewWidget.setLineProps(
        Object.assign(viewWidget.getLineProps(), {
          stroke: colorHex,
        })
      );
      viewWidget.setTextProps(
        Object.assign(viewWidget.getTextProps(), {
          fill: colorHex,
        })
      );
    },
    setWidgetSize: (viewWidget, size) => {
      viewWidget.setTextProps(
        Object.assign(viewWidget.getTextProps(), {
          style: `font-size: ${size * (window.devicePixelRatio || 1)}px`,
        })
      );
    },
    setWidgetName: () => {},
  },
  {
    name: 'Angle',
    icon: 'angle-tool',
    label: 'Angle',
    widgetClass: vtkAngleWidget,
    prepareWidget: (viewWidget) => {
      viewWidget.setCircleProps({
        'stroke-width': 3,
        fill: 'transparent',
        r: 8,
        stroke: '#ffee00',
      });
      viewWidget.setLineProps({
        stroke: '#ffee00',
        'stroke-width': 2,
      });
      viewWidget.setTextProps({
        fill: '#ffee00',
        dx: 12,
        dy: -12,
      });
      viewWidget.setText('');
      viewWidget.setHandleVisibility(false);
      viewWidget.setTextStateIndex(1);
    },
    onSliceUpdate: (widget, viewWidget, axis, slice) => {
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
    isWidgetFinalized: (state) => state.getHandleList().length === 3,
    // tool structure: refer to emptyTool() in MeasurementTools
    onWidgetStateUpdate: (tool) => {
      const { widget, viewWidget } = tool;
      const deg = ((widget.getAngle() * 180) / Math.PI).toFixed(3);
      const angle = `${deg}°`;
      viewWidget.setText(angle);
      // set extra info
      /* eslint-disable-next-line no-param-reassign */
      tool.extraInfo = angle;
    },
    setWidgetColor: (viewWidget, colorHex) => {
      viewWidget.setCircleProps(
        Object.assign(viewWidget.getCircleProps(), {
          stroke: colorHex,
        })
      );
      viewWidget.setLineProps(
        Object.assign(viewWidget.getLineProps(), {
          stroke: colorHex,
        })
      );
      viewWidget.setTextProps(
        Object.assign(viewWidget.getTextProps(), {
          fill: colorHex,
        })
      );
    },
    setWidgetSize: (viewWidget, size) => {
      viewWidget.setTextProps(
        Object.assign(viewWidget.getTextProps(), {
          style: `font-size: ${size * (window.devicePixelRatio || 1)}px`,
        })
      );
    },
    setWidgetName: () => {},
  },
  {
    name: 'Text',
    icon: 'text-tool',
    label: 'Text',
    widgetClass: vtkTextWidget,
    prepareWidget: (viewWidget) => {
      viewWidget.setCircleProps({
        'stroke-width': 3,
        fill: 'transparent',
        r: 8,
        stroke: '#ffee00',
      });
      viewWidget.setTextProps({
        fill: '#ffee00',
        dx: 12,
        dy: -12,
      });
      viewWidget.setText('Text');
      viewWidget.setHandleVisibility(false);
    },
    onSliceUpdate: (widget, viewWidget, axis, slice) => {
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
    isWidgetFinalized: (state) => state.getHandleList().length === 1,
    // tool structure: refer to emptyTool() in MeasurementTools
    onWidgetStateUpdate: () => {},
    setWidgetColor: (viewWidget, colorHex) => {
      viewWidget.setCircleProps(
        Object.assign(viewWidget.getCircleProps(), {
          stroke: colorHex,
        })
      );
      viewWidget.setTextProps(
        Object.assign(viewWidget.getTextProps(), {
          fill: colorHex,
        })
      );
    },
    setWidgetSize: (viewWidget, size) => {
      viewWidget.setTextProps(
        Object.assign(viewWidget.getTextProps(), {
          style: `font-size: ${size * (window.devicePixelRatio || 1)}px`,
        })
      );
    },
    setWidgetName: (viewWidget, name) => {
      viewWidget.setText(name);
    },
  },
];
