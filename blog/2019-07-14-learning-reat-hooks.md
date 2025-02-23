---
title: React Hooks 入门
date: 2019-07-14 10:45:00 GMT+0800
tags: [ react, hooks ]
---

学习使用 react-hooks 语法。

> Hooks are a new addition in React 16.8. They let you use state and other React features without writing a class.

<!-- truncate -->

## 现有 hooks

官方分了类，一类基础，一类扩展。其实常用的不多，主要还是 `useState`、`useEffect`、`useRef`、`useCallback`(`useMemo`和它差不多)。

**Basic Hooks**

* useState
* useEffect
* useContext

**Additional Hooks**

* useReducer
* useCallback
* useMemo
* useRef
* useImperativeHandle
* useLayoutEffect
* useDebugValue

## 使用 hooks 的规则

#### 首先是必须写到最顶层

```jsx
function Counter() {
  // 这样写是可以的，hooks 每次都必定执行到
  const [count, setCount] = useState(0)
  const [timer, setTimer] = useState(0)

  // 这样是不行的，因为 hooks 有的时候可能不会被执行
  if (condition) {
    const [data, setData] = useState([])
  }
  // ...
}
```

#### 只能在函数组件中使用

简单地说，就是要在 react 组件中使用。不能你在 react 项目中，随便写个公共方法就用 hooks，除非这个 hooks 最终用到了组件中。最终结论就是 hooks 最终必须应用到 react 组件中。

此外，传统的使用类方式的组件不可以使用 hooks，否则提示 Invalid Hook Call。

## useState

#### 常规用法

用法比较简单，直接上 demo。

```jsx
function Counter() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    setCount(count + 1)
  }

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={handleClick}>Click me</button>
    </div>
  )
}
```

#### 第二参数

要注意的是，`setState` (即上文的 `setCount`)是没有第二个参数的。

如果确实需要像以前一样的话，那么需要用到 `useEffect` 方法实现，这里先给出demo：

```jsx
function Counter() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    setCount(count + 1)
  }

  useEffect(() => {
    document.title = count
  }, [count])

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={handleClick}>Click me</button>
    </div>
  )
}
```

#### 传入函数

虽然第二个参数没有了，但是第一个参数还可以是一个函数：

```jsx
setState(state => {
})
```

比如上文的代码，可以调整为：

```jsx
const handleClick = () => {
  // setCount(count + 1)
  setCount(count => count + 1)
}
```

这么写有时候可以解决引用问题，因为它的第一个参数是函数，函数里面永远可以拿到最新的 state。不这么写的话，可能需要用 `useRef` 来解决。

#### 直接定义对象

实际使用的时候，有时候也会定义一个对象：

```jsx
const [state, setState] = useState({})
```

比如订单数据，都放在一个对象中，这样省去定义大量的 hooks。

## useEffect

处理副作用的方法。在更新改变后触发，相当于之前的 `componentDidMount` `componentDidUpdate`，不论是第一次渲染还是更新后，都会触发。

```jsx
useEffect(fn, [...])
```

第一个参数是执行函数，可以有返回值（返回函数），内容就是取消副作用（clean up）。

第二个参数是数组，相当于仅当数组的值改变后，才会触发函数。如果传入空数组，相当于后续永远不会在改变了，可以模拟 `componentDidMount`。

#### 常规用法

一个例子就是上文 `setState` 的用法。

这里给出另一个常见的例子：

```jsx
function Test() {
  const [value1, setValue1] = useState('')
  const [value2, setValue2] = useState('')
  const [allowed, setAllowed] = useState(false)

  const handleInput1Change = e => {
    setValue1(e.target.value)
  }

  const handleInput2Change = e => {
    setValue2(e.target.value)
  }

  // 传入空数组，模拟 componentDidMount
  useEffect(() => {
    document.title = '123'
  }, [])

  // 同时检测两个值
  useEffect(() => {
    setAllowed(value1 && value2)
  }, [value1, value2])

  return (
    <div>
      <input
        value={value1}
        onChange={handleInput1Change}
        style={{border: '1px solid #333'}}
        placeholder="username"
      />
      <br/>
      <input
        value={value2}
        onChange={handleInput2Change}
        style={{border: '1px solid #333'}}
        placeholder="password"
      />
      <br/>
      <p>allowed:{allowed ? 'yes' : 'no'}</p>
    </div>
  )
}
```

