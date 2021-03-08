const express = require('express');
const axios = require('axios');
const cors = require('cors');
const shell = require('shelljs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const port = 3000;
const urlDB = 'mongodb://localhost/primera_pagina';
const app = express()
app.use(cors())
app.use(bodyParser.json())

function aleatorio() {
	var number = Math.round((Math.random()*(6)+1)*1000);
	console.log(number);
    return number;
}

mongoose.connect(urlDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

//Definir el esquema
var studentSchema = {
    surname:String,
    lastname:String,
    phone:String
};

var Student = mongoose.model("Student", studentSchema);

var dataC = {
    surname: "Buitrago",
    lastname: "Juna",
    phone: "gfw232"
};

app.post('/new_student', async(req, res) => {
    console.log("llega del mid")
    //console.log(req.body)
    var student = new Student(req.body);
    await student.save(function(err) {
        console.log(student);
    });
    Student.find({}, function(error, students){
        if(error){
           res.send('Error.');
        }else{
           res.send(students);
        }
     })
})

app.get('/', function (req, res) {
    setTimeout(function(){
        res.send('oks');
    },aleatorio());	
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})