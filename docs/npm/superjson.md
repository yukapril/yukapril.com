# superjson

将对象安全的转换为字符串，后续可以还原回来。

举一个例子：

```js
const obj = {
  str: 'abc',
  time: new Date(),
  re: /\d+/,
  fn() {
    return 5
  }
}

console.log(JSON.stringify(obj))
// "{\"str\":\"abc\",\"time\":\"2024-04-01T13:20:31.009Z\",\"re\":{}}"
```

可以看出，常规字符串是正常的，但是时间已经被转化为具体的值了，正则变成了空对象，函数消失了。

我们没办法把这个 `obj` 进行缓存，直接存储会导致数据丢失。

如果用 `superjson` 就可以解决部分问题了。

```js
import superjson from 'superjson'

const obj = {
  str: 'abc',
  time: new Date(),
  re: /\d+/,
  fn() {
    return 5
  }
}

const result = superjson.stringify(obj)
console.log(result)
// '{"json":{"str":"abc","time":"2024-04-01T13:40:23.031Z","re":"/\\\\d+/"},"meta":{"values":{"time":["Date"],"re":["regexp"]}}}'
console.log(superjson.parse(result))
// {
//   str: 'abc',
//   time: new Date(), // 是 parse 时候的时间
//   re: /\d+/
// }
```

根据文档，`superjson` 与 `JSON.stringify` 支持的区别是：

| 类型        | JSON.stringify | superjson |
|-----------|----------------|-----------|
| string    | ✅              | ✅         |
| number    | ✅              | ✅         |
| boolean   | ✅              | ✅         |
| null      | ✅              | ✅         |
| Array     | ✅              | ✅         |
| Object    | ✅              | ✅         |
| undefined | ❌              | ✅         |
| bigint    | ❌              | ✅         |
| Date      | ❌              | ✅         |
| RegExp    | ❌              | ✅         |
| Set       | ❌              | ✅         |
| Map       | ❌              | ✅         |
| Error     | ❌              | ✅         |
| URL       | ❌              | ✅         |

`superjson` 也不是万能的，比如上面的例子中，函数就不行。
