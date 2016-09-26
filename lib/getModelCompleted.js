'use strict'
let AWS = require('aws-sdk')
AWS.config.region = 'us-east-1'
const debug = require('./debug')
let machinelearning = new AWS.MachineLearning()
let delateEndPoint = require('./delateEndPoint')
let getEndPoint = require('./getEndPoint')
module.exports = function (resCreateModel, ScoreThreshold) {
  debug.info('resCreateModel on getModelCompleted', resCreateModel)
  return new Promise(function (resolve, reject) {
    let timer = setInterval(function () {
      // We obtain the model
      machinelearning.getMLModel(resCreateModel, function (err,
        resGetModel) {
        // check if there is a error
        debug.info('resGetModel on getModelCompleted', resGetModel)
        if (err) {
          debug.error('err on getModelCompleted', err)
          clearInterval(timer)
          reject(err)
          return
        }
        // check if model is COMPLETED
        if (resGetModel.Status === 'DELETED' || resGetModel.Status ===
          'COMPLETED' || resGetModel.Status === 'FAILED') {
          clearInterval(timer)
          // if a ScoreThreshold is passed then the model is upgraded
          if (ScoreThreshold && resGetModel.Status === 'COMPLETED' &&
          resGetModel.MLModelType === 'BINARY') {
            // the endpoint is removed
            delateEndPoint(
                resGetModel.MLModelId
              )
              .then(function () {
                // When the endpoint is removed the model es updated
                machinelearning.updateMLModel({
                  MLModelId: resGetModel.MLModelId,
                  ScoreThreshold: ScoreThreshold
                }, function (err, modelUpdated) {
                  debug.info('modelUpdated on getModelCompleted', modelUpdated)
                  // If error happen the promise is removed
                  if (err) {
                    debug.error('err on getModelCompleted with updateMLModel', err)
                    reject(err)
                    return
                  }
                  // The end point is created again
                  getEndPoint(modelUpdated.MLModelId)
                    .then(resolve)
                    .catch(reject)
                })
              })
              .catch(reject)
            return
          }
          // The end point is created again
          if (resGetModel.Status === 'COMPLETED') {
            return getEndPoint(resGetModel.MLModelId)
            .then(resolve)
            .catch(reject)
          }
          return reject(resGetModel)
        }
      }) /* required */
    }, 180000)
  })
}
