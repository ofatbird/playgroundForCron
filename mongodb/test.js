const mongoose = require('mongoose')
const Stores = require('./model')
const findByNumber = require('./query')

// mongoose.connect('mongodb://admin:785689@cluster0-shard-00-00-twwvp.mongodb.net:27017,cluster0-shard-00-01-twwvp.mongodb.net:27017,cluster0-shard-00-02-twwvp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin')

function connectMongo(excute) {
    mongoose.connect('mongodb://admin:785689cui@cluster0-shard-00-00-koeuy.mongodb.net:27017,cluster0-shard-00-01-koeuy.mongodb.net:27017,cluster0-shard-00-02-koeuy.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');

    const db = mongoose.connection;

    db.on('error', (msg) => {
        console.log('Error mesage')
        console.log(msg)
    })

    db.once('open', () => {
        console.log('Connected to MongoDB')
        excute(db)
    })
}

// function findByNumber2(number) {
//     return new Promise((resolve, reject) => {
//         Stores.find({ number }, (err, docs) => {
//             console.log(docs.length)
//             if (err) { reject(err) } else { resolve(docs) }
//         })
//     })
// }
connectMongo((db) => {
    Stores.find({}).skip(10000).limit(1).exec((err, docs) => {
        console.log(docs[0].magnet)
        db.close()
    })
})



