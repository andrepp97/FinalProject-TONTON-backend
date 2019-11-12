const express = require('express')
const { adminController } = require('../controllers')

const router = express.Router()

// MANAGE USER //
router.post('/getAllUser', adminController.getAllUser)
router.post('/updateUser', adminController.updateUser)
router.post('/suspendUser', adminController.suspendUser)
// MANAGE USER //

// MANAGE MOVIES //
router.post('/getAllMovies', adminController.getAllMovies)
// MANAGE MOVIES //

// MANAGE GENRE //
router.get('/getAllGenre', adminController.getAllGenre)
router.post('/addNewGenre', adminController.addNewGenre)
router.delete('/deleteGenre/:idGen', adminController.deleteGenre)
// MANAGE GENRE //

// MANAGE ARTISTS //
router.get('/getAllArtist', adminController.getAllArtist)
// MANAGE ARTISTS //

module.exports = router