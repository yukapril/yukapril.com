---
title: "嵌套结构的处理与渲染"
date: 2017-09-21 21:45:00 GMT+0800
tags: [ js, render ]
---

公司组件库项目，有个同事做菜单功能，处理迭代弄不好。我写了一个简单的 DEMO，同时放出来参考：

<!-- truncate -->

> 在这里查看效果 [JSFiddle](https://jsfiddle.net/yukapril/egogr2h1/)

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Test</title>
    <style>
        .lv1 {
            margin: 10px 10px;
            border: 1px solid #ccc;
        }

        .lv2 {
            margin: 10px 20px;
            border: 1px solid #ccc;
        }

        .lv3 {
            margin: 10px 30px;
            border: 1px solid #ccc;
        }
    </style>
</head>
<body>
<div id="nav">
    <div data-color="red">1</div>
    <div>
        <div data-color="blue">2 - 1</div>
        <div data-color="purple">2 - 2</div>
        <div data-color="black">2 - 3</div>
    </div>
    <div>
        <div data-color="magenta">3 - 1</div>
        <div>
            <div data-color="green">3 - 2 - 1</div>
            <div data-color="brown">3 - 2 - 2</div>
        </div>
    </div>
</div>

<script>
    const rootElement = el => {
        if (typeof el === 'string') {
            return document.querySelector(el)
        }
        return el
    }

    const AST = root => {
        const children = (el, lv = 0) => {
            let color = el.dataset.color || null
            let text = null
            let child = el.children
            if (child.length === 0) text = el.textContent
            return {
                color,
                text,
                lv: lv,
                children: Array.prototype.map.call(child, v => children(v, lv + 1))
            }
        }
        return children(root).children
    }

    const render = list => {
        const htmlArr = children => {
            return children.map(child => {
                let color = child.color
                let text = child.text
                let ch = child.children
                let lv = child.lv
                if (ch.length > 0) {
                    return `<div class="lv${lv}">${htmlArr(ch)}</div>`
                } else {
                    return `<div class="lv${lv}" style="color:${color}">${text}</div>`
                }
            }).join('')
        }
        return htmlArr(list)
    }

    class Test {
        constructor(el) {
            let $el = rootElement(el)
            let list = AST($el)
            console.log(list)
            let html = render(list)
            console.log(html)
            $el.innerHTML = html
        }
    }
</script>

<script>
    new Test('#nav')
</script>
</body>
</html>
```


