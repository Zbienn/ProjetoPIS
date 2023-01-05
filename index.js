var express = require('express');
var app = express();
var mustacheExpress = require('mustache-express');

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/view'); //definição de uma pasta 'public'
app.use(express.urlencoded({extended: true}));
var rotas = require('./routes/routes.js');

var mustacheExpress = require('mustache-express');

var path = require('path');

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache'); //Extensão dos ficheiros das views
app.set('views', __dirname + '/view'); //Indicação de qual a pasta que irá colocar as views

app.get('/', function(req, res) {
    res.render('login', {
        title: 'Hey',
        message: 'Hello there!'
        })
    
});


app.use('/', rotas);
app.listen(8081);