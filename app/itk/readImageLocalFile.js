const path = require('path')
const mime = require('mime-types')

const mimeToIO = require('./MimeToIO.js')
const getFileExtension = require('./getFileExtension.js')
const extensionToIO = require('./extensionToIO.js')
const ImageIOIndex = require('./ImageIOIndex.js')

const loadEmscriptenModule = require('./loadEmscriptenModule.js')
const readImageEmscriptenFSFile = require('./readImageEmscriptenFSFile.js')

/**
 * Read an image from a file on the local filesystem in Node.js.
 *
 * @param: filePath path to the file on the local filesystem.
 */
const readImageLocalFile = (filePath) => {
  return new Promise(function (resolve, reject) {
    const imageIOsPath = path.resolve(__dirname, '..', 'dist', 'ImageIOs')
    try {
      const mimeType = mime.lookup(filePath)
      const extension = getFileExtension(filePath)

      let io = null
      if (mimeToIO.hasOwnProperty(mimeType)) {
        io = mimeToIO[mimeType]
      } else if (extensionToIO.hasOwnProperty(extension)) {
        io = extensionToIO[extension]
      } else {
        for (let idx = 0; idx < ImageIOIndex.length; ++idx) {
          const modulePath = path.join(imageIOsPath, ImageIOIndex[idx])
          const Module = loadEmscriptenModule(modulePath)
          const imageIO = new Module.ITKImageIO()
          Module.mountContainingDirectory(filePath)
          imageIO.SetFileName(filePath)
          if (imageIO.CanReadFile(filePath)) {
            io = ImageIOIndex[idx]
            Module.unmountContainingDirectory(filePath)
            break
          }
          Module.unmountContainingDirectory(filePath)
        }
      }
      if (io === null) {
        reject(Error('Could not find IO for: ' + filePath))
      }

      const modulePath = path.join(imageIOsPath, io)
      const Module = loadEmscriptenModule(modulePath)
      Module.mountContainingDirectory(filePath)
      const image = readImageEmscriptenFSFile(Module, filePath)
      Module.unmountContainingDirectory(filePath)
      resolve(image)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = readImageLocalFile
