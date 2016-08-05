const AWS = require('aws-sdk')
const debug = require('./debug')
AWS.config.region = 'us-east-1'
const machinelearning = new AWS.MachineLearning()
module.exports = function (dataSource) {
  return new Promise(function (resolve, reject) {
    machinelearning.getDataSource({
      DataSourceId: dataSource.DataSourceId, /* required */
      Verbose: true
    }, function (error, dataSourceGetted) {
      if (error) {
        debug.ML.error('error on Get dataSource', error)
        reject(error)
        return
      }
      debug.ML.info('dataSourceGetted', dataSourceGetted)
      resolve(dataSourceGetted)
    })
  })
}
