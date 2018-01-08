const puppeteer = require('puppeteer');
const base64 = require('base-64')
const text = base64.decode('aHR0cHM6Ly93d3cuamF2YnVzLnVzL3N0YXIvOTJs')
puppeteer.launch({ headless: false }).then(async browser => {
    const page = await browser.newPage();
    await page.goto(text, {
        waitUntil: 'domcontentloaded'
    })
    await page.addStyleTag({
        content: "img {display: none !important}"
    })
})