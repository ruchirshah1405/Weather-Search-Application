const express = require('express');
var cors = require('cors');
const app = express();
var path = require('path');
app.use(cors());
app.listen(8081, () => console.log('Server started'))


app.use(express.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

const cityRoute = require('./routes/autocity')
app.use('/autocity',cityRoute)

app.use(express.static(path.join(__dirname, 'dist/HW8-angular')));



