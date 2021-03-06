const express = require('express');
const axios = require('axios');
const cors = require('cors');
const shell = require('shelljs');
const port = 4321;

const app = express()
app.use(cors())

function aleatorio() {
	var number = Math.round((Math.random()*(6)+1)*1000);
	console.log(number);
    return number;
}

app.get('/', function (req, res) {
    setTimeout(function(){
        res.send('oks');
    },aleatorio());	
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})