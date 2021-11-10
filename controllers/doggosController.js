
const axios = require('axios')


function getAllDoggos(req, res) {
    axios.get('https://random.dog/doggos')
    .then(({data}) => {
        const allData = []
        const urlData = 'https://random.dog/'
        for (var i = 0; i < data.length; i++) {
            allData.push(urlData + data[i])
        }
        res.status(200).json({
            message: 'successfully get all data doggos',
            allData
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            message: 'Internal server error',
        })
    })
}

function random(req, res) {
    axios.get('https://random.dog/woof.json')
    .then(({data}) => {
        res.status(200).json({
            message: 'succes',
            data
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            message: 'Internal server error'
        })
    })
}

module.exports = {
    getAllDoggos,
    random
}