const express = require('express')
const app = express()

app.get('/', function (req, res) {
    res.send('Hello World')
})
console.log('il server è in ascolto sulla porta http://localhost:3000');
app.listen(3000)
console.log('fine');
