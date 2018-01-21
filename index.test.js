const puppeteer = require('puppeteer');
const base64 = require('base-64')
const to = require('await-to-js').to
const url = base64.decode('aHR0cHM6Ly93d3cuamF2YnVzLnVzL0NFU0QtNDk5')

puppeteer.launch(/*{headless: false}*/).then(async browser => {
    while(true){
        const page = await browser.newPage()
        const [netErr] = await to(page.goto(url, {waitUntil: 'networkidle0'}))
        if(!netErr) {
            console.log(await page.content())
            const  html = await page.evaluate(() => {
                const infos = document.querySelector('.info')
                const mags = document.querySelector('#magnet-table')
                return {
                    info: infos.outerHTML,
                    mags: mags.outerHTML
                }
            })
            // console.log(html)
            break;
        }
        console.log(netErr)
        await page.close()
    }
    await browser.close();
});