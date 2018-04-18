const jsonfile = require('jsonfile')
const magnet = require('magnet-uri')
// const data = jsonfile.readFileSync('./json/wy1.json')
// const fs = require('fs')
const data1 = jsonfile.readFileSync('./json/magnet.json')
// 
// const data1 = {}


function generateDup (data, keyword) {
  const dataKeys = []
  const regex = new RegExp(keyword, 'ig')
  Object.keys(data).forEach(ele => {
    dataKeys.push(data[ele].title[0].split(/[^0-9a-zA-Z]/).map(el => el.toLowerCase()).filter(el => !!el && !el.match(regex)))
  })
  // console.log(dataKeys)
  for (let i = 0; i < dataKeys.length - 1; i++) {
    if (data[i + 1].duplicated) {
      delete data[i + 1]
      continue
    }
    const len = dataKeys[i].length
    for (let j = i + 1; j < dataKeys.length; j++) {
      const intersection = dataKeys[i].filter(x => dataKeys[j].includes(x)).length
      const union = len + dataKeys[j].length - intersection
      const {title, magnet, size} = data[i + 1]
      if ((intersection / union) > 0.5) {
        data[i + 1].title = title.concat(data[j + 1].title)
        data[i + 1].magnet = magnet.concat(data[j + 1].magnet)
        data[i + 1].size = size.concat(data[j + 1].size)
        data[j + 1].duplicated = true
      }
    }
  }
  jsonfile.writeFileSync('./json/wyDup.json', data1)
}

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

// generateMagnet(data)
generateDup(data1, 'webyoung')