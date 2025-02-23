---
sidebar_position: 2
---

# 输入框的键盘自动提交控制

上篇文章提到键盘右下角，不同的 `type` 有不同的文案，本篇来研究如何实现该按钮的功能。

主要区分为：普通元素模式及表单模式。

## 普通元素模式

意思是单独的 `input` 输入框，外层没有表单嵌套。

此时键盘的提交功能，触发的是键盘回车键。一般通过监听 `keyup` 事件来完成。

```html
<div>
  <input type="text" id="input1"/>
</div>
```

```js
const input1 = document.getElementById('input1')

input1.addEventListener('keyup', (e) => {
  console.log('[INPUT 1] keyup', 'key=' + e.key, 'code=' + e.code, 'keyCode=' + e.keyCode)
  if (e.key === 'Enter' || e.code === 'Enter' || e.keyCode === 13) {
    console.log('按下了提交按钮')
  }
})
```

对于 `key` `code` `keyCode` 解释，详见下面。

## 表单模式

意思是 `input` 包裹在表单元素中。

此时又分为两种情况：带有提交按钮和不带有提交按钮。

带有提交按钮情况，键盘的提交功能，相当于触发表单提交 `submit`。且不论输入框有多少个，点击键盘提交就算做表单提交。

不带有提交按钮情况，则和上文中的一致，相当于触发键盘回车键。

```html
<form action="/submit/path" id="form">
  <input type="text" id="input2"/>
  <input type="text" id="input3"/>
  <input type="button">submit</input>
</form>
```

```js
const form = document.getElementById('form')

form.addEventListener('submit', (e) => {
  e.preventDefault() // 阻止默认提交，否则会提交到数据到/submit/path
  console.log('[FORM] submit')
})

const input2 = document.getElementById('input2')
input2.addEventListener('keyup', (e) => {
  console.log('[INPUT 2] keyup', 'key=' + e.key, 'code=' + e.code, 'keyCode=' + e.keyCode)
})
```

带有提交按钮情况，优先触发了表单 `submit` 事件，随后触发了输入框 `keyup` 回车事件。
如果把表单中的 `button` 提交按钮去掉，则只会触发输入框 `keyup` 回车事件。

经过测试，按钮元素类型为 `button` `submit`，均可以触发表单 `submit` 事件。即如下按钮可以：

```html
<button>submit</button>
<button type="button">submit</button>
<button type="submit">submit</button>
<input type="button" value="submit"/>
<input type="submit" value="submit"/>
```

但是 `reset` 是不可以的：

```html
<button type="reset">reset</button>
<input type="reset" value="reset"/>
```

## `key` `code` `keyCode` 异同

上面代码里，出现了 `key` `code` `keyCode` 三个属性。

`keyCode` 已经弃用字段。返回按键对应的 ASCII 码。建议换成 `code`。

`code` 返回触发的按键名。如 `Enter` `Backspace` `KeyQ` `Digit1` `ControlLeft` 等。
故即便都是按下 `Control` 键，也可以明确知道是按下了键盘上左侧还是右侧的按键。

`key` 返回触发的按键实际内容。如按下按键 `1`，此时输出 `1`。按下 `shift` + `1`，此时输出 `!`。
德沃夏克键盘模式下，按下 `Q`，此时 `code` 为 `KeyQ`，但 `key` 为 `'`。

实际应用中，如果是获取按键内容上，常用 `key`。
