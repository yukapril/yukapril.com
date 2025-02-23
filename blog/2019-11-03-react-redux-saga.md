---
title: Redux 学习 - react-saga
date: 2019-11-03 14:18:00 GMT+0800
tags: [ react, redux, saga ]
---

上两篇文章主要说了 redux 的用法。redux 中 reducer 只能处理同步的状态更新，那如果是有异步或者副作用呢，这时候我们就必须对 redux 使用中间件处理了。

<!-- truncate -->

redux 本身支持中间件，异步的方案都是通过中间件进行控制的。

在标准 redux 中，要想修改全局状态，组件需要 dispatch 一个 action 到 reducer 上，reducer 同步修改 state。

reducer 是负责同步修改 state，这个逻辑不会改变。

一般的思路是，监听（拦截）dispatch 的 action，如果发现是一个异步 action，就不执行 reducer（或者走到了 reducer 的 default 默认返回逻辑里）。此时执行异步逻辑，完毕后，再 dispatch 一个同步的 action。

处理这类异步或者副作用问题，常见的解决方案有 `redux-thunk` `redux-promise` `redux-saga` 等，其中 `redux-saga` 我认为算是比较优雅的实现，唯独就是初次理解上有些难度。

我们继续用最早的 redux 的例子，改装一下，实现 saga 的异步处理。

完整代码可以参考 [github](https://github.com/yukapril/learning/tree/master/react-redux-saga)

#### index.js

```jsx
import React from "react"
import ReactDOM from "react-dom"
import {Provider} from "react-redux"
import {createStore, applyMiddleware} from "redux"
import createSagaMiddleware from "redux-saga"
import saga from "./sagas"
import reducer from "./reducer.js"
import Counter from "./Counter"

const sagaMiddleware = createSagaMiddleware()
const store = createStore(reducer, applyMiddleware(sagaMiddleware))
sagaMiddleware.run(saga)

class App extends React.PureComponent {
  render() {
    return (
      <Provider store={store}>
        <Counter/>
      </Provider>
    )
  }
}

const rootElement = document.getElementById("root")
ReactDOM.render(<App/>, rootElement)
```

修改 store 的创建方式，增加 saga 的中间件。

这里要注意写法：

```js
// 这样写是不可以的
const sagaMiddleware = createSagaMiddleware(saga)

// 必须写成 run 的形式
const sagaMiddleware = createSagaMiddleware()
const store = createStore(reducer, applyMiddleware(sagaMiddleware))
sagaMiddleware.run(saga) // run 必须写到 createStore 之后，否则报错
```

这样调整后，我们就可以直接在组件内 dispatch 异步 action 了，并在 `sagas.js` 中进行监听。

#### Counter.js

```jsx
import React from "react"
import {connect} from "react-redux"

class Counter extends React.PureComponent {
  render() {
    const {globalState, dispatch} = this.props
    return (
      <div>
        <p>COUNT:{globalState.count}</p>
        <button onClick={() => dispatch({type: "INCREMENT", payload: 1})}>
          +1
        </button>
        <button onClick={() => dispatch({type: "DECREMENT", payload: 1})}>
          -1
        </button>
        <button onClick={() => dispatch({type: "INCREMENT_ASYNC", payload: 2})}>
          +2 async takeEvery
        </button>
        <button onClick={() => dispatch({type: "DECREMENT_ASYNC", payload: 2})}>
          -2 async takeLatest
        </button>
      </div>
    )
  }
}

const mapStateToProps = state => ({globalState: state})
export default connect(mapStateToProps)(Counter)
```

组件内增加两个异步的调用按钮。调用类型分别是 `INCREMENT_ASYNC` `DECREMENT_ASYNC`。

其他不要任何修改。

#### sagas.js

```js
import {put, all, takeEvery, takeLatest, delay} from "redux-saga/effects"

function* incrementAsync(action) {
  yield delay(1000)
  yield put({type: "INCREMENT", payload: action.payload})
}

function* decrementAsync(action) {
  yield delay(1000)
  yield put({type: "DECREMENT", payload: action.payload})
}

function* watchIncrementAsync() {
  yield takeEvery("INCREMENT_ASYNC", incrementAsync)
}

function* watchDecrementAsync() {
  yield takeLatest("DECREMENT_ASYNC", decrementAsync)
}

function* saga() {
  yield all([watchIncrementAsync(), watchDecrementAsync()])
}

export default saga
```

`sagas.js` 是全新添加的文件。

这里添加了两个监听函数 `watchIncrementAsync` `watchDecrementAsync`，就是监听 dispatch 的内容，一旦命中监听函数，那么就执行对应的异步操作，分别是 `incrementAsync` `decrementAsync`。

异步操作函数 `incrementAsync` `decrementAsync`，为了模拟，使用的 delay 函数，这里可以换成 fetch 等函数。等异步操作完毕后，重新触发同步 action 即可。

最后导出我们的监听函数，正常的项目不可能只有一个异步监听函数，所以我们需要合并后导出。

有可能这种写法更常见：

```js
yield all([call(watchIncrementAsync), call(watchDecrementAsync)])
```

用 call 辅助函数代替直接使用括号运行，此外我还不知道用 call 函数有什么特殊用途或区别。

这个文件导入了很多辅助函数，下面列出一些说明。具体内容参考[官方文档](https://redux-saga.js.org/docs/api/)：

| 辅助函数       | 用途                              |
|------------|---------------------------------|
| all        | 合并多个异步监听函数使用                    |
| takeEvery  | 监听函数使用，起到如何监听异步事件。表示每次都监听到，依次执行 |
| takeLatest | 监听函数使用，起到如何监听异步事件。表示仅执行最后一次操作   |
| put        | 相当于 dispatch，触发 action 使用       |
| delay      | 延时使用，真实项目一般项目用不到                |

> 最后，你感兴趣的话，可以在 `reducer.js` 文件中加入日志，就会发现 dispatch 异步 action 也会调用 reducer，只不过没有命中任何条件。在执行异步任务之后，还会 dispatch 一个同步 action，此时 reducer 再次执行一次。
