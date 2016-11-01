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
const MLmodel = require('./MLmodel')
/**
 * Class to exports the method to use aws ML
 *
 */
module.exports = class {
  constructor (options) {
    this.options = options
    this.MLmodel = MLmodel
    this.createDataSourceFromS3 = createDataSourceFromS3.bind(this)
    this.delateEndPoint = delateEndPoint.bind(this)
    this.getDataSource = getDataSource.bind(this)
    this.getDataSourceComplete = getDataSourceComplete.bind(this)
    this.getEndPoint = getEndPoint.bind(this)
    this.getModelCompleted = getModelCompleted.bind(this)
    this.mlDataset = mlDataset.bind(this)
    this.s3 = s3.bind(this)
    this.schema = schema.bind(this)
    this.updateMLModel = updateMLModel.bind(this)
    this.versioning = versioning.bind(this)
  }
  create (data, model, options) {
    options = options || {}
    let _options = Object.assign(Object.assign({}, this.options), options)
    return create(data, model, _options)
    .then(value => {
      this.model = value
    })
  }
  prediction (datum, query) {
    query.MLModelId = query.MLModelId || this.model
    return predict(datum, query)
  }

  delete (modelId, dataSourceId) {
    modelId = modelId || this.model.modelId
    dataSourceId = dataSourceId || modelId
    return remove(modelId, dataSourceId)
  }
}
