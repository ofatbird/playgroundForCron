const jsonfile = require('jsonfile')
const magnet = require('magnet-uri')
// const data = jsonfile.readFileSync('./json/nf.json')
const fs = require('fs')
const data1 = jsonfile.readFileSync('./json/magnet.json')
// 
// const data1 = {}
const dataKeys = []
Object.keys(data1).forEach(ele => {
    // console.log(data1[ele].title.split(/[^0-9a-zA-Z]/).join(''))
    // console.log(data1[ele].title[0].match(/[0-9]+/g))
    dataKeys.push(data1[ele].title[0].split(/[^0-9a-zA-Z]/).map(el => el.toLowerCase()).filter(el => !!el&&!el.match(/RealityKings/i)))
})
// console.log(data1)
for (let i = 0; i < dataKeys.length - 1; i++) {
    if (data1[i + 1].duplicated) {
      delete data1[i + 1]
      continue
    }
    const len = dataKeys[i].length
    for (let j = i + 1; j < dataKeys.length; j++) {
        const intersection = dataKeys[i].filter(x => dataKeys[j].includes(x)).length
        const union = len + dataKeys[j].length - intersection
        const {title, magnet, size} = data1[i + 1]
        if ((intersection / union) > 0.4) {
            data1[i + 1].title = title.concat(data1[j + 1].title)
            data1[i + 1].magnet = magnet.concat(data1[j + 1].magnet)
            data1[i + 1].size = size.concat(data1[j + 1].size)
            data1[j + 1].duplicated = true
        }
    }
}
jsonfile.writeFileSync('./json/magDup.json', data1)
// console.log(data1)
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
// fs.writeFileSync('./test.txt',dataKeys.filter((ele, index,array) => array.indexOf(ele) === index).sort((a,b) => a - b).join('\n'))

function generateMagnet (data) {
  const magData = {

  }
  for (let index in data) {
    const item = data[index]
    magData[index] = {
      title: [item.title],
      magnet: [magnet.encode({
        xt: `urn:btih:${item.mag.split('/').reverse()[0]}`,
        dn: item.title
      })],
      size: [item.size]
    }
  }

  jsonfile.writeFileSync('./json/magnet.json', magData)
}
