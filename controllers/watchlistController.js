const { sqlDB } = require('../database')

module.exports = {
    checkWatchlist: (req, res) => {
        let sql = `SELECT * FROM user_watchlist
                    WHERE idUser = ${req.body.idUser} AND idMov = ${req.body.idMov}`

        sqlDB.query(sql, req.body, (err, results) => {
            if (err) return res.status(500).send(err)

            res.status(200).send(results)
        })
    },

    addToWatchlist: (req, res) => {
        req.body.created_date = new Date()
        let sql = `INSERT INTO user_watchlist SET ?`

        sqlDB.query(sql, req.body, (err, results) => {
            if (err) return res.status(500).send(err)

            res.status(200).send(results)
        })
    },

    removeFromWatchlist: (req, res) => {
        let sql = `DELETE FROM user_watchlist
                    WHERE idUser = ${req.body.idUser} AND idMov = ${req.body.idMov}`

        sqlDB.query(sql, req.body, (err, results) => {
            if (err) return res.status(500).send(err)

            res.status(200).send(results)
        })
    },

    getUserWatchlist: (req, res) => {
        let sql = `SELECT idMov, movieName, poster, w.created_date
                    FROM user_watchlist w
                    JOIN m_movies m ON m.id = w.idMov
                    WHERE idUser = ${req.body.idUser}
                    ORDER BY 4 DESC`

        sqlDB.query(sql, (err, results) => {
            if (err) return res.status(500).send(err)

            res.status(200).send(results)
        })
    }
}