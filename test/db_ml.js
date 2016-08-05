'use strict'

const mongoose = require('mongoose')
mongoose.Promise = global.Promise
/** Connect to mongo service */
let conn = mongoose.createConnection('mongodb://localhost:27017/test')
module.exports = conn
