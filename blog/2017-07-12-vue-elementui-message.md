---
title: "elementUI Message 独立引入的用法"
date: 2017-07-12 13:04:00 GMT+0800
tags: [ vue, elementUI ]
---

今天在做项目时候，用到了 elementUI 的 Message 组件。因为我是按需 `import` 引入的方法，结果按照原本的文档API代码不生效。

<!-- truncate -->

## 查看文档

来看下，[elementUI - Message 文档](http://element.eleme.io/#/zh-CN/component/message) 的说明如下

> **全局方法**
>
> Element 为 Vue.prototype 添加了全局方法 $message。因此在 vue instance 中可以采用本页面中的方式调用 Message。
>
> **单独引用**
>
> 单独引入 Message：
>
> `import { Message } from 'element-ui';`
>
> 此时调用方法为 `Message(options)`。我们也为每个 type 定义了各自的方法，如 `Message.success(options)`。 并且可以调用 `Message.closeAll()` 手动关闭所有实例。

简答来说，如果是全局引入的话，直接按照文档方法就可以使用了，见下：

```js
export default {
  methods: {
    open() {
      this.$message.error('错误信息');
    }
  }
}
```

但是如果是单独引入的，就只能在某个vue单文件组件中这样来实现：

```js
import {Message} from 'element-ui';

export default {
  methods: {
    open() {
      Message.error('错误信息');
    }
  }
}
```

每个组件中，都需要引入 Message，太繁琐了。能不能像全局引入一样用 `this.$message` 呢

## 问题原因及解决

查看下 `element-ui/package/message/index.js` 的实现方法，结果发现：

```js
import Message from './src/main.js';

export default Message;
```

直接返回了。

而其他的组件，一般都是有 `install` 方法供Vue来操作的。

知道问题所在就好解决了，给 Message 添加 install 方法就行了。

```js
// 和其他组件一样，一并引入
import {Button, Message} from 'element-ui'

// 在调用 Vue.use 前，给 Message 添加 install 方法
Message.install = function (Vue, options) {
  Vue.prototype.$message = Message
}

// 和所有组件一样，一并进行use
Vue.use(Button)
Vue.use(Message)
```

当然，也可以不用 Vue.use 来实现，比如直接写在 Vue 实例上：

```js
// 和其他组件一样，一并引入
import {Button, Message} from 'element-ui'

Vue.use(Button)

// 将 Message 直接挂在 Vue 实例上
Vue.prototype.$message = Message
```

我比较倾向第一种方案，写法比较规矩而已。
