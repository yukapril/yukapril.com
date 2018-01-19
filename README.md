# jekyll-theme-simack

效果参考这里:[http://yukapril.com/categories/simack.html](http://yukapril.com/categories/simack.html)

## 安装流程

1. 安装ruby
2. 安装jekyll`gem install jekyll`
3. 安装jekyll-paginate分页插件`gem install jekyll-paginate`
4. 进入代码目录，执行`jekyll s`启动。


## 问题
* 目前发现 windows 可能4000端口占用，可以换成4001或者其他的。
* 各个系统安装ruby和jekyll会有所不同。
* windows下无法打开文章，地址中带有中文的情况 [参见这里](http://www.oschina.net/question/1396651_132154)
    
    问题主要处理方式大致如下：

    > 在ruby的webrick\httpservlet\filehandler.rb 两个地方转成 UTF-8 就可以本地预览了。
    >
    > 第一处：
    >
    > path = req.path_info.dup.force_encoding(Encoding.find("filesystem"))
    >
    > path.force_encoding("UTF-8") #加入这一行
    >
    > if trailing_pathsep?(req.path_info)
    >      
    > 第二处：
    >
    > while base = path_info.first
    >
    > break if base == "/"
    >
    > base.force_encoding("UTF-8") #加入这一行
    >
    > break unless File.directory?(File.expand_path(res.filename + base))
    
    问题原因：ruby读取系统默认编码。需要修改为UTF-8。 

* windows下`jekyll s`无法自动监听文件改动，每次要手动重启。
