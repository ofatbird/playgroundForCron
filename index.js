// var CronJob = require('cron').CronJob;
// new CronJob('* * * * * *', function() {
//   console.log('You will see this message every second');
// }, null, true, 'Asia/Shanghai');

// const request = require('request-promise-native');
// const iconv = require('iconv-lite')
// const fs = require('fs');

// const options = {
//  url: 'https://btso.pw/search/javascript',
//  // encoding: null,
//  headers: {
//    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
//    'Accept-Encoding': 'gzip, deflate, br',
//    'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
//    'Connection': 'keep-alive',
//    'Cookie': 'AD_enterTime=1513925919; AD_adst_b_M_300x50=0; AD_exoc_b_M_300x50=0; AD_jav_b_M_300x50=0; AD_javu_b_M_300x50=0; AD_wav_b_M_300x50=0; AD_wwwp_b_M_300x50=0; AD_clic_b_POPUNDER=2; AD_adst_b_SM_T_728x90=1; AD_popa_b_POPUNDER=2; AD_exoc_b_SM_T_728x90=1; AD_adca_b_SM_T_728x90=1; AD_jav_b_SM_B_728x90=1; AD_popc_b_POPUNDER=1; AD_jav_b_SM_T_728x90=1; AD_adca_b_POPUNDER=1; AD_wwwp_b_SM_T_728x90=1; AD_wav_b_SM_B_728x90=1; AD_gung_b_POPUNDER=1',
//    'Host': 'btso.pw',
//    'Upgrade-Insecure-Requests': '1',
//    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:57.0) Gecko/20100101 Firefox/57.0'
//  }
// };

// function echo(anything) {
//  console.log(anything)
// }
// // (async() => {
// //   const result = await request(options);
// //   fs.writeFileSync('index.html',result,'utf8')
// // })();
// request(options).then((htmlstr) => {
//   echo(htmlstr)
//  // const buffer = new BufferHelper()
//  // buffer.concat(htmlstr)
//  // echo(iconv.decode(buffer.toBuffer(), 'GBK'))
// }).catch(err => echo(err))
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const jsonfile = require('jsonfile')

puppeteer.launch().then(async browser => {
    let err, html;
    let count = 0;
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
        'Cookie': 'AD_enterTime=1513925919; AD_adst_b_M_300x50=0; AD_exoc_b_M_300x50=0; AD_jav_b_M_300x50=0; AD_javu_b_M_300x50=0; AD_wav_b_M_300x50=0; AD_wwwp_b_M_300x50=0; AD_clic_b_POPUNDER=2; AD_adst_b_SM_T_728x90=1; AD_popa_b_POPUNDER=2; AD_exoc_b_SM_T_728x90=1; AD_adca_b_SM_T_728x90=1; AD_jav_b_SM_B_728x90=1; AD_popc_b_POPUNDER=1; AD_jav_b_SM_T_728x90=1; AD_adca_b_POPUNDER=1; AD_wwwp_b_SM_T_728x90=1; AD_wav_b_SM_B_728x90=1; AD_gung_b_POPUNDER=1',
        'Host': 'btso.pw',
    })
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:57.0) Gecko/20100101 Firefox/57.0')
    await page.goto('https://btso.pw/search/girlsway', { waitUntil: 'domcontentloaded' });
    [err, html] = await page.$eval('.data-list', el => el.outerHTML);
    console.log(err+'\n'+html)
    // const $ = cheerio.load(html);

    // const curpage = {}
    // $('.row').each((index, ele) => {
    //     if (!index) reuturn;
    //     const $ele = $(ele)
    //     const itemA = $ele.find('a')
    //     curpage[index] = {
    //         title: itemA.attr('title'),
    //         mag: itemA.attr('href'),
    //         size: $ele.find('.size').text(),
    //     }
    //     // console.log($(ele).find('.size').text())
    // });
    // while (count <= 10 && !err) {
    //     count++;
    //     await page.goto('https://btso.pw/search/girlsway/page/' + count, { waitUntil: 'domcontentloaded' });
    //     [err, html] = await page.$eval('.data-list', el => el.outerHTML);
    //     const curpage = {}
    //     $('.row').each((index, ele) => {
    //         if (!index) reuturn;
    //         const $ele = $(ele)
    //         const itemA = $ele.find('a')
    //         curpage[index + 29 * count] = {
    //             title: itemA.attr('title'),
    //             mag: itemA.attr('href'),
    //             size: $ele.find('.size').text(),
    //         }
    //         // console.log($(ele).find('.size').text())
    //     });
        
    // }
    // jsonfile.writeFileSync('./data.json', curpage) //cover 
    // const compare = curpage.map(ele => ele.replace(/\.\,/g,'\n').split('\n'))
    await browser.close();

});