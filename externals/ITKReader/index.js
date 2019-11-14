import vtkITKImageReader from 'vtk.js/Sources/IO/Misc/ITKImageReader';
import vtkITKPolyDataReader from 'vtk.js/Sources/IO/Misc/ITKPolyDataReader';

import extensionToImageIO from 'itk/extensionToImageIO';
import readImageArrayBuffer from 'itk/readImageArrayBuffer';
import extensionToPolyDataIO from 'itk/extensionToPolyDataIO';
import readPolyDataArrayBuffer from 'itk/readPolyDataArrayBuffer';

import vtkITKDicomImageReader from './ITKDicomImageReader';

vtkITKImageReader.setReadImageArrayBufferFromITK(readImageArrayBuffer);
vtkITKPolyDataReader.setReadPolyDataArrayBufferFromITK(readPolyDataArrayBuffer);

export const imageExtensions = Array.from(
  new Set(Array.from(extensionToImageIO.keys()).map((ext) => ext.toLowerCase()))
);

export const polyDataExtensions = Array.from(
  new Set(
    Array.from(extensionToPolyDataIO.keys()).map((ext) => ext.toLowerCase())
  )
);

export const extensions = imageExtensions.concat(polyDataExtensions);

export function registerToGlance(Glance) {
  if (Glance) {
    imageExtensions
      .filter((e) => e !== 'dcm')
      .forEach((extension) =>
        Glance.registerReader({
          extension,
          name: `${extension.toUpperCase()} Reader`,
          vtkReader: vtkITKImageReader,
          binary: true,
          fileNameMethod: 'setFileName',
        })
      );

    polyDataExtensions.forEach((extension) =>
      Glance.registerReader({
        extension,
        name: `${extension.toUpperCase()} Reader`,
        vtkReader: vtkITKPolyDataReader,
        binary: true,
        fileNameMethod: 'setFileName',
      })
    );

    Glance.registerReader({
      extension: 'dcm',
      name: 'DICOM File Series Reader',
      vtkReader: vtkITKDicomImageReader,
      fileNameMethod: 'setFileName',
      fileSeriesMethod: 'readFileSeries',
    });
  }
}

export default {
  extensions,
  registerToGlance,
};

const Glance = (typeof window === 'undefined' ? {} : window).Glance;
registerToGlance(Glance);
