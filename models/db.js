const mongoose = require('mongoose');
const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/seke_db'
mongoose.connect(DB_URI, {useNewUrlParser: true});
const connection = mongoose.connection
connection.on('error',_=>{
    console.log('try reconnect');
    mongoose.connect();
})

connection.once('open', _=> {
    console.log('Connected')
})

exports.mongoose = mongoose;