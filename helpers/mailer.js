const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'andreputerap@gmail.com',
        pass: 'lsocgqtyvdvoknyf'
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = {
    transporter
}