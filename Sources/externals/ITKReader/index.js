import vtkITKImageReader from 'vtk.js/Sources/IO/Misc/ITKImageReader';

import extensionToImageIO from 'itk/extensionToImageIO';
import readImageArrayBuffer from 'itk/readImageArrayBuffer';

vtkITKImageReader.setReadImageArrayBufferFromITK(readImageArrayBuffer);

export const extensions = Array.from(
  new Set(Object.keys(extensionToImageIO).map((ext) => ext.toLowerCase()))
);

export function registerToGlance(Glance) {
  if (Glance) {
    extensions.forEach((extension) =>
      Glance.registerReader({
        extension,
        name: `${extension.toUpperCase()} Reader`,
        vtkReader: vtkITKImageReader,
        binary: true,
        fileNameMethod: 'setFileName',
      })
    );
  }
}

export default {
  extensions,
  registerToGlance,
};

const Glance = (typeof window === 'undefined' ? {} : window).Glance;
registerToGlance(Glance);
