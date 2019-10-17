const crypto = require('crypto')
const { sqlDB } = require('../database')
const { createJWTToken } = require('../helpers/jwt')
const { transporter } = require('../helpers/mailer')

const secret = 'sutrisno'

module.exports = {
    signup: (req, res) => {
        // APPEND TO REQ.BODY //
        req.body.roleId = 2
        req.body.created_date = new Date()
        req.body.updated_date = null
        req.body.status = 'Unverified'
        // APPEND TO REQ.BODY //

        // Encrypt //
        req.body.password = crypto.createHmac('sha256', secret).update(req.body.password).digest('hex')
        // Encrypt //

        // SELECT duplicate email
        var sql = `SELECT * FROM m_users
                WHERE email = '${req.body.email}'`
        sqlDB.query(sql, (err, results) => {
            if (err) return res.status(500).send({
                message: 'DB Error gan!',
                err,
                error: true
            })
            if (results.length > 0) {
                return res.status(500).send('Email already used for another account')
            }

            // Do insert if there is no duplicate email
            console.log(req.body)
            var sql = `INSERT INTO m_users SET ?`
            sqlDB.query(sql, req.body, (err, results) => {
                if (err) return res.status(500).send({
                    message: 'DB Error gan!',
                    err
                })

                // Email Verification
                var mailOptions = {
                    from: "TONTON.ID <andreputerap@gmail.com>",
                    to: req.body.email,
                    subject: "Email Confirmation",
                    html: `<h1>Click Link Below to Confirm Your Email</h1>
                    <h4><a href='http://localhost:3000/emailverified?email=${req.body.email}' target='_blank'>Click Me!!</a></h4>`
                }
                transporter.sendMail(mailOptions, (err, results) => {
                    if (err) {
                        return res.status(500).send({
                            message: 'Kirim Email Confirmation Gagal!',
                            err
                        })
                    }
                    console.log('Email Sent!')
                    res.status(200).send(results)
                })
            })
        })
    },

    resendEmailConfirm: (req, res) => {
        var mailOptions = {
            from: "Son Of A Gun <andreputerap@gmail.com>",
            to: req.body.email,
            subject: "Email Confirmation",
            html: `<h1>Bergabunglah Dengan Kami</h1>
                <h4>Silahkan klik <a href='http://localhost:3000/emailverified?email=${req.body.email}' target='_blank'>disini</a></h4>`
        }

        transporter.sendMail(mailOptions, (err, results) => {
            if (err) {
                return res.status(500).send({
                    message: 'Kirim Email Confirmation Gagal!',
                    err,
                    error: false
                })
            }

            res.status(200).send({
                message: 'Email Sent!',
                results
            })
        })
    },

    emailConfirmed: (req, res) => {
        var sql = `UPDATE m_users SET status='Verified' WHERE email = '${req.body.email}'`
        sqlDB.query(sql, (err, results) => {
            if (err) return res.status(500).send({
                status: 'error',
                err
            })

            sql = `SELECT id,username,email,status FROM m_users WHERE email = '${req.body.email}'`
            sqlDB.query(sql, (err, results) => {
                if (err) return res.status(500).send(err)

                var token = createJWTToken({
                    ...results[0]
                }, {
                    expiresIn: '1h'
                })

                res.status(200).send({
                    ...results[0],
                    token
                })
            })
        })
    },

    userLogin: (req, res) => {
        var { email, password } = req.body;
            password = crypto.createHmac('sha256', secret)
                            .update(password)
                            .digest('hex')

        let sql = `SELECT u.id, username, password, email, roleName
                    FROM m_users u JOIN m_role r ON r.id = u.roleId
                    WHERE email = '${email}' AND password = '${password}'`
        
        sqlDB.query(sql, (err, results) => {
            if (err){
                res.status(500).send(err)
            }

            console.log('Hasil Bro')
            console.log(results)
            if(results.length === 0) {
                return res.status(500).send({ message: 'Email or Password Incorrect' })
            }

            var token = createJWTToken({ ...results[0] }, { expiresIn: '1h' })
            console.log(token)
            res.status(200).send({ ...results[0], token })
        })
    },

    userKeepLogin: (req, res) => {
        console.log(req.user)
        res.status(200).send({
            ...req.user
        })
    }
}