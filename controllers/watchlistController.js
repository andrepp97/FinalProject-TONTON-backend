const { sqlDB } = require('../database')

module.exports = {
    checkWatchlist: (req, res) => {
        let sql = `SELECT * FROM user_watchlist
                    WHERE idUser = ${req.body.idUser} AND idMov = ${req.body.idMov}`

        sqlDB.query(sql, req.body, (err, results) => {
            if (err) res.status(500).send(err)

            res.status(200).send(results)
        })
    },

    addToWatchlist: (req, res) => {
        req.body.created_date = new Date()
        let sql = `INSERT INTO user_watchlist SET ?`

        sqlDB.query(sql, req.body, (err, results) => {
            if (err) res.status(500).send(err)

            res.status(200).send(results)
        })
    },

    removeFromWatchlist: (req, res) => {
        let sql = `DELETE FROM user_watchlist
                    WHERE idUser = ${req.body.idUser} AND idMov = ${req.body.idMov}`

        sqlDB.query(sql, req.body, (err, results) => {
            if (err) res.status(500).send(err)

            res.status(200).send(results)
        })
    }
}