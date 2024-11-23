const authController = require("../controllers/authController")

const router = require("express").Router()

router.post('/', authController.registerUser)
router.get('/', authController.getAllUser)
router.delete('/', authController.deleteAllUser)
router.post('/login', authController.loginUser)

module.exports = router;