'use strict'
let db = require(process.env.MLDB_PATH)
let mongoose = require('mongoose')
let MLmodel = new mongoose.Schema({
  owner: String,
  MLModelId: String,
  TrainingDataSourceId: String,
  CreatedByIamUser: String,
  CreatedAt: Date,
  LastUpdatedAt: Date,
  Name: String,
  Status: String,
  SizeInBytes: Number,
  EndpointInfo: {
    PeakRequestsPerSecond: Number,
    CreatedAt: Date,
    EndpointUrl: String,
    EndpointStatus: String
  },
  TrainingParameters: Object,
  InputDataLocationS3: String,
  MLModelType: String,
  LogUri: String
}, {
  timestamps: true
})
MLmodel.pre('save', function (next) {
  this.TrainingParameters = this.TrainingParameters || {}
  this.TrainingParameters.l1RegularizationAmount = this.TrainingParameters['sgd.l1RegularizationAmount']
  delete this.TrainingParameters['sgd.l1RegularizationAmount']
  this.TrainingParameters.l2RegularizationAmount = this.TrainingParameters['sgd.l2RegularizationAmount']
  delete this.TrainingParameters['sgd.l2RegularizationAmount']
  this.TrainingParameters.maxMLModelSizeInBytes = this.TrainingParameters['sgd.maxMLModelSizeInBytes']
  delete this.TrainingParameters['sgd.maxMLModelSizeInBytes']
  this.TrainingParameters.maxPasses =
      this.TrainingParameters['sgd.maxPasses']
  delete this.TrainingParameters['sgd.maxPasses']
  this.TrainingParameters.shuffleType =
      this.TrainingParameters['sgd.shuffleType']
  delete this.TrainingParameters['sgd.shuffleType']
  next()
})

MLmodel.pre('findOneAndUpdate', function (next) {
  this._update.TrainingParameters = this._update.TrainingParameters || {}
  this._update.TrainingParameters.l1RegularizationAmount = this._update.TrainingParameters['sgd.l1RegularizationAmount']
  delete this._update.TrainingParameters['sgd.l1RegularizationAmount']
  this._update.TrainingParameters.l2RegularizationAmount = this._update.TrainingParameters['sgd.l2RegularizationAmount']
  delete this._update.TrainingParameters['sgd.l2RegularizationAmount']
  this._update.TrainingParameters.maxMLModelSizeInBytes = this._update.TrainingParameters['sgd.maxMLModelSizeInBytes']
  delete this._update.TrainingParameters['sgd.maxMLModelSizeInBytes']
  this._update.TrainingParameters.maxPasses =
    this._update.TrainingParameters['sgd.maxPasses']
  delete this._update.TrainingParameters['sgd.maxPasses']
  this._update.TrainingParameters.shuffleType =
    this._update.TrainingParameters['sgd.shuffleType']
  delete this._update.TrainingParameters['sgd.shuffleType']
  next()
})
// mongoose.connect('mongodb://127.0.0.1/psp')
module.exports = db.model('MLmodel', MLmodel)
