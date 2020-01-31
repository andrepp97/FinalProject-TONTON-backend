const express = require('express')
const {auth, authEmail} = require('../helpers/auth')
const {userController} = require('../controllers')

const router = express.Router()

router.post('/signup', userController.signup)
router.post('/resendemailconfirm', userController.resendEmailConfirm)
router.post('/emailConfirmed', authEmail, userController.emailConfirmed)
router.post('/userLogin', userController.userLogin)
router.post('/userKeepLogin', auth, userController.userKeepLogin)
router.get('/calcUserSubs/:idUser', userController.calcUserSubs)
router.post('/userCancelPlan/', userController.userCancelPlan)

router.post('/getPriceData', userController.getPriceData)
router.post('/userUpgradePremium', userController.userUpgradePremium)
router.post('/userCreateEventTimeout', userController.userCreateEventTimeout)
router.post('/getUserBillById', userController.getUserBillById)
router.post('/getUserBills', userController.getUserBills)
router.post('/userUploadReceipt', userController.userUploadReceipt)

module.exports = router