# mock-fjson

[![Build Status](https://travis-ci.org/bugss/mock-fjson.svg?branch=master)](https://travis-ci.org/bugss/mock-fjson)
[![codecov](https://codecov.io/gh/bugss/mock-fjson/branch/master/graph/badge.svg)](https://codecov.io/gh/bugss/mock-fjson)

### 安装

npm install mock-fjson --save


### 意义
定义一些简单的规则,能够生成带方法的json字符串,这个格式可以在网络上传递,并且可以在接收端解析成
javascript 对象.

### 特点
- 生成的逻辑可以全异步
- 生成器方法
- promise方法
- callback方法
- 模拟出来的方法会尽量跟真实的方法一模一样,尽量保证remote端还原出来的方法行为一致



### 用法

```js
const fjson=require('mock-fjson')
var testObject={
  p1:{
    // 生成生成器方法
    type:"*",
    $value:{}
  },
  p2:{
    type:"promise",
    $value:function*(){
      // 自动处理异步
      // yield 
      // yield
    }
  },
  p3:{
    type:"callback",
    // 生成  function(cb){ cb(null,{name:"111",value:"222"})}
    $value:{
      name:"111",
      value:"222"
    }
  },
  p4:{
    // 生成  function(cb){ cb(new Error('error'))}
    type:"callback",
    $value:new Error('error')
  },
  p5:{
    // 默认会生成一个普通的方法
    // function(){return {name:"222"}}
    $value:{ name:"222"}
  }
}


fjson.stringify(testObject).then(function(jsonStr) {
 var comeback= fjson.parse(jsonStr)
 console.info(comeback)
})


```

```js



```



