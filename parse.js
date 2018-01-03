const jsonfile = require('jsonfile')
const magnet = require('magnet-uri')
const data = jsonfile.readFileSync('./data.json')
const data1 = jsonfile.readFileSync('./data1.json')
const dataKeys = []
const prefix = 'magnet:?xt=urn:btih:'
const displayname = '&dn:'
Object.keys(data).forEach(ele => {
    dataKeys.push(data[ele].title
        .toLowerCase()
        .replace(/\:|\_|\+|\,|\(|\)|\-|\.|\[|\]\&/g, ' ')
        .split(' ').filter(i => i && i !== 'girlsway')
    )
})
for (let i = 0; i < dataKeys.length - 1; i++) {
    if (data1[i + 1].duplicated) {
      delete data1[i + 1]
      continue
    }
    const len = dataKeys[i].length
    for (let j = i + 1; j < dataKeys.length; j++) {
        const intersection = dataKeys[i].filter(x => dataKeys[j].includes(x)).length
        const union = len + dataKeys[j].length - intersection
        const {title, mag, size} = data1[i + 1]
        if ((intersection / union) > 0.4) {
            data1[i + 1].title = title.concat(data1[j + 1].title)
            data1[i + 1].mag = mag.concat(data1[j + 1].mag)
            data1[i + 1].size = size.concat(data1[j + 1].size)
            data1[j + 1].duplicated = true
        }
    }
}


// dataKeys.filter
Object.keys(data).forEach(ele => {
  console.log(magnet.encode({
    xt: `urn:btih:${data[ele].mag.split('/').reverse()[0]}`,
    dn: data[ele].title
  }))
})

// jsonfile.writeFileSync('./data2.json', data1)