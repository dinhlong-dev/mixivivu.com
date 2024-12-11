const paymentController = require('../controllers/paymentController')

const router = require('express').Router()

router.post('/', paymentController.createPayment)

router.post('/callback', paymentController.paymentCallback)

router.post('/transaction-status', paymentController.transactionStatus)

module.exports = router