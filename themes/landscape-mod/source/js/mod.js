(function () {
  // http 跳转
  if (window.location.host.indexOf('yukapril.com') >= 0 && window.location.protocol === 'http:') {
    var url = window.location.href.replace(/http:/, 'https:')
    window.location.href = url
  }
})() 