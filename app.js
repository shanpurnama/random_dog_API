require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT
const bodyParser = require('body-parser')

app.use(bodyParser.json())

const doggosRouter = require('./routers/doggos')
app.use('/doggos', doggosRouter)

const userRouter = require('./routers/user')
app.use('/users', userRouter)



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })