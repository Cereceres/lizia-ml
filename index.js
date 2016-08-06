'use strict'
const create = require('./lib/createMLModel')
const predict = require('./lib/makePrediction')
const remove = require('./lib/delateModel')
module.exports = class {
  constructor (options) {
    this.options = options
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
