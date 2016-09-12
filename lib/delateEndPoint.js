'use strict'
var AWS = require('aws-sdk')
const debug = require('./debug')
AWS.config.region = 'us-east-1'
var machinelearning = new AWS.MachineLearning()
module.exports = function (MLModelId) {
  return new Promise(function (resolve, reject) {
    // The RealtimeEndpoint is removed
    machinelearning.deleteRealtimeEndpoint({MLModelId: MLModelId}, function (error, resEndPoint) {
      if (error) {
        debug.error('error on deleteRealtimeEndpoint', error)
        reject(error)
        return
      }
      // if the reponse of EndpointStatus is NONE then the promise is resolved
      if (resEndPoint.RealtimeEndpointInfo.EndpointStatus ===
        'NONE' || !resEndPoint) {
        debug.info('resEndPoint on deleteRealtimeEndpoint', resEndPoint)
        resolve(resEndPoint)
        return
      }
      // the request are send until obtain the EndpointStatus NONE
      let timer = setInterval(function () {
        machinelearning.getMLModel({
          MLModelId: MLModelId
        }, function (err, res) {
          if (err) {
            debug.info('error on deleteRealtimeEndpoint with timer', err)
            reject(err)
          } else if (res.EndpointInfo && res.EndpointInfo.EndpointStatus ===
            'NONE') {
              // the timer is removed if endpoint is removed
            clearInterval(timer)
            debug.info('resEndPoint on deleteRealtimeEndpoint with timer', res)
            resolve(res)
          }
        })
      }, 180000)
    })
  })
}
