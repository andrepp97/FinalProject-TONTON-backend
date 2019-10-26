const { sqlDB } = require('../database')

module.exports = {
    getAllUser: (req, res) => {
        let sql = `SELECT u.id, username, email,  r.id as roleId, roleName, date(created_date) as created_date, status
                    FROM m_users u JOIN m_role r ON r.id = u.roleId`

        sqlDB.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    },

    updateUser: (req, res) => {
        let sql = `UPDATE m_users SET ? WHERE id = ${req.body.id}`

        sqlDB.query(sql, req.body, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    },

    suspendUser: (req, res) => {
        let sql = `UPDATE m_users SET status = 'Suspended' WHERE id = ${req.body.id}`

        sqlDB.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    }
}