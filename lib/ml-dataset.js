'use strict'
var AWS = require('aws-sdk')
AWS.config.region = 'us-east-1'
var s3 = require('./s3')
let createDataSourceFromS3 = require('./createDataSourceFromS3')

/**
 * @function
 * @param {Object} model
 * @param {Object} data
 * @param {Object} bucket
 * @param {Object} DataSourceName
 * @param {Object} DataSourceId
 */
module.exports = function (model, data, bucket, path,
  DataSourceName, DataSourceId) {
  return s3(bucket, DataSourceName, path, data).then(function (res) {
    res = res || {}
    res.path = path
      // the DataSource is created with the data stored in s3
    return createDataSourceFromS3(model, DataSourceId, DataSourceName, res)
  })
}
