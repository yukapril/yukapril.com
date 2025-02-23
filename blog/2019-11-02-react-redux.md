---
title: Redux 学习 - react-redux
date: 2019-11-02 15:44:00 GMT+0800
tags: [ react, redux ]
---

感觉公司新项目要用到 redux 了，趁此机会好好学习下。react 用了这么久，redux 真的一点还不会。其实也是看过一点文章，但感觉他们的写法太复杂，把简单的写法弄复杂了。这次算是一个系列的文章，大概顺序是
redux、redux-saga、umijs（dva）架构写法。

<!-- truncate -->

## redux

一般 react 项目，都是各个组件自己管理状态，如果遇到多个组件要通信，才会考虑 redux。

确实大部分项目都用不到 redux。我认为需要用到 redux 主要有三点：

* 项目有太多的状态需要管理
* 开发人员太多导致状态混乱，难以管理
* 组件需要较多的通信，或者存在嵌套太深

使用 redux 后，数据流动发生了一些变化：

1. 首先是组件的部分状态（或全部）要在全局状态来进行获取，这步需要通过 connect 方法来实现 HOC（高阶组件）。
2. 其次组件需要修改共用的状态，需要通过 dispatch 方法派发一个 action，到 reducer 上，reducer 负责调整全局状态。

下面，我力争用最简单的例子，并且尽量和后续文章内容写法上向后兼容。

> 下文将不再特殊说明，redux 有时候特指 react-redux。

## react-redux 上手

最终的代码见 [github](https://github.com/yukapril/learning/tree/master/react-redux-lite)

最基础的功能实现，只需要三个文件就可以了。分别是：

* 入口文件 `index.js`
* 迭代文件 `reducer.js`
* 组件文件 `Counter.js`

如果你看过完整版的 redux 入门，会多出一些文件，其实就是单独抽离出来而已。随着下文遇到的时候，我会做相应说明。

我们来实现一个全局状态管理的支持加减的记录器。

#### index.js

```jsx
import React from "react"
import ReactDOM from "react-dom"
import {Provider} from "react-redux"
import {createStore} from "redux"
import reducer from "./reducer.js"
import Counter from "./Counter"

const store = createStore(reducer)

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

必须要先使用 `Provider` 组件整体包裹起来，组件来源于 `react-redux` 垫片库。这样子组件变成 HOC（高阶组件）后就可以拿到全局状态了。

需要创建一个全局状态（`store`），使用 redux 原本的库的方法进行创建。

> 经过研究，创建全局状态时候，一般不建议使用 `createStore` 的第二个参数配置 `初始 state`，而是在 reducer（迭代函数）中配置默认值。因为如果是只有一个 reducer，那么没啥问题。如果是多个 reducer
> 再进行合成，会有问题，我没有深入研究原因。

#### Counter.js

```js
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
      </div>
    );
  }
}

const mapStateToProps = state => ({globalState: state})
export default connect(mapStateToProps)(Counter)
```

**看似很简单的组件，其实涉及的点特别多。**

组件想要获取全局状态，必须用 `connect` 连接包裹一下。

`connect` 支持两个参数，分别是 `mapStateToProps` `mapDispatchToProps`。其中 `mapStateToProps` 必须实现，否则组件内部 `props` 拿不到 `state`；`mapDispatchToProps` 我觉得无所谓，因为组件内部 `props` 默认可以拿到
`dispatch` 方法。

> `connect` 可以在文件后面用函数调用方式写，也可以用装饰器来写（就是 java 注解那种样子）。如果用 `create-react-app` 生成的项目，是不支持装饰器的，需要自己配置。

代码中 `dispatch` 的 `{ type: "INCREMENT", payload: 1 }`，这个对象叫做 **action**，一般是含有 `type` 和 `payload`，当然你也可以不叫作 `payload`，不过 `type` 我没见过改名的。如果你看完整版的教程，会有专门的文件
`actions.js` 来负责生成 action，**我认为没必要**。同时，完整版把 `INCREMENT` 这些常量在定义一个专门的文件 `actionTypes.js` 中，**我一样认为没必要**。

这个例子中，我把全局状态 `state` 通过 `mapStateToProps` 方法，改名叫做 `globalState` 放到了组件 `props` 里面。你可能看到这样的写法：

```js
const mapStateToProps = state => {
  return {
    count: state.count
  }
}
```

直接把全局 `state.count` 映射到组件上（叫做`count`）

我认为如果组件要用的全局状态太多，`mapStateToProps` 里这么写太费劲了，所以干脆直接透传了 `state`。之所以改名，我觉得使用 redux 不一定 100% 状态全部保存到全局状态上，组件内部自己也可以维护 `state`。

至于 `mapDispatchToProps`，我认为一般不需要写，理由同上，如果用的 dispatch 太多，你得写多少啊。当然你愿意也可以写成：

```js
const mapDispatchToProps = dispatch => {
  return {
    inc() {
      dispatch({type: "INCREMENT", payload: 1})
    },
    dec() {
      dispatch({type: "DECREMENT", payload: 1})
    }
  }
}
```

组件内容可以写成:

```js
class Counter extends React.PureComponent {
  render() {
    const {globalState, inc, dec} = this.props
    return (
      <div>
        <p>COUNT:{globalState.count}</p>
        <button onClick={inc}>
          +1
        </button>
        <button onClick={dec}>
          -1
        </button>
      </div>
    )
  }
}
```

背着抱着一样沉。不写组件事件绑定里，就要在  `mapDispatchToProps`写好，然后通过 `props` 传入。反正我不推荐写 `mapDispatchToProps`。我在我司的业管平台中还看到异步写法，处理完毕之后要回调的，写到
`mapDispatchToProps` 会导致组件内不好获取回调。

**需要知道的是，dispatch 是有返回值的，这个例子是同步函数，返回的是当前调用的 action。**同步情况用不到返回值，但是异步处理的话，这个就有作用了。

#### reducer.js

```jsx
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
export default globalReducer
```

reducer 是描述如何修改 `state` 的函数，不能有副作用。同时也必须是同步函数（不能是异步的）。**传入的全局状态，不可修改，必须重新返回的一个新对象。**

第一个参数建议配置默认值。如果 `index.js` 中创建全局 store 没有配置，这里也没配置，会报错。

action 就是 `Counter.js` 中 dispatch 的东西。可以任意定义传输内容。一般 `type` 字段表示调用 reducer 的名字，`payload` 来传输数据。当然也可以换成 `value` 等字段，或增加其他字段亦可以。
