const CronJob = require('cron').CronJob;

const ip = ['97.64.127.44', '111.74.56.249', '121.41.175.199']
const job = new CronJob('0 * * * * *', function() {
  console.log('You will see this message every second');
  job.stop()
}, null, true, 'Asia/Shanghai');