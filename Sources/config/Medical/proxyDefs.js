import vtkView from 'vtk.js/Sources/Proxy/Core/ViewProxy';
import vtk2DView from 'vtk.js/Sources/Proxy/Core/View2DProxy';

import ConfigUtils from '../configUtils';
import proxyUI from '../Generic/proxyUI';

const { activateOnCreate, createProxyDefinition } = ConfigUtils;

function createDefaultView(classFactory, ui) {
  return activateOnCreate(
    createProxyDefinition(
      classFactory,
      ui,
      [
        {
          type: 'application',
          link: 'AnnotationOpacity',
          property: 'annotationOpacity',
        },
        {
          type: 'application',
          link: 'OrientationAxesVisibility',
          property: 'orientationAxesVisibility',
        },
        {
          type: 'application',
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

const Views = {
  View3D: createDefaultView(vtkView, proxyUI.View3D),
  View2D: createDefaultView(vtk2DView, proxyUI.View2D),
  View2D_X: createDefaultView(vtk2DView, proxyUI.View2D),
  View2D_Y: createDefaultView(vtk2DView, proxyUI.View2D),
  View2D_Z: createDefaultView(vtk2DView, proxyUI.View2D),
};

export default {
  Views,
};
