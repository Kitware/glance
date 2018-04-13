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
 * Parses a vtkImage imageId.
 */
function parseImageId(imageId) {
  function split(str, delim, limit = Infinity) {
    const result = [];
    let i = 0;
    let lim = limit;
    while (lim-- > 0) {
      const ni = str.indexOf(delim);
      if (ni === -1) {
        break;
      }
      result.push(str.substring(i, ni));
      i = ni + 1;
    }
    result.push(str.substr(i));
    return result;
  }

  let parts;

  parts = split(imageId, ':', 1);
  if (parts.length !== 2) {
    return null;
  }

  const [proto, info] = parts;
  if (proto !== 'vtkImage') {
    return null;
  }

  parts = split(info, '?', 1);
  if (parts.length !== 2) {
    return null;
  }

  const [filterId, query] = parts;
  const params = vtkURLExtract.extractURLParameters(true, query);

  return {
    proto,
    filterId: Number(filterId),
    params,
  };
}

/**
 * Loader for Cornerstone.
 */
function loader(imageId) {
  const parsed = parseImageId(imageId);

  const promise = new Promise((resolve, reject) => {
    if (!parsed) {
      reject(new Error(`Bad imageId "${imageId}"`));
    }

    const { filterId, params } = parseImageId(imageId);

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
  parseImageId,
};
