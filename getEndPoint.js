'use strict'
var AWS = require('aws-sdk')
AWS.config.region = 'us-east-1'
const debug = require('./debug')
var machinelearning = new AWS.MachineLearning()
module.exports = function (MLModelId) {
  return new Promise(function (resolve, reject) {
    machinelearning
    // the request to obtain the RealtimeEndpointInfo is emitted
    .createRealtimeEndpoint(
      {
        MLModelId: MLModelId
      }, function (
      error, resEndPoint) {
        debug.ML.info('resEndPoint on getEndPoint', resEndPoint)
        if (error) {
          debug.ML.error('error on getEndPoint', resEndPoint)
          reject(error)
          return
        }
        // if the RealtimeEndpointInfo is READY then the promise is resolved
        if (resEndPoint.RealtimeEndpointInfo && resEndPoint.RealtimeEndpointInfo
        .EndpointStatus ===
        'READY') {
          resolve(resEndPoint)
          return
        }
        // a timer is called to make request until obtain the EndpointStatus like READY
        let timer = setInterval(function () {
          machinelearning.getMLModel({
            MLModelId: MLModelId
          }, function (err, res) {
            debug.ML.info('res on getEndPoint', res)
            if (err) {
              debug.ML.error('error on getEndPoint with timer', err)
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
