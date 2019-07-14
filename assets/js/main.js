'use strict'

/**
 * 外链点击统计
 */
var clickInfo = function () {
  var els = document.querySelectorAll('a[target="_blank"]')

  Array.prototype.forEach.call(els, function (el) {
    el.addEventListener('click', function (e) {
      _hmt.push(['_trackEvent', 'link', e.target.innerText, e.target.href])
    }, false)
  })
}

clickInfo()
