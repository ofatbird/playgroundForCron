const puppeteer = require('puppeteer')
const jsonfile = require('jsonfile')
const chalk = require('chalk')
const to = require('await-to-js').to
const base64 = require('base-64')
//aHR0cHM6Ly93d3cuamF2YnVzLnVzL3N0YXIvOTJs
//aHR0cHM6Ly93d3cuamF2YnVzLnVzL0JDUFYtMDky
const text = base64.decode('aHR0cHM6Ly93d3cuamF2YnVzLnVzL3N0YXIvOTJs')
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
        const [networkErr] = await to(page.goto(text + '/' + count, {
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
        await sleep(10000)
    }
    // console.log(indexDB)
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
            mags: html.filter((ele, index, arr) => ele && ele.indexOf('magnet')>-1 && arr.indexOf(ele) === index)
        }
        sleep(10000)
    }
    jsonfile.writeFileSync('./syzy.json', bson)
    await browser.close()
})