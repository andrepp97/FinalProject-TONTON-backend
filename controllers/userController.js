const crypto = require('crypto')
const fs = require('fs')
const { sqlDB } = require('../database')
const { createJWTToken } = require('../helpers/jwt')
const { transporter } = require('../helpers/mailer')
const { uploader } = require('../helpers/uploader')

const secret = 'sutrisno'

module.exports = {
    signup: (req, res) => {
        // APPEND TO REQ.BODY //
        req.body.roleId = 3
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

                // Create TOKEN
                const token = createJWTToken({ email: req.body.email })

                // Email Verification
                var mailOptions = {
                    from: "TONTON.ID <andreputerap@gmail.com>",
                    to: req.body.email,
                    subject: "Email Confirmation",
                    html: `<h1>Click Link Below to Confirm Your Email</h1>
                    <h4><a href='http://localhost:3000/emailverified?token=${token}' target='_blank'>Click Me!!</a></h4>`
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
        // Create TOKEN
        const token = createJWTToken({
            email: req.body.email
        })

        var mailOptions = {
            from: "Son Of A Gun <andreputerap@gmail.com>",
            to: req.body.email,
            subject: "Email Confirmation",
            html: `<h1>Bergabunglah Dengan Kami</h1>
                <h4>Silahkan klik <a href='http://localhost:3000/emailverified?token=${token}' target='_blank'>disini</a></h4>`
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
        var sql = `UPDATE m_users SET status='Verified' WHERE email = '${req.email}'`
        sqlDB.query(sql, (err, results) => {
            if (err) return res.status(500).send({
                status: 'error',
                err
            })

            sql = `SELECT id,username,email,status FROM m_users WHERE email = '${req.email}'`
            sqlDB.query(sql, (err, results) => {
                if (err) return res.status(500).send(err)

                var token = createJWTToken({
                    ...results[0]
                }, {
                    expiresIn: '3h'
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

            // console.log(results)
            if(results.length === 0) {
                return res.status(500).send({ message: 'Email or Password Incorrect' })
            }

            var token = createJWTToken({ ...results[0] }, { expiresIn: '3h' })
            console.log(token)
            res.status(200).send({ ...results[0], token })
        })
    },

    userKeepLogin: (req, res) => {
        console.log(req.user)
        res.status(200).send({
            ...req.user
        })
    },

    // SUBSCRIPTIONS //
    getPriceData: (req, res) => {
        var sql = `SELECT pricePerMonth FROM m_subscription WHERE subsName = 'Premium'`
        sqlDB.query(sql, (err, results) => {
            if (err) return res.status(500).send(err)

            res.status(200).send(results[0])
        })
    },

    userUpgradePremium: (req, res) => {
        const idSubs = 1
        var sql = `INSERT INTO user_transaction
                    VALUES (null, ${req.body.idUser}, ${idSubs}, ${req.body.pricePerMonth}, NOW(), (NOW() + INTERVAL 90 MINUTE), 'WAITING FOR PAYMENT', null)`
        sqlDB.query(sql, (err, results) => {
            if (err) return res.status(500).send(err)

            res.status(200).send(results)
        })
    },

    userCreateEventTimeout: (req,res) => {
        var sql = `SET GLOBAL event_scheduler = 1`
        sqlDB.query(sql, (err,results) => {
            if (err) return res.status(500).send(err)

            const eventName = 'INV' + req.body.idTransaction
            var sql2 = `CREATE EVENT ${eventName}
                    ON SCHEDULE AT (NOW() + INTERVAL 90 MINUTE)
                    DO UPDATE user_transaction SET status = 'EXPIRED' WHERE id = ${req.body.idTransaction}`
            console.log(sql2)
            sqlDB.query(sql2, (err, results) => {
                if (err) return res.status(500).send(err)

                res.status(200).send('Event Created')
            })
        })
    },

    getUserBillById: (req, res) => {
        var sql = `SELECT id, total_pay, transaction_date, payment_timeout, status, timestampdiff(second, now(), payment_timeout)*1000 as 'countdown'
                    FROM user_transaction
                    WHERE idUser = ${req.body.idUser}
                    ORDER BY 3 DESC`
        sqlDB.query(sql, (err, results) => {
            if (err) return res.status(500).send(err)

            res.status(200).send(results[0])
        })
    },

    getUserBills: (req, res) => {
        var sql = `SELECT *, timestampdiff(minute, now(), payment_timeout) as 'countdown'
                    FROM user_transaction
                    WHERE idUser = ${req.body.idUser}
                    ORDER BY 5 DESC`
        sqlDB.query(sql, (err, results) => {
            if (err) return res.status(500).send(err)

            res.status(200).send(results)
        })
    },

    userUploadReceipt: (req, res) => {
        const path = '/files'
        const upload = uploader(path, 'TRF_').fields([{
            name: 'image'
        }])

        upload(req, res, (err) => {
            if (err) {
                return res.status(500).json({
                    message: 'Upload file failed !',
                    error: err.message
                });
            }

            const {image} = req.files;
            console.log(image)

            const data = JSON.parse(req.body.data)
            console.log(data)

            var imgPath = path + '/' + image[0].filename
            console.log('img path : ', imgPath)

            var sql = `UPDATE user_transaction
                        SET receipt = '${imgPath}'
                        WHERE idUser = ${data.idUser} AND status = 'WAITING FOR PAYMENT'`
            sqlDB.query(sql, (err, results) => {
                if (err) {
                    fs.unlinkSync(`./public${imgPath}`)
                    return res.status(500).send(err)
                }

                var sql2 = `UPDATE user_transaction
                            SET status = 'PROCESSING PAYMENT'
                            WHERE idUser = ${data.idUser} AND status = 'WAITING FOR PAYMENT'`
                 sqlDB.query(sql2, (err, results) => {
                    if (err) {
                        return res.status(500).send(err)
                    }

                    res.status(200).send('UPLOAD SUCCESS')
                })
            })
        })
    }
    // SUBSCRIPTIONS //
}