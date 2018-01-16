import vtkXMLPolyDataReader from 'vtk.js/Sources/IO/XML/XMLPolyDataReader';
import vtkXMLImageDataReader from 'vtk.js/Sources/IO/XML/XMLImageDataReader';
import vtkSTLReader from 'vtk.js/Sources/IO/Geometry/STLReader';
import vtkOBJReader from 'vtk.js/Sources/IO/Misc/OBJReader';

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
