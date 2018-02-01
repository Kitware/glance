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
  'parseArrayBuffer',
  'vtkPolyData'
);

ReaderFactory.registerReader(
  'vti',
  'ImageData Reader',
  vtkXMLImageDataReader,
  'readAsArrayBuffer',
  'parseArrayBuffer',
  'vtkImageData'
);

ReaderFactory.registerReader(
  'stl',
  'STL Binary Reader',
  vtkSTLReader,
  'readAsArrayBuffer',
  'parseBinary',
  'vtkPolyData'
);

ReaderFactory.registerReader(
  'obj',
  'OBJ Reader',
  vtkOBJReader,
  'readAsText',
  'parse',
  'vtkPolyData'
);

ReaderFactory.registerReader(
  'pdb',
  'PDB Reader',
  vtkPDBReader,
  'readAsText',
  'parseText',
  'vtkMolecule'
);
