import vtkURLExtract from 'vtk.js/Sources/Common/Core/URLExtract';

const SliceFilters = Object.create(null);
let FilterId = 1;

/**
 * Adds a slice filter to the image loader.
 *
 * Returns the corresponding filter ID for use in generating
 * cornerstone image IDs.
 */
function addSliceFilter(filter) {
  SliceFilters[FilterId] = filter;
  return FilterId++;
}

/**
 * Removes a slice filter from the image loader.
 *
 * Accepts a filter ID to delete the associated filter.
 */
function removeSliceFilter(id) {
  delete SliceFilters[id];
}

/**
 * Loader for Cornerstone.
 */
function loader(imageId) {
  const info = imageId.substr(imageId.indexOf(':') + 1);
  const filterId = Number(info.substr(0, info.indexOf('?')));
  const query = info.substr(info.indexOf('?') + 1);
  const params = vtkURLExtract.extractURLParameters(true, query);

  const promise = new Promise((resolve, reject) => {
    if (!(filterId in SliceFilters)) {
      reject(new Error(`No corresponding slice filter for ${filterId}`));
    }

    const filter = SliceFilters[filterId];
    filter.setAxis(params.axis);
    filter.setSlice(params.slice);

    const sliceBuffer = filter.getOutputData(0).getData();
    const sliceDims = filter.getSliceDimensions();
    const sliceSpacing = filter.getSliceSpacing();

    // get range of entire image, not just slice
    const [minPixelValue, maxPixelValue] = filter
      .getInputData(0)
      .getPointData()
      .getScalars()
      .getRange();

    resolve({
      imageId,

      minPixelValue,
      maxPixelValue,

      slope: 1.0,
      intercept: 0.0,

      rows: sliceDims[1],
      height: sliceDims[1],
      columns: sliceDims[0],
      width: sliceDims[0],

      rowPixelSpacing: sliceSpacing[1],
      columnPixelSpacing: sliceSpacing[0],

      color: false,
      invert: false,

      getPixelData: () => sliceBuffer,
      sizeInBytes: sliceBuffer.buffer.byteLength,
    });
  });

  return { promise };
}

export default {
  loader,
  addSliceFilter,
  removeSliceFilter,
};
