'use strict'
module.exports =
function (bucket) {
  return JSON.stringify({
    'Version': '2012-10-17',
    'Statement': [
      {
        'Sid': 'AmazonML_s3:GetObject',
        'Effect': 'Allow',
        'Principal': {
          'Service': 'machinelearning.amazonaws.com'
        },
        'Action': 's3:GetObject',
        'Resource': 'arn:aws:s3:::' + bucket + '/*'
      }
    ]
  })
}
