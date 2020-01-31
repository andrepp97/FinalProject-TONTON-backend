const express = require('express')
const { adminController } = require('../controllers')

const router = express.Router()

// MANAGE USER //
router.post('/getAllUser', adminController.getAllUser)
router.post('/updateUser', adminController.updateUser)
router.post('/suspendUser', adminController.suspendUser)
router.get('/getUserPayment', adminController.getUserPayment)
router.post('/verifyPayment', adminController.verifyPayment)
router.post('/declinePayment', adminController.declinePayment)
// MANAGE USER //

// MANAGE MOVIES //
router.get('/getAllMovies', adminController.getAllMovies)
router.post('/addNewMovie', adminController.addNewMovie)
router.delete('/deleteMovie/:idMov', adminController.deleteMovie)
// MANAGE MOVIES //

// MANAGE GENRE //
router.get('/getAllGenre', adminController.getAllGenre)
router.post('/addNewGenre', adminController.addNewGenre)
router.delete('/deleteGenre/:idGen', adminController.deleteGenre)
// MANAGE GENRE //

// MANAGE ARTISTS //
router.get('/getArtists', adminController.getArtists)
router.get('/getAllArtist', adminController.getAllArtist)
router.post('/addNewArtist', adminController.addNewArtist)
router.post('/updateArtist/:idCast', adminController.updateArtist)
router.delete('/deleteArtist/:idCast', adminController.deleteArtist)
// MANAGE ARTISTS //

module.exports = router