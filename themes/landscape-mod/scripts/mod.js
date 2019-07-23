const config = hexo.config

// 调整分页数
config.archive_generator.per_page = 50
config.category_generator.per_page = 20
config.tag_generator.per_page = 20

// 调整生成链接的格式，兼容原有 jekyll 格式
hexo.extend.filter.register('post_permalink', data => {
  let newData = data.substring(5)
  newData = newData.replace(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/, '$1/$2/$3/$4')
  return newData
})