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
    while (count < 2) {
        const page = await browser.newPage();
        // const url = 'https://www.webyoung.com/en/videos/updates/All-Categories/0/All-Pornstars/0/' + count
        const [networkErr] = await to(page.goto('http://www.adultfilmdatabase.com/browse.cfm?type=title&page=1&dsp=30&sb=viewcount&cf=Lesbian&sf=&showgay=0&showbi=0&showtrans=0&dspas= grid', {
            waitUntil: 'domcontentloaded'
        }))
        if (networkErr) {
            await page.close()
            console.log('continue')
            continue
        }
        const result = await page.evaluate(() => {
            // const container = document.querySelector('.w3-container.w3-white.w3-round.w3-card-2')
            const items = document.querySelectorAll('.w3-container.w3-center.w3-padding')
            return [].map.call(items, item => {
                const aTag = item.querySelector('a')
                const pic = aTag.querySelector('img').getAttribute('src')
                const number = aTag.getAttribute('title')
                const href = aTag.getAttribute('href')
                return {
                    pic,
                    number,
                    href
                }
            })
            // const items = document.querySelectorAll('.tlcItem')
            // return [].map.call(items, item => {
            //     const pic = item.querySelector('img').getAttribute('data-original')
            //     const number = item.querySelector('.tlcTitle>a').getAttribute('title')
            //     const avatar = [].map.call(item.querySelectorAll('.tlcActors>a'), a => a.innerHTML)
            //     return {
            //         number,
            //         pic,
            //         avatar
            //     }
            // })
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
    jsonfile.writeFileSync('./json/database.json', indexJSON)
    // https://www.digitalplayground.com/videos/all-videos/all-pornstars/lesbian/alltime/bydate/1
    // const page = await browser.newPage();
    // // await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:57.0) Gecko/20100101 Firefox/56.0')
    // const [networkErr] = await to(page.goto('http://www.adultfilmdatabase.com/browse.cfm?type=title&page=1&dsp=30&sb=viewcount&cf=Lesbian&sf=&showgay=0&showbi=0&showtrans=0&dspas= grid', {
    //     waitUntil: 'domcontentloaded'
    // }))
    // networkidle0
    // await page.evaluate(() => {
    //     window.scrollBy(0, window.innerHeight);
    // })
    // await timeout(3000)
    // // if (networkErr)
    // const [error, html] = await to(page.content())
    // // const [error, html] = await to(page.evaluate(() => {
    // //     const wrapper = document.querySelector('html')
    // //     return wrapper.outerHTML
    // // }))
    // if (error) {
    //     console.log(error)
    // } else {
    //     fs.writeFileSync('index.html', html)
    // }

    // await browser.close()
})