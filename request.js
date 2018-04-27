const request = require('request')
const fs = require('fs')
const cheerio = require('cheerio')

request('https://www.hotmovies.com/category/761/Lesbian/', function(error, response, body) {
    if (error) {
        console.log(error)
    } else {
        fs.writeFileSync('index.html', body)
    }
})

// function getBody () {
//   return new Promise((resolve, reject) => {
//     request.post({
//       url: 'http://www.adultfilmdatabase.com/browse.cfm?type=title',
//       form: {
//         dsp: '30',
//         sb: 'viewcount',
//         cf: 'Lesbian',
//         sf: '',
//         type: 'title',
//         dspas: ' grid'
//       }
//     }, (error, response, body) => {
//       // Print the error if one occurred
//       // Print the response status code if a response was received
//       //   console.log('body:', body); // Print the HTML for the Google homepage.
//       if (error) {
//         reject(error)
//       } else {
//         resolve(body)
//       }
//     })
//   })
// }

// (async function() {
//     const html = await getBody()
// })()
