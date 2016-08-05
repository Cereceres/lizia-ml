
let a = new Promise(function (resolve, reject) {
  resolve(Promise.resolve(4))
})
a.then(value => {
  console.log('value', value)
})
