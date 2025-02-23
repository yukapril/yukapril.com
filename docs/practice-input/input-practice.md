---
sidebar_position: 4
---

# 受控输入框的 Vue 业务封装

很多时候业务层更倾向直接使用封装好的组件，不在关心具体的细节配置。我们可以把键盘类型、受控组件等功能一并封装处理好。

下文以 Vue 为例。

## Vue 受控组件底层封装

参考[上文](./input-handle.md)，先准备封装一个最底层受控组件 `CtrlInput.vue`：

```html title="CtrlInput.vue"
<!-- 受控输入框 -->
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
          // 添加自定义监听器
          // 这里确保组件配合 `v-model` 的工作
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
      // 将展示的原生的 input value 和 this 中的 input value 保持一致
      setNativeInputValue() {
        const input = this.$refs.input
        if (!input) return
        if (input.value === Stringify(this.value)) return
        input.value = Stringify(this.value)
      }
    }
  }
</script>

<style scoped>
  input {
    margin: 0;
    padding: 0;
    width: inherit;
    height: inherit;
  }
</style>
```

我把公共方法，放到了 `extend.js` 中，如果封装多个组件，可以方便复用：

```js title="extend.js"
/**
 * extend 处理功能
 * 启动初始化时，增加数据验证和格式处理
 * 输入时，处理数据验证（this.formatter 回调实现）及保存 lastText 中
 * 输入时，处理 focus 状态
 * 增加 autoEnterBlur，键盘按回车后，键盘收起
 */
export default {
  props: {
    value: {type: String, default: ''},
    autoEnterBlur: {type: Boolean, default: false}
  },
  data() {
    return {
      lastText: '', // 上一次输入的内容
      focus: false // 当前是否获取焦点
    }
  },
  computed: {
    inputListeners() {
      return {
        ...this.$listeners,
        input: (value, e) => {
          const v = this.formatter(value || '', e, {})
          this.lastText = v
          this.$emit('input', v)
          if (this.$listeners.input) this.$listeners.input(v, e)
        },
        keyup: (e) => {
          if (this.autoEnterBlur) {
            if (e.code === 'Enter' || e.key === 'Enter' || e.keyCode === 13) {
              e.target.blur()
            }
          }
          if (this.$listeners.keyup) this.$listeners.keyup(e)
        },
        blur: (e) => {
          e.target && e.target.scrollIntoViewIfNeeded && e.target.scrollIntoViewIfNeeded(true)
          this.focus = false
          if (this.$listeners.blur) this.$listeners.blur(e)
        },
        focus: (e) => {
          this.focus = true
          if (this.$listeners.focus) this.$listeners.focus(e)
        }
      }
    }
  },
  created() {
    // 初始化处理默认上一次输入内容
    this.lastText = this.formatter(this.value || '', null, {})
    // 处理不符合格式的默认值
    this.$emit('input', this.lastText)
  }
}
```

要注意的是，如果底层 `extend.js` 劫持了相应的事件，最后要调用上层组件的对应方法。如：

```js
if (this.$listeners.focus) this.$listeners.focus(e)
```

否则上层组件无法监听到对应事件了。

还有，初始化及输入后，会调用上层组件的 `this.formatter()`，来实现内容展示的格式化。

## 封装手机号输入组件

```html title="InputPhone.vue"
<template>
  <div class="e2-input-phone">
    <CtrlInput
        type="text"
        inputmode="numeric"
        :maxlength="11"
        v-bind="$attrs"
        :value="value"
        v-on="inputListeners"/>
  </div>
</template>

<script>
  import CtrlInput from './CtrlInput.vue'
  import extend from './extend'

  const fn = {
    // 过滤清理无效输入等
    filter(value, e) {
      let val = value
      val = val.replace(/\s/g, '') // 禁止空格类字符
      val = val.replace(/\D/g, '') // 禁止非数字
      return val
    },
    // 格式化为最终需要格式
    format(value, e) {
      return value
    }
  }

  export default {
    components: {CtrlInput},
    extends: extend,
    methods: {
      // 数据处理方法，不要改名（extend 中有调用）
      formatter(value, e) {
        let val = value
        val = fn.filter(val, e, {})
        val = fn.format(val, e, {})
        return val
      }
    }
  }
</script>

<style scoped>
  .e2-input-phone {
    display: flex;
    align-items: center;
    width: inherit;
    height: inherit;
  }
</style>
```

html 结构上，建议包裹一层 `div`，主要考虑可以做除了输入框的其他功能，如一键清除功能等。这样未来结构不会有明显的层级变化了。

定义一个 `fn` 对象，实现了过滤器 `filter` 和格式化效果器 `formatter`。这么写，主要是为了写其他组件时候拷贝修改起来方便。

## 封装手机号输入组件使用

封装的非常详细，使用就不需要太过于关注参数控制了。

```html
<template>
  <div>
    <InputPhone placeholder="输入手机号" v-model="text"/>
    <p>输入的内容:{{ text }}</p>
  </div>
</template>

<script>
  import {InputPhone} from './InputPhone.vue'

  export default {
    components: {InputPhone},
    data() {
      return {
        text: '',
      }
    }
  }
</script>
```

## 封装银行卡受控组件

银行卡组件，要实现银行卡四位分隔，还有长度的控制。

