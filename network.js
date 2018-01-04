const puppeteer = require('puppeteer')
const chalk = require('chalk')
const base64 = require('base-64')

const text = base64.decode('aHR0cHM6Ly93d3cuamF2YnVzLnVzL0JDUFYtMDky')
puppeteer.launch().then(async browser => {

    const page = await browser.newPage();
    page.on('response', response => {
        const req = response.request()
        if (req.resourceType === 'xhr') {
            console.log(chalk.yellow('##########'.repeat(6)))
            console.log(response.url)
        }
    })
    await page.goto(text, {
        waitUntil: 'networkidle0'
    })
    // console.log(await page.content())
    await browser.close()
})