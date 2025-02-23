---
title: Redux 学习 - reducer 合并
date: 2019-11-02 23:09:00 GMT+0800
tags: [ react, redux ]
---

上一篇文章主要说了 redux 的简单用法，为了和后续 umi 体系进行对齐，增加一篇 redux 有多个 reducer，并且合并的情况用法。

<!-- truncate -->

最终代码可以看这里 [github](https://github.com/yukapril/learning/tree/master/react-redux-lite-combine)

很多项目都是按模块化区分的，对于不同的模块理应 reducer 也是分开的。最终导出的 reducer 在进行合并。

首先参考上次的代码，来进行修改调整。

#### index.js

文件完全相同，不需要修改。

#### reducer.js

```jsx
import {combineReducers} from "redux";

const globalReducer = (state = {count: 10}, action) => {
  switch (action.type) {
    case "INCREMENT":
      return {...state, count: state.count + action.payload}
    case "DECREMENT":
      return {...state, count: state.count - action.payload}
    default:
      return state
  }
}

const otherReducer = (state = {count: 20}, action) => {
  switch (action.type) {
    case "CLEAR":
      return {...state, count: 0}
    case "TOMAX":
      return {...state, count: 100}
    default:
      return state
  }
}


export default combineReducers({
  globalReducer,
  otherReducer
})
```

我们增加一个 `otherReducer`，最后使用 `combineReducers` 进行合并。为了省事，我把两个 reducer 写到一个文件里了，实际项目更可能是分布在两个文件中。

`combineReducers` 里的对象默认是如下形式：

```json
{
  globalReducer: globalReducer,
  otherReducer: otherReducer
}
```

当然你可以改名为：

```json
{
  aaa: globalReducer,
  bbb: otherReducer
}
```

后续获取全局 `state` 时候就要换成自定义的字段名。

#### Counter.js

```jsx
import React from "react"
import {connect} from "react-redux"

class Counter extends React.PureComponent {
  render() {

    const {globalState, otherState, dispatch} = this.props
    return (
      <div>
        <p>COUNT:{globalState.count}</p>
        <button onClick={() => dispatch({type: "INCREMENT", payload: 1})}>+1</button>
        <button onClick={() => dispatch({type: "DECREMENT", payload: 1})}>-1</button>
        <p>COUNT:{otherState.count}</p>
        <button onClick={() => dispatch({type: "CLEAR"})}>clear</button>
        <button onClick={() => dispatch({type: "TOMAX"})}>to max</button>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return ({globalState: state.globalReducer, otherState: state.otherReducer})
}
export default connect(mapStateToProps)(Counter)
```

为了省事，我把这个组件增加了两个按钮功能，实际情况更可能是另外一个组件来调用对应的方法。

与之前不同的是，全局 `state` 不再是一层对象了，而是被我们 reducer 定义的字段名包了一层。

**需要注意的是，我们调用 `dispatch({ type: "DECREMENT", payload: 1 })` 后，不仅 `globalReducer` 会被执行，`otherReducer` 也会被执行。只不过 `otherReducer` 走到了 `default` 情况。这也就是 reducer
不要写带有副作用的功能！**
