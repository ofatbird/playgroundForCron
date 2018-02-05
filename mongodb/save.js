const fs = require('fs')
const puppeteer = require('puppeteer')
const jsonfile = require('jsonfile')
const chalk = require('chalk')
const to = require('await-to-js').to
const base64 = require('base-64')

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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function getFormatTime() {
    const date = new Date()
    return `${date.toDateString()} ${date.toTimeString()}`
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function findByNumber(number) {
    return new Promise((resolve, reject) => {
        Store.find({ number }, (err, docs) => {
            if (err) { reject(err) } else { resolve(docs) }
        })
    })
}

function save2Atlas(bson) {
    return new Promise((resolve, reject) => {
        findByNumber(bson.number)
            .then(docs => {
                if (docs.length) {
                    resolve('We owned this number')
                } else {
                    const item = new Store(bson)
                    item.save(err => {
                        if (!err) {
                            resolve('saved')
                        } else {
                            reject('failed')
                        }
                    })
                }
            })
            .catch(err => {
                reject(err)
            })
    })
}

function save2log(errlog) {
    fs.writeFileSync('./err.log', errlog, 'a')
}

let networkErrFlag = 0
let start = 3292;
const bsonDB = jsonfile.readFileSync('../json/mainThread.json')
const pool = Object.keys(bsonDB).map(index => bsonDB[index])
const breakpoint = pool.length;
const bson = {}
puppeteer.launch().then(async browser => {
    // console.log(pool)
    while (start < breakpoint) {
        const { number, cover } = pool[start]
        const uri = base64.decode('aHR0cHM6Ly93d3cuamF2YnVzLnVz') + '/' + number
        // console.log(uri)
        const page = await browser.newPage();
        const [networkErr] = await to(page.goto(uri, {
            waitUntil: 'networkidle0'
        }))
        if (networkErr) {
            console.log(chalk.yellow('Network Error'))
            networkErrFlag++
            if (networkErrFlag > 3) {
                console.log(`${chalk.red(start)} is a shit, something is broken here`)
                save2log(`${getFormatTime()}: ${number} is a shit, Network is broken here \n`)
                networkErrFlag = 0
                start++
            }
            continue
        }
        if (networkErrFlag) networkErrFlag = 0
        const html = await page.evaluate(() => {
            const infos = document.querySelector('.info')
            const mags = document.querySelector('#magnet-table')
            return {
                info: infos.outerHTML,
                magnet: mags.outerHTML
            }
        })
        await page.close()
        console.log(chalk.gray(start))
        /*save into mongodb atlas*/
        const [saveErr, saveSucc] = await to(save2Atlas(Object.assign({
            number,
            pic: cover,
        }, html)))
        if (saveErr) {
            console.log(saveErr)
            save2log(`${getFormatTime()}: ${saveErr};failed to insert data ${number}\n`)
        } else {
            console.log(saveSucc)
        }
        start++
        await sleep(getRandomArbitrary(1, 3) * 1000)
    }

    // jsonfile.writeFileSync('./json/subThread1.json', bson)
    // jsonfile.writeFileSync('./json/star'+(pages-1).toString()[0]+'.json', jsonDB, {flag: 'a'})
    // jsonfile.writeFileSync('./json/bqzx.json', bson, {flag: 'a'})
    // jsonfile.writeFileSync('./json/lbmagdetail.json', bson)
    await browser.close()
    db.close()
})