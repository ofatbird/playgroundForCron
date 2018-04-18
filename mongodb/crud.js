const fs = require('fs')
const puppeteer = require('puppeteer')
const jsonfile = require('jsonfile')
const chalk = require('chalk')
const to = require('await-to-js').to
const base64 = require('base-64')
const utf8 = require('utf8')

const mongoose = require('mongoose');
const Store = require('./model')

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// @format {String}
function base64zh(value, format) {
    if (format === 'e') {
        return base64.encode(utf8.encode(value))
    } else if (format === 'd') {
        return utf8.decode(base64.decode(value))
    } else {
        return value
    }
}

// connect mongodb
function connectMongo(excute) {
    // mongodb://admin:785689@cluster0-shard-00-00-koeuy.mongodb.net:27017,cluster0-shard-00-01-koeuy.mongodb.net:27017,cluster0-shard-00-02-koeuy.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin
    // mongodb://admin:785689@lescluster-shard-00-00-njhnj.mongodb.net:27017,lescluster-shard-00-01-njhnj.mongodb.net:27017,lescluster-shard-00-02-njhnj.mongodb.net:27017/test?ssl=true&replicaSet=lesCluster-shard-0&authSource=admin
    mongoose.connect('mongodb://admin:785689@lescluster-shard-00-00-njhnj.mongodb.net:27017,lescluster-shard-00-01-njhnj.mongodb.net:27017,lescluster-shard-00-02-njhnj.mongodb.net:27017/test?ssl=true&replicaSet=lesCluster-shard-0&authSource=admin');

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



// 格式化时间
function getFormatTime() {
    const date = new Date()
    return `${date.toDateString()} ${date.toTimeString()}`
}
// 随机
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
// 查询是否存在
function findByNumber(number) {
    return new Promise((resolve, reject) => {
        Store.find({
            number
        }, (err, docs) => {
            if (err) {
                reject(err)
            } else {
                resolve(docs)
            }
        })
    })
}

function save2Atlas(bson) {
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

function save2log(errlog) {
    fs.writeFileSync('./err.log', errlog, {
        flag: 'a'
    })
}

async function filter(resources) {
    const tmp = []
    for (let i = 0; i < resources.length; i++) {
        const number = resources[i].number
        const doc = await findByNumber(number)
        if (!doc.length) {
            tmp.push(resources[i])
        }
    }
    return tmp
}

function fetchUpdate(start) {
    const mainPrefix = base64.decode('aHR0cHM6Ly93d3cuamF2YnVzLnVzL2dlbnJlLzFk')
    let count = start
    let indexDB = []

    const endpoint = start + 1
    return new Promise((resolve, reject) => {
        puppeteer.launch({
            timeout: 15000
        }).then(async browser => {
            while (count < endpoint) {
                const page = await browser.newPage();
                await page.setExtraHTTPHeaders({
                    cookie: `__cfduid=d34894136e6a078316ad17b08ac9225441509805299; HstCfa3034720=1509805537073; c_ref_3034720=https%3A%2F%2Fwww.javbus.xyz%2F; HstCmu3034720=1522664334418; PHPSESSID=dcssk4vmu4885n20vbu3hprj02; existmag=all; HstCla3034720=1522750659276; HstPn3034720=19; HstPt3034720=599; HstCnv3034720=33; HstCns3034720=37; __dtsu=D9E9B66BE3CDFD59CC6B4854020D4EC7`
                })
                // const uri = count > 1 ? mainPrefix + '/' + count : mainPrefix.replace('/page','')
                // console.log(uri)
                const [networkErr] = await to(page.goto(mainPrefix + '/' + count, {
                    waitUntil: 'domcontentloaded'
                }))
                if (networkErr) {
                    await page.close()
                    console.log(networkErr)
                    console.log(chalk.yellow('network error'))
                    continue
                }
                const [error, resources] = await to(page.evaluate(() => {
                    const items = document.querySelectorAll('.movie-box')
                    return [].map.call(items, ele => {
                        const info = ele.querySelector('img');
                        const date = ele.querySelectorAll('date')
                        return {
                            cover: info.getAttribute('src'),
                            title: info.getAttribute('title'),
                            number: date[0].innerHTML,
                            date: date[1].innerHTML
                        }
                    })
                }))
                await page.close()
                if (error || (!error && !resources.length)) {
                    console.log(error, resources.length)
                    break;
                }
                // const newRes = await filter(resources)
                indexDB = indexDB.concat(resources)
                // console.log(count, newRes.length)
                // if (newRes.length < 30) {
                //     break
                // }
                count++
                // await sleep(getRandomArbitrary(1, 5) * 1000)
            }
            let bson = {}
            indexDB.forEach((ele, index) => {
                bson[index] = ele
            })
            await browser.close()
            jsonfile.writeFileSync('../json/updateThread.json', bson)
            resolve('done')
        })
    })
}

function fetchByGenre(uri, index) {
    let count = 1
    let indexDB = []
    // process.on('exit', () => {
    //     console.log(chalk.gray(`You exit at ${count}`))
    // })
    return new Promise((resolve, reject) => {
        puppeteer.launch().then(async browser => {
            while (true) {
                const page = await browser.newPage();
                const url = count > 1 ? uri + '/' + count : uri
                const [networkErr] = await to(page.goto(url, {
                    waitUntil: 'domcontentloaded'
                }))
                if (networkErr) {
                    console.log(networkErr)
                    console.log(chalk.yellow('network error'))
                    continue
                }
                const [error, resources] = await to(page.evaluate(() => {
                    const items = document.querySelectorAll('.movie-box')
                    return [].map.call(items, ele => {
                        const info = ele.querySelector('img');
                        const date = ele.querySelectorAll('date')
                        return {
                            cover: info.getAttribute('src'),
                            title: info.getAttribute('title'),
                            number: date[0].innerHTML,
                            date: date[1].innerHTML
                        }
                    })
                }))
                await page.close()
                if (!error && !resources.length) {
                    break;
                }
                indexDB = indexDB.concat(resources)
                console.log(`${count} done`)
                count++
                await sleep(getRandomArbitrary(1, 3) * 1000)
            }
            let bson = {}
            indexDB.forEach((ele, index) => {
                bson[index] = ele
            })
            await browser.close()
            jsonfile.writeFileSync('../json/genre_' + index + '.json', bson)
            // db.close()
            resolve('DONE')
        })
    })

}

function saveData(db) {
    let networkErrFlag = 0
    let start = 0
    let succ = 0;
    // let counter = 4054;
    const bsonDB = jsonfile.readFileSync(`../json/updateThread.json`)
    const pool = Object.keys(bsonDB).map(index => bsonDB[index])
    const breakpoint = pool.length;
    console.log(pool.length)
    const bson = {}
    process.on('exit', () => {
        console.log(`Program exit at ${chalk.gray(start)}`)
    })
    puppeteer.launch({ /*headless: false*/ }).then(async browser => {
        // console.log(pool)
        while (start < breakpoint) {
            const {
                number,
                cover
            } = pool[start]
            const uri = base64.decode('aHR0cHM6Ly93d3cuamF2YnVzLnVz') + '/' + number
            const doc = await findByNumber(number)
            if (doc.length) {
                console.log(`We updated this ${start}, no more upload again`)
                console.log(number === doc[0].number)
                start++
                continue
            }
            const page = await browser.newPage();
            const [networkErr] = await to(page.goto(uri, {
                waitUntil: 'networkidle0'
            }))
            if (networkErr) {
                await page.close()
                console.log(chalk.yellow('Network Error'))
                networkErrFlag++
                if (networkErrFlag > 3) {
                    console.log(`${chalk.red(start)} is a shit, something is broken here`)
                    save2log(`${getFormatTime()}: ${start}=>${number} is a shit, Network is broken here \n`)
                    networkErrFlag = 0
                    start++
                }
                continue
            }
            if (networkErrFlag) networkErrFlag = 0
            const htmlStr = await page.content()

            const html = await page.evaluate(() => {
                const infos = document.querySelector('.info')
                const mags = document.querySelector('#magnet-table')
                let list = []
                let infostr = ''

                // const $$ = Array.isArray(element.magnet) ? cheerio.load(element.magnet[0]) : cheerio.load(element.magnet)
                // const $ = cheerio.load(element.info)
                if (mags.innerText.indexOf('暫時沒有') > -1) {
                    list = null
                } else {
                    const atag = [].filter.call(mags.querySelectorAll('a'), element => {
                        return element.className.indexOf('btn') == -1
                    })
                    const star = [].slice.call(infos.querySelectorAll('.star-name>a'))
                    const info_p = infos.querySelectorAll('p')
                    let htmlstr = ''
                    for (let i = 0; i < 3; i++) {
                        const inner = info_p[i].innerText.replace(/\&\#[0-9a-z]{5}\;/ig, '')
                        infostr += `<p>${inner}</p>`
                    }
                    if (star.length) {
                        star.forEach(ele => {
                            htmlstr += `<span> ${$(ele).text()} </span>`
                        })
                    } else {
                        htmlstr = ` <span> 未知 </span>`
                    }
                    infostr += `<p><span>演员:</span>${htmlstr}</p>`
                    for (let i = 0; i < atag.length; i += 3) {
                        list.push({
                            name: atag[i].innerText.replace(/\s/g, ''),
                            size: atag[i + 1].innerText.replace(/\s/g, ''),
                            href: unescape(atag[i].getAttribute('href')),
                        })
                    }
                }

                return {
                    info: infostr,
                    magnet: list
                }
            })
            if (!html.magnet) {
                await page.close()
                console.log(chalk.hex('#cccccc')('There is nothing here'))
                start++
                continue
            }
            await page.close()
            console.log(chalk.gray(start))
            // console.log(html)
            /*save into mongodb atlas*/
            const [saveErr, saveSucc] = await to(save2Atlas(Object.assign({
                number,
                pic: cover,
                fake: false,
                // insertDate: Number(new Date('03/05/2018').getTime()) + (pool.length * 200 + start),
                insertDate: Number(Date.now())
            }, html)))
            if (saveErr) {
                console.log(saveErr)
                save2log(`${getFormatTime()}: ${saveErr};failed to insert data ${number}\n`)
            } else {
                succ++
                console.log(saveSucc)
            }
            start++
            await sleep(getRandomArbitrary(1, 3) * 1000)
        }
        console.log(`There are totally ${succ} saved`)
        await browser.close()
        db.close()
    })
}

async function launch() {
    const index = 35
    const list = jsonfile.readFileSync('../json/genre.json')
    for (let i = index; i < 50; i++) {
        console.log(`Current genre ${i}`)
        if (list[i].tag === base64zh('5ZCM5oCn', 'd')) {
            continue
        }
        await fetchByGenre(list[i].uri, i)
    }
}

// launch()
// fetchUpdate(4).then(() => {
//     connectMongo(saveData)
// })

// connectMongo(saveData)