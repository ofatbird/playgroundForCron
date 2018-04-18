const jsonfile = require('jsonfile')

const datamag = require('./json/magnet.json')

const info = require('./json/wyinfo.json')

const dup = require('./json/wyDup.json')
// const database = {}
// let count = 299
// Object.keys(info).forEach((el, index) => {
//     const name = info[index].number.toLowerCase()
//     let matched = 'disappear'
//     for (let i in datamag) {
//         const title = datamag[i].title[0].split(/[^0-9a-zA-Z]/).join(' ').toLowerCase()
//         if (title.indexOf(name) > -1) {
//             matched = 'match'
//             count--
//             break
//         } 
//     }
//     // console.log(`${index}: ${matched}`)
// })
// console.log(count)

console.log(Object.keys(dup).length)