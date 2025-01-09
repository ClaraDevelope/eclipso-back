const nodeMailer = require('nodemailer')

const transporter = nodeMailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'c3735861@gmail.com',
    pass: 'kviu zlbp ojsj kanz'
  }
})

module.exports = transporter