`useEffect` 实际用起来，最常用的就是传空数组，模拟 `componentDidMount`。剩下传入参数的时候，和 vue 的 `watch` 差不多。

#### 返回函数

再给出一个需要取消副作用的例子（例子的实际意义不好，仅做代码演示）：

```jsx
// 仅当输入内容长度均大于5位后，才考虑自动提交数据
// 并在提交前提供3秒延迟
// 这个例子就是常见的防抖
useEffect(() => {
  setAllowed(value1 && value2)
  let ref = null
  if (value1.length >= 5 && value2.length >= 5) {
    console.log('启动定时器打印log')
    ref = setTimeout(() => {
      console.log('log', value1, value2)
    }, 3000)
  }
  return () => {
    console.log('清理定时器')
    clearTimeout(ref)
  }
}, [value1, value2])
```

返回清理函数的情况，大部分是处理定时器或者发出一个 ajax 请求后，需要中断处理的情况。

目前来看我在项目里面还没用到，可能是我的项目中，没有得到数据，页面不可能跳转到下一步，也就不存在需要清理副作用的情况。

## useRef

`useRef` 在 hooks 中，有两种用法。第一种是常规的 ref，第二种是用于穿透闭包。

通过 `useRef` 可以创建一个对象，可以理解为函数内的全局变量。为了能做到实时引用，所以他必须是一个对象。具体的引用值，都存在了 `current` 属性上，这就使得它可以穿透闭包。

#### 常规用法

先说第一种常规 ref 用法，和之前写的 `React.createRef` 一致：

```jsx
function Test() {
  const [isFocus, setIsFocus] = useState(false)
  const [value, setValue] = useState('')

  const inputRef = useRef(null)

  const handleInputChange = e => {
    setValue(e.target.value)
  }

  const handleInputFocus = () => {
    setIsFocus(true)
  }

  const handleInputBlur = () => {
    setIsFocus(false)
  }

  const handleBtnClick = () => {
    inputRef.current.focus()
  }

  return (
    <div>
      <input
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        ref={inputRef}
        style={{border: '1px solid #333'}}
      />
      <button onClick={handleBtnClick} style={{border: '1px solid #333'}}>
        click for focus
      </button>
      <br/>
      <p>focus:{isFocus ? 'yes' : 'no'}</p>
    </div>
  )
}
```

#### 其他用法

来说 ref 的第二种用法。

首先看一个 demo：

```jsx
function Test() {
  const [count, setCount] = useState(0)

  const handleAddClick = e => {
    setCount(count + 1)
  }

  const handleAlertClick = () => {
    setTimeout(() => {
      alert(count)
    }, 3000)
  }

  return (
    <div>
      <span>counter:{count}</span>&nbsp;&nbsp;
      <button onClick={handleAddClick} style={{border: '1px solid #333'}}>
        +1
      </button>
      <br/>
      <br/>
      <button onClick={handleAlertClick} style={{border: '1px solid #333'}}>
        alert
      </button>
    </div>
  )
}
```

操作结果为：

* 点击 +1 按钮，增加计数器，增加到 3
* 点击 alert，3秒后显示计数器的值
* 点击 +1 按钮，增加计数器，增加到 5
* 3秒到了，此时提示框显示了 3

或许和你想的不一样，为什么不是显示 5？

简言之，再点击 alert 按钮时候，此时计数器值是 3。**hooks 会缓存此状态！**所以3秒过后，就是提示 3 了。

解决方法很简单，如果不是 react 项目，那么我们肯定用一个对象存储数据，这样 3 秒后提示内容，读取对象中的属性就好了。因为对象是传址（非传值）的。

react 亦如此。我们使用 useRef 来实现，其中的值保存在 `current` 中。

