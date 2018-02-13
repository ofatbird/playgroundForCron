module.exports = function(inp, callback) {
    /*
      @argument
       start
       breakpoint
       still need a global variable
     */
    while (start < breakpoint) {
        const { number, cover } = pool[start]
        const uri = base64.decode('aHR0cHM6Ly93d3cuamF2YnVzLnVz') + '/' + number
        const doc = await findByNumber(number)
        if (doc.length) {
            console.log(`We updated this one, no more upload again`)
            console.log(number === doc[0].number)
            start++
            continue
        }
        const page = await browser.newPage();
        const [networkErr] = await to(page.goto(uri, {
            waitUntil: 'networkidle0'
        }))
        if (networkErr) {
            console.log(chalk.yellow('Network Error'))
            networkErrFlag++
            if (networkErrFlag > 3) {
                console.log(`${chalk.red(start)} is a shit, something is broken here`)
                save2log(`${getFormatTime()}: ${number} is a shit, Network is broken here \n`)
                networkErrFlag = 0
                start++
            }
            continue
        }
        if (networkErrFlag) networkErrFlag = 0
        const html = await page.evaluate(() => {
            const infos = document.querySelector('.info')
            const mags = document.querySelector('#magnet-table')
            return {
                info: infos.outerHTML,
                magnet: mags.outerHTML
            }
        })
        await page.close()
        console.log(chalk.gray(start))
        /*save into mongodb atlas*/
        const [saveErr, saveSucc] = await to(save2Atlas(Object.assign({
            number,
            pic: cover,
        }, html)))
        if (saveErr) {
            console.log(saveErr)
            save2log(`${getFormatTime()}: ${saveErr};failed to insert data ${number}\n`)
        } else {
            console.log(saveSucc)
        }
        start++
        // await sleep(getRandomArbitrary(1, 3) * 1000)
    }
}