```html title="InputBankcard.vue"
<template>
  <div class="e2-input-bankcard">
    <CtrlInput
        type="text"
        inputmode="numeric"
        v-bind="$attrs"
        :value="value"
        :placeholder="placeholder"
        :maxlength="inputMaxlength"
        v-on="inputListeners"/>
  </div>
</template>

<script>
  import CtrlInput from './CtrlInput.vue'
  import extend from './extend'
  import {separator4Format} from './utils'

  const fn = {
    // 过滤清理无效输入等
    filter(value, e, {maxlength}) {
      const max = Number(maxlength)
      let val = value
      // 1. 输入拦截
      val = val.replace(/\s/g, '') // 禁止空格类字符
      val = val.replace(/\D/g, '') // 禁止非数字

      // 2. 分隔符处理
      // 如果是分隔符，有空格存在，故不能使用 maxlength，需要自行控制长度
      if (max > 0 && val.length > max) {
        val = val.substring(0, max)
      }
      return val
    },
    // 格式化为最终需要格式
    format(value, e, {separator}) {
      // 处理分隔符
      if (separator) {
        return separator4Format(value)
      }
      return value
    }
  }

  export default {
    components: {CtrlInput},
    extends: extend,
    props: {
      placeholder: {type: String, default: ''},
      maxlength: {type: String, default: '19'},
      separator: {type: Boolean, default: false}
    },
    computed: {
      inputMaxlength() {
        if (this.separator) {
          // 需要自己控制长度，此时不定义即可
          return ''
        } else {
          // 使用配置的长度
          return this.maxlength
        }
      }
    },
    methods: {
      // 数据处理方法，不要改名（extend 中有调用）
      formatter(value, e) {
        let val = value
        val = fn.filter(val, e, {maxlength: this.maxlength})
        val = fn.format(val, e, {separator: this.separator})
        return val
      }
    }
  }
</script>

<style scoped>
  .e2-input-bankcard {
    display: flex;
    align-items: center;
    width: inherit;
    height: inherit;
  }
</style>
```

封装银行卡稍微复杂一点，但整体思路是一致的。区别点在于：

1. `formatter` 格式化中，要给两个函数提供长度和分隔符状态；
2. `fn` 的两个函数稍微复杂一点点，需要考虑长度和分隔符了，因为有没有分隔符 `maxlength` 处理方式不同；
3. `maxlength` 需要手动管理下；
4. 要准备两个函数，四位分隔符处理 `separator4Format`，以及移除分隔符 `removeSeparatorFormat`
   。前者在组件内调用，后者要暴露给业务层，再拿到数据后，需要移除其中的分隔符。

## 封装银行卡输入组件使用

```html
<template>
  <div>
    <InputBankcard
        class="input-bankcard"
        placeholder="输入银行卡号"
        separator
        v-model="text"/>
    <p>输入的内容:{{ text }}</p>
    <p>处理后的内容:{{ textValue }}</p>
  </div>
</template>

<script>
  import {InputBankcard} from './InputBankcard.vue'
  import {removeSeparatorFormat} from './utils'

  export default {
    components: {InputBankcard},
    data() {
      return {
        text: ''
      }
    },
    computed: {
      textValue() {
        return removeSeparatorFormat(this.text)
      }
    }
  }
</script>
```

使用也非常简单，要注意的是，如果开启了分隔符 `separator`，则数据应该使用处理后的，即 `textValue`。`text` 内容为输入框中内容，即带有空格。

## 封装任意受控通用组件

可能我们个别的业务定制化较强，可以封装一个通用组件，接受拦截器和展示格式格式化的功能。

```html title="InputAny.vue"
<template>
  <div class="e2-input-any">
    <CtrlInput type="text" v-bind="$attrs" :value="value" v-on="inputListeners"/>
  </div>
</template>

<script>
  import CtrlInput from './CtrlInput.vue'
  import extend from './extend'

  export default {
    components: {CtrlInput},
    extends: extend,
    props: {
      filter: {type: Function, default: val => val},
      format: {type: Function, default: val => val}
    },

    methods: {
      // 数据处理方法，不要改名（extend 中有调用）
      formatter(value, e) {
        let val = value
        val = this.filter(val, e, {})
        val = this.format(val, e, {})
        return val
      }
    }
  }
</script>

<style scoped>
  .e2-input-any {
    width: inherit;
    height: inherit;
  }
</style>
```

## 封装任意受控通用组件使用

我们实现一个输入框功能，可以输入 30 位，但是不允许输入空格。展示上，就不做特殊处理了。

```html
<template>
  <div class="input-any">
    <InputAny
        v-model="text"
        placeholder="不能输入空格"
        :filter="inputAnyFilter"
        :format="inputAnyFormat"/>
  </div>
</template>

<script>
  import {InputAny} from './InputAny.vue'

  export default {
    components: {InputAny},
    data() {
      return {
        text: 'abc'
      }
    },
    methods: {
      inputAnyFilter(value, e) {
        let val = value
        val = val.replace(/\s/g, '') // 禁止空格类字符
        val = val.substring(0, 30) // 可以逻辑中控制，也可以maxlength控制
        return val
      },
      inputAnyFormat(value, e) {
        return value
      }
    }
  }
</script>
```

## 小结

如果需求比较固定，可以直接根据 `CtrlInput.vue` 和 `extend.js` 来封装具体业务组件，当然也可以在 `InputAny.vue` 基础上封装需要的业务组件。

同时也提供 `InputAny.vue` 组件，便于业务定制化的开发，无需关心底层细节了。但需要业务层比较熟悉了解封装思路和原理。
