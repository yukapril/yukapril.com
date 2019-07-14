(function () {
  var commons = {}

  /**
   * 代码美化
   * 代码显示行号
   */
  commons.codeBeauty = function () {
    var style = document.createElement('style')
    var str = '.markdown-body code .lineno::after{content:attr(data-value);display:inline-block;margin-right:.5rem;padding-right:.5rem;width:1.5rem;text-align:right;border-right:2px solid #999;}'
    //str += '.markdown-body pre .code-lines:hover{background:#666;width:100%}'
    style.type = 'text/css'
    if (style.styleSheet) {
      style.styleSheet.cssText = str
    } else {
      style.innerHTML = str
    }
    document.querySelector('head').appendChild(style)

    var codeList = document.querySelectorAll('.markdown-body pre code')
    for (var i = 0, len1 = codeList.length; i < len1; i++) {
      var html = codeList[i].innerHTML
      html = html.replace(/\t/g, '    ')
      var data = html.split('\n')
      data.pop()
      var newHtml = ''
      for (var j = 0, len2 = data.length; j < len2; j++) {
        newHtml += '<div class="code-lines"><span class="lineno" data-value="' + (j + 1) + '"></span>' + data[j] + '\n</div>'
      }
      codeList[i].innerHTML = newHtml
    }
  }

  /**
   * 将文章外链加入href="_blank"
   */
  commons.linkHref = function () {
    var root = document.querySelector('#J_Main')
    Array.prototype.forEach.call(root.querySelectorAll('a'), function (el) {
      if (el.href.indexOf(location.protocol + '//' + location.host) !== 0) {
        el.target = '_blank'
      }
    })
  }

  /**
   * (移动端)顶栏分类栏目列表
   */
  commons.headerCat = function () {
    var btn = document.querySelector('#J_Header_Cat')
    var cat_list = btn.parentElement.querySelector('.cat-list')
    var flag = false
    //cat_list.classList.remove('in')
    btn.addEventListener('click', function () {
      if (flag) {
        flag = false
        cat_list.classList.remove('in')
        setTimeout(function () {
          cat_list.classList.remove('show')
        }, 200)
      } else {
        flag = true
        cat_list.classList.add('show')
        setTimeout(function () {
          cat_list.classList.add('in')
        }, 0)
      }

    }, false)
  }

  /**
   * 修复代码中大括号识别问题
   */
  commons.fixBrace = function () {
    var list = document.querySelectorAll('code')
    Array.prototype.forEach.call(list, function (item) {
      if (item.innerHTML.indexOf('\\{\\{') >= 0) {
        item.innerHTML = item.innerHTML.replace(/\\{\\{/g, '{{')
      }
      if (item.innerHTML.indexOf('\\}\\}') >= 0) {
        item.innerHTML = item.innerHTML.replace(/\\}\\}/g, '}}')
      }
      if (item.innerHTML.indexOf('\\{\\%') >= 0) {
        item.innerHTML = item.innerHTML.replace(/\\{\\%/g, '{%')
      }
      if (item.innerHTML.indexOf('\\%\\}') >= 0) {
        item.innerHTML = item.innerHTML.replace(/\\%\\}/g, '%}')
      }
    })
  }

  commons.toHttps = function () {
    if (window.location.protocol === 'http:') {
      var url = window.location.href
      var newUrl = url.replace(/^http:/, 'https:')
      window.location.href = newUrl
    }
  }

  //commons.codeBeauty()
  commons.linkHref()
  commons.headerCat()
  // commons.fixBrace()
  commons.toHttps()
})()


