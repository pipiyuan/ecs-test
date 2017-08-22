const Koa = require('koa');
const Cheerio = require('cheerio');
const Request = require('request');
const Moment = require('moment');
// 注意require('koa-router')返回的是函数:
const router = require('koa-router')();
// koa-bodyparser 解析原始request请求，然后，把解析后的参数，绑定到ctx.request.body中
const bodyParser = require('koa-bodyparser');

const nunjucks = require('./nunjucks.js');
const BookList = require('./db/config.js').bookList;
const BookTopList = require('./db/config.js').bookTopList;
const Book = require('./db/config.js').book;
// 导入controller middleware:
// const controllers = require('./controller');

const app = new Koa();

router.get('/', async(ctx, next) => {
	ctx.response.body = nunjucks.render('index.html');
})

// log request URL:
let rootUrl = 'http://m.qidian.com/'
router.get('/booklist', async(ctx, next) => {
    console.log(`.....................`);
    Request(rootUrl, (error, res, body) => {
    	let data = [];
    	let id = 1;
        if (!error && res.statusCode == 200) {
            $ = Cheerio.load(body);
            $('.module-slide-ol .module-slide-li').each((index, value) => {

            	data.push({
            		id: id++,
            		url: `${rootUrl}${$(value).find('a').attr('href')}`,
            		imageUrl:`${$(value).find('img').attr('src')}`,
            		name: $(value).find('.module-slide-caption').text(),
            		author: $(value).find('.gray').text(),
            	})
            })
        }
        // console.log(BookList);
    	BookList.update(
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
		)	
        /*BookList.create(
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
		)	*/
    });
    ctx.response.body = {name: 'ok'};
});

router.get('/booktoplist', async(ctx, next) => {
    console.log(`.....................`);
    Request(rootUrl, (error, res, body) => {
    	let data = [];
    	let id = 1;
        if (!error && res.statusCode == 200) {
            $ = Cheerio.load(body);
            $('.book-ol-normal .book-li').each((index, value) => {

            	data.push({
            		id: id++,
            		url: `${rootUrl}${$(value).find('a').attr('href')}`,
            		imageUrl:`${$(value).find('img').attr('src')}`,
            		name: $(value).find('.book-title').text(),
            		author: $(value).find('.book-author').text(),
            		intro: $(value).find('.book-desc').text(),
            		labels: [
            			{tag: $(value).find('.book-meta-r .gray').text()},
            			{tag: $(value).find('.book-meta-r .red').text()},
            			{tag: $(value).find('.book-meta-r .blue').text()},
            		],
            	})
            })
        }
        // console.log(BookList);
    	BookTopList.update(
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
		)	
        /*BookTopList.create(
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
		)	*/
    });
    ctx.response.body = {name: 'ok'};
});

router.get('/book', async(ctx, next) => {
	let list = await BookList.findOne();
  
  	for(let item of list.books){
  		Book.create(
	  		{
	  			time: Moment(new Date()).add('hours', 8).format('YYYY-MM-DD HH:mm:ss'),
	  			booName: item.name,
	  			author: item.author,
	  			url: item.url,
	  			imageUrl: item.imageUrl,
	  			chapters: await getChapters(item.url),
	  			// chapters: [],
	  		},(err, data) => {
				if (!err) {
					console.log('save is ok！！！！！！！！！！！！！！！！')
				}else{
					console.error(err);
				}
			}
  		)
  	}
  	 // let aaa = await getChapters('http://m.qidian.com//book/1004141708')
  	 // console.log(aaa[1])
  	console.log('is ok.....................')
    ctx.response.body = {name: 'ok'};
});

function getChapters(url){

	return new Promise((resolve, reject) => {
		Request(`${url}/catalog`, (error, res, body) => {
			let data = [];
	    	let id = 1;
	        if (!error && res.statusCode == 200) {
	            $ = Cheerio.load(body);
	            let i = 1;

	            $('#catelogX .jsChapter').each(async(index, value) => {
	            	let contentId = $(value).find('a').attr('data-chapter-id');
	            	i++;
	            	data.push({
	            		id: contentId,
	            		title: $(value).find('span').text(),
	            		content: await getContent(`${url}/${contentId}`, i),
	            	});

	            	// each 内为 async 所以 只有判断 $('#catelogX .jsChapter')和data的长度相等后 在resolve
	            	if ($('#catelogX .jsChapter').length === data.length) {
	            		console.log('content finishied........')
	        			resolve(data);
	            	}
	            })
	        }else{
	        	reject(error)
	        }
		})
	})

	/*Request(`${url}/catalog`, (error, res, body) => {
		let data = [];
    	let id = 1;
        if (!error && res.statusCode == 200) {
            $ = Cheerio.load(body);
            $('#catelogX .jsChapter').each((index, value) => {
            	let contentId = $(value).find('a').attr('data-chapter-id');
            	data.push({
            		id: contentId,
            		title: $(value).find('span').text(),
            		content: getContent(`${url}/contentId`),
            	})
            })
        }
        // console.log(data)
        return data;
	})*/
}

function getContent(url, index,){
	return new Promise((resolve, reject) => {
		Request(url, (error, res, body) => {
			let content = '';
	        if (!error && res.statusCode == 200) {
	            $ = Cheerio.load(body);
	            content = trim($('#readContent .read-section').html());
	            console.log('content is ok..................'+index)
	        	resolve (content);
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