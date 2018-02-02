import vtk2DView from 'vtk.js/Sources/Proxy/Core/View2DProxy';
import vtkGeometryRepresentationProxy from 'vtk.js/Sources/Proxy/Representations/GeometryRepresentationProxy';
import vtkLookupTableProxy from 'vtk.js/Sources/Proxy/Core/LookupTableProxy';
import vtkMoleculeRepresentationProxy from 'vtk.js/Sources/Proxy/Representations/MoleculeRepresentationProxy';
import vtkPiecewiseFunctionProxy from 'vtk.js/Sources/Proxy/Core/PiecewiseFunctionProxy';
import vtkProxySource from 'vtk.js/Sources/Proxy/Core/SourceProxy';
import vtkSliceRepresentationProxy from 'vtk.js/Sources/Proxy/Representations/SliceRepresentationProxy';
import vtkView from 'vtk.js/Sources/Proxy/Core/ViewProxy';
import vtkVolumeRepresentationProxy from 'vtk.js/Sources/Proxy/Representations/VolumeRepresentationProxy';
import vtkImageMarchingCubes from 'vtk.js/Sources/Filters/General/ImageMarchingCubes';

import Palettes from '../Palettes';

export default {
  definitions: {
    Proxy: {
      LookupTable: {
        class: vtkLookupTableProxy,
      },
      PiecewiseFunction: {
        class: vtkPiecewiseFunctionProxy,
      },
    },
    Sources: {
      TrivialProducer: {
        class: vtkProxySource,
        options: {},
      },
      Contour: {
        class: vtkProxySource,
        options: {
          autoUpdate: false, // For now...
          algoFactory: vtkImageMarchingCubes,
          proxyPropertyMapping: {
            contourValue: { modelKey: 'algo', property: 'contourValue' },
            computeNormals: { modelKey: 'algo', property: 'computeNormals' },
            mergePoints: { modelKey: 'algo', property: 'mergePoints' },
          },
          updateDomain(self, dataset) {
            const arrayToProcess =
              dataset.getPointData().getScalars() ||
              dataset.getPointData().getArrayByIndex(0);
            if (!arrayToProcess) {
              return;
            }
            const [min, max] = arrayToProcess.getRange();
            const step = Math.min(1, (max - min) / 500);
            self.updateProxyProperty('contourValue', {
              domain: { min, max, step },
            });
          },
          ui: [
            {
              label: 'Contour Value',
              name: 'contourValue',
              widget: 'slider',
              propType: 'slider',
              type: 'double',
              size: 1,
              domain: { min: 0, max: 1000, step: 1 },
              doc: 'Adjust contour value',
            },
            {
              label: 'Compute Normals',
              name: 'computeNormals',
              widget: 'checkbox',
              type: 'boolean',
              advanced: 0,
              size: 1,
              doc: 'Compute normal to enable smooth surface',
            },
            {
              label: 'Merge points',
              name: 'mergePoints',
              widget: 'checkbox',
              type: 'boolean',
              advanced: 0,
              size: 1,
              doc: 'Prevent point duplication by merging them',
            },
            {
              label: 'Update',
              name: 'update',
              propType: 'ExecuteProperty',
              size: 1,
            },
          ],
        },
      },
    },
    Representations: {
      Geometry: {
        class: vtkGeometryRepresentationProxy,
        options: {
          ui: [
            {
              label: 'Color By',
              propType: 'colorBy',
              name: 'colorBy',
              type: 'str',
              advanced: 0,
              size: 3,
              domain: {},
              doc: 'Array to color by',
            },
            {
              label: 'Lookup Table Editor',
              propType: 'lookupTableProperty',
              name: 'lookupTableProxy',
              advanced: 0,
              size: 1,
              domain: {},
              doc: 'Edit lookup table',
            },
            // {
            //   label: 'Piecewise Function Editor',
            //   propType: 'piecewiseFunctionProperty',
            //   name: 'piecewiseFunctionProxy',
            //   advanced: 0,
            //   size: 1,
            //   domain: {},
            //   doc: 'Edit piecewise function',
            // },
            {
              widget: 'list-1',
              label: 'Representation',
              name: 'representation',
              doc: 'Choose the type for the representation',
              values: ['Surface with edges', 'Surface', 'Wireframe', 'Points'],
              type: 'str',
              advanced: 0,
              size: 1,
            },
            {
              label: 'Opacity',
              name: 'opacity',
              widget: 'slider',
              propType: 'slider',
              type: 'double',
              size: 1,
              domain: { min: 0, max: 1, step: 0.01 },
              doc: 'Adjust object opactity',
            },
            {
              label: 'Interpolate Scalar before mapping',
              name: 'interpolateScalarsBeforeMapping',
              widget: 'checkbox',
              type: 'boolean',
              advanced: 1,
              size: 1,
              doc: 'Enable smooth color interpolation',
            },
            {
              name: 'visibility',
              label: 'Visibility',
              doc: 'Toggle object visibility',
              widget: 'checkbox',
              type: 'boolean',
              advanced: 1,
              size: 1,
            },
            {
              label: 'Point size',
              name: 'pointSize',
              widget: 'slider',
              propType: 'slider',
              type: 'integer',
              size: 1,
              domain: { min: 1, max: 50 },
              doc: 'Adjust point size',
              advanced: 1,
            },
          ],
        },
      },
      Slice: {
        class: vtkSliceRepresentationProxy,
        options: {
          ui: [
            {
              name: 'visibility',
              label: 'Visibility',
              doc: 'Toggle visibility',
              widget: 'checkbox',
              type: 'boolean',
              advanced: 1,
              size: 1,
            },
            {
              label: 'Color Window',
              name: 'colorWindow',
              widget: 'slider',
              type: 'integer',
              size: 1,
              domain: { min: 0, max: 255, step: 1 },
            },
            {
              label: 'Color Level',
              name: 'colorLevel',
              widget: 'slider',
              type: 'integer',
              size: 1,
              domain: { min: 0, max: 255, step: 1 },
            },
            {
              label: 'Slice',
              name: 'sliceIndex',
              widget: 'slider',
              type: 'integer',
              size: 1,
              domain: { min: 0, max: 255, step: 1 },
            },
          ],
        },
      },
      Volume: {
        class: vtkVolumeRepresentationProxy,
        options: {
          ui: [
            {
              label: 'Color By',
              propType: 'colorBy',
              name: 'colorBy',
              type: 'str',
              advanced: 0,
              size: 3,
              domain: {},
              doc: 'Array to color by',
            },
            {
              label: 'Lookup Table Editor',
              propType: 'lookupTableProperty',
              name: 'lookupTableProxy',
              advanced: 0,
              size: 1,
              domain: {},
              doc: 'Edit lookup table',
            },
            {
              label: 'Piecewise Function Editor',
              propType: 'piecewiseFunctionProperty',
              name: 'piecewiseFunctionProxy',
              advanced: 0,
              size: 1,
              domain: {},
              doc: 'Edit piecewise function',
            },
            {
              name: 'volumeVisibility',
              label: 'Volume Visibility',
              doc: 'Toggle visibility of the Volume',
              widget: 'checkbox',
              type: 'boolean',
              advanced: 1,
              size: 1,
            },
            {
              widget: 'PropertyGroup', // 'ProxyEditorPropertyWidget',
              label: 'Shadow and Edge',
              name: 'groupShadowEdge',
              type: null,
              children: [
                {
                  name: 'useShadow',
                  label: 'Use shadow',
                  doc: 'Toggle shadow for volume rendering',
                  widget: 'checkbox',
                  type: 'boolean',
                  size: 1,
                },
                {
                  label: 'Sample distance',
                  name: 'sampleDistance',
                  widget: 'slider',
                  type: 'double',
                  size: 1,
                  domain: { min: 0, max: 1, step: 0.01 },
                },
                {
                  label: 'Edge Gradient',
                  name: 'edgeGradient',
                  widget: 'slider',
                  type: 'double',
                  size: 1,
                  domain: { min: 0, max: 1, step: 0.01 },
                },
              ],
            },
            {
              widget: 'PropertyGroup', // 'ProxyEditorPropertyWidget',
              label: 'Window setup',
              name: 'groupWindow',
              type: null,
              children: [
                {
                  label: 'Color Window',
                  name: 'colorWindow',
                  widget: 'slider',
                  type: 'integer',
                  size: 1,
                  domain: { min: 0, max: 255, step: 1 },
                },
                {
                  label: 'Color Level',
                  name: 'colorLevel',
                  widget: 'slider',
                  type: 'integer',
                  size: 1,
                  domain: { min: 0, max: 255, step: 1 },
                },
              ],
            },
            {
              widget: 'PropertyGroup', // 'ProxyEditorPropertyWidget',
              label: 'Slices',
              name: 'groupSlices',
              type: null,
              children: [
                {
                  name: 'sliceVisibility',
                  label: 'Slices Visibility',
                  doc: 'Toggle visibility of the Slices',
                  widget: 'checkbox',
                  type: 'boolean',
                  size: 1,
                },
                {
                  label: 'SliceX',
                  name: 'xSliceIndex',
                  widget: 'slider',
                  type: 'integer',
                  size: 1,
                  domain: { min: 0, max: 255, step: 1 },
                },
                {
                  label: 'SliceY',
                  name: 'ySliceIndex',
                  widget: 'slider',
                  type: 'integer',
                  size: 1,
                  domain: { min: 0, max: 255, step: 1 },
                },
                {
                  label: 'SliceZ',
                  name: 'zSliceIndex',
                  widget: 'slider',
                  type: 'integer',
                  size: 1,
                  domain: { min: 0, max: 255, step: 1 },
                },
              ],
            },
          ],
        },
      },
      Molecule: {
        class: vtkMoleculeRepresentationProxy,
        options: {
          ui: [
            {
              label: 'Tolerance',
              name: 'tolerance',
              widget: 'slider',
              type: 'double',
              size: 1,
              domain: { min: 0, max: 1, step: 0.01 },
            },
            {
              label: 'Atomic Radius Scale Factor',
              name: 'atomicRadiusScaleFactor',
              widget: 'slider',
              type: 'double',
              size: 1,
              domain: { min: 0, max: 1, step: 0.01 },
            },
            {
              label: 'Bond Radius',
              name: 'bondRadius',
              widget: 'slider',
              type: 'double',
              size: 1,
              domain: { min: 0, max: 1, step: 0.01 },
            },
            {
              label: 'Delta Bond Factor',
              name: 'deltaBondFactor',
              widget: 'slider',
              type: 'double',
              size: 1,
              domain: { min: 0, max: 1, step: 0.01 },
            },
            {
              label: 'Hide Elements',
              name: 'hideElements',
              propType: 'cell',
              type: 'str',
              size: 1,
            },
          ],
        },
      },
    },
    Views: {
      View3D: {
        class: vtkView,
        options: {
          ui: [
            {
              label: 'Background Color',
              name: 'background',
              propType: 'Color',
              type: 'double',
              size: 3,
              doc:
                'RGB mapping of the background color with values between 0 and 1.0',
              domain: {
                palette: Palettes.spectral.concat('fff', '000', '#ffffff00'),
              },
            },
            {
              label: 'Orientation Axes',
              name: 'orientationAxes',
              widget: 'checkbox',
              type: 'boolean',
              advanced: 1,
              size: 1,
              doc: 'Toggle orientation axes visibility',
            },
            // {
            //   label: 'ResetCamera',
            //   name: 'resetCamera',
            //   propType: 'ExecuteProperty',
            //   size: 1,
            // },
          ],
        },
      },
      View2D: {
        class: vtk2DView,
        options: {
          ui: [
            {
              label: 'Background Color',
              name: 'background',
              propType: 'Color',
              type: 'double',
              size: 3,
              doc:
                'RGB mapping of the background color with values between 0 and 1.0',
              domain: {
                palette: Palettes.spectral.concat('fff', '000', '#ffffff00'),
              },
            },
            {
              label: 'Orientation Axes',
              name: 'orientationAxes',
              widget: 'checkbox',
              type: 'boolean',
              advanced: 1,
              size: 1,
              doc: 'Toggle orientation axes visibility',
            },
          ],
        },
      },
    },
  },
  representations: {
    View3D: {
      vtkPolyData: { name: 'Geometry' },
      vtkImageData: { name: 'Volume' },
      vtkMolecule: { name: 'Molecule' },
    },
    View2D: {
      vtkPolyData: { name: 'Geometry' },
      vtkImageData: { name: 'Slice' },
      vtkMolecule: { name: 'Molecule' },
    },
  },
  filters: {
    vtkPolyData: [],
    vtkImageData: ['Contour'],
    vtkMolecule: [],
  },
};
