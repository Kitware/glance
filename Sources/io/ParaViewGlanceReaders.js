import vtkXMLPolyDataReader from 'vtk.js/Sources/IO/XML/XMLPolyDataReader';
import vtkXMLImageDataReader from 'vtk.js/Sources/IO/XML/XMLImageDataReader';
import vtkSTLReader from 'vtk.js/Sources/IO/Geometry/STLReader';
import vtkOBJReader from 'vtk.js/Sources/IO/Misc/OBJReader';
import vtkPDBReader from 'vtk.js/Sources/IO/Misc/PDBReader';

import ReaderFactory from './ReaderFactory';

// ----------------------------------------------------------------------------
// Register default readers
// ----------------------------------------------------------------------------

ReaderFactory.registerReader({
  extension: 'vtp',
  name: 'Polydata Reader',
  vtkReader: vtkXMLPolyDataReader,
  binary: true,
});

ReaderFactory.registerReader({
  extension: 'vti',
  name: 'ImageData Reader',
  vtkReader: vtkXMLImageDataReader,
  binary: true,
});

ReaderFactory.registerReader({
  extension: 'stl',
  name: 'STL Binary Reader',
  vtkReader: vtkSTLReader,
  binary: true,
});

ReaderFactory.registerReader({
  extension: 'obj',
  name: 'OBJ Reader',
  vtkReader: vtkOBJReader,
  binary: false,
});

ReaderFactory.registerReader({
  extension: 'pdb',
  name: 'PDB Reader',
  vtkReader: vtkPDBReader,
  binary: false,
  sourceType: 'vtkMolecule',
});
