var express = require('express');
var app = express();
var mustacheExpress = require('mustache-express');

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/view'); //definição de uma pasta 'public'
app.use(express.urlencoded({extended: true}));

var rotas = require('./routes/routes.js');

var path = require('path');

app.get('/', function(req, res) {
    res.render('home', {
        title: 'Hey',
        message: 'Hello there!'
        })
    
});


app.use('/', rotas);
app.listen(8081);