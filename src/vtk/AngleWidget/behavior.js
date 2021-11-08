import superWidgetBehavior from '@kitware/vtk.js/Widgets/Widgets3D/AngleWidget/behavior';

import widgetManipulatorWatcher from 'paraview-glance/src/vtk/widgetManipulatorWatcher';

export default function widgetBehavior(publicAPI, model) {
  superWidgetBehavior(publicAPI, model);
  widgetManipulatorWatcher(publicAPI, model);
}
