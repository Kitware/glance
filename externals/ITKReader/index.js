import vtkITKImageReader from 'vtk.js/Sources/IO/Misc/ITKImageReader';

import extensionToImageIO from 'itk/extensionToImageIO';
import readImageArrayBuffer from 'itk/readImageArrayBuffer';

import vtkITKDicomImageReader from './ITKDicomImageReader';

vtkITKImageReader.setReadImageArrayBufferFromITK(readImageArrayBuffer);

export const extensions = Array.from(
  new Set(Object.keys(extensionToImageIO).map((ext) => ext.toLowerCase()))
);

export function registerToGlance(Glance) {
  if (Glance) {
    extensions.filter((e) => e !== 'dcm').forEach((extension) =>
      Glance.registerReader({
        extension,
        name: `${extension.toUpperCase()} Reader`,
        vtkReader: vtkITKImageReader,
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
