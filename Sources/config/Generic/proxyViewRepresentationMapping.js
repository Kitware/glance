const View3D = {
  vtkPolyData: { name: 'Geometry' },
  vtkImageData: { name: 'Volume' },
  vtkMolecule: { name: 'Molecule' },
  Glyph: { name: 'Glyph' },
  Skybox: { name: 'Skybox' },
};

const View2D = {
  vtkPolyData: { name: 'Geometry' },
  vtkImageData: { name: 'Slice' },
  vtkMolecule: { name: 'Molecule' },
  Glyph: { name: 'Glyph' },
  Skybox: { name: 'Skybox' },
};

export default {
  View2D,
  View3D,
};
