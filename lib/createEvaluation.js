'use strict'
var AWS = require('aws-sdk')
AWS.config.region = 'us-east-1'
const debug = require('./debug')
var machinelearning = new AWS.MachineLearning()
module.exports = function (MLModelId, DatasourceId) {
  return new Promise(function (resolve, reject) {
    machinelearning
    // the request to obtain the RealtimeEndpointInfo is emitted
    .createEvaluation(
      {
        EvaluationDataSourceId: DatasourceId
      }, function (
      error, resEvaluation) {
        debug.ML.info('resEvaluation on getEvaluation', resEvaluation)
        if (error) {
          debug.ML.error('error on getEvaluation', resEvaluation)
          reject(error)
          return
        }
        // if the RealtimeEndpointInfo is READY then the promise is resolved
        if (resEvaluation.RealtimeEndpointInfo && resEvaluation.RealtimeEndpointInfo
        .EndpointStatus ===
        'READY') {
          resolve(resEvaluation)
          return
        }
        // a timer is called to make request until obtain the EndpointStatus like READY
        let timer = setInterval(function () {
          machinelearning.getMLModel({
            MLModelId: MLModelId
          }, function (err, res) {
            debug.ML.info('res on getEvaluation', res)
            if (err) {
              debug.ML.error('error on getEvaluation with timer', err)
              reject(err)
            } else if (res.EndpointInfo && res.EndpointInfo.EndpointStatus ===
            'READY') {
              // the timer is clean
              clearInterval(timer)
              resolve(res)
            }
          })
        }, 60000)
      })
  })
}
