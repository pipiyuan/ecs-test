let booklistDesc = {
	id: {type: Number, default: 2},
	time: {type: Date, default: Date.now},
	title: {type: String, default: "新书抢鲜"},
	books: [{
		id: {type: Number},
		name: {type: String},
		url: {type: String},
		imageUrl: {type: String},
		author: {type: String},
		intro: {type: String},
		labels: {type: Array},		
	}]
}
module.exports = booklistDesc;
