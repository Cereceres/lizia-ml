'use strict'
var AWS = require('aws-sdk')
var converter = require('json-2-csv')
const debug = require('./debug')
AWS.config.region = 'us-east-1'
module.exports = function (json, bucket, name, path) {
  name = name || this.options.DataSourceName
  bucket = bucket || this.options.bucket
  path = path || this.options.path
  var now = new Date()
  var jsonDate = now.toJSON()
  return new Promise(function (resolve, reject) {
    // params to create de object into de bucket
    var s3bucket = new AWS.S3({params: {
      Bucket: bucket,
      Key: path.length ? path + '/' + jsonDate + ':' + name + '.csv' : jsonDate + ':' + name + '.csv'
    }})
    // the bucket is created
    s3bucket.createBucket({
      Bucket: bucket
    }, function (err, createBucket) {
      if (err) {
        debug.ML.error('error on create bucket with s3', err)
        reject(err)
        return
      }
      debug.ML.info('createBucket on create bucket with s3', createBucket)
      // the object with the csv is obtainded
        // the data are convert to json
          // next the object stored into s3 is concat to object passed
      converter.json2csv(json, function (e, csv) {
        if (e) {
          debug.ML.error('err on json2csv object in bucket with s3', e)
          reject(e)
          return
        }
        var params = {
          Body: csv,
          ACL: 'public-read-write'
        }
              // the object is uploaded
        s3bucket.upload(params, function (err, dataUploaded) {
          if (err) {
            debug.ML.error('err on upload object in bucket with s3', err)
            reject(err)
            return
          }
                // the promise is resolved
          debug.ML.info('object in bucket with s3', {
            data: dataUploaded,
            createBucket: createBucket
          })
          resolve({
            data: dataUploaded,
            createBucket: createBucket
          })
        })
      })
    })
  })
}
