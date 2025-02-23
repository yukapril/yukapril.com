---
title: iOS 输入框获取焦点问题
date: 2023-11-05 14:14:00 GMT+0800
tags: [ dom, input, focus ]
---

公司最近在一个项目中，要求一个文本框可以进行编辑。故在文本框后面增加一个按钮，点击按钮可以切换为输入框，并使得输入框获取焦点，变成激活状态。

这个需求挺简单的，项目用的 Vue，实现很容易。

<!-- truncate -->

```html
<template>
    <div id="app">
        <span v-if="!editMode">{{ msg }}</span>
        <input v-if="editMode" v-model="msg" ref="inputRef"/>
        <button @click="onEditClick">edit</button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                editMode: false,
                msg: "hello world",
            };
        },
        methods: {
            onEditClick() {
                this.editMode = true;
                setTimeout(() => {
                    // do something...
                    this.$refs.inputRef.focus();
                }, 10);
            },
        },
    };
</script>
```

点击按钮后，由于涉及 `v-if` 切换，故需要使用 `$nextTick`，等待 DOM 渲染完成后，才能获取 `$refs.inputRef`。

但是实际项目中，还有一些其他需求，干脆就直接使用 `setTimeout` 了。

这么做，PC 端还有 Android 都没有问题。但是 iOS 会无效，表现为可以通过 `$refs` 获取 DOM 元素，但是 `focus()` 不生效。

一开始以为是延时太小，导致了其他逻辑干扰，发现不行。

疑似自己封装的组件有问题，反复调试修改，还是不行。又尝试把封装的 `Input` 组件，换成标准的 `input` 组件，依然不行。

写一个小的 demo，iOS 确实可以实现 `focus()`。这也证明了还是代码问题。而且是项目页面问题。

最后发现，出在了 `setTimeout` 上。iOS 操作输入框，必须用户触发并同步立即执行对应功能，不能延迟处理。

[CodeSandBox 演示地址](https://codesandbox.io/s/vue-input-focus-x8clmr?file=/src/App.vue)

最终代码如下：

```html
<template>
  <div id="app">
    <span v-if="!editMode">{{ msg }}</span>
    <input v-if="editMode" v-model="msg" ref="inputRef" />
    <button @click="onEditClick">edit</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editMode: false,
      msg: "hello world",
    };
  },
  methods: {
    onEditClick() {
      this.editMode = true;
      this.$nextTick(() => {
        this.$refs.inputRef.focus();
        setTimeout(() => {
          // do something...
        }, 10);
      });
    },
  },
};
</script>
```

之前在做 `input` 输入框，拉起文件/相册时候，是知道这个问题的。而且 iOS Android 都要求有用户真实点击，才能模拟用户点击。大致如下：

```html
<div id="btn">btn</div>
<script>
  document.querySelector('#btn').addEventListener('click', () => {
    const input = document.createElement('input')
    input.type = 'file'
    document.body.appendChild(input)
    input.click()
  })
</script>
```

如果没有用户真实的点击，那么直接执行创建元素并模拟点击，是不生效的。当然用 `setTimeout` 异步也不行。

没想到 iOS 那么严格，连输入框 `focus` 都要求用户真实点击，还不能是异步线程执行。
