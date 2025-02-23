# arr-diff

数组比较的工具，可以获取两个数组的差异。

```js
const diff = require('arr-diff')

const a = ['a', 'b', 'c', 'd']
const b = ['b', 'c']
const c = ['d']

console.log(diff(a, b))    //=> ['a', 'd']
console.log(diff(a, b, c)) //=> ['a']
```

`arr-diff` 可以支持多个参数。源码也很短，基本上就是利用 `for` 循环排除。

大概流程如下。

> 假设全量数据集合是 A，要排除的数据集合是 B。
>
> 从 A 里面，一个一个检出，到 B 里面进行匹配，如果相同则中断 `for` 循环，否则 `push` 当前不匹配的元素到数组。
>
> 处理完毕 A -> B，结果是 X。
>
> 如果还有数据集合 C，再跑一遍 X -> C，结果是 Y。
>
> ...

一开始我本以为是个不错的工具，试了下才发现他还有些限制。

比如上面的例子，必须 `a` 是全量数据，剩下 `b` `c` 只能是它的子集。

如果按照下面这么写，则返回空。

```js
const a = ['a', 'b', 'c', 'd']
const b = ['b', 'c']
console.log(diff(b, a))
// 返回 []
```

5年未更新，Github Star 才 37。NPM 周下载量却达到了 19M。难以理解这么简单而且还有限制的包，下载量这么出奇大。
