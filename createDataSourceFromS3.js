'use strict'
const AWS = require('aws-sdk')
const getDataSource = require('./getDataSource')
const getDataSourceComplete = require('./getDataSourceComplete')
const debug = require('./debug')
AWS.config.region = 'us-east-1'
const Schema = require('./schema')
const versioning = require('./versioning')
const machinelearning = new AWS.MachineLearning()
  /**
   * @function
   * @param {Object} to be used to create the schema of data for dataser of ML
   * @param {String} to be used to create the schema of data for dataser of ML
   * @param {String} to be used to create the schema of data for dataser of ML
   * @param {res} to be used to create the schema of data for dataser of ML
   */
function createDataSourceFromS3 (model, DataSourceId, DataSourceName, Bucket) {
  return new Promise(function (resolve, reject) {
    // schema created from model passed
    debug.ML.info('model to create schema', model)
    let schema = Schema(model)
    // params to be used to create the datasource
    let params = {
      DataSourceId: DataSourceId,
      /* required */
      DataSpec: { /* required */
        DataLocationS3: Bucket.path.length ? 's3:/' + Bucket.createBucket.Location + '/' + Bucket.path + '/'
        : 's3:/' + Bucket.createBucket.Location + '/' + Bucket.data.Key,
        DataSchema: schema
      },
      ComputeStatistics: true,
      DataSourceName: DataSourceName
    }
    debug.ML.info('params to be used in create datasourcefromS3', params)
    machinelearning.createDataSourceFromS3(params, function (err, datasource) {
      if (err) {
        debug.ML.error('error en create datasouce is', err)
        // If the datasource exist then is eliminated
        if (err.message.search('already exists') > -1) {
          // if the datasource already exists then is removed
          machinelearning.deleteDataSource({DataSourceId: DataSourceId
          }, function (error) {
            if (error) {
              debug.ML.error('error on remove the datasource', error)
              reject(error)
            } else {
              // The DataSourceId is updated
              DataSourceId = versioning(DataSourceId)
              debug.ML.info('the new DataSourceId is updated to ', DataSourceId)
              // the new datasource is creted with the new DataSourceId
              createDataSourceFromS3(model, DataSourceId, DataSourceName, Bucket)
                .then(resolve)
                .catch(reject)
            }
          })
        } else {
          reject(err)
        }
      } else {
        debug.ML.info('the data source created is', datasource)
        // get the data source to see his status
        getDataSource(datasource)
        .then(function (dataSourceGetted) {
          // if the status is delted or failed then the DataSourceId is updated
          if (dataSourceGetted.Status === 'FAILED' || dataSourceGetted.Status === 'DELETED') {
            // The DataSourceId is updated
            DataSourceId = versioning(DataSourceId)
            debug.ML.info('the new DataSourceId is updated to ', DataSourceId)
            // the new datasource is creted with the new DataSourceId
            createDataSourceFromS3(model, DataSourceId, DataSourceName, Bucket)
              .then(resolve)
              .catch(reject)
            return
          }
          // Get the datasource completed
          getDataSourceComplete(dataSourceGetted).then(resolve).catch(reject)
        }
        ).catch(reject)
      }
    })
  })
}
module.exports = createDataSourceFromS3
