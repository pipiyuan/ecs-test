// 模型数据结构
let  books = {
	id: {type: Number, default: 1},
	time: {type: Date, default: Date.now},
	bookName: {type: String},
	author: {type: String},
	url: {type: String},
	imageUrl: {type: String},
	chapters: [{
		id: {type: Number},
		title: {type: String},
		content: {type: String},
	}]
}
module.exports = books;


