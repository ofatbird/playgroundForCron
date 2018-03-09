const mongoose = require('mongoose');

const mySchema = new mongoose.Schema({
    number: {
        type: String,
        index: true
    },
    pic: String,
    info: String,
    magnet: String,
    insertDate: {type:Number,index: true}
})
const Store = module.exports = mongoose.model('Store', mySchema)