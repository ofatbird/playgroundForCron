const mongoose = require('mongoose')
const Store = require('./model')

mongoose.connect('mongodb://admin:785689cui@cluster0-shard-00-00-koeuy.mongodb.net:27017,cluster0-shard-00-01-koeuy.mongodb.net:27017,cluster0-shard-00-02-koeuy.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');

const db = mongoose.connection;

db.on('error', (msg) => {
    console.log('Error mesage')
    console.log(msg)
})

db.once('open', () => {
    console.log('Connect to MongoDB')
})

module.exports = function findByNumber (number) {
    return new Promise((resolve, reject) => {
        Store.find({ number }, (err, docs) => {
            console.log(db,docs.length)
            db.close()
            if (err) { reject(err) } else { resolve(docs)}
        })
    })
}
