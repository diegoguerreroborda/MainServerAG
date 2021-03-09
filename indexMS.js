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

var studentsG;
//var datajson = {students : []};
var datajson = [];

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
/*
var dataC = {
    surname: "Buitrago",
    lastname: "Juna",
    phone: "gfw232"
};
*/

//Llega desde el middleware cuando se va a crear un nuevo estudiante
app.post('/new_student', async(req, res) => {
    console.log("llega del mid")
    //console.log(req.body)
    var student = new Student(req.body);
    await student.save(function(err) {
        console.log(student);
    });
    await Student.find({}, function(error, students){
        if(error){
            res.send('Error.');
        }else{
            studentsG = students;
            res.send(students)
        }
    })
    console.log(`Antes ${studentsG}`)
    //res.send(studentsG)
    console.log(`Despues ${studentsG}`)
})

async function getListStudents(){
    await Student.find({}, function(error, students){
        if(error){
            res.send('Error.');
        }else{
            studentsG = students;
        }
    })
}

app.get('/', function (req, res) {
    setTimeout(function(){
        res.send('oks');
    },aleatorio());	
});

//Se le envia la info al backup cada cierto tiempo
app.get('/students_backup', async(req,res) => {
    //res.send(studentsG)
    console.log("1")
    await getListStudents();
    console.log(studentsG)
    axios({
        method: 'post',
        url : `http://localhost:${4320}/students_backup`,
        data: {
          students: studentsG
        }
    }).then(response => {
        //datajson = response.data
        //fillDB();
        console.log("3")
        res.sendStatus(200)
    }).catch(err => {
        res.sendStatus(404)
        console.log(err);
    }); 
})

//Asigna DB al servidor nuevo, solo se ejecuta una vez, apenas se crea, se llama al backup
app.get('/recovery_db', async(req, res) => {
    //req.body
    
    await axios.get(`http://localhost:${4320}/backup_info`)
    .then(function (response) {
        //Hace una petición GET al servidor
        datajson = response.data;
        fillDB();
        res.sendStatus(200);
    }).catch(function (error) {
        res.sendStatus(404);
    });
});

//Restaura la BD cuando crea la nueva instancia
async function fillDB() {
    for(var i=0;i< datajson.students.length;i++){
        console.log('-------------inicio------' + i);
        console.log('Surname:' + datajson.students[i].surname);
        console.log('lastName:' + datajson.students[i].lastname);
        console.log('Phone:' + datajson.students[i].phone);
        console.log('--------------fin-----' + i);
        var student = new Student();
        student.surname = datajson.students[i].surname;
        student.lastname = datajson.students[i].lastname;
        student.phone = datajson.students[i].phone;
        await student.save(function(err) {
            console.log('Agregado');
        });
    }
  }

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})