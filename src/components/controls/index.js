import ColorBy from 'paraview-glance/src/components/controls/ColorBy';
import Information from 'paraview-glance/src/components/controls/Information';
import Molecule from 'paraview-glance/src/components/controls/Molecule';
import Representation from 'paraview-glance/src/components/controls/Representation';
import Slice from 'paraview-glance/src/components/controls/SliceControl';

export default [
  {
    component: Representation,
    defaultExpand: true,
    icon: 'brightness_medium',
    name: 'Representation',
    visible: (source) =>
      source.getDataset().isA('vtkPolyData') ||
      source.getDataset().isA('vtkImageData'),
  },
  {
    component: ColorBy,
    defaultExpand: true,
    icon: 'invert_colors',
    name: 'Colors',
    visible: (source) =>
      source.getDataset().isA('vtkPolyData') ||
      source.getDataset().isA('vtkImageData'),
  },
  {
    component: Slice,
    defaultExpand: true,
    icon: 'tune',
    name: 'Slice',
    visible: (source) =>
      source.getDataset().isA('vtkPolyData') ||
      source.getDataset().isA('vtkImageData'),
  },
  {
    component: Molecule,
    defaultExpand: true,
    icon: 'bubble_chart',
    name: 'Molecule',
    visible: (source) => source.getDataset().isA('vtkMolecule'),
  },
  {
    component: Information,
    defaultExpand: false,
    icon: 'help_outline',
    name: 'Information',
    visible: (source) =>
      source.getDataset().isA('vtkPolyData') ||
      source.getDataset().isA('vtkImageData'),
  },
];
