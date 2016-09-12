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
        EvaluationDataSourceId: DatasourceId,
        EvaluationId: DatasourceId,
        MLModelId: MLModelId
      }, function (
      error, resEvaluation) {
        debug.info('resEvaluation on getEvaluation', resEvaluation)
        if (error) {
          debug.error('error on getEvaluation', error)
          reject(error)
          return
        }
        // a timer is called to make request until obtain the EndpointStatus like READY
        let timer = setInterval(function () {
          machinelearning.getEvaluation({
            EvaluationId: DatasourceId
          }, function (err, res) {
            debug.info('res on getEvaluation', res)
            if (err || res.Status === 'FAILED' || res.Status === 'DELETED') {
              debug.error('error on getEvaluation with timer', err)
              reject(err)
            } else if (res.Status === 'COMPLETED') {
              // the timer is clean
              clearInterval(timer)
              resolve(res)
            }
          })
        }, 180000)
      })
  })
}
