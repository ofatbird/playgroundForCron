const mongoose = require('mongoose');
const Store = require('./model')

mongoose.connect('mongodb://admin:785689@cluster0-shard-00-00-koeuy.mongodb.net:27017,cluster0-shard-00-01-koeuy.mongodb.net:27017,cluster0-shard-00-02-koeuy.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');

const db = mongoose.connection;

db.on('error', (msg) => {
    console.log('Error mesage')
    console.log(msg)
})

db.once('open', () => {
    console.log('Connect to MongoDB')
    // db.close()
})

// const item = new Store({
//     number: '12345',
//     pic: 'String',

// })

// item.save((err, docs) => {
//     if (err) return console.log(err)
//     console.log(docs)
//     db.close()
// })
// 
Store.find({ number: '123456'}, (...args) => {
    console.log(args)
    db.close()
})