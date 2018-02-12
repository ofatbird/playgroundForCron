const puppeteer = require('puppeteer');
const jsonfile = require('jsonfile')
const base64 = require('base-64')
const to = require('await-to-js').to
const url = base64.decode('aHR0cHM6Ly93d3cuamF2YnVzLnVzL2dlbnJl')

puppeteer.launch({timeout: 20000}).then(async browser => {
    while(true){
        const page = await browser.newPage()
        const [netErr] = await to(page.goto(url, {waitUntil: 'networkidle0'}))
        if(!netErr) {
            // console.log(await page.content())
            const [error, list] = await to(page.evaluate(() => {
                const items = document.querySelectorAll('.genre-box>a');
                return [].map.call(items, item => {
                    return {
                        uri: item.getAttribute('href'),
                        tag: item.innerHTML
                    }
                })
            }));
            const bson = {}
            if (!error) {
                list.forEach((ele, index)=> {
                    bson[index] = ele
                })
                jsonfile.writeFileSync('./json/genre.json', bson)
            }
            break;
        }
        console.log(netErr)
        await page.close()
    }
    await browser.close();
});