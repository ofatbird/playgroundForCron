const puppeteer = require('puppeteer');
const jsonfile = require('jsonfile')
const base64 = require('base-64')
const to = require('await-to-js').to
const url = base64.decode('aHR0cHM6Ly93d3cuamF2YnVzLnVzL3BhZ2U=')
// const bson = {}

puppeteer.launch({ timeout: 15000 }).then(async browser => {
    while (true) {
        const page = await browser.newPage()
        const [netErr] = await to(page.goto(url.replace('/page', ''), { waitUntil: 'domcontentloaded' }))
        if (!netErr) {
            console.log(await page.content())
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
            const bson = {}
            if (!error) {
                resources.forEach((ele, index) => {
                    bson[index] = ele
                })
                jsonfile.writeFileSync('./json/updateThread.json', bson)
            }
            await page.close()
            break;
        }
        console.log(netErr)
        await page.close()
    }
    await browser.close();
});