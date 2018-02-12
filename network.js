const puppeteer = require('puppeteer')
const jsonfile = require('jsonfile')
const chalk = require('chalk')
const to = require('await-to-js').to
const base64 = require('base-64')
//aHR0cHM6Ly93d3cuamF2YnVzLnVzL3N0YXIvOTJs
//aHR0cHM6Ly93d3cuamF2YnVzLnVzL0JDUFYtMDky
//aHR0cHM6Ly93d3cuamF2YnVzLnVzL3BhZ2Uv
//aHR0cHM6Ly93d3cuamF2YnVzLnVzL2FjdHJlc3Nlcw==
// aHR0cHM6Ly93d3cuamF2YnVzLnVzL3BhZ2U=  main page
const text = base64.decode('aHR0cHM6Ly93d3cuamF2YnVzLnVzL3N0YXIvOTJs')
const starPrefix = base64.decode('aHR0cHM6Ly93d3cuamF2YnVzLnVzL3N0YXIv')
const mainPrefix = base64.decode('aHR0cHM6Ly93d3cuamF2YnVzLnVzL3BhZ2U=')
const prefix = base64.decode('aHR0cHM6Ly93d3cuamF2YnVzLnVzLw==')
const stored = jsonfile.readFileSync('./json/mainThread.json')
let count = 1
let indexDB = []
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
puppeteer.launch().then(async browser => {
    while (true) {
        const page = await browser.newPage();
        // page.on('response', async response => {
        //     const req = response.request()
        //     if (req.resourceType === 'xhr' && response.url.indexOf('ajax') > -1) {
        //           console.log(await response.text())
        //     }
        // })
        const [networkErr] = await to(page.goto(mainPrefix + '/' + count, {
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
        console.log(count)
        count++
        
        await sleep(getRandomArbitrary(1, 5) * 1000)
    }
    let bson = {}
    indexDB.forEach((ele, index) => {
        bson[index] = ele
    })
    // jsonfile.writeFileSync('./json/mainThread1.json', bson)
    // console.log('films: '+indexDB.length)
    /*==================getMovByTheme====================*/
    // const bsonDB = jsonfile.readFileSync('./json/mainThread.json')
    // const pool = Object.keys(bsonDB).map(index => bsonDB[index])
    // const bson = {}
    // let networkErrFlag = 0
    // let start = 0;
    // const breakpoint = 10;
    // // console.log(pool)
    // while (start < breakpoint) {
    //     const { number } = pool[start]
    //     const uri = 'https://www.javbus.us/' + number
    //     // console.log(uri)
    //     const page = await browser.newPage();
    //     const [networkErr] = await to(page.goto(uri, {
    //         waitUntil: 'networkidle0'
    //     }))
    //     if (networkErr) {
    //         console.log(chalk.yellow('Network Error'))
    //         networkErrFlag++
    //         if (networkErrFlag > 4) {
    //             console.log(`${chalk.red(start)} is a shit`)
    //             break
    //         }
    //         continue
    //     }
    //     if (networkErrFlag) networkErrFlag = 0
    //     const html = await page.evaluate(() => {
    //         const infos = document.querySelector('.info')
    //         const mags = document.querySelector('#magnet-table')
    //         return {
    //             info: infos.outerHTML,
    //             mags: mags.outerHTML
    //         }
    //     })
    //     await page.close()
    //     console.log(chalk.gray(start))
    //     bson[start++] = Object.assign({
    //         title: number
    //     }, html)
    //     await sleep(getRandomArbitrary(1,5)*1000)
    // }

    jsonfile.writeFileSync('./json/subThread1.json', bson)
    /*=============getMovByStar=============*/
    // let length = indexDB.length
    // let bson = {}
    // let bsonDB = jsonfile.readFileSync('./json/lb.json')
    // while (length > 0) {
    //     const { number } = indexDB[length - 1]
    //     const uri = prefix + number
    //     const page = await browser.newPage();
    //     const [networkErr] = await to(page.goto(uri, {
    //         waitUntil: 'networkidle0'
    //     }))
    //     if (networkErr) {
    //         console.log(chalk.yellow('Network Error'))
    //         continue
    //     }
    //     const html = await page.evaluate(() => {
    //         const items = document.querySelectorAll('td>a')
    //         return [].map.call(items, ele => {
    //             return ele.getAttribute('href')
    //         })
    //     })
    //     await page.close()
    //     console.log(chalk.gray(length))
    //     bson[--length] = {
    //         title: number,
    //         mags: html.filter((ele, index, arr) => ele && ele.indexOf('magnet') > -1 && arr.indexOf(ele) === index)
    //     }
    //     await sleep(getRandomArbitrary(1,5)*1000)
    // }
    // ******* load stars ******* //
    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }
    // const starsUri = base64.decode('aHR0cHM6Ly93d3cuamF2YnVzLnVzL2FjdHJlc3Nlcw==')
    // const jsonDB = {}
    // let pages = 601
    // while (true) {
    //     const date = new Date()
    //     console.log(chalk.green(date.toISOString() +' tick for the ' + pages + 'th time'))
    //     const page = await browser.newPage();
    //     const [networkErr] = await to(page.goto(starsUri + '/' + pages, {
    //         waitUntil: 'networkidle0'
    //     }));

    //     if (networkErr) {
    //         console.log(chalk.yellow('Network Error'));
    //         continue;
    //     }
    //     const html = await page.evaluate(() => {
    //         const items = document.querySelectorAll('.avatar-box')
    //         return [].map.call(items, ele => ({
    //             uri: ele.getAttribute('href'),
    //             name: ele.querySelector('.photo-info>span').innerHTML
    //         }))
    //         // return [].map.call(items, ele => ele.innnerHTML)
    //     })
    //     await page.close()
    //     if (!html.length) {
    //         console.log(chalk.red(`It's Done!!!`))
    //         break;
    //     }
    //     jsonDB[pages] = html
    //     if (!(pages%100)) {
    //         break
    //     }
    //     pages++
    //     await sleep(getRandomArbitrary(1,5)*1000)
    // }

    // console.log(html)
    // jsonfile.writeFileSync('./json/star'+(pages-1).toString()[0]+'.json', jsonDB, {flag: 'a'})
    // jsonfile.writeFileSync('./json/bqzx.json', bson, {flag: 'a'})
    // jsonfile.writeFileSync('./json/lbmagdetail.json', bson)
    await browser.close()
})