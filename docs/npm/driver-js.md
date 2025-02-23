# driver.js

功能非常强大的用户引导、教程和导览功能的库。适合活动等落地页使用，让用户快速了解主要页面功能。

一个简单的例子：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Driver</title>
    <script src="https://cdn.jsdelivr.net/npm/driver.js@1.0.1/dist/driver.js.iife.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/driver.js@1.0.1/dist/driver.css"/>
</head>
<body>
<div class="driver">
    <h1 class="class_1">Line 1</h1>
    <h1 class="class_2">Line 2</h1>
</div>

<script>
    const driver = window.driver.js.driver

    const driverObj = driver({
        showProgress: true,
        allowClose: false,
        steps: [
            {
                element: '.class_1',
                popover: {
                    title: 'Step 1',
                    description: 'test1',
                    side: 'left',
                    align: 'start',
                    nextBtnText: '下一个',
                    prevBtnText: '上一个',
                },
            },
            {
                element: '.class_2',
                popover: {
                    title: 'Step 2',
                    description: 'test2',
                    side: 'left',
                    align: 'start',
                    nextBtnText: '下一个',
                    prevBtnText: '上一个',
                },
            },
            {
                popover: {
                    title: 'Finished',
                    description: 'finish',
                    // 最后一个，不能改 nextBtnText，否则无法展示 doneBtnText
                    // nextBtnText: '下一个',
                    prevBtnText: '上一个',
                    doneBtnText: '结束啦',
                },
            },
        ],
    })

    driverObj.drive()
</script>
</body>
</html>
```

上手很容易，配置选项也很多，也支持事件回调。不过上面简单的例子，我就发现一个问题。最后一个 `popover`，不能配置 `nextBtnText`，否则 `doneBtnText` 不能生效。感觉这个因该算作 bug。

此外我感觉更麻烦的应该是细节 UI 调整，用这种功能的页面大概率都有细致的 UI 展现要求。`driver.js` 的解决方案主要是自定义样式类来处理。
