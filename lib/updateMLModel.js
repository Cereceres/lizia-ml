'use strict'
const MLmodel = require('../MLmodel')
const debug = require('./debug')
module.exports = function (model, oldModelId) {
  return new Promise(function (resolve, reject) {
    // the model is created, if exist then is uploaded
    MLmodel.findOneAndUpdate({
      MLModelId: oldModelId || model.MLModelId
    }, model, {
      new: true,
      upsert: true
    }, function (e, docCreated) {
      if (e) {
        debug.ML.error('error on update the MLmodel', e)
        reject(e)
        return
      }
      debug.ML.info('docCreated in updateModel', docCreated)
      resolve(docCreated)
    })
  })
}
