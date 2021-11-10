const schoolDB = require('../models/favouriteDogDB')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

function getAll(req, res) {
    var sql = 'SELECT * FROM users'
    schoolDB.query(sql, function(err, data) {
        if (err) {
            console.log(err)
            res.status(500).json({
                message: 'Internal Server Error'
            })
        } else {
            // console.log(JSON.stringify(data[0].favourite_dog))
            for (var i = 0; i < data.length; i++) {
                data[i].favourite_dog = JSON.parse(data[i].favourite_dog)
            }
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
            console.log(err)
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
            console.log(err)
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
                    console.log(err)
                    res.status(500).json({
                        message: 'Internal Server Error'
                    })
                } else if (result === false) {
                    res.status(404).json({
                        message: 'wrong password'
                    })
                } else {
                    var token = jwt.sign({ 
                        id: data[0].id,
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
            res.status(200).json({
                message: 'OK success update',
                data
            })
        }
    })
}
module.exports = {
    getAll,
    register,
    login,
    addToFavourite
}