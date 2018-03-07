import vtk2DView from 'vtk.js/Sources/Proxy/Core/View2DProxy';
import vtkGeometryRepresentationProxy from 'vtk.js/Sources/Proxy/Representations/GeometryRepresentationProxy';
import vtkSkyboxRepresentationProxy from 'vtk.js/Sources/Proxy/Representations/SkyboxRepresentationProxy';
import vtkGlyphRepresentationProxy from 'vtk.js/Sources/Proxy/Representations/GlyphRepresentationProxy';
import vtkLookupTableProxy from 'vtk.js/Sources/Proxy/Core/LookupTableProxy';
import vtkMoleculeRepresentationProxy from 'vtk.js/Sources/Proxy/Representations/MoleculeRepresentationProxy';
import vtkPiecewiseFunctionProxy from 'vtk.js/Sources/Proxy/Core/PiecewiseFunctionProxy';
import vtkProxySource from 'vtk.js/Sources/Proxy/Core/SourceProxy';
import vtkSliceRepresentationProxy from 'vtk.js/Sources/Proxy/Representations/SliceRepresentationProxy';
import vtkView from 'vtk.js/Sources/Proxy/Core/ViewProxy';
import vtkVolumeRepresentationProxy from 'vtk.js/Sources/Proxy/Representations/VolumeRepresentationProxy';

import proxyUI from './proxyUI';
import proxyFilter from './proxyFilter';
import proxyViewRepresentationMapping from './proxyViewRepresentationMapping';

// ----------------------------------------------------------------------------

function createProxyDefinition(classFactory, ui = {}, links = []) {
  return {
    class: classFactory,
    options: {
      links,
      ui,
    },
  };
}

// ----------------------------------------------------------------------------

function activateOnCreate(def) {
  def.options.activateOnCreate = true;
  return def;
}

// ----------------------------------------------------------------------------

export default {
  definitions: {
    Proxy: {
      LookupTable: createProxyDefinition(vtkLookupTableProxy),
      PiecewiseFunction: createProxyDefinition(vtkPiecewiseFunctionProxy),
    },
    Sources: {
      TrivialProducer: createProxyDefinition(vtkProxySource),
      Contour: proxyFilter.Contour,
    },
    Representations: {
      Geometry: createProxyDefinition(
        vtkGeometryRepresentationProxy,
        proxyUI.Geometry
      ),
      Skybox: createProxyDefinition(
        vtkSkyboxRepresentationProxy,
        proxyUI.Skybox
      ),
      Slice: createProxyDefinition(vtkSliceRepresentationProxy, proxyUI.Slice, [
        { link: 'ColorWindow', property: 'colorWindow' },
        { link: 'ColorLevel', property: 'colorLevel' },
      ]),
      SliceX: createProxyDefinition(
        vtkSliceRepresentationProxy,
        proxyUI.Slice,
        [
          { link: 'ColorWindow', property: 'colorWindow' },
          { link: 'ColorLevel', property: 'colorLevel' },
          { link: 'SliceX', property: 'slice' },
        ]
      ),
      SliceY: createProxyDefinition(
        vtkSliceRepresentationProxy,
        proxyUI.Slice,
        [
          { link: 'ColorWindow', property: 'colorWindow' },
          { link: 'ColorLevel', property: 'colorLevel' },
          { link: 'SliceY', property: 'slice' },
        ]
      ),
      SliceZ: createProxyDefinition(
        vtkSliceRepresentationProxy,
        proxyUI.Slice,
        [
          { link: 'ColorWindow', property: 'colorWindow' },
          { link: 'ColorLevel', property: 'colorLevel' },
          { link: 'SliceZ', property: 'slice' },
        ]
      ),
      Volume: createProxyDefinition(
        vtkVolumeRepresentationProxy,
        proxyUI.Volume,
        [
          { link: 'ColorWindow', property: 'colorWindow' },
          { link: 'ColorLevel', property: 'colorLevel' },
          { link: 'SliceX', property: 'xSlice' },
          { link: 'SliceY', property: 'ySlice' },
          { link: 'SliceZ', property: 'zSlice' },
          { link: 'Shadow', property: 'useShadow' },
          { link: 'SampleDistance', property: 'sampleDistance' },
          { link: 'EdgeGradient', property: 'edgeGradient' },
        ]
      ),
      Molecule: createProxyDefinition(
        vtkMoleculeRepresentationProxy,
        proxyUI.Molecule
      ),
      Glyph: createProxyDefinition(vtkGlyphRepresentationProxy, proxyUI.Glyph),
    },
    Views: {
      View3D: activateOnCreate(
        createProxyDefinition(vtkView, proxyUI.View3D, [
          { link: 'AnnotationOpacity', property: 'annotationOpacity' },
          {
            link: 'OrientationAxesVisibility',
            property: 'orientationAxesVisibility',
          },
          {
            link: 'OrientationAxesPreset',
            property: 'presetToOrientationAxes',
          },
        ])
      ),
      View2D: activateOnCreate(
        createProxyDefinition(vtk2DView, proxyUI.View2D, [
          { link: 'AnnotationOpacity', property: 'annotationOpacity' },
          {
            link: 'OrientationAxesVisibility',
            property: 'orientationAxesVisibility',
          },
          {
            link: 'OrientationAxesPreset',
            property: 'presetToOrientationAxes',
          },
        ])
      ),
      View2D_X: activateOnCreate(
        createProxyDefinition(vtk2DView, proxyUI.View2D, [
          { link: 'AnnotationOpacity', property: 'annotationOpacity' },
          {
            link: 'OrientationAxesVisibility',
            property: 'orientationAxesVisibility',
          },
          {
            link: 'OrientationAxesPreset',
            property: 'presetToOrientationAxes',
          },
        ])
      ),
      View2D_Y: activateOnCreate(
        createProxyDefinition(vtk2DView, proxyUI.View2D, [
          { link: 'AnnotationOpacity', property: 'annotationOpacity' },
          {
            link: 'OrientationAxesVisibility',
            property: 'orientationAxesVisibility',
          },
          {
            link: 'OrientationAxesPreset',
            property: 'presetToOrientationAxes',
          },
        ])
      ),
      View2D_Z: activateOnCreate(
        createProxyDefinition(vtk2DView, proxyUI.View2D, [
          { link: 'AnnotationOpacity', property: 'annotationOpacity' },
          {
            link: 'OrientationAxesVisibility',
            property: 'orientationAxesVisibility',
          },
          {
            link: 'OrientationAxesPreset',
            property: 'presetToOrientationAxes',
          },
        ])
      ),
    },
  },
  representations: {
    View3D: proxyViewRepresentationMapping.View3D,
    View2D: proxyViewRepresentationMapping.View2D,
    View2D_X: Object.assign({}, proxyViewRepresentationMapping.View2D, {
      vtkImageData: { name: 'SliceX' },
    }),
    View2D_Y: Object.assign({}, proxyViewRepresentationMapping.View2D, {
      vtkImageData: { name: 'SliceY' },
    }),
    View2D_Z: Object.assign({}, proxyViewRepresentationMapping.View2D, {
      vtkImageData: { name: 'SliceZ' },
    }),
  },
  filters: {
    vtkPolyData: [],
    vtkImageData: ['Contour'],
    vtkMolecule: [],
    Glyph: [],
  },
};
