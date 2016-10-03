'use strict'
let AWS = require('aws-sdk')
AWS.config.region = 'us-east-1'
const debug = require('./debug')
let machinelearning = new AWS.MachineLearning()
/**
 * @function
 * @param {Object} with dataSourceId  to get
 */
module.exports = function (dataSource) {
  return new Promise(function (resolve, reject) {
    let timer = setInterval(function () {
      // We obtain the model
      machinelearning.getDataSource({ DataSourceId: dataSource.DataSourceId }, function (err,
        dataSourceGetted) {
        debug.info('dataSourceGetted completed', dataSourceGetted)
        // check if there is a error
        if (err) {
          debug.error('err on dataSourceGetted', err)
          clearInterval(timer)
          reject(err)
          return
        }
        // check if model is COMPLETED
        if (dataSourceGetted.Status === 'DELETED' || dataSourceGetted.Status ===
          'COMPLETED') {
          clearInterval(timer)
          // if the datasource is completed or deleted then the promise is resolved
          resolve(dataSourceGetted)
        }
      })
    }, 180000)
  })
}
