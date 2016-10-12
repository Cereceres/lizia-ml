
'use strict'
process.env.MLDB_PATH = './test/db_ml'
const AWS = require('aws-sdk')
const createModel = require('../lib/createModel')
const delateModel = require('../lib/delateModel')
const assert = require('assert')
AWS.config.region = 'us-east-1'
var uuid = require('node-uuid')
let mlId = uuid.v4()
let self
let predict = require('../lib/makePrediction')
let data = []
for (var i = 0; i < 100000; i++) {
  data.push({
    siftScienceScore: Math.random(),
    hour: Math.floor(24 * Math.random()) + 1,
    day: Math.floor(7 * Math.random()) + 1,
    mount: Math.floor(10000 * Math.random()),
    items: Math.floor(10 * Math.random()) + 1,
    emailAge: Math.floor(24 * Math.random()) + 1,
    trust: Math.random(),
    EAScore: Math.floor(1000 * Math.random()) + 1,
    is: Math.floor(5 * Math.random())
  })
}
before(function (done) {
  let self = this
  createModel(data, {
    siftScienceScore: 'NUMERIC',
    hour: 'NUMERIC',
    day: 'CATEGORICAL',
    mount: 'NUMERIC',
    items: 'NUMERIC',
    emailAge: 'NUMERIC',
    trust: 'NUMERIC',
    EAScore: 'NUMERIC',
    is: 'CATEGORICAL'
  }, {
    bucket: 'ml-aws',
    path: 'ml-files',
    DataSourceName: 'PSP',
    DataSourceId: mlId,
    modelType: 'MULTICLASS',
    ScoreThreshold: 0.6,
    upgrade: true
  }).then(function (res) {
    self.modelSaved = res
    done()
  })
  .catch(done)
})
describe('Make a prediction', function () {
  this.timeout(100000000)
  it('Should do a prediction', function (done) {
    self = this
    predict({ /* required */
      siftScienceScore: Math.random().toString(),
      hour: (Math.floor(24 * Math.random()) + 1).toString(),
      day: (Math.floor(7 * Math.random()) + 1).toString(),
      mount: Math.floor(10000 * Math.random()).toString(),
      items: (Math.floor(10 * Math.random()) + 1).toString(),
      emailAge: (Math.floor(24 * Math.random()) + 1).toString(),
      trust: Math.random().toString(),
      EAScore: (Math.floor(1000 * Math.random()) + 1).toString()
        /* anotherKey: ... */
    }, this.modelSaved)
    .then(function (res) {
      assert(res.Prediction)
      assert(res.Prediction.predictedScores)
      done()
    })
    .catch(function (error) {
      done(error)
    })
  })
  it('Create data without data', function * () {
    yield createModel({
      siftScienceScore: 'NUMERIC',
      hour: 'NUMERIC',
      day: 'CATEGORICAL',
      mount: 'NUMERIC',
      items: 'NUMERIC',
      emailAge: 'NUMERIC',
      trust: 'NUMERIC',
      EAScore: 'NUMERIC',
      is: 'CATEGORICAL'
    }, {
      bucket: 'ml-aws',
      path: 'ml-files',
      DataSourceName: 'PSP',
      DataSourceId: mlId,
      modelType: 'MULTICLASS',
      ScoreThreshold: 0.6,
      upgrade: true
    })
    .then(function (res) {
      assert(res)
    })
  })
})
after(function (done) {
  delateModel(self.modelSaved.MLModelId)
  .then(() => { done() })
  .catch(done)
})
