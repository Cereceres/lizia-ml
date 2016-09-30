w'use strict'

const AWS = require('aws-sdk')
AWS.config.region = 'us-east-1'
const delateEndPoint = require('./delateEndPoint')
const updateMLModel = require('./updateMLModel')
const debug = require('./debug')
const machinelearning = new AWS.MachineLearning()

/**
 * The payer methods
 * @function {generator} To controller the payment endpoint
 */
module.exports = function (MLModelId, dataSourceId) {
  dataSourceId = dataSourceId || MLModelId
  return new Promise(function (resolve, reject) {
    delateEndPoint(MLModelId)
    .then(function (modelWithEndPointDelated) {
      debug.info('modelWithEndPointDelated', modelWithEndPointDelated)
      // the model is removed from ML aws
      return machinelearning.deleteMLModel({
        MLModelId: modelWithEndPointDelated.MLModelId
      }).promise()
    })
    .then(function (modelDelated) {
      machinelearning.getMLModel(modelDelated).promise()
      .then(MLModelStatus => {
        return updateMLModel(MLModelStatus)
      })
      .then(modelUpdated => {
        debug.info('modelUpdated to delete', modelUpdated.toObject ? modelUpdated.toObject() : modelUpdated)
      })
      .catch(err => {
        reject(err)
      })
      debug.info('modelDelated', modelDelated)
      // Here the data source is delated
      return machinelearning.deleteDataSource({ DataSourceId: dataSourceId })
      .promise()
    })
    .then(function (dataSourceDelated) {
      debug.info('dataSourceDelated', dataSourceDelated)
      resolve(dataSourceDelated)
    })
    .catch(reject)
  })
}
