

const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const verify = require('../middleware/verify')


router.get('/', userController.getAll)
router.post('/register', userController.register)
router.post('/login', userController.login)


router.post('/addToFavourite/:id', verify.authenticate, verify.authorize, userController.addToFavourite)

module.exports = router