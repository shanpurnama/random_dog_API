

const e = require('express')
const jwt = require('jsonwebtoken')
const favouriteDogDb = require('../models/favouriteDogDB')

function authenticate(req, res, next) {
    try {
        jwt.verify(req.headers.token, process.env.PRIVATE_KEY)
        next()
      } catch(err) {
        res.status(err).json(400).json({
            message: 'unauthenticate'
        })
      }
}



function authorize(req, res, next) {
    try {
        const decode = jwt.verify(req.headers.token, process.env.PRIVATE_KEY)
        const sql = `
        SELECT *
        FROM
            users
        WHERE
            users.id = '${req.params.id}'`
        favouriteDogDb.query(sql, function(err, data) {
            if (err) {
                console.log(err)
                res.status(500).json({
                    message: 'Internal Server Error'
                })
            } else {
                if (data[0].id === decode.id) {
                    next()
                } else {
                    console.log(err)
                    res.status(400).json({
                        message: 'Unautorized'
                    })
                }
            } 
        })
    } catch(err) {
        res.status(400).json({
            message: 'unautorize'
        })
    }
}

module.exports = {
    authenticate,
    authorize
}