---
sidebar_position: 3
---

# 输入框受控组件处理

我们以原生 js、Vue、React 方案，来实现“只能输入 4 个数字的”输入框。

## 原生输入框受控处理

这个很简单。在输入后，直接移除不需要的内容，就算是受控了。

```html
<input type="text" id="input" placeholder="只能输入4个数字">
```

```js
const input = document.getElementById('input')
input.addEventListener('input', () => {
  input.value = formatter(input.value)
})

// 受控处理
function formatter (value) {
  let val = value
  val = value.replace(/\D/g, '')
  if (val.length > 4) val = val.substring(0, 4)
  return val
}
```

## Vue 输入框受控处理

可以参考他人<sup>[[1]](#参考)</sup>的成果，我稍微改了一点点，便可以使用了。

```html title="CtrlInput.vue"
<template>
  <input ref="input" v-bind="$attrs" :value="value" v-on="inputListeners"/>
</template>

<script>
  /**
   * 输入内容字符串化
   */
  const Stringify = val => {
    return (val === null || val === undefined) ? '' : String(val)
  }

  export default {
    props: {
      value: {
        type: String
      }
    },
    computed: {
      inputListeners() {
        return {
          // 从父级添加所有的监听器
          ...this.$listeners,
          // 添加自定义监听器 input，实现 v-model
          input: e => {
            this.$emit('input', e.target.value, e)
            // 保证原生的 input value 是可控的
            this.$nextTick(this.setNativeInputValue)
          }
        }
      }
    },
    watch: {
      // 输入框值改变时，将展示的原生的 input value 和 this 中的 input value 保持一致
      value() {
        this.setNativeInputValue()
      }
    },
    methods: {
      // 始终确保原生的 input value 同 this 中的 input value 保持一致
      setNativeInputValue() {
        const input = this.$refs.input
        if (!input) return
        if (input.value === Stringify(this.value)) return
        input.value = Stringify(this.value)
      }
    }
  }
</script>
```

随后，我们来实现“只能输入 4 个数字的”输入框。

```html title="OnlyFourNumberInput.vue"
<template>
  <CtrlInput v-model="text" placeholder="只能输入4个数字"/>
</template>

<script>
import CtrlInput from './components/CtrlInput.vue'

export default {
  components: { CtrlInput },
  data () {
    return {
      text: ''
    }
  },
  watch: {
    text (newVal) {
      this.text = this.formatter(newVal)
    }
  },
  methods: {
    formatter (value) {
      let val = value
      val = val.replace(/\D/g, '')
      val = val.substring(0, 4)
      return val
    }
  }
}
</script>
```

## React 输入框受控处理

由于 React 输入框本身就是受控的，所以实现非常简单。

```jsx
import { useState } from "react"

export default function App() {
  const [text, setText] = useState("")

  const formatter = (value) => {
    let val = value;
    val = val.replace(/\D/g, "")
    val = val.substring(0, 4)
    return val
  }

  const onInputChange = (e) => {
    const val = e.target.value
    const newVal = formatter(val)
    setText(newVal)
  }

  return (
    <input value={text} onChange={onInputChange} placeholder="只能输入4个数字" />
  )
}
```

## 参考

[1]&nbsp;[参考element源码用vue写一个input的受控组件](https://juejin.cn/post/6945307209819488270)
