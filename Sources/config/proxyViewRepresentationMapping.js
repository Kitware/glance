const View3D = {
  vtkPolyData: { name: 'Geometry' },
  vtkImageData: { name: 'Volume' },
  vtkMolecule: { name: 'Molecule' },
  Glyph: { name: 'Glyph' },
};

const View2D = {
  vtkPolyData: { name: 'Geometry' },
  vtkImageData: { name: 'Slice' },
  vtkMolecule: { name: 'Molecule' },
  Glyph: { name: 'Glyph' },
};

export default {
  View2D,
  View3D,
};