```jsx
function Test() {
  const [count, setCount] = useState(0)
  const valueRef = useRef()

  const handleAddClick = e => {
    const newVal = count + 1
    setCount(newVal)
    valueRef.current = newVal
  }

  const handleAlertClick = () => {
    setTimeout(() => {
      alert(valueRef.current)
    }, 3000)
  }

  return (
    <div>
      <span>counter:{count}</span>&nbsp;&nbsp;
      <button onClick={handleAddClick} style={{border: '1px solid #333'}}>
        +1
      </button>
      <br/>
      <br/>
      <button onClick={handleAlertClick} style={{border: '1px solid #333'}}>
        alert
      </button>
    </div>
  )
}
```

## useContext

`useContext` 主要解决的是组件数据透传。比如父组件要定义一些数据，但是最终要在很深层次的子组件中使用，这时候用 `useContext` 非常方便。

```jsx
const DataContext = React.createContext()

function Child() {
  return (
    <DataContext.Consumer>
      {value => {
        return (
          <div>
            <p>name: {value.name}</p>
            <p>age: {value.age}</p>
          </div>
        )
      }}
    </DataContext.Consumer>
  )
}

function Parent() {
  const [data, setData] = useState({name: 'tim', age: 20})
  return (
    <DataContext.Provider value={data}>
      <div>
        <Child/>
      </div>
    </DataContext.Provider>
  )
}
```

唯一要说明的就是，`Provider` 的传值属性必须是 `value`。所以要么传一个值，要么传一个对象。

## useReducer

`useReducer` 使用起来非常简单，不管是否接触过 Redux，都能容易上手。

```jsx
const initialState = {count: 0}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1}
    case 'incrementAny':
      return {count: state.count + action.count}
    case 'decrement':
      return {count: state.count - 1}
    default:
      return {count: state.count}
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <div>
      Count: {state.count}
      <br/>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'incrementAny', count: 5})}>
        +5
      </button>
    </div>
  )
}
```

实际使用中，当多个组件公用一个状态时候，会用得到。

## useCallback / useMemo

使用 useCallback / useMemo 来缓存函数，提升执行效率。

#### 常规用法

下文例子中，输入数字，进行加法计算。输入空格，触发内容改变，但是数值没有变化。

不做处理的情况下，每次输入，均会触发加法计算。

使用了，`useMemo` 后，相同的值，只会计算一次。后续不会触发加法计算。

```jsx
function Counter() {
  const [val1, setVal1] = useState(0)
  const [val2, setVal2] = useState(0)

  const add = (a, b) => {
    console.log('add', a, b)
    return a + b
  }

  const memoized = useCallback(add(val1, val2), [val1, val2])

  const handleInput1Change = e => {
    const val = Number(e.target.value)
    console.log('input1:', val)
    setVal1(val)
    memoized()
  }
  const handleInput2Change = e => {
    const val = Number(e.target.value)
    console.log('input2:', val)
    setVal2(val)
  }

  return (
    <div>
      <input onChange={handleInput1Change} value={val1}/>
      <input onChange={handleInput2Change} value={val2}/>
      <p>sum:{memoized}</p>
    </div>
  )
}
```

如果要用 `useCallback`，上文需要调整一点就可以了。官方给出了两者关系，如下：

```jsx
useCallback(fn, deps)
useMemo(() => fn, deps)
```

需要注意的是，`useMemo` 的第一个参数是个函数，**并且需要进行返回**！

```jsx
// const memoized = useCallback(add(val1, val2), [val1, val2])
const memoized = useMemo(() => {
  return add(val1, val2)
}, [val1, val2])
```

## 小结

根据我这一段时间的使用，基本上没遇到太多坑，也就是参考上文的这些处理方法基本都可解决。

唯独要注意的是，hooks 里面不要使用 `setInterval`，一言难尽，建议看 react 原作者文章（[见此](https://overreacted.io/zh-hans/making-setinterval-declarative-with-react-hooks)），解释的很清晰，也有直接用的
`useInterval` 方案。
