Promise.reject('test')
.catch((err) => {
  console.log('err', err)
  return 'test2'
})
.catch((err) => {
  console.log('err2', err)
  return 'test3'
})
.then((value) => {
  console.log('value', value)
})
