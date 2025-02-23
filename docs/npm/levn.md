# levn

把字符串转化为指定的类型和格式。

```js
const { parse } = require('levn')

parse('Number', '2') //=> 2
parse('String', '2') //=> '2'

parse('Number | String', 'str') //=> 'str'
parse('Number | String', '2')   //=> 2

parse('[Number]', '[1,2,3]')                      //=> [1,2,3]
parse('(String, Boolean)', '(hi, false)')         //=> ['hi', false]
parse('{a: String, b: Number}', '{a: str, b: 2}') //=> {a: 'str', b: 2}
```

不是强转类型那么简单粗暴，还支持多元化的类型。

而且还支持 `[Number]` 这种类似 TS 的写法。

对于下面这种错误，会直接报错。

```js
parse('Number', 'abc') //=> Error: Value "abc" does not type check against [{"type":"Number"}].
```

我在项目中常见的做法是强转失败就展示默认，至少不能报错。

不过抛出错误，也方便追踪数据源。

这个工具在比较底层的且数据格式复杂情况下，处理上应该能有些作用。
