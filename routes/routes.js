var express = require('express');
var mustacheExpress = require('mustache-express');
var app = express();
var router = express.Router();
var users = require('../users.json');

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache'); //Extensão dos ficheiros das views
app.set('views', __dirname + '/view'); 

router.get('/', function(req, res) {
  res.render('home', {
  });
});

router.get('/ola', function (req, res) {
    res.send('ola');

});

router.get('/erro', function (req, res) {
    res.render('erro');

});

router.get('/users', function (req, res) {
    res.render('users', {
      users:users
    });
  });

  router.get('/inseriruserform', function (req, res) {
    res.render('inseriruserform');
  });

  router.post('/inseriruser', function (req, res) {
    const user = {id: 0, user: "", password: "", admin: false};
    user.id = parseInt(req.body.id);
    user.user = req.body.user;
    user.password = req.body.pass;
    users.push(user);
    console.log(users)
    res.redirect('http://localhost:8081');

 });


 router.get('/login', function (req, res) {
    res.render('login');

});

router.get('*', function(req, res){
    res.redirect('http://localhost:8081/erro');
});



module.exports = router;