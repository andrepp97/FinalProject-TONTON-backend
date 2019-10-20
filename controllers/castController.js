const { sqlDB } = require('../database')

module.exports = {
    castList: (req, res) => {
        let sql = `SELECT * FROM m_cast
                    ORDER BY popularity DESC, castName ASC
                    LIMIT ${req.body.limit} OFFSET ${req.body.offset}`

        sqlDB.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    },

    movieCast: (req, res) => {
        let sql = `SELECT idMov, idCast, castName, image
                FROM m_movies m
                	JOIN con_moviecast cmc ON cmc.idMov = m.id
                	JOIN m_cast c ON c.id = cmc.idCast
                WHERE idMov = ${req.body.idMov}
                ORDER BY castRole`

        sqlDB.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    },

    castDetails: (req, res) => {
        let sql = `SELECT *, length(bio) as bioLength FROM m_cast WHERE id = ${req.body.idCast}`

        sqlDB.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            res.status(200).send(results[0])
        })
    },

    castMovies: (req, res) => {
        let sql = `SELECT idMov, movieName, poster, idCast
                    FROM m_movies m
                    JOIN con_moviecast cm ON m.id = cm.idMov
                    WHERE idCast = ${req.body.idCast}
                    ORDER BY releaseDate DESC`

        sqlDB.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    },

    updatePopularity: (req, res) => {
        let sql = `SELECT popularity FROM m_cast WHERE id = ${req.body.idCast}`

        sqlDB.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }

            let pop = results[0].popularity + 1

            let sql2 = `UPDATE m_cast SET popularity = ${pop} WHERE id = ${req.body.idCast}`
            sqlDB.query(sql2, (err, results) => {
                if (err) res.status(500).send(err)

                res.status(200).send('Popularity Increased!')
            })
        })
    },

    getCastByName: (req, res) => {
        let sql = `SELECT * FROM m_cast WHERE castName like '%${req.body.q}%'`

        sqlDB.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    }
}