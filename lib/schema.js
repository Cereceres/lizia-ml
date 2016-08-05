'use strict'
module.exports = function (prop) {
  let obj = {}
  obj.attributes = []
  for (var i in prop.var) {
    obj.attributes.push({
      'fieldName': i,
      'fieldType': prop.var[i]
    })
  }
  let variables = Object.keys(prop.var)
  obj.version = obj.version || '1.0'
  obj.targetFieldName = obj.target || variables[variables.length - 1]
  delete obj.target
  obj.dataFileContainsHeader = obj.containsHeader === undefined ? true : obj.containsHeader
  delete obj.containsHeader
  obj.dataFormat = obj.format || 'CSV'
  delete obj.format
  obj.exclude && (obj.excludedVariableNames = obj.exclude) && (delete obj.exclude)
  return JSON.stringify(obj)
}
