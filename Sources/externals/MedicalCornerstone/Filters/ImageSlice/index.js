import macro from 'vtk.js/Sources/macro';
import vtkDataArray from 'vtk.js/Sources/Common/Core/DataArray';

import Constants from './Constants';

const { vtkErrorMacro } = macro;
const { SliceAxis } = Constants;

function vtkImageSlice(publicAPI, model) {
  model.classHierarchy.push('vtkImageSlice');

  publicAPI.getSliceDimensions = () => {
    const input = publicAPI.getInputData(0);
    if (!input) {
      vtkErrorMacro('Invalid or missing input');
      return null;
    }
    return input.getDimensions().filter((d, i) => i !== model.axis);
  };

  publicAPI.getSliceSpacing = () => {
    const input = publicAPI.getInputData(0);
    if (!input) {
      vtkErrorMacro('Invalid or missing input');
      return null;
    }
    return input.getSpacing().filter((d, i) => i !== model.axis);
  };

  publicAPI.requestData = (inData, outData) => {
    const input = inData[0];

    if (!input) {
      vtkErrorMacro('Invalid or missing input');
      return;
    }

    const buffer = input
      .getPointData()
      .getScalars()
      .getData();

    const imageDims = input.getDimensions();
    const sliceDims = publicAPI.getSliceDimensions();
    const size = sliceDims[0] * sliceDims[1];
    const sliceBuffer = new buffer.constructor(size);
    // ensure integer since we slice in IJK space
    const slice = Math.round(model.slice);

    // TODO perf of this loop
    const jStride = imageDims[0];
    const kStride = imageDims[0] * imageDims[1];
    for (let p = 0; p < size; ++p) {
      const ijk = [p % sliceDims[0], Math.floor(p / sliceDims[0])];
      ijk.splice(model.axis, 0, slice);
      const imageIndex = ijk[0] + ijk[1] * jStride + ijk[2] * kStride;

      sliceBuffer[p] = buffer[imageIndex];
    }

    outData[0] = vtkDataArray.newInstance({ values: sliceBuffer });
  };
}

function extend(publicAPI, model, initialValues = {}) {
  Object.assign(
    model,
    {
      axis: SliceAxis.K,
      slice: 0,
    },
    initialValues
  );

  macro.obj(publicAPI, model);
  // 1 input, 1 output
  macro.algo(publicAPI, model, 1, 1);
  macro.setGet(publicAPI, model, ['axis', 'slice']);

  vtkImageSlice(publicAPI, model);
}

export const newInstance = macro.newInstance(extend, 'vtkImageSlice');

export default { newInstance, extend };
