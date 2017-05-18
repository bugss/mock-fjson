const fjson = require('../')
const assert = require('assert')
describe('test/index.test.js', function () {
  
  it('stringify with an obj not with function ', (done) => {
    var testObj = {
      name: {},
      value: {
        same: '111',
        d: new Date(),
        cc: {
          d1: new Date()
        }
      }
    }
    var oldString = JSON.stringify(testObj)
    fjson.stringify(testObj).then(function () {
      assert(fjson.hasFunction(testObj) === false)
      assert(fjson.hasFunction(undefined) === false)
      var newString = JSON.stringify(testObj)
      assert(oldString === newString)
      assert(fjson.parse(newString).value.same === '111')
      done()
    })
  })
  
  it('stringify with GeneratorFunction', (done) => {
    var testObject = {
      name: 'test',
      fns: {
        test1: {
          f1: {
            // 生成器值为对象
            type: '*',
            $value: {
              id: 'f1'
            }
          },
          f2: {
            // 生成器值为对象
            type: '*',
            $value: new Error('error')
          },
          f3: {
            // 生成器值为对象
            type: '*',
            $value: function () {
              
            }
          },
          f4: {
            // 生成器值为对象
            type: '*',
            $value: function () {
              return {
                name: 'bbb'
              }
            }
          },
          f5: {
            // 生成器值为对象
            type: '*',
            $value: function () {
              return new Date()
            }
          },
          f6: {
            // 生成器值为对象
            type: '*',
            $value: function () {
              return {
                d1: new Date(),
                d2: {
                  d3: new Date()
                }
              }
            }
          }
        }
      }
    }
    fjson.stringify(testObject).then(function (jsonStr) {
      assert(fjson.hasFunction(testObject) === true)
      assert(jsonStr.includes('__$f1'))
      assert(jsonStr.includes('__$f2'))
      assert(jsonStr.includes('__$f3'))
      assert(jsonStr.includes('__$f4'))
      assert(jsonStr.includes('__$f5'))
      assert(jsonStr.includes('__$f6'))
      let json = fjson.parse(jsonStr)
      assert(json.fns.test1.f1().next().value.id === 'f1')
      assert(json.fns.test1.f2().next().value.message === 'error')
      assert(json.fns.test1.f4().next().value.name == 'bbb')
      assert(json.fns.test1.f5().next().value instanceof Date)
      // the date value in the obj will lose it type
      // assert(json.fns.test1.f6().next().value.d1 instanceof Date)
      done()
    })
  })
  
  it('stringify with normal function', (done) => {
    var testObject = {
      name: 'test',
      fns: {
        test1: {
          f1: {
            // 生成器值为对象
            type: '',
            $value: {
              id: 'f1'
            }
          },
          f2: {
            // 生成器值为对象
            type: '',
            $value: new Error('error')
          },
          f3: {
            // 生成器值为对象
            type: '',
            $value: function () {
              
            }
          },
          f4: {
            // 生成器值为对象
            type: '',
            $value: function () {
              return {
                name: 'bbb'
              }
            }
          },
          f5: {
            // 生成器值为对象
            type: '',
            $value: function () {
              return new Date()
            }
          },
          f6: {
            // 生成器值为对象
            type: '',
            $value: function () {
              return {
                d1: new Date(),
                d2: {
                  d3: new Date()
                }
              }
            }
          },
          f7: {
            // 生成器值为对象 不存在的type默认为普通方法
            type: 'aldlfldafldf',
            $value: function () {
              return {
                otherType: 'otherType'
              }
            }
          }
        }
      }
    }
    fjson.stringify(testObject).then(function (jsonStr) {
      assert(fjson.hasFunction(testObject) === true)
      assert(jsonStr.includes('__$f1'))
      assert(jsonStr.includes('__$f2'))
      assert(jsonStr.includes('__$f3'))
      assert(jsonStr.includes('__$f4'))
      assert(jsonStr.includes('__$f5'))
      assert(jsonStr.includes('__$f6'))
      assert(jsonStr.includes('__$f7'))
      let json = fjson.parse(jsonStr)
      assert(json.fns.test1.f1().id === 'f1')
      assert(json.fns.test1.f2().message === 'error')
      assert(json.fns.test1.f4().name == 'bbb')
      assert(json.fns.test1.f5() instanceof Date)
      assert(json.fns.test1.f7().otherType === 'otherType')
      // the date value in the obj will lose it type
      // assert(json.fns.test1.f6().next().value.d1 instanceof Date)
      done()
    })
  })
  
  it('stringify with callback function', (done) => {
    var testObject = {
      name: 'test',
      fns: {
        test1: {
          f1: {
            // 生成器值为对象
            type: 'callback',
            $value: {
              id: 'f1'
            }
          },
          f2: {
            // 生成器值为对象
            type: 'cb',
            $value: new Error('error')
          },
          f3: {
            // 生成器值为对象
            type: 'callback',
            $value: function () {
              
            }
          },
          f4: {
            // 生成器值为对象
            type: 'callback',
            $value: function () {
              return {
                name: 'bbb'
              }
            }
          },
          f5: {
            // 生成器值为对象
            type: 'callback',
            $value: function () {
              return new Date()
            }
          },
          f6: {
            // 生成器值为对象
            type: 'callback',
            $value: function () {
              return {
                d1: new Date(),
                d2: {
                  d3: new Date()
                }
              }
            }
          }
        }
      }
    }
    fjson.stringify(testObject).then(function (jsonStr) {
      assert(fjson.hasFunction(testObject) === true)
      assert(jsonStr.includes('__$f1'))
      assert(jsonStr.includes('__$f2'))
      assert(jsonStr.includes('__$f3'))
      assert(jsonStr.includes('__$f4'))
      assert(jsonStr.includes('__$f5'))
      assert(jsonStr.includes('__$f6'))
      let json = fjson.parse(jsonStr)
      json.fns.test1.f1(function (err, result) {
        assert(result.id === 'f1')
      })
      
      json.fns.test1.f2(function (err, result) {
        assert(err.message === 'error')
      })
      
      json.fns.test1.f3(function (err, result) {
        assert(result === undefined)
      })
      
      json.fns.test1.f4(function (err, result) {
        assert(result.name === 'bbb')
      })
      
      json.fns.test1.f5(function (err, result) {
        assert(result instanceof Date)
      })
      done()
    })
  })
  
  it('stringify with  promise', (done) => {
    var testObject = {
      name: 'test',
      fns: {
        test1: {
          f1: {
            // 生成器值为对象
            type: 'promise',
            $value: {
              id: 'f1'
            }
          },
          f2: {
            // 生成器值为对象
            type: 'promise',
            $value: new Error('error')
          },
          f3: {
            // 生成器值为对象
            type: 'promise',
            $value: function () {
              
            }
          },
          f4: {
            // 生成器值为对象
            type: 'promise',
            $value: function () {
              return {
                name: 'bbb'
              }
            }
          },
          f5: {
            // 生成器值为对象
            type: 'promise',
            $value: function () {
              return new Date()
            }
          },
          f6: {
            // 生成器值为对象
            type: 'promise',
            $value: function () {
              return {
                d1: new Date(),
                d2: {
                  d3: new Date()
                }
              }
            }
          }
        }
      }
    }
    fjson.stringify(testObject).then(function (jsonStr) {
      assert(fjson.hasFunction(testObject) === true)
      assert(jsonStr.includes('__$f1'))
      assert(jsonStr.includes('__$f2'))
      assert(jsonStr.includes('__$f3'))
      assert(jsonStr.includes('__$f4'))
      assert(jsonStr.includes('__$f5'))
      assert(jsonStr.includes('__$f6'))
      let json = fjson.parse(jsonStr)
      json.fns.test1.f1().then(function (result) {
        assert(result.id === 'f1')
      })
      
      json.fns.test1.f2().catch(function (err) {
        assert(err.message === 'error')
      })
      
      json.fns.test1.f3().then(function (result) {
        assert(result === undefined)
      })
      
      json.fns.test1.f4().then(function (result) {
        assert(result.name === 'bbb')
      })
      
      json.fns.test1.f5().then(function (result) {
        assert(result instanceof Date)
      })
      done()
    })
  })
  
  it('should throw error when a method inner throw error', (done) => {
    var testObject = {
      name: 'test',
      fns: {
        test1: {
          f1: {
            // 生成器值为对象
            type: 'promise',
            $value: {
              id: 'f1'
            }
          },
          f2: {
            // 生成器值为对象
            type: 'promise',
            $value: new Error('error')
          },
          f3: {
            // 生成器值为对象
            type: 'promise',
            $value: function () {
              throw  new Error('error throw')
            }
          },
          f4: {
            // 生成器值为对象
            type: 'promise',
            $value: function () {
              throw  new Error('error throw')
            }
          },
          f5: {
            // 生成器值为对象
            type: 'promise',
            $value: function () {
              return new Date()
            }
          },
          f6: {
            // 生成器值为对象
            type: 'promise',
            $value: function () {
              return {
                d1: new Date(),
                d2: {
                  d3: new Date()
                }
              }
            }
          }
        }
      }
    }
    fjson.stringify(testObject).then(function (jsonStr) {
    }).catch(function (err) {
      assert(err.message === 'error throw')
      done()
    })
  })
  
})

