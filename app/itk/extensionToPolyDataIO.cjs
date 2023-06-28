"use strict";

const extensionToIO = new Map([['gen', 'VTKExodusFileReader'], ['e', 'VTKExodusFileReader'], ['exo', 'VTKExodusFileReader'], ['exii', 'VTKExodusFileReader'], ['ex2', 'VTKExodusFileReader'], ['vtk', 'VTKLegacyFileReader'], ['VTK', 'VTKLegacyFileReader'], ['vtp', 'VTKXMLFileReader'], ['VTP', 'VTKXMLFileReader'], ['vtu', 'VTKXMLFileReader'], ['VTU', 'VTKXMLFileReader'], ['vtr', 'VTKXMLFileReader'], ['VTR', 'VTKXMLFileReader']]);
module.exports = extensionToIO;