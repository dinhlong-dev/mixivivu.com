const OAuthController = require("../controllers/OAuthController")

const router = require("express").Router()

router.get('/', OAuthController.getAuthUrl)

module.exports = router