import vtkXMLPolyDataReader from 'vtk.js/Sources/IO/XML/XMLPolyDataReader';
import vtkXMLImageDataReader from 'vtk.js/Sources/IO/XML/XMLImageDataReader';
import vtkSTLReader from 'vtk.js/Sources/IO/Geometry/STLReader';
import vtkOBJReader from 'vtk.js/Sources/IO/Misc/OBJReader';
import vtkPDBReader from 'vtk.js/Sources/IO/Misc/PDBReader';

import ReaderFactory from './ReaderFactory';

// ----------------------------------------------------------------------------
// Register default readers
// ----------------------------------------------------------------------------

ReaderFactory.registerReader(
  'vtp',
  'Polydata Reader',
  vtkXMLPolyDataReader,
  'readAsArrayBuffer',
  'parseArrayBuffer'
);

ReaderFactory.registerReader(
  'vti',
  'ImageData Reader',
  vtkXMLImageDataReader,
  'readAsArrayBuffer',
  'parseArrayBuffer'
);

ReaderFactory.registerReader(
  'stl',
  'STL Binary Reader',
  vtkSTLReader,
  'readAsArrayBuffer',
  'parseBinary'
);

ReaderFactory.registerReader(
  'obj',
  'OBJ Reader',
  vtkOBJReader,
  'readAsText',
  'parse'
);

ReaderFactory.registerReader(
  'pdb',
  'PDB Reader',
  vtkPDBReader,
  'readAsText',
  'parseText',
  'vtkMolecule'
);
