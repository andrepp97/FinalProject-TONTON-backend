const { sqlDB } = require('../database')

module.exports = {
    getAllUser: (req, res) => {
        let sql = `SELECT u.id, username, email,  r.id as roleId, roleName, date(created_date) as created_date, status
                    FROM m_users u JOIN m_role r ON r.id = u.roleId`

        sqlDB.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    },

    updateUser: (req, res) => {
        let sql = `UPDATE m_users SET ? WHERE id = ${req.body.id}`

        sqlDB.query(sql, req.body, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    },

    suspendUser: (req, res) => {
        let sql = `UPDATE m_users SET status = 'Suspended' WHERE id = ${req.body.id}`

        sqlDB.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    },

    getAllMovies: (req, res) => {
        let sql = `SELECT id, movieName, filePath, trailer, poster, if(type = 'F', 'Free', 'Premium') as 'type', upload_date
                    FROM m_movies m`

        sqlDB.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    },

    getAllGenre: (req, res) => {
        let sql = `SELECT * FROM m_genre ORDER BY 2`

        sqlDB.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    },

    addNewGenre: (req, res) => {
        let sql = `INSERT INTO m_genre SET ?`

        sqlDB.query(sql, req.body, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send('Insert Genre Berhasil')
        })
    },

    deleteGenre: (req, res) => {
        let sql = `DELETE FROM m_genre WHERE id = ${req.params.idGen}`

        sqlDB.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send('Delete Genre Berhasil')
        })
    },

    getAllArtist: (req, res) => {
        let sorting = ''
        console.log(req.query.sort)
        if (req.query.sort === 'asc' || req.query.sort === undefined) {
            sorting = 'ORDER BY castName ASC'
        }
        if (req.query.sort === 'desc') {
            sorting = 'ORDER BY castName DESC'
        }
        if (req.query.sort === 'popularity') {
            sorting = 'ORDER BY popularity DESC'
        }

        let sql = `SELECT * FROM m_cast ${sorting}`

        sqlDB.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    },
}