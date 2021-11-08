const express = require('express')
const router = express.Router()
const doggosController = require('../controllers/doggosController')

router.get('/getAll', doggosController.getAllDoggos)
router.get('/random', doggosController.random)


module.exports = router