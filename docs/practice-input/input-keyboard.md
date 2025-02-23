---
sidebar_position: 1
---

# 输入框的键盘及按钮文案控制

移动端项目中，有不少需要用户输入的地方，而默认弹出的键盘，一般为 `字母全键盘` 或者 `九宫格键盘`。
对于文本形式的内容，还算合理。但对于电话、金额、验证码形式的内容，很明显默认的键盘下，用户还需要进一步进行点击切换。

本文主要针对 iOS 设备，默认的键盘进行测试与研究。使用的测试手机输入法，为自带手机输入法键盘，且以 `字母全键盘` 模式为主进行说明。
（因为 `九宫格键盘`，在对于部分类型时变化不大）

本文写法与结论，大部分也适用与 Android。

本文的测试 demo <a href="/demo/2023-04-23-input.html" target="_blank">见此</a>。

## input type 类型

`input` 的 `type` 支持的类型较多，可以参考 MDN 文档<sup>[[1]](#参考)</sup>。

我们主要关注 `text` `search` `number` `tel` `url` `email`。

### 写法1: 非表单中的 input

```html
<div><input type="text"/></div>
```

![写法1: 非表单中的 input](https://cdn1.yukapril.com/knowledge/input-1-1.png)

此时是默认全键盘。在没有表单元素包裹下，右下角提交按钮表现为 `换行`，点击按钮没有任何反应。因为缺少表单的定义。

### 写法2: 没有 action 的 type="text"

```html
<form><input type="text"/></form>
```

效果同写法1。

此时是默认全键盘。右下角提交按钮表现为 `换行`，点击按钮键盘收起了。

### 写法3: input type="text"

```html
<form action="#"><input type="text"/></form>
```

![写法3: input type="text"](https://cdn1.yukapril.com/knowledge/input-1-3.png)

此时是默认全键盘。右下角提交按钮表现为蓝色的 `前往`，点击按钮键盘没有任何反应。因为表单没有定义提交等处理方法。下文亦如此。

### 写法4: input type="search"

```html
<form action="#"><input type="search"/></form>
```

![写法4: input type="search"](https://cdn1.yukapril.com/knowledge/input-1-4.png)

此时是默认全键盘。右下角提交按钮表现为蓝色的 `搜索`。注意，必须嵌套在表单元素中，否则看不到 `搜索` 按钮。下文亦如此。

### 写法5: input type="number"

```html
<form action="#"><input type="number"/></form>
```

![写法5: input type="number"](https://cdn1.yukapril.com/knowledge/input-1-5.png)

此时是默认全键盘，但是默认激活数字输入层。右下角提交按钮表现为蓝色的 `前往`。
用户可以键盘切换为字母等并进行输入，但点击 `前往` 按钮后，会有提示。

此外，输入数字内容后，使用 javascript 获取输入值，类型同其他输入框一致，仍然为字符串类型。

在 iOS 下，如果输入了非数字后（如 `234a`），使用 javascript 获取输入值，此时将为**空字符串**。
但要注意的是字母 `e`，如 `23e4` 是合法数字，将得到字符串 `23e4`。

注意：`type="number"`，是不支持 `maxlength` 的。`maxlength` 只能对 `text` `search` `url` `tel` `email` `password`
生效<sup>[[1]](#参考)</sup>。

### 写法6: input type="tel"

```html
<form action="#"><input type="tel"/></form>
```

![写法6: input type="tel"](https://cdn1.yukapril.com/knowledge/input-1-6.png)

此时只能是系统默认的电话号码键盘，可以输入数字及 `+*#,;` 字符。没有提交按钮。 安装第三方输入法无效，不能被激活。

### 写法7: input type="url"

```html
<form action="#"><input type="url"/></form>
```

![写法7: input type="url"](https://cdn1.yukapril.com/knowledge/input-1-7.png)

此时是默认全键盘，但是空格键消失，取代为链接快捷输入。右下角提交按钮表现为蓝色的 `前往`。

### 写法8: input type="email"

```html
<form action="#"><input type="email"/></form>
```

![写法8: input type="email"](https://cdn1.yukapril.com/knowledge/input-1-8.png)

此时是默认全键盘，但是空格键变小，取代为邮箱快捷输入。右下角提交按钮表现为蓝色的 `前往`。

### 写法9: input type="password"

```html
<form action="#"><input type="password"/></form>
```

此时只能是默认全键盘。安装第三方输入法无效，不能被激活。

而且不能被截屏，截屏图片键盘部分是纯白色。

## input inputmode 类型

除 `type` 属性外，`input` 还支持 `inputmode` 属性，主要用于键盘类型控制<sup>[[2]](#参考)</sup>。

### 写法1: input inputmode="none"

```html
<form action="#"><input type="text" inputmode="none"/></form>
```

此时不拉起任何键盘。如果自己实现键盘效果，则非常实用。

### 写法2: input inputmode="text"

```html
<form action="#"><input type="text" inputmode="text"/></form>
```

这个是默认值。

### 写法3: input inputmode="decimal"

```html
<form action="#"><input type="text" inputmode="decimal"/></form>
```

![写法3: input inputmode="decimal"](https://cdn1.yukapril.com/knowledge/input-2-3.png)

此时为数字键盘，可以输入小数点。

### 写法4: input inputmode="numeric"

```html
<form action="#"><input type="text" inputmode="numeric"/></form>
```

![写法4: input inputmode="numeric"](https://cdn1.yukapril.com/knowledge/input-2-4.png)

此时为数字键盘，不可以输入小数点。

### 写法5: input inputmode="tel"

```html
<form action="#"><input type="text" inputmode="tel"/></form>
```

此时和 `input type="tel"` 效果一致。可参考上文。

### 写法6: input inputmode="search"

```html
<form action="#"><input type="text" inputmode="search"/></form>
```

![写法6: input inputmode="search"](https://cdn1.yukapril.com/knowledge/input-2-6.png)

此时是默认全键盘。但右下角提交按钮**并不是**蓝色的 `搜索`。

### 写法7: input inputmode="email"

```html
<form action="#"><input type="text" inputmode="email"/></form>
```

此时和 `input type="email"` 效果一致。可参考上文。

### 写法8: input inputmode="url"

```html
<form action="#"><input type="text" inputmode="url"/></form>
```

此时和 `input type="url"` 效果一致。可参考上文。

## input type 与 inputmode 混用

具体可以自行实践以及参考 demo。这里直接说结论：

1. 如果是合理的，如 `type="number" inputmode="decimal"` `type="search" inputmode="url"`，则`type` `inputmode` 全部生效；
2. 如果不合理，如 `type="tel" inputmode="url"`，则按 `inputmode` 为准，`type` 无效；
3. 是否合理：`type` 依然控制键盘外观和提交按钮效果，如果 `inputmode` 的键盘输入范围是 `type` 键盘的子集，则合理并生效，否则不合理不生效；
4. 如果使用第三方键盘，基本也符合上述规律。

## 小结

1. `type` 控制的是键盘的外观（如果有对应的外观样式）以及右下角按钮的效果；
2. `inputmode` 只能控制键盘外观，但不能决定右下角提交按钮的效果；
3. `inputmode` 的一些值，可以直接用对应的 `type` 属性来替代；
4. 建议 `input` 嵌套在表单中，否则 `type` 对应的键盘提交按钮文案不能正常展示；
    * 没有使用表单元素包裹，或者表单元素缺少 `action` 属性，直接显示 `换行`；
    * 表单元素包裹且有 `action` 属性，默认展示 `前往`，如果是 `search` 类型，则展示 `搜索`；
5. 系统自带输入法和安装第三方输入法区别不是很大。第三方输入法主要在 UI 样式有细微差别，功能基本同系统自带输入法；
6. `字母全键盘` 功能全面，不同的类型模式下会有差异，而 `九宫格键盘` 由于展示的按键较少，很多时候区别不大；
7. 系统自带输入法，默认有输入控制能力，比如 `inputmode=decimal`
   ，只能输入数字和小数点。但是第三方键盘（如搜狗），可能允许用户切换输入方式，此时仍然可以输入字母等。故一定要进行数据验证。

## 参考

[1]&nbsp;[input MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input)

[2]&nbsp;[inputmode MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/inputmode)
