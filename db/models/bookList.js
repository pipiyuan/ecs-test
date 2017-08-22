// 模型数据结构
let  bookList = {
	id: {type: Number, default: 1},
	time: {type: Date, default: Date.now},
	title: {type: String, default: "热门小说"},
	books: [{
		id: {type: Number},
		name: {type: String},
		url: {type: String},
		imageUrl: {type: String},
		author: {type: String}
	}]
}
module.exports = bookList;
