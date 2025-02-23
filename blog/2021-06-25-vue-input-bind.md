---
title: Vue 下 input 输入拦截研究
date: 2021-06-25 23:38:00 GMT+0800
tags:  [vue, input]
---

前几天看面试题，其中提到 React 的 `setState` 何时为同步何时为异步。那篇文章提到要根据 `isBatchingUpdate` 来判断。当时我就信以为真了。

过了几天有时间就去看了下 React 源码，根本没有 `isBatchingUpdate`！之后依次翻阅历史版本，从 v18 一直到 v15.6，果真看到了。没想到这应该是 2018 的面试题吧。

<!-- truncate -->

正好突然想起了 React 对输入框的单向绑定，想看看具体实现。结果发现没有啥特殊逻辑。又想到公司的项目输入框，错误数据总是先显示出来，瞬间又被删除，体验不好。就想着封装一个 Vue 组件试试。

其实 2019 年我就写过方案了，只不过当时没有封装而已。现在来看，原理是正确的。

`Input.vue`  如下：

```html

<template>
    <input ref="input"/>
</template>

<script>
    export default {
        props: {
            // 传入最新的值
            value: {type: String, default: ""},
        },
        data() {
            return {
                // 本地缓存上一次老值
                oldVal: "",
            };
        },
        computed: {
            // 输入框元素
            input() {
                return this.$refs.input;
            },
        },
        watch: {
            // 处理每次外层改变新值时候，要修正老值和输入框显示值
            value(newVal, oldVal) {
                this.oldVal = newVal;
                this.input.value = newVal;
            },
        },
        methods: {
            listener(e) {
                const target = e.target;
                // 要想实现输入内容防抖，这里必须写成老值
                // 后续等待外层改变新值时候，触发 watch->value 方法
                target.value = this.oldVal;
                this.$emit("input", e);
            },
        },
        mounted() {
            this.oldVal = this.value;
            this.input.value = this.value;
            this.input.addEventListener("input", this.listener);
        },
        beforeUnmount() {
            this.input.removeEventListener("input", this.listener);
        },
    };
</script>
```

`App.vue` 如下：

```html
<template>
  <Input :value="val" @input="onInput" />
</template>

<script>
import Input from "./components/Input";
export default {
  components: { Input },
  data() {
    return {
      val: "123",
    };
  },
  methods: {
    onInput(e) {
      const val = e.target.value;
      this.val = val.replace(/\D+/g, "");
    },
  },
};
</script>
```

在线看效果：[https://codesandbox.io/s/vue-input-component-f412y](https://codesandbox.io/s/vue-input-component-f412y)
