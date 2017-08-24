let booklist = {
	id: {type: Number},
	time: {type: Date, default: Date.now},
	type: {type: String, default: "slide"},
	bookName: {type: String},
	author: {type: String},
	url: {type: String},
	imageUrl: {type: String},
	intro: {type: String, default: ""},
	labels: {type: Array, default: []},		
}
module.exports = booklist;