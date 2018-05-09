import macro from 'vtk.js/Sources/macro';
import vtkSliceRepresentationProxy from 'vtk.js/Sources/Proxy/Representations/SliceRepresentationProxy';

import ImageLoader from './CornerstoneImageLoader';
import vtkImageSliceFilter from './Filters/ImageSlice';

function CornerstoneRepresentationProxy(publicAPI, model) {
  model.classHierarchy.push('vtkCornerstoneRepresentationProxy');

  // Private ------------------------------------------------------------------

  function createImageStack() {
    const sliceAxis = 'IJK'.indexOf(model.slicingMode);
    if (sliceAxis === -1) {
      return null;
    }

    const numSlices = model.input.getDataset().getDimensions()[sliceAxis];

    const imageIds = [];
    for (let slice = 0; slice < numSlices; ++slice) {
      const params = [`axis=${sliceAxis}`, `slice=${slice}`].join('&');
      imageIds.push(`vtkImage:${model.sliceFilterId}?${params}`);
    }

    const stack = {
      currentImageIdIndex: Math.floor(numSlices / 2),
      imageIds,
    };

    return stack;
  }

  // Setup --------------------------------------------------------------------

  model.sliceFilter = vtkImageSliceFilter.newInstance();
  model.sliceFilterId = ImageLoader.addSliceFilter(model.sliceFilter);

  model.imageStack = null;

  // Public -------------------------------------------------------------------

  publicAPI.setInput = macro.chain(publicAPI.setInput, (input) => {
    if (input) {
      model.sliceFilter.setInputData(input.getDataset());
      model.imageStack = createImageStack();

      model.colorLevel = model.property.getColorLevel();
      model.colorWindow = model.property.getColorWindow();
    } else {
      model.imageStack = null;
    }
  });

  publicAPI.setSlicingMode = macro.chain(publicAPI.setSlicingMode, () => {
    model.imageStack = createImageStack();
  });

  publicAPI.setSlice = (slice) => {
    if (model.imageStack) {
      const sliceAxis = 'IJK'.indexOf(model.slicingMode);
      // -1 since we are getting max slice index
      const maxIndex = model.input.getDataset().getDimensions()[sliceAxis] - 1;
      // slice must be an integer (and valid image ID index)
      const newIndex = Math.round(Math.max(0, Math.min(maxIndex, slice)));

      if (model.imageStack.currentImageIdIndex === newIndex) {
        return;
      }
      model.imageStack.currentImageIdIndex = newIndex;
      publicAPI.modified();
    }
  };

  publicAPI.getSlice = () =>
    model.imageStack ? model.imageStack.currentImageIdIndex : 0;

  publicAPI.delete = macro.chain(
    () => ImageLoader.removeSliceFilter(model.sliceFilterId),
    publicAPI.delete
  );

  // Initialization -----------------------------------------------------------

  if (model.input) {
    model.imageStack = createImageStack();
  }
}

function extend(publicAPI, model, initialValues = {}) {
  Object.assign(
    model,
    {
      colorLevel: 0,
      colorWindow: 0,
      interpolation: true,
      invertColors: false,
      hFlip: false,
      vFlip: false,
    },
    initialValues
  );

  vtkSliceRepresentationProxy.extend(publicAPI, model, initialValues);
  macro.get(publicAPI, model, ['imageStack']);
  macro.setGet(publicAPI, model, [
    'colorLevel',
    'colorWindow',
    'interpolation',
    'invertColors',
    'hFlip',
    'vFlip',
  ]);

  CornerstoneRepresentationProxy(publicAPI, model);
}

export const newInstance = macro.newInstance(
  extend,
  'vtkCornerstoneRepresentationProxy'
);

export default { newInstance, extend };
