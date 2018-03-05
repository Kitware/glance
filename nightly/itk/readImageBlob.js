const WebworkerPromise = require('webworker-promise')
const PromiseFileReader = require('promise-file-reader')

const config = require('./itkConfig.js')

const worker = new window.Worker(config.webWorkersPath + '/ImageIOWorker.js')
const promiseWorker = new WebworkerPromise(worker)

/**
 * @param: blob Blob that contains the file contents
 * @param: fileName string that contains the file name
 * @param: mimeType optional mime-type string
 */
const readImageBlob = (blob, fileName, mimeType) => {
  return PromiseFileReader.readAsArrayBuffer(blob)
    .then(arrayBuffer => {
      return promiseWorker.postMessage({ operation: 'readImage', name: fileName, type: mimeType, data: arrayBuffer, config: config },
        [arrayBuffer])
    })
}

module.exports = readImageBlob
