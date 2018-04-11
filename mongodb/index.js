const cheerio = require('cheerio')
const mongoose = require('mongoose')
const Store = require('./model')
const to = require('await-to-js').to
const jsonfile = require('jsonfile')

mongoose.connect('mongodb://admin:785689@lescluster-shard-00-00-njhnj.mongodb.net:27017,lescluster-shard-00-01-njhnj.mongodb.net:27017,lescluster-shard-00-02-njhnj.mongodb.net:27017/test?ssl=true&replicaSet=lesCluster-shard-0&authSource=admin');

const db = mongoose.connection;

db.on('error', (msg) => {
    console.log('Error mesage')
    console.log(msg)
})

db.once('open', () => {
    console.log('Connect to MongoDB')
    // db.close()
})

function deleteUselessText(element) {
    const $$ = Array.isArray(element.magnet) ? cheerio.load(element.magnet[0]) : cheerio.load(element.magnet)
    const $ = cheerio.load(element.info)
    const atag = [].filter.call($$('a'), (element) => {
        return !$$(element).hasClass('btn')
    })
    const star = [].slice.call($('.star-name>a'))
    const info_p = $('p')
    const list = []
    let htmlstr = ''
    element.info = ''
    for (let i = 0; i < 3; i++) {
        const inner = $(info_p[i]).text().replace(/\&\#[0-9a-z]{5}\;/ig, '')
        element.info += `<p>${inner}</p>`
    }
    if (star.length) {
        star.forEach(ele => { htmlstr += `<span> ${$(ele).text()} </span>` })
    } else {
        htmlstr = ` <span> 未知 </span>`
    }
    element.info += `<p><span>演员:</span>${htmlstr}</p>`
    for (let i = 0; i < atag.length; i += 3) {
        list.push({
            name: $$(atag[i]).text().replace(/\s/g, ''),
            size: $$(atag[i + 1]).text().replace(/\s/g, ''),
            href: unescape($$(atag[i]).attr('href')),
        })
    }
    element.magnet = list
}


function findAndUpdate(count) {
    return new Promise((resolve, reject) => {
        Store.find().skip(count).limit(1).exec(async (err, docs) => {
            if (err) return reject(err)
            docs[0].fake = false
            // console.log(docs[0])
            await docs[0].save()
            resolve('success')
        })
    })
}
const indexDB = {}
let count = 0
async function update() {//3574
    for (let ii = 3576; ii < 3577; ii++) { //
        const [err, item] = await to(findAndUpdate(ii))
        if (err) {
            console.log(`${ii} , ${err}`)
        } else {
            console.log(`This ${ii} success...`)
        }
        // indexDB[ii] = item
    }
    // jsonfile.writeFileSync('updatedDate.json', indexDB)
    db.close()
}

update()