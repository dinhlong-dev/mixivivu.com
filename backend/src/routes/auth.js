const authController = require("../controllers/authController")
const authMiddleware = require('../middleware/auth')

const router = require("express").Router()

router.post('/', authController.registerUser)
router.get('/', authController.getAllUser)
router.delete('/', authController.deleteAllUser)

// LOGIN USER
router.post('/login', authController.loginUser)

router.get('/dashboard', authMiddleware, authController.getDashboard)

module.exports = router;