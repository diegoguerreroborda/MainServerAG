const express = require('express');
const axios = require('axios');
const cors = require('cors');
const shell = require('shelljs');
const mongoose = require('mongoose');
const port = 4321;

const app = express()
app.use(cors())

function aleatorio() {
	var number = Math.round((Math.random()*(6)+1)*1000);
	console.log(number);
    return number;
}

mongoose.connect('mongodb://localhost/primera_pagina', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

//Definir el esquema
var studentSchema = {
    id:Number,
    lastname:String,
    surname:String,
    phone:String
};

var Student = mongoose.model("Student", studentSchema);

var dataC = {
    id: 1221,
    lastname: "Buitrago",
    surname: "Diego",
    phone: "gfw232"
};

app.get('/new_student', (req, res) => {
    //Todavia no sé cómo llega
    var student = new Student(dataC);
    student.save(function(err) {
        console.log(student);
    });
})

app.get('/', function (req, res) {
    setTimeout(function(){
        res.send('oks');
    },aleatorio());	
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})