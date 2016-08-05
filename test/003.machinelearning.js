
'use strict'
process.env.MLDB_PATH = '../test/db_ml'
const AWS = require('aws-sdk')
AWS.config.region = 'us-east-1'
const createModel = require('../lib/createModel')
const delateModel = require('../lib/delateModel')
var uuid = require('node-uuid')
let mlId = uuid.v4()
let self
const assert = require('assert')
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
    Fraud: Math.floor(5 * Math.random())
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
    Fraud: 'CATEGORICAL'
  }, {
    bucket: 'ml-aws',
    path: 'ml-files',
    DataSourceName: 'PSP',
    DataSourceId: mlId,
    type: 'MULTICLASS',
    ScoreThreshold: 0.6,
    upgrade: true
  }).then(function (res) {
    self.modelSaved = res
    done()
  })
  .catch(function (error) {
    done(error)
  })
})
describe('POST /payments', function () {
  this.timeout(100000000)
  it('Should do a prediction', function (done) {
    self = this
    predict({ /* required */
      hour: '23',
      day: 'Lunes',
      mount: '1234',
      items: '1',
      emailAge: '2',
      EAScore: '500'
        /* anotherKey: ... */
    }, {
      MLModelId: this.modelSaved.MLModelId
    })
    .then(function (res) {
      assert(res.Prediction)
      assert(res.Prediction.predictedScores)
      done()
    })
    .catch(function (error) {
      done(error)
    })
  })
})
after(function (done) {
  delateModel(self.modelSaved.MLModelId)
  .then(() => { done() })
  .catch(done)
})
