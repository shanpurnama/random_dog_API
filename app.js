require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT
const bodyParser = require('body-parser')

app.use(bodyParser.json())

const routerDoggos = require('./routers/doggos')
app.use('/doggos', routerDoggos)
// app.use('/getRandomDoggos', routerDoggos)



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })