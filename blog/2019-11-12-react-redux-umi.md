---
title: Redux 学习 - umijs
date: 2019-11-12 21:56:00 GMT+0800
tags: [ react, redux, umi ]
---

终于到最后一篇文章了。这次开始学习 umi 架构的 redux 用法。

对于 umi （dva）体系，主要是集成了 react react-router react-redux redux-saga 等。比起 redux-saga，好处是做了高度封装，将原本的 reducer.js 和 sagas.js 统一到了一个 model.js 中。

<!-- truncate -->

创建 umi 架构项目，可以通过官方脚手架来完成。具体可参考 [官方文档](https://umijs.org/)。

创建项目后，配置文件等不进行调整，因为这次主要学习 model.js 的写法而已。

## 直接上代码

本次的示例代码 [见此](https://github.com/yukapril/learning/tree/master/react-umi)。

相对于之前的 redux-saga 项目，我们只需要调整两个文件。一个是页面组件，负责页面展示（按钮控制）的功能调用 dispatch 轻微调整；以及一个 model 文件，来代替原本的 reducer 和 sagas 文件。

#### models/global.js

我们先创建一个 model 文件，内容如下：

```js
const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout))

export default {
  namespace: 'global',
  state: {
    count: 10,
  },
  reducers: {
    increment(state, action) {
      return {
        ...state,
        count: state.count + action.payload,
      }
    },
    decrement(state, action) {
      return {
        ...state,
        count: state.count - action.payload,
      }
    },
  },
  effects: {
    * incrementAsync(action, {put}) {
      yield delay(1000)
      yield put({type: 'increment', payload: action.payload})
    },
    decrementAsync: [
      function* (action, {put}) {
        yield delay(1000)
        yield put({type: 'decrement', payload: action.payload})
      },
      {type: 'takeLatest'}
    ]
  },
}
```

由于在 umi 体系下没找到 delay 方法，所以我直接实现了一下。在 redux-saga 例子中，官方是提供 delay 方法的，所以直接引用的。

按照官方的格式，我们写一个对象（如上代码），定义了一些属性。其中定义了一个 `namespace: 'global'`，即这是一个命名空间为 `global` 的 model。后续我们在读取状态、dispatch 时候都要用到。

`state` 中存放初始化的状态。

在组件内 dispatch 后，会根据调用的类型直接路由到对应的 `reducers` 或者 `effects`。

`reducers` 和之前 redux 中用法一样，负责同步修改 `state` 内容。注意也是要返回一个新的 `state` 对象，并且函数必须是无副作用的。

`effects` 就是处理副作用的位置。完成副作用（比如异步获取数据）后，通过 `put`（相当于 dispatch）调用后续合适的 `reducers` 方法，完成 `state` 更新。这里要注意的是，通过 `put` 调用，直接写类型即可，不需要写命名空间。即
**不用写成 `put({ type: 'global/increment', payload: action.payload })`**。

这个例子 `effects` 写了两种用法。

一种是默认的 `takeEvery`，在 redux-saga 中我们接触过它。默认写法的语法是：

```text
*incrementAsync(action, effects){
}
```

另一种是 `takeLatest`，这个不是默认值，所以需要配置，语法是：

```js
decrementAsync: [
  function* (action, effects) {
  },
  {type: 'takeLatest'}
]
```

两种的区别在于，入口一个是 generator 函数（有星号），一个是普通数组，数组内第一个参数是 generator 函数，第二个是类型配置。

#### index.js

参考之前的 redux-saga 的组件，我们基本上调整内容很少。

```jsx
import React from "react"
import {connect} from "dva"

class Counter extends React.PureComponent {
  render() {
    const {globalState, dispatch} = this.props
    return (
      <div>
        <p>COUNT:{globalState.count}</p>
        <button onClick={() => dispatch({type: "global/increment", payload: 1})}>
          +1
        </button>
        <button onClick={() => dispatch({type: "global/decrement", payload: 1})}>
          -1
        </button>
        <button onClick={() => dispatch({type: "global/incrementAsync", payload: 2})}>
          +2 async takeEvery
        </button>
        <button onClick={() => dispatch({type: "global/decrementAsync", payload: 2})}>
          -2 async takeLatest
        </button>
      </div>
    )
  }
}

const mapStateToProps = state => ({globalState: state.global})
export default connect(mapStateToProps)(Counter)
```

主要的区别是，我们由于定义了一个全局 model，叫做 `global`（在 `models/global.js` 中定义），所以调用时候必须加上命名空间。即 `dispatch({ type: "global/increment", payload: 1 }`。

其他文件都不需要再修改了。
