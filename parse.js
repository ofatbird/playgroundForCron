const jsonfile = require('jsonfile')
const magnet = require('magnet-uri')
const data = jsonfile.readFileSync('./test.json')
const fs = require('fs')
// const data1 = jsonfile.readFileSync('./data1.json')
// 
const data1 = {}
const dataKeys = []
const prefix = 'magnet:?xt=urn:btih:'
const displayname = '&dn:'
Object.keys(data).forEach(ele => {
    data1[ele] = {
        title: data[ele].title.match(/bban\-[0-9]+/ig),
        mag: [data[ele].mag.split('/').reverse()[0]],
        size: [data[ele].size]
    }
    // console.log(data1[ele].title[0].match(/[0-9]+/g))
    dataKeys.push(data[ele].title.match(/bban\-[0-9]+/ig)[0].replace(/bban\-0*/ig,''))
})
// console.log(dataKeys)
// for (let i = 0; i < dataKeys.length - 1; i++) {
//     if (data1[i + 1].duplicated) {
//       delete data1[i + 1]
//       continue
//     }
//     const len = dataKeys[i].length
//     for (let j = i + 1; j < dataKeys.length; j++) {
//         const intersection = dataKeys[i].filter(x => dataKeys[j].includes(x)).length
//         const union = len + dataKeys[j].length - intersection
//         const {title, mag, size} = data1[i + 1]
//         if ((intersection / union) > 0.4) {
//             data1[i + 1].title = title.concat(data1[j + 1].title)
//             data1[i + 1].mag = mag.concat(data1[j + 1].mag)
//             data1[i + 1].size = size.concat(data1[j + 1].size)
//             data1[j + 1].duplicated = true
//         }
//     }
// }
// for (let i = 0; i < dataKeys.length - 1; i++) {
//     if (data1[i + 1].duplicated) {
//       delete data1[i + 1]
//       continue
//     }
//     const len = dataKeys[i].length
//     for (let j = i + 1; j < dataKeys.length; j++) {
//         // const intersection = dataKeys[i].filter(x => dataKeys[j].includes(x)).length
//         // const union = len + dataKeys[j].length - intersection
//         const {title, mag, size} = data1[i + 1]
//         if (dataKeys[i] === dataKeys[j]) {
//             // console.log(data1[i+1].title,data1[j+1].title)
//             data1[i + 1].title = title.concat(data1[j + 1].title)
//             data1[i + 1].mag = mag.concat(data1[j + 1].mag)
//             data1[i + 1].size = size.concat(data1[j + 1].size)
//             data1[j + 1].duplicated = true
//         }
//     }
// }
fs.writeFileSync('./test.txt',dataKeys.filter((ele, index,array) => array.indexOf(ele) === index).sort((a,b) => a - b).join('\n'))

// // dataKeys.filter
// Object.keys(data).forEach(ele => {
//   console.log(magnet.encode({
//     xt: `urn:btih:${data[ele].mag.split('/').reverse()[0]}`,
//     dn: data[ele].title
//   }))
// })

// jsonfile.writeFileSync('./data2.json', data1)