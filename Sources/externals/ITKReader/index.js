import extensionToIO from 'itk/extensionToIO';

import vtkITKImageReader from './ITKImageReader';

export const extensions = Array.from(
  new Set(Object.keys(extensionToIO).map((ext) => ext.toLowerCase()))
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
  vtkITKImageReader,
  registerToGlance,
};

const Glance = (typeof window === 'undefined' ? {} : window).Glance;
registerToGlance(Glance);
