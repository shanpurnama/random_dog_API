const express = require('express')
const router = express.Router()
const dogosController = require('../controllers/controllerDoggos')

router.get('/getAllDoggos', dogosController.getAllDoggos)
router.get('/random', dogosController.random)


module.exports = router