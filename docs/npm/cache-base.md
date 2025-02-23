# cache-base

可以在内存中缓存数据的工具。

```js
const CacheBase = require('cache-base')
const app = new CacheBase()

app.set('a.b', 'c')

console.log(app.cache.a)    //=> { b: 'c' }
console.log(app.cache.a.b)  //=> 'c'

console.log(app.get('a'))   //=> { b: 'c' }
console.log(app.get('a.b')) //=> 'c'
```

可以方便的在内存中缓存各种数据，写入、读取都很方便。

不过是在内存中保存，页面刷新后数据会消失。我记得有的库使用 `localStorage` `indexDB` 等多维度存储，专门处理数据丢失问题。

如果是在 Node 中，就没有这个问题了。不过做后端，一般不都是用框架么，内部应该有类似 `session` 的东西。
