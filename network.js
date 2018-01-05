const puppeteer = require('puppeteer')
const chalk = require('chalk')
const to = require('await-to-js').to
const base64 = require('base-64')
//aHR0cHM6Ly93d3cuamF2YnVzLnVzL3N0YXIvOTJs
//aHR0cHM6Ly93d3cuamF2YnVzLnVzL0JDUFYtMDky
const text = base64.decode('aHR0cHM6Ly93d3cuamF2YnVzLnVzL3N0YXIvOTJs')
const count = 1;
// const isEmpty = false;
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
            console.log(chalk.yellow('network error'))
            await browser.close()
            return
        }
        const resources = await to(page.evaluate(() => {
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
        if (!resources.length) {
            
        }
        count++
    }
    console.log(htmls)
    await browser.close()
})