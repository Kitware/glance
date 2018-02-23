const WebworkerPromise = require('webworker-promise')
const PromiseFileReader = require('promise-file-reader')

const config = require('./itkConfig.js')

const worker = new window.Worker(config.webWorkersPath + '/ImageIOWorker.js')
const promiseWorker = new WebworkerPromise(worker)

const readImageDICOMFileSeries = (fileList) => {
  const fetchFileDescriptions = Array.from(fileList, function (file) {
    return PromiseFileReader.readAsArrayBuffer(file).then(function (arrayBuffer) {
      const fileDescription = { name: file.name, type: file.type, data: arrayBuffer }
      return fileDescription
    })
  })

  return Promise.all(fetchFileDescriptions).then(function (fileDescriptions) {
    const transferables = fileDescriptions.map((description) => {
      return description.data
    })
    return promiseWorker.postMessage({ operation: 'readDICOMImageSeries', fileDescriptions: fileDescriptions, config: config },
      transferables)
  })
}

module.exports = readImageDICOMFileSeries
