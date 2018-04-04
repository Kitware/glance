import macro from 'vtk.js/Sources/macro';
import vtkViewProxy from 'vtk.js/Sources/Proxy/Core/ViewProxy';

function CornerstoneViewProxy(publicAPI, model) {
  model.classHierarchy.push('vtkCornerstoneViewProxy');
}

function extend(publicAPI, model, initialValues = {}) {
  Object.assign(
    model,
    {
      axis: 2,
      orientation: -1,
      viewUp: [0, 1, 0],
      useParallelRendering: true,
    },
    initialValues
  );

  vtkViewProxy.extend(publicAPI, model, initialValues);
  macro.get(publicAPI, model, ['axis']);

  CornerstoneViewProxy(publicAPI, model);
}

export const newInstance = macro.newInstance(extend, 'vtkCornerstoneViewProxy');

export default { newInstance, extend };
