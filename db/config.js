const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const config = {
    ip: '120.77.81.108',
    port: '27017',
    database: 'qidian',
    username: 'Test',
    password: '101010',

}

let URL = `mongodb://${config.username}:${config.password}@${config.ip}:${config.port}/${config.database}`;

// mongoose.connect(URL);
// mongoose.connect("mongodb://120.77.81.108:27017/test");
mongoose.connect(URL, function(error) {
    if (error) {
        console.log("erorr", error);
    } else {
        console.log("success!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    }
});

const db = mongoose.connection;

let files = fs.readdirSync(__dirname + '/models');
//数据结构模型 集合； models文件下文件的文件名 即为模型名
let schemaModels = {};  
files.forEach(file => {
    let name = path.basename(file, '.js');
    let schemaName = new mongoose.Schema(require(__dirname + '/models/' + file));
    schemaModels[name] = mongoose.model(name, schemaName);
})
// console.log(schemaModels.performance)

module.exports = schemaModels;