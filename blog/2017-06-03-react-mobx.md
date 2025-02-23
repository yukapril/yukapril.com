---
title: "学习 React - MobX"
date: 2017-06-03 14:16:00 GMT+0800
tags: [ react, mobx ]
---

计划学习 React，就接触到了 MobX。之前听过 Redux，因为我接触过 Vuex，感觉差不太多，就没有再去学习。还听说 Redux 的作者推荐 MobX，看来在不是很复杂的数据流动选择 MobX 是非常正确的。

<!-- truncate -->

## 一个简单的 React 例子

做一个最简单的 React 页面——页面实时显示时间。

其中有一个组件 `Timer` ，负责显示时间，并完成实时更新。

### 用 React直接来写

那么，`app.js` 如下：

```jsx
import React from "react";
import "./App.css";

const now = () => {
  let t = new Date().toISOString().replace('T', ' ');
  return t.substring(0, t.length - 5);
};

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: null,
      timeString: now()
    }
  }

  componentDidMount() {
    let timer = setInterval(() => {
      this.setState({
        timeString: now()
      });
    }, 1000);
    this.setState({timer});
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  render() {
    return (<span>now: {this.state.timeString} </span>)
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <Timer></Timer>
      </div>
    )
  }
}

export default App;
```

由于我们需要实时更新时间，在 `Timer` 组件内，定义内部状态（ `state`），并且在挂载组件后启动定时，组件移除时清除定时器。

这样做有这些问题：

- 如果有两个组件公用一个时间，那么没办法写在其中一个组件内，否则第二个组件获得不到时间
- 为了解决第一点，一般就是采用 Redux，创建公共的 store，接收公共状态
- 当然，如果两个组件是父子关系，可以通过 `props` 来进行传递，可以不用 Redux

而一旦使用 Redux，那么项目规模立刻变大许多，而且 Redux 也比较复杂，不易于学习。所以就有了 MobX。😘

### 使用 MobX

引入 MobX 包，我们改写下 `app.js` ：

```jsx
import React from "react";
import "./App.css";

import {observable} from "mobx";
import {observer} from "mobx-react";

const now = () => {
  let t = new Date().toISOString().replace('T', ' ');
  return t.substring(0, t.length - 5);
};

let store = observable({
  timerString: now()
});

setInterval(() => {
  store.timerString = now();
}, 1000);

@observer
class Timer extends React.Component {
  render() {
    return (<span>now: {store.timerString} </span>)
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <Timer></Timer>
      </div>
    )
  }
}

export default App;
```

修改之后，是不是简单多了？

修改的内容有：

- 引入了新包 `mobx` 和 `mobx-react`
- 共享的状态，直接写到了全局下，而且还是 `observable` （可观察的）
- 状态的修改，也直接放到了全局下，当然，这个放在那里都无所谓，也可以放到组件内
- 原有的 `Timer` 组件，直接引用全局共享状态，并且加上了装饰器 `observer`
- 需要说明的一点：**observable 如果使用装饰器形式，只能写在类（ `class` ）内，所以这里没办法写成装饰器形式**

## 小结

通过使用 MobX，可以大大简化状态共享的代码量，原本需要使用 Redux 的项目，如果数据流动不是特别复杂，换成 MobX 可以开发效率更高。但是据说项目有一定规模的话，MobX 也会比较难于管理，还是 Redux 比较适合。
