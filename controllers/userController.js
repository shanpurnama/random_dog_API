const schoolDB = require('../models/favouriteDogDB')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

function getAll(req, res) {
    var sql = 'SELECT * FROM users'
    schoolDB.query(sql, function(err, data) {
        if (err) {
            res.status(500).json({
                message: 'Internal Server Error'
            })
        } else {
            res.status(200).json({
                message: 'OK SUCCESFULLY',
                data
            })
        }
    })
}

function register(req, res) {
    const data = {
        email: req.body.email
    }
    const sql = 'SELECT * FROM users WHERE ?'
    schoolDB.query(sql, data, function(err) {
        if (err) {
            res.status(500).json({
                message: 'Internal Server Error'
            })
        } else if (data.length > 0) {
            res.status(400).json({
                message: 'email already used'
            })
        } else {
            const uuid = uuidv4()
            bcrypt.hash(req.body.password, 3, function(err, hash) {
                if (err) {
                    console.log(err)
                    res.status(500).json({
                        message: 'Internal Server Error'
                    })
                } else {
                    const dataTeacher = {
                        id: uuid,
                        email: req.body.email,
                        password: hash,
                    }
                    var sql = 'INSERT INTO users SET ?'
                    schoolDB.query(sql, dataTeacher, function(err) {
                        if (err) {
                            console.log(err)
                            res.status(500).json({
                                message: 'Internal Server Error'
                            })
                        } else {
                            res.status(201).json({
                                message: 'Success create new user'
                            })
                        }
                    })
                }
            })
        }
    })
}

function login(req, res) {
    const dataEmail = {
        email: req.body.email
    }
    schoolDB.query('SELECT * FROM users WHERE ?', dataEmail, function(err, data) {
        if (err) {
            res.status(500).json({
                message: 'Internal Server Error'
            })
        } else if (data.length === 0) {
            res.status(404).json({
                message: 'wrong username and password or cant find email'
            })
        } else {
            bcrypt.compare(req.body.password, data[0].password, function(err, result) {
                if (err) {
                    res.status(500).json({
                        message: 'Internal Server Error'
                    })
                } else if (result === false) {
                    res.status(404).json({
                        message: 'wrong password'
                    })
                } else {
                    var token = jwt.sign({ 
                        email: data[0].email}, 
                        process.env.PRIVATE_KEY)
                    res.status(200).json({
                        message: 'OK successfully login',
                        token,
                    })
                }
            })
        }
    })
}

function addToFavourite(req, res) {
    // console.log('masukkk nih')
    // console.log(req.params.id)
    // console.log(req.body.favourite)
    const sql = `
    UPDATE
        users
    SET?
    WHERE
        id = '${req.params.id}'`

    const data = [
        {
            favourite_dog: JSON.stringify(req.body.favourite)
        }
    ]
    schoolDB.query(sql, data, function(err) {
        if (err) {
            console.log(err)
            res.status(500).json({
                message: 'Internal Server Error'
            })
        } else {
            // const newData = JSON.parse(data)
            res.status(200).json({
                message: 'OK success update',
                data
            })
            // console.log(JSON.parse(data[0].favourite_dog))
            // var tampung = []
            // for (var i = 0; i < data.length; i++) {
            //     // console.log(data[i])
            //     tampung.push(JSON.parse(data[i]))
            //     console.log(tampung)
            // }
            // console.log(JSON.parse(data.favourite_dog))
            // console.log(JSON.parse(req.body.favourite))
            // console.log(contoh)
            // var tampung =  []
            // for (var i = 0; i < req.body.favourite.length; i++) {
            //     console.log(JSON.stringify(req.body.favourite[i]))
                // tampung += req.body.favourite[i]
            // }
            // console.log(tampung)
            // console.log(data)
            // const tampung = []
            // for (var i = 0; i < data.length; i++) {
            //     // console.log(JSON.parse(data[i].favourite_dog))
            //     tampung.push(JSON.parse(data[i].favourite_dog))
            // }
            // console.log(tampung)
            // for (var i = 0; i < data[0].length; i++) {
            //     console.log(data[i][0])
            // }
            
            // console.log(tampung)
            // console.log(JSON.parse(tampung))
            // console.log(data[0])
            // for (var i = 0; i < data.length; i++) {
            //     console.log(JSON.parse(data[i].favourite_dog))
            // }
            // res.status(200).json({
            //     message: 'OK success update',
            //     // tampung
            //     data
            // })
        }
    })
}
module.exports = {
    getAll,
    register,
    login,
    addToFavourite
}