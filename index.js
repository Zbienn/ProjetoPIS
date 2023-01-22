var express = require('express');
var app = express();
var mustacheExpress = require('mustache-express');
var jwt = require('jsonwebtoken');

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/view'); //definição de uma pasta 'public'
app.use(express.static(__dirname + '/view'));
app.use(express.urlencoded({extended: true}));

var rotas = require('./routes/routes.js');

app.use('/', rotas);
app.listen(8081);


