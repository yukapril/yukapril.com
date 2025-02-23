---
title: "GO 语言学习片段"
date: 2017-03-31 00:09:00 GMT+0800
tags: [ go, 指针 ]
---

go 语言入门笔记。

<!-- truncate -->

### 循环输出字符

```go
package main
import "fmt"

func main() {
    var max int = 25
    var c string = "G"
    
    for i := 1; i <= max; i++{
        var str = ""
        for j := 1; j <= i; j++{
            str += c
        }
        fmt.Println(str)
    }
}
```

### 函数多返回值，解构赋值

```go
package main
import "fmt"

func twoNumbers (a int, b int, c int) (x int, y int){
    x = a + b
    y = b + c
    return // 省略 x和y
}

func main() {
    m,n := twoNumbers(3, 5, 8) //等同于Javascript的解构赋值
    fmt.Printf("第一个数:%d, 第二个数:%d", m, n)
}
```

### 函数变长参数（展开运算符）

```go
package main
import "fmt"

func add (args ...int) (sum int){
    for ix,v := range args {
        fmt.Printf("index:%d,current:%d\n", ix, v)
        sum += v
    }
    return
}

func main() {
    sum := add(3, 5, 8, 9, 12)
    fmt.Printf("sum:%d", sum)
}
```

### defer推迟执行（异步执行）

```go
package main
import "fmt"

func say (str string){
    fmt.Println(str)
}

func f1 (){
    fmt.Println("entry f1...")
    defer say("defer f1")
    fmt.Println("leave f1...")
    f2()
}

func f2 (){
    fmt.Println("entry f2...")
    defer say("defer f2")
    fmt.Println("leave f2...")
}

func main() {
    fmt.Println("entry main...")
    f1()
    fmt.Println("leave main...")
}

// entry main...
// entry f1...
// leave f1...
// entry f2...
// leave f2...
// defer f2
// defer f1
// leave main...
```

需要注意的是，`leave main...`是最后执行的，推迟执行并没有在其之后。而且 defer 的函数类似栈操作，先进后出，后进先出。

### 关于指针的使用

`*` 是获取值，`&`获取地址。

声明 `*p`，此时 `*p` 是地址。

声明 `q`，此时 `q` 是值，`&q`是取址。

```go
package main
import "fmt"

// 传入普通数组
func f(a [3]int) { 
    a[2] = 5
}

// 传入指针类型
func fp(a *[3]int) { 
    a[1] = 3
}

func main() {
    var ar [3]int
    fmt.Println(ar)

    f(ar)
    fmt.Println(ar)

    fp(&ar) // 此处需要传入地址
    fmt.Println(ar)
}

// [0 0 0]
// [0 0 0]
// [0 3 0]
```
