const fs = require('fs')
const { sqlDB } = require('../database')
const { uploader } = require('../helpers/uploader')

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

    getUserPayment: (req, res) => {
        var sql = `SELECT t.id, idUser, username, email, 'Upgrade To Premium' as description, t.status as payment_status, receipt
                    FROM user_transaction t
                    JOIN m_users u ON u.id = t.idUser
                    WHERE t.status = 'PROCESSING PAYMENT'`

        sqlDB.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }

            res.status(200).send(results)
        })
    },

    verifyPayment: (req, res) => {
        var sql = `UPDATE user_transaction
                    SET status = 'SUCCESS'
                    WHERE idUser = ${req.body.idUser} AND status = 'PROCESSING PAYMENT'`

        sqlDB.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }

            var sql2 = `UPDATE user_subs
                        SET idSubs = 1, start_date = now(), end_date = (NOW() + INTERVAL 30 DAY)
                        WHERE idUser = ${req.body.idUser}`

            sqlDB.query(sql2, (err, results) => {
                if (err) return res.status(500).send(err)

                res.status(200).send('Payment Verified')
            })
        })
    },

    declinePayment: (req, res) => {
        var sql = `UPDATE user_transaction
                    SET status = 'DECLINED'
                    WHERE idUser = ${req.body.idUser} AND status = 'PROCESSING PAYMENT'`

        sqlDB.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }

            res.status(200).send('Declined')
        })
    },

    getAllMovies: (req, res) => {
        let sorting = ''

        if (req.query.sort === 'name') {
            sorting = 'ORDER BY movieName'
        }
        if (req.query.sort === 'views') {
            sorting = 'ORDER BY views'
        }

        let sql = `SELECT idMov, movieName, filePath, trailer, poster, sum(counter) as views, releaseDate, country, lang,
                    director, duration, synopsis, if(type='F', 'Free', 'Premium') as type, upload_date
                    FROM m_movies m
                    JOIN movie_views v ON m.id = v.idMov
                    WHERE movieName LIKE '%${req.query.searchMovie}%' OR synopsis LIKE '%${req.query.searchMovie}%'
                    GROUP BY idMov
                    ${sorting} ${req.query.sortDir}`

        sqlDB.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    },

    addNewMovie: (req, res) => {
        const path = '/movies'
        const upload = uploader(path, 'MOV_').fields([{
            name: 'movie'
        }])

        upload(req, res, (err) => {
            if (err) {
                return res.status(500).json({
                    message: 'Upload file failed !',
                    error: err.message
                });
            }

            const {movie} = req.files;
            // console.log('Filem - ', movie)

            const data = JSON.parse(req.body.data)
            const idUser = JSON.parse(req.body.idUser)
            const genres = JSON.parse(req.body.genres)
            const cast = JSON.parse(req.body.cast)
            
            var moviePath = path + '/' + movie[0].filename
            // console.log('movie path : ', moviePath)
            
            data.filePath = moviePath
            data.upload_date = new Date().toISOString().slice(0, 10)
            data.duration = `${Math.floor(data.duration/60)}:${data.duration-(60 * Math.floor(data.duration/60))}:00`
            console.log(data)

            var sql = `INSERT INTO m_movies SET ?`
            sqlDB.query(sql, data, (err, results) => {
                if (err) {
                    fs.unlinkSync(`./public${moviePath}`)
                    return res.status(500).send(err)
                }

                var sql2 = `SELECT id FROM m_movies ORDER BY id DESC LIMIT 1`
                sqlDB.query(sql2, (err, results) => {
                    if (err) return res.status(500).send(err)
                    
                    let idMov = results[0].id

                    var movGenres = []
                    for (let i = 0; i < genres.length; i++) {
                        movGenres.push([idMov, genres[i]])
                    }

                    var movCast = []
                    for (let j = 0; j < cast.length; j++) {
                        cast[j].unshift(idMov)
                        movCast.push(cast[j])
                    }
                    // console.log('cast = ', movCast)
                    // console.log('Genres = ', movGenres)

                    var sql3 = `INSERT INTO con_moviegenre (idMov, idGen) VALUES ?`
                    sqlDB.query(sql3, [movGenres], (err, results) => {
                        if (err) {
                            fs.unlinkSync(`./public${moviePath}`)
                            return res.status(500).send(err)
                        }

                        var sql5 = `INSERT INTO con_moviecast (idMov, idCast, castRole) VALUES ?`
                        sqlDB.query(sql5, [movCast], (err, results) => {
                            if (err) {
                                fs.unlinkSync(`./public${moviePath}`)
                                return res.status(500).send(err)
                            }

                            var sql4 = `INSERT INTO movie_views
                                VALUES (null, ${idMov}, ${idUser}, 0)`
                            sqlDB.query(sql4, (err, results) => {
                                if (err) {
                                    fs.unlinkSync(`./public${moviePath}`)
                                    return res.status(500).send(err)
                                }

                                res.status(200).send('BERHASIL')
                            })
                        })
                    })
                })
            })
        })
    },

    deleteMovie: (req, res) => {
        let sql = `SELECT filePath FROM m_movies WHERE id = ${req.params.idMov}`
        sqlDB.query(sql, (err, results) => {
            if (err) return res.status(500).send(err)

            fs.unlinkSync(`./public${results[0].filePath}`)
            let sql2 = `DELETE FROM m_movies WHERE id = ${req.params.idMov}`

            sqlDB.query(sql2, (err, results) => {
                if (err) {
                    return res.status(500).send(err)
                }

                res.status(200).send('Delete Genre Berhasil')
            })
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

    getArtists: (req, res) => {
        let sql = `SELECT * FROM m_cast`

        sqlDB.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    },

    getAllArtist: (req, res) => {
        let sorting = ''
        if (req.query.sort === 'asc' || req.query.sort === undefined) {
            sorting = 'ORDER BY castName ASC'
        }
        if (req.query.sort === 'desc') {
            sorting = 'ORDER BY castName DESC'
        }
        if (req.query.sort === 'popularity') {
            sorting = 'ORDER BY popularity DESC'
        }

        let sql = `SELECT * FROM m_cast WHERE castName like '%${req.query.searchValue}%' ${sorting}`

        sqlDB.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    },

    addNewArtist: (req, res) => {
        let sql = `INSERT INTO m_cast SET ?`

        sqlDB.query(sql, req.body, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send('Insert Artist Berhasil')
        })
    },

    updateArtist: (req, res) => {
        req.body.birthday = req.body.birthday.slice(0,10)

        let sql = `UPDATE m_cast SET ? WHERE id = ${req.params.idCast}`

        sqlDB.query(sql, req.body, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send('Update Artist Berhasil')
        })
    },

    deleteArtist: (req, res) => {
        let sql = `DELETE FROM m_cast WHERE id = ${req.params.idCast}`

        sqlDB.query(sql, req.body, (err, results) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send('Delete Artist Berhasil')
        })
    },
}