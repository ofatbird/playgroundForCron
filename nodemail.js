const nodemailer = require('nodemailer')

const transporter =  nodemailer.createTransport({
  host: 'smtp.163.com',
  auth: {
    user: '17625935365@163.com',
    pass: '785689cui'
  }
})

transporter.verify(function(error, success) {
   if (error) {
        console.log('error');
   } else {
        console.log('Server is ready to take our messages');
   }
});