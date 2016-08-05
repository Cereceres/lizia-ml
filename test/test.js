'use strict'
let assert = require('assert')
process.env.MLDB_PATH = '../test/db_ml'
describe('the test to machine learning', function () {
  it('the test to MLModelId', function () {
    let MLmodel = require('../lib/MLmodel')
    assert(MLmodel.create)
  })
})
