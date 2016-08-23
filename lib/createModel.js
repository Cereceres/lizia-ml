'use strict'
const AWS = require('aws-sdk')
AWS.config.region = 'us-east-1'
const mlDataSet = require('./ml-dataset')
const debug = require('./debug')
const version = require('./versioning')
const update = require('./updateMLModel')
var uuid = require('node-uuid')
const machinelearning = new AWS.MachineLearning()
const getMLModel = require('./getModelCompleted')
let oldModelId
const delateModel = require('./delateModel')
let create
/**
 * @function
 * @param params
 * @param upgrade
 */
let createMLModel = function (params) {
  return new Promise(function (resolve, reject) {
    // the model is created in AWS
    machinelearning.createMLModel(params, function (err, resCreateModel) {
      debug.ML.info('resCreateModel', resCreateModel)
      if (err) {
        debug.ML.error('error on create the ML ', err)
        // If a err or the model already exists then the modelId is modified
        if ((err && err.message.search('already exists') > -1)) {
          // the modelid is saved into de oldModelId
          oldModelId = params.MLModelIds
          // The modelid is updated
          debug.ML.info('creating with the new ID on create the ML ', err)
          params.MLModelId = version(params.MLModelId)
          setTimeout(function () {
            createMLModel(params).then(resolve).catch(reject)
          }, 30000)
          return
        }
        reject(err)
        return
      }
      resolve(resCreateModel)
      return
    })
  })
}

/**
 * @function
 * @param {Array} data
 * @param {Object} model
 * @prop {String} type of data {NUMERIC,CATEGORICAL,TEXT}
 * @param {Object} options
 * @prop {String} bucket: name of bucket where the data are stored
 * @prop {String} path: folder name that contain the data
 * @prop {String} DataSourceName
 * @prop {String} DataSourceId
 * @prop {String} type: type of regression to be done
 * {'MULTICLASS','BINARY','REGRESSION'}
 * @prop {Number} ScoreThreshold: the score thereshold to be used,
 * @prop {Boolean} upgrade: if the ML model is to be upgraded
 */
module.exports = function (data, model, options) {
  oldModelId = options.MLModelId
  let bucket = options.bucket
  let path = options.path || ''
  let DataSourceName = options.DataSourceName
  let DataSourceId = options.DataSourceId || uuid.v4()
  let MLModelId = options.MLModelId || DataSourceId
  let type = options.type
  let ScoreThreshold = options.ScoreThreshold ? options.ScoreThreshold : 0.5

  return new Promise(function (resolve, reject) {
    // the data are stored into s3
    mlDataSet({var: model}, data, bucket, path, DataSourceName, DataSourceId)
    .then(function (dataSource) {
        // The params to create the ML
      let params = {
        MLModelId: MLModelId,
        /* required */
        MLModelType: type,
        /* required */
        TrainingDataSourceId: dataSource.DataSourceId,
        /* required */
        MLModelName: 'ModelName_' + DataSourceName,
        Parameters: {
          'sgd.l1RegularizationAmount': '0.000001',
          'sgd.maxPasses': '10',
          'sgd.maxMLModelSizeInBytes': '33554432'
        }
        // Recipe: 'STRING_VALUE'
      }
      debug.ML.info('params to create the ML ', params)
        // The create function
      create = function (params) {
        return new Promise(function (resolve, reject) {
            // The create model function is invoked
          return createMLModel(params)
          .then(function (modelCrated) {
            // The model is getted
            debug.ML.info('modelCrated create the ML ', modelCrated)
            return getMLModel(modelCrated, ScoreThreshold)
          })
          .then(function (modelCompleted) {
            debug.ML.info('modelCompleted in create the ML ', modelCompleted)
            // When the model is obteined is checked if its status is deleted
            if (modelCompleted.Status === 'DELETED') {
              // The modelid is updated
              oldModelId = params.MLModelId
              // the modelid is changed
              params.MLModelId = version(params.MLModelId)
              // the ML is created again with the new modelid
              create(params)
                .then(resolve).catch(reject)
              return
            }
            options.type && (modelCompleted.type = options.type)
            // When the model is obtainded is updated into de DB
            return update(modelCompleted, oldModelId)
          })
          .then(function (modelSaved) {
            debug.ML.info('modelSaved in create the ML ', modelSaved)
            // if oldModelId is different to modelId created then
            // the old ML is removed
            if (oldModelId) {
              debug.ML.info('delateModel in create the ML ', oldModelId)
              return delateModel(oldModelId, dataSource.DataSourceId)
            }
            resolve(modelSaved)
          })
          .then(function (MLmodelDelated) {
            debug.ML.info('delated Model in create the ML ', MLmodelDelated)
            MLmodelDelated.Status = MLmodelDelated.Status || 'DELATED'
            return update(MLmodelDelated)
          })
          .catch(reject)
        })
      }
        // Invok  create function
      return create(params)
    })
    .then(resolve)
    .catch(reject)
  })
}
