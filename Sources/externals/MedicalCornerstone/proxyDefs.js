import vtkView from 'vtk.js/Sources/Proxy/Core/ViewProxy';
import vtk2DView from './CornerstoneViewProxy';

import ConfigUtils from '../../config/configUtils';
import proxyUI from '../../config/Generic/proxyUI';

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
