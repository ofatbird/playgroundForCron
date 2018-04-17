const puppeteer = require('puppeteer')
const fs = require('fs')
const jsonfile = require('jsonfile')
const chalk = require('chalk')
const to = require('await-to-js').to

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

let count = 1
let indexDB = []
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
puppeteer.launch().then(async browser => {
    const page = await browser.newPage();
    const [networkErr] = await to(page.goto('https://www.webyoung.com/en', {
        waitUntil: 'networkidle0'
    }))

    const html = await page.content()
    fs.writeFileSync('index.html', html)
    await browser.close()
})