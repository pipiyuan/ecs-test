// 模型数据结构
let  books = {
	id: {type: Number, default: 1},
	chapters: [{
		chapterId: {type: Number},
		title: {type: String},
		content: {type: String},
	}]
}
module.exports = books;


