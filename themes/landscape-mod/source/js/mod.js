(function () {
  // http 跳转
  if (window.location.protocol === 'http:') {
    var url = window.location.href.replace(/http:/, 'https:')
    window.location.href = url
  }
})() 