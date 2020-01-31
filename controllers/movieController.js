const { sqlDB } = require('../database')

module.exports = {
    moviePoster: (req, res) => {
        let sql = `SELECT id, movieName, poster, type FROM m_movies
                    ORDER BY movieName
                    LIMIT ${req.body.limit} OFFSET ${req.body.offset}`

        sqlDB.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    },

    moviePosterPopular: (req, res) => {
        let sql = `SELECT idMov as id, movieName, poster, type, sum(counter) as views
                    FROM m_movies m
                    JOIN movie_views v ON m.id = v.idMov
                    GROUP BY idMov
                    ORDER BY views DESC
                    LIMIT 15`

        sqlDB.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    },

    moviePosterNew: (req, res) => {
        let sql = `SELECT id, movieName, poster, type
                FROM m_movies
                ORDER BY upload_date desc
                LIMIT 15`

        sqlDB.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    },

    movieData: (req, res) => {
        let sql = `SELECT id, movieName, filePath, trailer, poster, releaseDate, country, lang,
                    concat(hour(duration), 'h ', minute(duration), 'm') as duration, director, synopsis, type
                FROM m_movies
                WHERE id = ${req.body.idMov}`

        sqlDB.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    },

    getMovieGenre: (req, res) => {
        let sql = `SELECT movieName, genreName
                FROM m_movies mov
	            JOIN con_moviegenre cmg on mov.id = cmg.idMov
                JOIN m_genre gen on gen.id = cmg.idGen
                WHERE idMov = ${req.body.idMov}`

        sqlDB.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }

            // JOINING GENRES
            let genreTemp = ''
            for (let i = 0; i < results.length; i++) {
                genreTemp += results[i].genreName + ', '
            }
            genreTemp = genreTemp.slice(0, genreTemp.length - 2)
            // JOINING GENRES

            res.status(200).send(genreTemp)
        })
    },

    getMovieUrl: (req, res) => {
        let sql = `SELECT id, movieName, filePath, poster FROM m_movies WHERE id = ${req.body.idMov}`

        sqlDB.query(sql, (err, results) => {
            if (err) return res.status(500).send(err)

            if (results.length > 0) {
                return res.status(200).send(results[0])
            } else {
                console.log(results)
            }
        })
    },

    getMoviesByName: (req, res) => {
        let sql = `SELECT * FROM m_movies
                    WHERE movieName LIKE '%${req.body.q}%' or substring(filePath, 9, length(filePath)) LIKE '%${req.body.q}%'
                    UNION
                    SELECT * FROM m_movies
                    WHERE synopsis LIKE '%${req.body.q}%'`

        sqlDB.query(sql, (err, results) => {
            if (err) return res.status(500).send(err)

            res.status(200).send(results)
        })
    },

    calcMovieViews: (req, res) => {
        let sql = `SELECT *
                    FROM movie_views
                    WHERE idMov = ${req.body.idMov} AND idUser = ${req.body.idUser}`

        sqlDB.query(sql, (err, results) => {
            if (err) return res.status(500).send(err)

            console.log('Film ', results)
            if (results.length > 0) {
                let newCounter = Number(results[0].counter) + 1
                let sql2 = `UPDATE movie_views
                            SET counter = ${newCounter}, last_viewed = now()
                            WHERE idMov = ${req.body.idMov} AND idUser = ${req.body.idUser}`
                sqlDB.query(sql2, (err, results) => {
                    if (err) return res.status(500).send(err)

                    sqlDB.query(sql, (err, results) => {
                        if (err) return res.status(500).send(err)

                        res.status(200).send(results[0])
                    })
                })
            } else if (results.length < 1) {
                let sql3 = `INSERT INTO movie_views VALUES (null, ${req.body.idMov}, ${req.body.idUser}, 1, now())`
                sqlDB.query(sql3, (err, results) => {
                    if (err) return res.status(500).send(err)

                    sqlDB.query(sql, (err, results) => {
                        if (err) return res.status(500).send(err)

                        res.status(200).send(results[0])
                    })
                })
            }
        })
    },
}