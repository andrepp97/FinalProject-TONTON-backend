const { sqlDB } = require('../database')

module.exports = {
    moviePoster: (req, res) => {
        let sql = `SELECT id, movieName, poster, type
                FROM m_movies`

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
                LIMIT 18`

        sqlDB.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    },

    movieData: (req, res) => {
        let sql = `SELECT id, movieName, filePath, trailer, poster, releaseDate, country, lang,
                    concat(hour(duration), 'h ', minute(duration), 'm') as duration, director, synopsis, type
                FROM m_movies
                WHERE id = ${sqlDB.escape(req.params.idMov)}`

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
                WHERE idMov = ${sqlDB.escape(req.params.idMov)}`

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
    }
}