const Koa = require('koa');
const Cheerio = require('cheerio');
const Request = require('request');
const Moment = require('moment');
// 注意require('koa-router')返回的是函数:
const router = require('koa-router')();
// koa-bodyparser 解析原始request请求，然后，把解析后的参数，绑定到ctx.request.body中
const bodyParser = require('koa-bodyparser');

const nunjucks = require('./nunjucks.js');
const BooklistSlide = require('./db/config.js').booklistSlide;
const BooklistDesc = require('./db/config.js').booklistDesc;
const Books = require('./db/config.js').books;
// 导入controller middleware:
// const controllers = require('./controller');

const app = new Koa();

router.get('/', async(ctx, next) => {
	ctx.response.body = nunjucks.render('index.html');
})

//  request URL:
let rootUrl = 'http://m.qidian.com/'; 
let classify = 'female'  			// 女生类小说
// let classify = 'male';			// 男生类小说
router.get('/booklistSlide', async(ctx, next) => {
    console.log(`.....................`);
    Request(rootUrl + classify, (error, res, body) => {
    	let data = [];
    	let id = 1;
        if (!error && res.statusCode == 200) {
            $ = Cheerio.load(body);
            $('.module-slide-ol .module-slide-li').each((index, value) => {
            	if (index < 20) {
	            	data.push({
	            		id: id++,
	            		url: `${rootUrl}${$(value).find('.module-slide-a').attr('href')}`,
	            		imageUrl:`${$(value).find('img').attr('src')}`,
	            		name: $(value).find('.module-slide-caption').text(),
	            		author: $(value).find('.module-slide-author .gray').text(),
	            	})
	            }
            })
	        // console.log(BooklistSlide);
	    	/*BooklistSlide.update(
	    		{id: 1},
		        {
					time: Moment(new Date()).add('hours', 8).format('YYYY-MM-DD HH:mm:ss'),
					books: data
				},(err, data) => {
					if (!err) {
						console.log('update is ok！！！！！！！！！！！！！！！！')
					}else{
						console.error(err);
					}
				}
			)	*/
	        BooklistSlide.create(
		        {
					time: Moment(new Date()).add('hours', 8).format('YYYY-MM-DD HH:mm:ss'),
					books: data
				},(err, data) => {
					if (!err) {
						console.log('save is ok！！！！！！！！！！！！！！！！')
					}else{
						console.error(err);
					}
				}
			)	
        }else{
        	console.error(error)
        }
    });
    ctx.response.body = {name: 'ok'};
});

router.get('/booklistDesc', async(ctx, next) => {
    console.log(`.....................`);
    Request(rootUrl + classify, (error, res, body) => {
    	let data = [];
    	let id = 1;
        if (!error && res.statusCode == 200) {
            $ = Cheerio.load(body);
            $('.book-ol-normal .book-li').each((index, value) => {
            	if (index < 20) {
	            	data.push({
	            		id: id++,
	            		url: `${rootUrl}${$(value).find('.book-layout').attr('href')}`,
	            		imageUrl:`${$(value).find('.book-layout img').attr('src')}`,
	            		name: $(value).find('.book-title').text(),
	            		author: $(value).find('.book-author').text(),
	            		intro: $(value).find('.book-desc').text().replace("作者：", ""),
	            		labels: [
	            			{tag: $(value).find('.book-meta-r .gray').text()},
	            			{tag: $(value).find('.book-meta-r .red').text()},
	            			{tag: $(value).find('.book-meta-r .blue').text()},
	            		],
	            	})
	            }
            })
	        // console.log(BooklistDesc);
	    	/*BooklistDesc.update(
	    		{id: 2},
		        {
					time: Moment(new Date()).add('hours', 8).format('YYYY-MM-DD HH:mm:ss'),
					books: data
				},(err, data) => {
					if (!err) {
						console.log('update is ok！！！！！！！！！！！！！！！！')
					}else{
						console.error(err);
					}
				}
			)	*/
	        BooklistDesc.create(
		        {
					time: Moment(new Date()).add('hours', 8).format('YYYY-MM-DD HH:mm:ss'),
					books: data
				},(err, data) => {
					if (!err) {
						console.log('save is ok！！！！！！！！！！！！！！！！')
					}else{
						console.error(err);
					}
				}
			)	
        }else{
        	console.error(error)
        }
    });
    ctx.response.body = {name: 'ok'};
});

router.get('/books', async(ctx, next) => {
	
	setTimeout(saveArticle, 1000);
    ctx.response.body = {name: 'ok'};
});


async function saveArticle(){
	let list = await BooklistSlide.findOne();
	let processing = 0; 
  	console.log(`book totall ${list.books.length}`)

  	for(let item of list.books){
  		let saveData = {
  				id: ++processing,
	  			time: Moment(new Date()).add('hours', 8).format('YYYY-MM-DD HH:mm:ss'),
	  			bookName: item.name,
	  			author: item.author,
	  			url: item.url,
	  			imageUrl: item.imageUrl,
	  			chapters: await getChapters(item.url)
	  		}
  		Books.create(saveData, (err, data) => {
			if (!err) {
				console.log('.........' + item.name + '............save is ok！article_process........' + list.books.length+'====='+ processing+ '......................');
			}else{
				console.error(err);
			}
		})
  	}
  	console.log("全部书已存储完毕................................................................................")
}

function getChapters(url){
	return new Promise((resolve, reject) => {
		Request(`${url}/catalog`, (error, res, body) => {
			let data = [];
	    	let id = 1;
	        if (!error && res.statusCode == 200) {
	            $ = Cheerio.load(body);
	            let i = 1;
	            let chapterOvj = $('#catelogX .jsChapter');

	            chapterOvj.each(async(index, value) => {
	            	let contentId = $(value).find('a').attr('data-chapter-id');
	            	i++;
	            	data.push({
	            		id: contentId,
	            		title: $(value).find('span').text(),
	            		content: await getContent(`${url}/${contentId}`, i),
	            	});

	            	// each 内为 async 所以 只有判断 $('#catelogX .jsChapter')和data的长度相等后 在resolve
	            	if (chapterOvj.length == data.length) {
	            		console.log('article content is finishied............' + chapterOvj.length + '=====' + data.length)
	        			resolve(data);
	            	}else{
	            		console.log('........chapter_processing......' + chapterOvj.length + '=====' + data.length)
	            	}
	            })
	        }else{
	        	reject(error)
	        }
		})
	})
}

function getContent(url, index,){
	return new Promise((resolve, reject) => {
		Request(url, (error, res, body) => {
			let content = '';
	        if (!error && res.statusCode == 200) {
	            $ = Cheerio.load(body);
	            content = reconvert($('#readContent .read-section').html());
	            content = trim(content);
	            console.log('a chapter is ok...'+index)
	        	resolve (content);
	        }else{
	        	reject(error)
	        }
		})
		
	})
}

function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '').replace(/&nbsp;/g, '')
}

//将Unicode转汉字
function reconvert(str) {
  str = str.replace(/(&#x)(\w{1,4});/gi, function ($0) {
    return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{1,4})(%3B)/g, "$2"), 16));
  });
  return str
}

// 在合适的位置加上：由于middleware的顺序很重要，这个koa-bodyparser必须在router之前被注册到app对象上。
app.use(bodyParser());

// 使用middleware:
app.use(router.routes());

// 在端口3000监听:
app.listen(3333);
console.log('app started at port 3333...');