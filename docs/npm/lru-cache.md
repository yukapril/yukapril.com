# lru-cache

可以在内存中缓存数据的工具，可以设置缓存大小及缓存时间等。

```js
// 官方例子
const LRU = require("lru-cache")
const options = {
  max: 500,
  length: function (n, key) { return n * 2 + key.length },
  dispose: function (key, n) { n.close() },
  maxAge: 1000 * 60 * 60
}
const cache = new LRU(options)

cache.set("key", "value")
cache.get("key") // "value"
```

大致是如果资源超过缓存上限，则应该把最不常用的资源移除，换成新资源。

可以想到应该是在后端做有限缓存命中时候使用。同时没有命中缓存去数据库查询。

