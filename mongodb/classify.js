const jsonfile = require('jsonfile')

const datamag = require('../json/magnet.json')

const info = require('../json/wyfiltered.json')

const mongoose = require('mongoose')
const Store = require('./model')

function connectMongo (excute) {
  // mongodb://admin:785689@cluster0-shard-00-00-koeuy.mongodb.net:27017,cluster0-shard-00-01-koeuy.mongodb.net:27017,cluster0-shard-00-02-koeuy.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin
  // mongodb://admin:785689@lescluster-shard-00-00-njhnj.mongodb.net:27017,lescluster-shard-00-01-njhnj.mongodb.net:27017,lescluster-shard-00-02-njhnj.mongodb.net:27017/test?ssl=true&replicaSet=lesCluster-shard-0&authSource=admin
  mongoose.connect('mongodb://admin:785689@lescluster-shard-00-00-njhnj.mongodb.net:27017,lescluster-shard-00-01-njhnj.mongodb.net:27017,lescluster-shard-00-02-njhnj.mongodb.net:27017/test?ssl=true&replicaSet=lesCluster-shard-0&authSource=admin')

  const db = mongoose.connection

  db.on('error', (msg) => {
    console.log('Error mesage')
    console.log(msg)
  })

  db.once('open', () => {
    console.log('Connected to MongoDB')
    excute(db)
  })
}
const unmatched = []
const database = {}

let left = 28
Object.keys(info).forEach((el, index) => {
  const name = info[index].number.split(/[^0-9a-zA-Z]/).join('').toLowerCase()
  const magnet = []
  const avatar = info[index].avatar
  for (let i in datamag) {
    const title = datamag[i].title[0].split(/[^0-9a-zA-Z]/).join('').toLowerCase()
    let count = 0
    // if (title.indexOf(name) > -1) {
    //     magnet.push({
    //         name: datamag[i].title[0],
    //         size: datamag[i].size[0],
    //         href: datamag[i].magnet[0]
    //     })
    // }
    avatar.forEach(ele => {
      if (title.indexOf(ele.toLowerCase().replace(/\s/g, '')) > -1) {
        count++
      }
    })
    if (count > 1) {
      // console.log(avatar, info[index].number, datamag[i].title[0])
      magnet.push({
        name: datamag[i].title[0],
        size: datamag[i].size[0],
        href: datamag[i].magnet[0]
      })
    }
  }
  if (magnet.length) {
  //     // database[name] = {
  //     //     number: info[index].number,
  //     //     pic: info[index].pic,
  //     //     info: `<p>片名: ${info[index].number}</p>`,
  //     //     fake: false,
  //     //     insertDate: Number(Date.now()),
  //     //     magnet,
  //     // }
  } else {
      unmatched.push(info[index])
  }

})
console.log(unmatched)
function save2Atlas (bson) {
  return new Promise((resolve, reject) => {

    const item = new Store(bson)
    item.save(err => {
      if (!err) {
        resolve('saved')
      } else {
        reject('failed')
      }
    })
  })
}

// connectMongo(db => {
//     Object.keys(database).forEach((ele, index) => {
//         if (index) {
//             save2Atlas(database[ele]).then(msg => { console.log(msg); db.close() })
//         }
//     })
// })

// console.log(unmatched)
// const tmpJSON = {}
// unmatched.forEach((el, index) => {
//     tmpJSON[index] = el
// })
//  jsonfile.writeFileSync('../json/wyfiltered.json', tmpJSON)
