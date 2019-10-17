const express = require('express')
const {auth} = require('../helpers/auth')
const {userController} = require('../controllers')

const router = express.Router()

router.post('/signup', userController.signup)
router.post('/resendemailconfirm', userController.resendEmailConfirm)
router.post('/emailConfirmed', userController.emailConfirmed)
router.post('/userLogin', userController.userLogin)
router.post('/userKeepLogin', auth, userController.userKeepLogin)

module.exports = router