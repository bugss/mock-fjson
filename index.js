let co = require('co')

const keyword = '$value'
const hasFunctionKey = '__hasFunction'
const $function = '__$'

function typeConvert (value) {
  if (value instanceof Date) {
    return 'new Date(' + value.getTime() + ')'
  }
  return JSON.stringify(value, function (key, value) {
    let keyValue = this[key]
    if (keyValue instanceof Date) {
      return 'new Date(' + keyValue.getTime() + ')'
    } else {
      return value
    }
  })
}

function hasFunction (obj) {
  if (!obj) {
    return false
  }
  return obj.hasOwnProperty(hasFunctionKey)
}

function convertToFunctionBody (value) {
  let body,
    error = false
  if (value == undefined) {
    body = `${value}`
  } else if (value instanceof Error) {
    body = `new Error('${value.message}')`
    error = true
  } else {
    body = ` ${typeConvert(value)}`
  }
  return {
    body,
    error
  }
}

function getFunctionFieldKey (fieldName) {
  return $function + fieldName
}

function isFunctionFieldkey (fieldName) {
  return fieldName.startsWith($function)
}

function getOriginFunctionFieldKey (functionFieldKey) {
  return functionFieldKey.substr($function.length)
}

const parsers = {
  '*': (target, key, config, returnValue) => {
    let convert = convertToFunctionBody(returnValue)
    let body = ['function*(){ return ', convert.body, '}'].join('')
    target[getFunctionFieldKey(key)] = body
  },
  promise: (target, key, config, returnValue) => {
    let body = ['function(){return']
    let convert = convertToFunctionBody(returnValue)
    if (convert.error) {
      body.push(' Promise.reject(', convert.body, ')')
    } else {
      body.push(' Promise.resolve(', convert.body, ')')
    }
    body.push('}')
    target[getFunctionFieldKey(key)] = body.join('')
  },
  callback: (target, key, config, returnValue) => {
    let body = ['function(cb){return ']
    body.push('typeof cb==="function"&&')
    let convert = convertToFunctionBody(returnValue)
    if (convert.error) {
      body.push(' cb(', convert.body, ')')
    } else {
      body.push(' cb(null,', convert.body, ')')
    }
    body.push('}')
    target[getFunctionFieldKey(key)] = body.join('')
  },
  default: (target, key, config, returnValue) => {
    let convert = convertToFunctionBody(returnValue)
    let body = ['function(){ return ', convert.body, '}'].join('')
    target[getFunctionFieldKey(key)] = body
  }
}

function getFuntionConfig (obj) {
  let rs = []
  JSON.stringify(obj, function (key, value) {
    if (value && value.hasOwnProperty(keyword)) {
      rs.push({
        target: this,
        key,
        config: value
      })
      return
    }
    return value
  })
  return rs
}

function exec (rs) {
  let ps = []
  rs.forEach((functionItem) => {
    let {target, key} = functionItem
    let config = functionItem.config
    let value = config[keyword]
    if (typeof value === 'function') {
      ps.push(co(value).then((r) => ({
        target,
        key,
        config,
        returnValue: r
      })))
    } else {
      ps.push(Promise.resolve({
        target,
        key,
        config,
        returnValue: value
      }))
    }
  })
  return Promise.all(ps).then((results) => {
    results.forEach((result) => {
      let {target, key, config, returnValue} = result
      let type = config.type || 'default'
      type = type === 'cb' && 'callback' || type
      // not found as default,just a normal function return some value
      let parseFn = parsers[type] || parsers.default
      parseFn(target, key, config, returnValue)
    })
  })
}

function parse (jsonStr) {
  return JSON.parse(jsonStr, function (key, value) {
    if (isFunctionFieldkey(key)) {
      let originKey = getOriginFunctionFieldKey(key)
      this[originKey] = eval('(' + value + ')')
    } else {
      return value
    }
  })
}

module.exports = {
  hasFunction,
  stringify: co.wrap(function * (obj) {
    let rs = getFuntionConfig(obj)
    let json
    if (rs.length === 0) {
      delete obj[hasFunctionKey]
    } else {
      obj[hasFunctionKey] = true
      yield exec(rs)
    }
    json = JSON.stringify(obj)
    // clean up
    for (let item of rs) {
      delete item.target[getFunctionFieldKey(item.key)]
    }
    return json
  }),
  parse
}
