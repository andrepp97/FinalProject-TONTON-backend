const express = require('express')
const { watchlistController } = require('../controllers')

const router = express.Router()

router.post('/checkWatchlist', watchlistController.checkWatchlist)
router.post('/addToWatchlist', watchlistController.addToWatchlist)
router.post('/removeFromWatchlist', watchlistController.removeFromWatchlist)
router.post('/getUserWatchlist', watchlistController.getUserWatchlist)

module.exports = router