const { sqlDB } = require('../database')

module.exports = {
    moviePoster: (req, res) => {
        let sql = `SELECT id, movieName, poster, type FROM m_movies
                    ORDER BY movieName
                    LIMIT ${req.body.limit} OFFSET ${req.body.offset}`

        sqlDB.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
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
                res.status(500).send(err)
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
                res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    },

    movieData: (req, res) => {
        console.log(req.body.idMov)
        let sql = `SELECT id, movieName, filePath, trailer, poster, releaseDate, country, lang,
                    concat(hour(duration), 'h ', minute(duration), 'm') as duration, director, synopsis, type
                FROM m_movies
                WHERE id = ${req.body.idMov}`

        sqlDB.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
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
                res.status(500).send(err)
            }

            // JOINING GENRES
            let genreTemp = ''
            for (let i = 0; i < results.length; i++) {
                genreTemp += results[i].genreName + ', '
            }
            genreTemp = genreTemp.slice(0, genreTemp.length - 2)
            // JOINING GENRES

            console.log(genreTemp)
            res.status(200).send(genreTemp)
        })
    },

    getMovieUrl: (req, res) => {
        let sql = `SELECT filePath FROM m_movies WHERE id = ${req.body.idMov}`

        sqlDB.query(sql, (err, results) => {
            if (err) res.status(500).send(err)

            res.status(200).send(results[0])
        })
    },

    getMoviesByName: (req, res) => {
        let sql = `SELECT * FROM m_movies
                    WHERE movieName LIKE '%${req.body.q}%' or substring(filePath, 9, length(filePath)) LIKE '%${req.body.q}%'
                    UNION
                    SELECT * FROM m_movies
                    WHERE synopsis LIKE '%${req.body.q}%'`

        sqlDB.query(sql, (err, results) => {
            if (err) res.status(500).send(err)

            res.status(200).send(results)
        })
    },

    getAllMovies: (req, res) => {
        let sql = `SELECT * FROM m_movies`

        sqlDB.query(sql, (err, results) => {
            if (err) res.status(500).send(err)

            res.status(200).send(results)
        })
    }
}