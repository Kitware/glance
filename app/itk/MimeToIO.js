let mimeToIO = {}

mimeToIO['image/jpeg'] = 'itkJPEGImageIOJSBinding'
mimeToIO['image/png'] = 'itkPNGImageIOJSBinding'
mimeToIO['image/tiff'] = 'itkTIFFImageIOJSBinding'
mimeToIO['image/x-ms-bmp'] = 'itkBMPImageIOJSBinding'
mimeToIO['image/x-bmp'] = 'itkBMPImageIOJSBinding'
mimeToIO['image/bmp'] = 'itkBMPImageIOJSBinding'
mimeToIO['application/dicom'] = 'itkDCMTKImageIOJSBinding'

module.exports = mimeToIO
