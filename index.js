'use strict'
const create = require('./lib/createModel')
const predict = require('./lib/makePrediction')
const remove = require('./lib/delateModel')
const createDataSourceFromS3 = require('./lib/createDataSourceFromS3')
const delateEndPoint = require('./lib/delateEndPoint')
const getDataSource = require('./lib/getDataSource')
const getDataSourceComplete = require('./lib/getDataSourceComplete')
const getEndPoint = require('./lib/getEndPoint')
const getModelCompleted = require('./lib/getModelCompleted')
const mlDataset = require('./lib/ml-dataset')
const s3 = require('./lib/s3')
const schema = require('./lib/schema')
const updateMLModel = require('./lib/updateMLModel')
const versioning = require('./lib/versioning')

module.exports = class {
  constructor (options) {
    this.options = options
    this.createDataSourceFromS3 = createDataSourceFromS3
    this.delateEndPoint = delateEndPoint
    this.getDataSource = getDataSource
    this.getDataSourceComplete = getDataSourceComplete
    this.getEndPoint = getEndPoint
    this.getModelCompleted = getModelCompleted
    this.mlDataset = mlDataset
    this.s3 = s3
    this.schema = schema
    this.updateMLModel = updateMLModel
    this.versioning = versioning
  }
  create (data, model, options) {
    options = options || {}
    return create(data, Object.assign(options, this.options))
    .then(value => {
      this.model = value
    })
  }
  prediction (datum, model) {
    model = model || this.model
    return predict(datum, model)
  }

  delate (modelId, dataSourceId) {
    modelId = modelId || this.model.modelId
    dataSourceId = dataSourceId || modelId
    return remove(modelId, dataSourceId)
  }
}
