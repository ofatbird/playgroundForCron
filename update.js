const puppeteer = require('puppeteer');
const jsonfile = require('jsonfile')
const base64 = require('base-64')
const to = require('await-to-js').to
// aHR0cHM6Ly93d3cuamF2YnVzLnVzL2dlbnJlLzFk
// aHR0cHM6Ly93d3cuamF2YnVzLnVzL3BhZ2U= mainpage
const url = base64.decode('aHR0cHM6Ly93d3cuamF2YnVzLnVzL2dlbnJlLzFk')
// const bson = {}

puppeteer.launch({timeout: 15000}).then(async browser => {
    while (true) {
        const page = await browser.newPage()
        await page.setExtraHTTPHeaders({
            cookie: `__cfduid=dcdcbd6f154a3290d66b10b5ced0df7861520604389; PHPSESSID=8blp3ntq4k2npqcvic059at5p5; HstCfa3034720=1520604392613; HstCla3034720=1520604392613; HstCmu3034720=1520604392613; HstPn3034720=1; HstPt3034720=1; HstCnv3034720=1; HstCns3034720=1; __dtsu=D9E9B66BE994A25A7E395EB8025B2A67; existmag=all`
        })
        const [netErr] = await to(page.goto(url + '/35', { waitUntil: 'domcontentloaded' }))
        if (!netErr) {
            // console.log(await page.content())
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