# node.js 爬取起点网小说数据  
> 从起点小说网爬取爬取小说数据，存入mongodb数据库
### 程序功能
  
* 爬取书籍信和书籍正文；  
* 爬取的数据存储到mongodb

#### 依赖库：  
* request (请求加载 html页面)
* cheerio （解析 html，语法和jquery相似）
* koa2     （url请求的方式触发 request）
* mongodb  