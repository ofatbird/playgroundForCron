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

// Store.find(), async (err, docs) => {
//     console.log(`signal:${err}`)
//     for (let i = 0;i<docs.length; i++) {
//         docs[i].insertDate = i
//         await docs[i].save()
//     }
//     db.close()
// })


function findAndUpdate(count) {
    return new Promise((resolve, reject) => {
        Store.find().skip(count).limit(1).exec(async (err, docs) => {
            if (err) return reject(err)
            docs[0].insertDate = count
            await docs[0].save()
            resolve()
        })
    })
}
async function update() {
    for (let ii = 5483; ii < 20000; ii++) {
        await findAndUpdate(ii)
        console.log(`${ii} success`)
    }
    db.close()
}

update()