const express = require('express')
const { movieController } = require('../controllers')

const router = express.Router()

router.post('/moviePoster', movieController.moviePoster)
router.post('/moviePosterPopular', movieController.moviePosterPopular)
router.post('/moviePosterNew', movieController.moviePosterNew)
router.post('/movies', movieController.movieData)
router.post('/getGenre', movieController.getMovieGenre)
router.post('/getMovieUrl', movieController.getMovieUrl)
router.post('/getMoviesByName', movieController.getMoviesByName)

module.exports = router