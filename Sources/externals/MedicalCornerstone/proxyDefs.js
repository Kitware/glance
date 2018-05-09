import vtkView from 'vtk.js/Sources/Proxy/Core/ViewProxy';
import vtk2DView from './CornerstoneViewProxy';
import vtkCornerstoneRepresentationProxy from './CornerstoneRepresentationProxy';

import ConfigUtils from '../../config/configUtils';
import proxyUI from './proxyUI';

const { activateOnCreate, createProxyDefinition } = ConfigUtils;

function createDefaultView(classFactory, ui) {
  return activateOnCreate(
    createProxyDefinition(
      classFactory,
      ui,
      [
        { link: 'AnnotationOpacity', property: 'annotationOpacity' },
        {
          link: 'OrientationAxesVisibility',
          property: 'orientationAxesVisibility',
        },
        {
          link: 'OrientationAxesPreset',
          property: 'presetToOrientationAxes',
        },
      ],
      {}, // definitionOptions
      // props
      {
        presetToOrientationAxes: 'lps',
      }
    )
  );
}

function createDefaultSliceRepr(sliceName) {
  return createProxyDefinition(
    vtkCornerstoneRepresentationProxy,
    proxyUI.Slice,
    [
      { link: 'ColorWindow', property: 'colorWindow' },
      { link: 'ColorLevel', property: 'colorLevel' },
      { link: sliceName, property: 'slice' },
      { link: 'Interpolation', property: 'interpolation' },
    ]
  );
}

const Views = {
  View3D: createDefaultView(vtkView, proxyUI.View3D),
  View2D: createDefaultView(vtk2DView, []),
  View2D_X: createDefaultView(vtk2DView, []),
  View2D_Y: createDefaultView(vtk2DView, []),
  View2D_Z: createDefaultView(vtk2DView, []),
};

const Slices = {
  SliceX: createDefaultSliceRepr('SliceX'),
  SliceY: createDefaultSliceRepr('SliceY'),
  SliceZ: createDefaultSliceRepr('SliceZ'),
};

export default {
  Slices,
  Views,
};
