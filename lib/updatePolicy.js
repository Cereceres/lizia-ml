'use strict'
var AWS = require('aws-sdk')
const debug = require('./debug')
AWS.config.region = 'us-east-1'
module.exports = function (bucket, path) {
  bucket = bucket || this.options.bucket
  path = path || this.options.path
  debug.info('bucket to be update the policy ', bucket, ' with path ', path)
  var s3bucket = new AWS.S3()
    // params to create de object into de bucket
  return s3bucket.getBucketPolicy({Bucket: bucket}).promise()
.then((data) => {
  let test = false
  let Policy = JSON.parse(data.Policy)
  for (let i = 0; i < Policy.Statement.length; i++) {
    if (Policy.Statement[i].Action === 's3:GetObject' &&
    Policy.Statement[i].Resource ===
    ('arn:aws:s3:::' + bucket + '/' + path + '/*')) {
      test = true
      break
    }
  }
  if (!test) {
    Policy.Statement.push({
      Sid: 'AmazonML_s3:ListBucket',
      Effect: 'Allow',
      'Principal': {
        'Service': 'machinelearning.amazonaws.com'
      },
      'Action': 's3:ListBucket',
      'Resource': 'arn:aws:s3:::' + bucket,
      'Condition': {
        'StringLike':
      {'s3:prefix': path + '/*'}
      }
    }, {
      'Sid': 'AmazonML_s3:GetObject',
      'Effect': 'Allow',
      'Principal': {
        'Service': 'machinelearning.amazonaws.com'
      },
      'Action': 's3:GetObject',
      'Resource': 'arn:aws:s3:::' + bucket + '/' + path + '/*'
    })
  }
  let params = {
    Bucket: bucket, /* required */
    Policy: JSON.stringify(Policy) /* required */
  }
    // the bucket is created
  if (!test) return s3bucket.putBucketPolicy(params).promise()
  return Promise.resolve()
})
.catch(error => {
  debug.error('error on update policy ', bucket, ' with path ', path,
'error happen', error)
  return Promise.reject(error)
})
}
