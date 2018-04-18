const puppeteer = require('puppeteer')
const fs = require('fs')
const jsonfile = require('jsonfile')
const chalk = require('chalk')
const to = require('await-to-js').to

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

async function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let count = 1
let indexDB = []
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
puppeteer.launch().then(async browser => {
    let count = 1
    let indexDB = []
    while (count < 7) {
        const page = await browser.newPage();
        const url = 'https://www.webyoung.com/en/videos/updates/All-Categories/0/All-Pornstars/0/' + count
        const [networkErr] = await to(page.goto(url, {
            waitUntil: 'domcontentloaded'
        }))
        if (networkErr) {
            await page.close()
            console.log('continue')
            continue
        }
        const result = await page.evaluate(() => {
            const items = document.querySelectorAll('.tlcItem')
            return [].map.call(items, item => {
                const pic = item.querySelector('img').getAttribute('data-original')
                const number = item.querySelector('.tlcTitle>a').getAttribute('title')
                return {
                    number,
                    pic
                }
            })
        })
        await page.close()
        indexDB = indexDB.concat(result)
        console.log(indexDB.length)
        count++
    }
    await browser.close()
    console.log(indexDB.length)
    const indexJSON = {}
    indexDB.forEach((ele, index) => {
        indexJSON[index] = ele
    })
    
    jsonfile.writeFileSync('./json/wyinfo.json', indexJSON)
    // await page.evaluate(() => {
    //     window.scrollBy(0, window.innerHeight);
    // })
    // await timeout(5000)
    // const html = await page.content()
    // fs.writeFileSync('index.html', html)
})