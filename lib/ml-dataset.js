'use strict'
var AWS = require('aws-sdk')
AWS.config.region = 'us-east-1'
var s3 = require('./s3')
let createDataSourceFromS3 = require('./createDataSourceFromS3')
var now = new Date()
var jsonDate = now.toJSON()
const updatePolicy = require('./updatePolicy')

/**
 * @function
 * @param {Object} model
 * @param {Object} data
 * @param {Object} bucket
 * @param {Object} DataSourceName
 * @param {Object} DataSourceId
 */
module.exports = function (model, data, bucket, path, DataSourceName, DataSourceId) {
  if (Array.isArray(data) && data.length) {
    return s3(data, DataSourceName, bucket, path).then(function (res) {
      res = res || {}
      res.path = path
      // the source created with the data stored in s3
      return createDataSourceFromS3(model, DataSourceId, DataSourceName, res)
    })
  }
  return updatePolicy(bucket, path).then(() => createDataSourceFromS3(model, DataSourceId, DataSourceName,
    {
      path: path,
      data: {Key: path.length ? path + '/' +
      jsonDate + ':' + DataSourceName + '.csv' : jsonDate + ':' + DataSourceName + '.csv'},
      createBucket: {
        Location: '/' + bucket
      }
    }))
}
