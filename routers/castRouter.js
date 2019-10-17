const express = require('express')
const { castController } = require('../controllers')

const router = express.Router()

router.post('/castList', castController.castList)
router.post('/movieCast', castController.movieCast)
router.post('/castDetails', castController.castDetails)
router.post('/castMovies', castController.castMovies)
router.post('/updatePopularity', castController.updatePopularity)


module.exports = router