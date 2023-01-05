var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.send('Inicio de aplicação');
});

app.listen(8081);