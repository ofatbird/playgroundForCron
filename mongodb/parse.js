const fs = require('fs')
module.exports = function(logfile) {
  return fs.readFileSync(logfile).match(/[\w-]+/ig)
}