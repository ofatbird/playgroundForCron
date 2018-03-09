const base64 = require('base-64')
const puppeteer = require('puppeteer')
const to = require('await-to-js').to
//aHR0cHM6Ly93d3cuamF2YnVzLnVzL2dlbnJlLzFk
const url = base64.decode('aHR0cHM6Ly93d3cuamF2YnVzLnVzL2dlbnJlLzFk')
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
puppeteer.launch({}).then(async browser => {
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    "cookie" : `__cfduid=dfe64fe990aadb78fd63f3ffb6c182d751520582741; PHPSESSID=f8qpesl0bi2d7o0jnlunt1gdq6; HstCfa3034720=1520582746713; HstCla3034720=1520582746713; HstCmu3034720=1520582746713; HstPn3034720=1; HstPt3034720=1; HstCnv3034720=1; HstCns3034720=1; __dtsu=1FE704455D40A25AFC6A40C30249EC81; existmag=all`
  })
  // await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:57.0) Gecko/20100101 Firefox/56.0')

// :authority:www.javbus.us
// :method:GET
// :path:/genre/1d
// :scheme:https
// accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
// accept-encoding:gzip, deflate, br
// accept-language:zh-CN,zh;q=0.9
// cache-control:max-age=0
// cookie:__cfduid=dfe64fe990aadb78fd63f3ffb6c182d751520582741; PHPSESSID=f8qpesl0bi2d7o0jnlunt1gdq6; HstCfa3034720=1520582746713; HstCla3034720=1520582746713; HstCmu3034720=1520582746713; HstPn3034720=1; HstPt3034720=1; HstCnv3034720=1; HstCns3034720=1; __dtsu=1FE704455D40A25AFC6A40C30249EC81; existmag=all
// referer:https://www.javbus.us/genre/1d
// upgrade-insecure-requests:1
// user-agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3264.0 Safari/537.36

  await page.goto(url, {
      waitUntil: 'domcontentloaded'
  });
  console.log(await page.content())
  // [err, html] = await to(page.$eval('.data-list', el => el.outerHTML));
  // await page.close()
  
 
  await browser.close()
});