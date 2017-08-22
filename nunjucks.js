const nunjucks = require('nunjucks');

function createEnv(path, opts) {
    let autoescape = opts.autoescape && true;  //危险字符串自动转义
    let noCache = opts.noCache || false;        //每次都不要使用缓存并重新编译模板
    let watch = opts.watch || false;            //重新加载模板（服务器端）
    let throwOnUndefined = opts.throwOnUndefined || false;  //输出空值/未定义值时会抛出错误
    let env = new nunjucks.Environment(                     // 模板处理对象
            new nunjucks.FileSystemLoader(path, {
                noCache: noCache,
                watch: watch,
            }), {
                autoescape: autoescape,
                throwOnUndefined: throwOnUndefined
            });
    if (opts.filters) {
        for (var f in opts.filters) {
            env.addFilter(f, opts.filters[f]);
        }
    }
    return env;
}

var env = createEnv('views', {
    watch: true,
    filters: {
        hex: function (n) {
            return '0x' + n.toString(16);
        }
    }
});

// var s = env.render('hello.html', { name: '<script>alert("小明")</script>' });
// console.log(s);
module.exports = env;