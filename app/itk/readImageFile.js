const PromiseWorker = require('promise-worker-transferable')
const PromiseFileReader = require('promise-file-reader')

const config = require('./itkConfig.js')

const worker = new window.Worker(config.webWorkersPath + '/ImageIOWorker.js')
const promiseWorker = new PromiseWorker(worker)

const readImageFile = (file) => {
  return PromiseFileReader.readAsArrayBuffer(file)
    .then(arrayBuffer => {
      return promiseWorker.postMessage({ operation: 'readImage', name: file.name, type: file.type, data: arrayBuffer, config: config },
        [arrayBuffer])
    })
}

module.exports = readImageFile
