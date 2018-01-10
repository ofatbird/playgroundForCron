const puppeteer = require('puppeteer')
const jsonfile = require('jsonfile')
const chalk = require('chalk')
const to = require('await-to-js').to
const base64 = require('base-64')
//aHR0cHM6Ly93d3cuamF2YnVzLnVzL3N0YXIvOTJs
//aHR0cHM6Ly93d3cuamF2YnVzLnVzL0JDUFYtMDky
//aHR0cHM6Ly93d3cuamF2YnVzLnVzL2FjdHJlc3Nlcw==
const text = base64.decode('aHR0cHM6Ly93d3cuamF2YnVzLnVzL3N0YXIvOTJs')
const starPrefix = base64.decode('aHR0cHM6Ly93d3cuamF2YnVzLnVzL3N0YXIv')
const prefix = base64.decode('aHR0cHM6Ly93d3cuamF2YnVzLnVzLw==')
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
        const [networkErr] = await to(page.goto(starPrefix + '2jv/' + count, {
            waitUntil: 'networkidle0'
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
                const date = ele.querySelector('date')
                return {
                    cover: info.getAttribute('src'),
                    title: info.getAttribute('title'),
                    number: date.innerHTML
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
        await sleep(getRandomArbitrary(1,5)*1000)
    }
    console.log('films: '+indexDB.length)
    let length = indexDB.length
    let bson = {}
    while (length > 0) {
        const { number } = indexDB[length - 1]
        const uri = prefix + number
        const page = await browser.newPage();
        const [networkErr] = await to(page.goto(uri, {
            waitUntil: 'networkidle0'
        }))
        if (networkErr) {
            console.log(chalk.yellow('Network Error'))
            continue
        }
        const html = await page.evaluate(() => {
            const items = document.querySelectorAll('td>a')
            return [].map.call(items, ele => {
                return ele.getAttribute('href')
            })
        })
        await page.close()
        console.log(chalk.gray(length))
        bson[--length] = {
            title: number,
            mags: html.filter((ele, index, arr) => ele && ele.indexOf('magnet') > -1 && arr.indexOf(ele) === index)
        }
        await sleep(getRandomArbitrary(1,5)*1000)
    }
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
    jsonfile.writeFileSync('./json/bccz.json', bson, {flag: 'a'})
    await browser.close()
})