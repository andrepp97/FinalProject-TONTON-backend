const express = require('express')
const { movieController } = require('../controllers')

const router = express.Router()

router.get('/moviePoster', movieController.moviePoster)
router.get('/moviePosterNew', movieController.moviePosterNew)
router.get('/movies/:idMov', movieController.movieData)
router.get('/getGenre/:idMov', movieController.getMovieGenre)


module.exports = router