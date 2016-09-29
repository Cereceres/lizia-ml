'use strict'
module.exports = {
  'Version': '2012-10-17',
  'Statement': [
    {
      'Sid': 'AmazonML_s3:ListBucket',
      'Effect': 'Allow',
      'Principal': {
        'Service': 'machinelearning.amazonaws.com'
      },
      'Action': 's3:ListBucket',
      'Resource': 'arn:aws:s3:::ml-aws',
      'Condition': {
        'StringLike': {
          's3:prefix': 'sales/color/*'
        }
      }
    },
    {
      'Sid': 'AmazonML_s3:ListBucket',
      'Effect': 'Allow',
      'Principal': {
        'Service': 'machinelearning.amazonaws.com'
      },
      'Action': 's3:ListBucket',
      'Resource': 'arn:aws:s3:::ml-aws',
      'Condition': {
        'StringLike': {
          's3:prefix': 'ml-files/*'
        }
      }
    },
    {
      'Sid': 'AmazonML_s3:GetObject',
      'Effect': 'Allow',
      'Principal': {
        'Service': 'machinelearning.amazonaws.com'
      },
      'Action': 's3:GetObject',
      'Resource': 'arn:aws:s3:::ml-aws/*'
    },
    {
      'Sid': 'AmazonML_s3:GetObject',
      'Effect': 'Allow',
      'Principal': {
        'Service': 'machinelearning.amazonaws.com'
      },
      'Action': 's3:GetObject',
      'Resource': 'arn:aws:s3:::ml-aws/ml-files/*'
    },
    {
      'Sid': 'AmazonML_s3:GetObject',
      'Effect': 'Allow',
      'Principal': {
        'Service': 'machinelearning.amazonaws.com'
      },
      'Action': 's3:GetObject',
      'Resource': 'arn:aws:s3:::ml-aws/sales/color/*'
    },
    {
      'Sid': 'AmazonML_s3:ListBucket',
      'Effect': 'Allow',
      'Principal': {
        'Service': 'machinelearning.amazonaws.com'
      },
      'Action': 's3:ListBucket',
      'Resource': 'arn:aws:s3:::ml-aws',
      'Condition': {
        'StringLike': {
          's3:prefix': 'sales/categories/*'
        }
      }
    },
    {
      'Sid': 'AmazonML_s3:GetObject',
      'Effect': 'Allow',
      'Principal': {
        'Service': 'machinelearning.amazonaws.com'
      },
      'Action': 's3:GetObject',
      'Resource': 'arn:aws:s3:::ml-aws/sales/categories/*'
    },
    {
      'Sid': 'AmazonML_s3:ListBucket',
      'Effect': 'Allow',
      'Principal': {
        'Service': 'machinelearning.amazonaws.com'
      },
      'Action': 's3:ListBucket',
      'Resource': 'arn:aws:s3:::ml-aws',
      'Condition': {
        'StringLike': {
          's3:prefix': 'similitude/similitude/*'
        }
      }
    },
    {
      'Sid': 'AmazonML_s3:GetObject',
      'Effect': 'Allow',
      'Principal': {
        'Service': 'machinelearning.amazonaws.com'
      },
      'Action': 's3:GetObject',
      'Resource': 'arn:aws:s3:::ml-aws/similitude/similitude/*'
    },
    {
      'Sid': 'AmazonML_s3:ListBucket',
      'Effect': 'Allow',
      'Principal': {
        'Service': 'machinelearning.amazonaws.com'
      },
      'Action': 's3:ListBucket',
      'Resource': 'arn:aws:s3:::ml-aws',
      'Condition': {
        'StringLike': {
          's3:prefix': 'ml-sim/similitude/*'
        }
      }
    },
    {
      'Sid': 'AmazonML_s3:GetObject',
      'Effect': 'Allow',
      'Principal': {
        'Service': 'machinelearning.amazonaws.com'
      },
      'Action': 's3:GetObject',
      'Resource': 'arn:aws:s3:::ml-aws/ml-sim/similitude/*'
    },
    {
      'Sid': 'AmazonML_s3:ListBucket',
      'Effect': 'Allow',
      'Principal': {
        'Service': 'machinelearning.amazonaws.com'
      },
      'Action': 's3:ListBucket',
      'Resource': 'arn:aws:s3:::ml-aws',
      'Condition': {
        'StringLike': {
          's3:prefix': 'ml-sale-customer/color/*'
        }
      }
    },
    {
      'Sid': 'AmazonML_s3:GetObject',
      'Effect': 'Allow',
      'Principal': {
        'Service': 'machinelearning.amazonaws.com'
      },
      'Action': 's3:GetObject',
      'Resource': 'arn:aws:s3:::ml-aws/ml-sale-customer/color/*'
    }
  ]
}
