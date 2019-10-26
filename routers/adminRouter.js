const express = require('express')
const { adminController } = require('../controllers')

const router = express.Router()

router.post('/getAllUser', adminController.getAllUser)
router.post('/updateUser', adminController.updateUser)
router.post('/suspendUser', adminController.suspendUser)

module.exports = router