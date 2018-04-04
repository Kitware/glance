import macro from 'vtk.js/Sources/macro';
import vtkSliceRepresentationProxy from 'vtk.js/Sources/Proxy/Representations/SliceRepresentationProxy';

function CornerstoneRepresentationProxy(publicAPI, model) {
  model.classHierarchy.push('vtkCornerstoneRepresentationProxy');
}

function extend(publicAPI, model, initialValues = {}) {
  vtkSliceRepresentationProxy.extend(publicAPI, model, initialValues);

  CornerstoneRepresentationProxy(publicAPI, model);
}

export const newInstance = macro.newInstance(
  extend,
  'vtkCornerstoneRepresentationProxy'
);

export default { newInstance, extend };
