# machinelearning
[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com)

[![Build Status](https://travis-ci.com/4yopping/machinelearning.svg?token=2Cbz912YVHmx3VxyGReu&branch=master)](https://travis-ci.com/4yopping/machinelearning)
## Install

Install dependencies:

```bash
$ npm install --save git+ssh://git@github.com:4yopping/machinelearning.git
```
## Class machinelearning
Instance of machinelearning class have the method predict, create and delate, every method return a primise that is resolved when the task is made for aws.
### machinelearning(options)->instance
the options object is a object that is used to every method, this object can be rewritten in every call.
```js
options = {
  bucket: 'ml-aws', // bucket that contain the data
  path: 'ml-files', // path folder that contain the data
  DataSourceName: 'PSP', // data source name
  DataSourceId: mlId, // data source id
  type: 'MULTICLASS', // type of regression
  ScoreThreshold: 0.6,
  upgrade: true // if the model have to be upgraded
}
```
## Class machinelearning.create(data,model[,options])->Promise.resolve(res)

Instance method that create a model, wait until the model is created. The data has to be an array with the data to be analysed on format given in model object. The options is the same like class instancing and is used to rewrite the options property given in the class instancing.
The res object that is promise returned is resolved has the property MLModelId with value of MLModelId created.
```js
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
    Is: Math.floor(5 * Math.random())
  })
}
  createModel(data,
// the model object
    {
    siftScienceScore: 'NUMERIC',
    hour: 'NUMERIC',
    day: 'CATEGORICAL',
    mount: 'NUMERIC',
    items: 'NUMERIC',
    emailAge: 'NUMERIC',
    trust: 'NUMERIC',
    EAScore: 'NUMERIC',
    Is: 'CATEGORICAL'
  },
  //options object
  {
    bucket: 'ml-aws',
    path: 'ml-files',
    DataSourceId: mlId,
    ScoreThreshold: 0.6,
  })
  .then(value => {
    value // {MLModelId:'modelId of model created'}
  });
```

## Class machinelearning.delete(MLModelId[,dataSourceId])->Promise.resolve(res)
The MLModelId is a string that model to be removed. Return a promise with the dataSourceId
removed too.

## Class machinelearning.predict(datum,modelToBeUsed)->Promise.resolve(res)

Instance method that make a prediction with datum using the modelToBeUsed, this object have to be the model saved into DB.If the modelToBeUsed is not passed look for a model with more recently date and status be COMPLETED. The res object has the property Prediction that is a object.
```js
predict({ /* required */
  hour: '23',
  day: 'Lunes',
  mount: '1234',
  items: '1',
  emailAge: '2',
  EAScore: '500'
    /* anotherKey: ... */
}, this.modelSaved)
.then(function (res) {
  res //=>
// { Prediction:
//    { predictedLabel: '0',
//      predictedScores:
//       { '0': 0.20242302119731903,
//         '1': 0.20069073140621185,
//         '2': 0.1976957768201828,
//         '3': 0.19815300405025482,
//         '4': 0.2010374665260315 },
//      details: { Algorithm: 'SGD', PredictiveModelType: 'MULTICLASS' }
//    }
//   }
})
```
