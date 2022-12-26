const express    = require('express');
const path       = require('path');
const bodyParser = require('body-parser');
const app        = express();

const bcrypt     = require('bcrypt');
const User       = require('./public/user');

// CREDENCIALES DE LA BASE DE DATOS
const usuario = 'brayand';
const password = 'tecsup2022';
const dbname = 'instituto';
const uri = `mongodb+srv://${usuario}:${password}@logindelgadillo.kwaopik.mongodb.net/${dbname}?retryWrites=true&w=majority`;

//conexión a BASE DE DATOS
const mongoose   = require('mongoose');
mongoose.connect(uri,
    { useNewUrlParser: true, useUnifiedTopology: true }
)
    .then(() => console.log(`Base de datos conectada: ${dbname}`))
    .catch(e => console.log(e))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public'))); 

app.get('/', (req, res) =>{

});

app.post('/register', (req, res) =>{
    const {username, password} = req.body;

    const user = new User({username, password});

    user.save(err =>{
        if(err){
            res.status(500).send('ERROR AL REGISTRAR AL USUARIO');
        }else{
            res.status(200).send('USUARIO REGISTRADO');
        }
    });
});
app.post('/authenticate', (req, res) =>{
    const {username, password} = req.body;

    User.findOne({username}, (err, user) =>{
        if(err){
            res.status(500).send('ERROR AL AUTENTICAR AL USUARIO');
        }else if(!user){
            res.status(500).send('EL USUARIO NO EXISTE');
        }else{
            user.isCorrectPassword(password, (err, result) =>{
                if(err){
                    res.status(500).send('ERROR AL AUTENTICAR');
                }else if(result){
                    res.status(200).send('USUARIO AUTENTICADO CORRECTAMENTE');
                }else{
                    res.status(500).send('ERROR AL AUTENTICAR AL USUARIO');
                }
            });
        }
    });
});

app.listen(3000, () =>{
    console.log('server started');
})

module.exports = app;