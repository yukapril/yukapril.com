---
title: 中文输入法在 React 文本输入框的特殊处理
date: 2019-11-11 22:54:00 GMT+0800
tags: [ react, input, event, composition ]
---

看 anu 的源码，看到注释里面有一篇文章，说输入法的问题，正好很多年前也遇到过，虽然不是特别影响使用，但是这个思路确实不常见。

<!-- truncate -->

## 问题

首先，这个问题和框架无关，都会遇到的。为了方便，下面用 react 来说明。简单来说：

页面有一个输入框，每次输入一下，便向后端请求，获取一些相关数据。这里技术上不考虑节流情况。

假设用户输入了 `abc`。那么由于触发 `onChange` 三次，所以请求了后端三次。分别是 `a` `ab` `abc`。**符合预期**。

假设用户输入了 `abc的`。那么触发 `onChange` 分别是 `a` `ab` `abc` `abcd` `abcde` `abc的`。**这不符合预期**。正确的请求应该是 4 次，即 `a` `ab` `abc` `abc的`。在使用输入法输入过程中，也触发 `onChange` 了。

这个问题来源和解决方案，见此： [中文输入法与React文本输入框的问题与解决方案](https://segmentfault.com/a/1190000008023476)

文章挺好的，但是太长了，所以 TLDR。我自己决定按照 `compositionEvent` 试试看。

## 处理代码

自己写着玩的，兼容性没有测试过，只是在 chrome firefox 最新版下没问题。

`compositionEvent` 输入合成事件，下文均指代输入法输入过程。

```jsx
import React from 'react';

class App extends React.PureComponent {
  state = {
    text: "",
    isInputing: false
  };

  // 原本只有使用输入法输入时候会触发，
  // event.type 主要为 compositionEvent 系列。
  // 在 handleChange 中调用此方法后，
  // event.type 就存在 change 的情况。
  handleCompsition = event => {
    const {isInputing} = this.state;
    const type = event.type;
    const value = event.target.value;
    console.log("handleCompsition", type, value);

    if (type === "compositionstart") {
      // 输入法开始输入
      this.setState({isInputing: true});
    } else if (type === "compositionupdate") {
      // 输入法每次敲击，这里不需要特殊处理
      // 只需要关注开始和结束事件即可
    } else if (type === "compositionend") {
      // 输入法结束输入
      this.setState({isInputing: false});
      // 由于是先调用 onChange
      // 最后调用 compositionend
      // 故此事件内需要将最终的内容写入 state
      this.setState({text: value});
    } else if (type === "change") {
      if (!isInputing) {
        // 非输入法情况下，直接保存内容到 state
        this.setState({text: value});
      } else {
        // 输入法情况下，等待输入法输入完毕
        // 然后在 compositionend 事件内，再保存内容到 state
        // 故此处不需要保存内容到 state
      }
    }
  };

  // 不论如何输入都会触发 handleChange
  // 但是直接输入英文，不会触发 handleCompsition
  // 故干脆都放到 handleCompsition 处理
  handleChange = event => {
    console.log("handleChange");
    // 必须透传 event 事件
    // 主要是透传 event.type === 'change' 这种情况
    this.handleCompsition(event);
  };

  render() {
    const {text, isInputing} = this.state;

    return (
      <div>
        <p>输入状态：{isInputing ? "输入法输入中..." : "-"}</p>
        <p>输入内容：{text}</p>
        <p>
          输入区域：
          <input
            onCompositionStart={this.handleCompsition}
            onCompositionUpdate={this.handleCompsition}
            onCompositionEnd={this.handleCompsition}
            onChange={this.handleChange}
            value={this.state.innerInputText}/>
        </p>
      </div>
    );
  }
}

export default App;
```

通过监听 `onCompositionStart` `onCompositionEnd`，即可得知当前是否在使用输入法进行输入，也就为解决问题有了思路。

这是相对复杂的情况（react 受控组件），非受控组件相对容易一些，可以参考原文。
