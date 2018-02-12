const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'smtp.163.com',
  port: 465,
  secure: true,
  auth: {
    user: '17625935365@163.com',
    pass: '785689cui'
  },
  tls: {
    rejectUnauthorized: false
  }
})

let mailOptions = {
  from: '17625935365@163.com', // sender address
  to: '13813983264@163.com', // list of receivers
  subject: 'Hello world', // Subject line
  text: 'dsfcsddwedqwqw', // plain text body
  // html: '<b>Hello world?</b>' // html body
}

transporter.verify(function (error, success) {
  if (error) {
    console.log('error')
  } else {
    console.log('Server is ready to take our messages')
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error)
      }
      console.log('Message sent: %s', info.messageId)
      // Preview only available when sending through an Ethereal account
      // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    })
  }
})
