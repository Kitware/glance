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
  readMethod: 'readAsArrayBuffer',
  parseMethod: 'parseArrayBuffer',
});

ReaderFactory.registerReader({
  extension: 'vti',
  name: 'ImageData Reader',
  vtkReader: vtkXMLImageDataReader,
  readMethod: 'readAsArrayBuffer',
  parseMethod: 'parseArrayBuffer',
});

ReaderFactory.registerReader({
  extension: 'stl',
  name: 'STL Binary Reader',
  vtkReader: vtkSTLReader,
  readMethod: 'readAsArrayBuffer',
  parseMethod: 'parseBinary',
});

ReaderFactory.registerReader({
  extension: 'obj',
  name: 'OBJ Reader',
  vtkReader: vtkOBJReader,
  readMethod: 'readAsText',
  parseMethod: 'parse',
});

ReaderFactory.registerReader({
  extension: 'pdb',
  name: 'PDB Reader',
  vtkReader: vtkPDBReader,
  readMethod: 'readAsText',
  parseMethod: 'parseText',
  sourceType: 'vtkMolecule',
});
