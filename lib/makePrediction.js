'use strict'
var AWS = require('aws-sdk')
AWS.config.region = 'us-east-1'
let MLmodel = require('../MLmodel')
let debug = require('./debug')
var machinelearning = new AWS.MachineLearning()
module.exports = function (datum, query) {
  debug.ML.info('datum to make prediction is', datum)
  debug.ML.info('query to find prediction is', query)
  query = query || {}
  let _query = {}
  _query.Status = 'COMPLETED'
  query.MLModelId && (_query.MLModelId = query.MLModelId)
  query.type && (_query.type = query.type)
  return new Promise(function (resolve, reject) {
    // The model is looking for
    MLmodel.find(_query).sort({updatedAt: -1}).exec(function (e, d) {
      if (e) debug.ML.error('error in found a model', e)
      debug.ML.info('model found to make prediction is',
      d[0] && d[0].toObject ? d[0].toObject() : d[0])
      if (d.length && d[0].EndpointInfo.EndpointStatus === 'READY') {
        // with the model found the predict is made to endpoint
        machinelearning.predict({
          MLModelId: d[0].MLModelId,
            /* required */
          PredictEndpoint: d[0].EndpointInfo.EndpointUrl,
            /* required */
          Record: datum
        },
          function (err, prediction) {
            if (err) {
              debug.ML.error('error on prediction is', err)
              reject(err)
            } else {
              debug.ML.info('prediction is', prediction)
              resolve(prediction)
            }
          })
        return
      }
      resolve()
    })
  })
}
