var express = require('express');
const data = require('..');
var router = express.Router();


router.get('/ola', function (req, res) {
    res.send('ola');

});

router.get('/users', function (req, res) {
    res.render('users');
  });

  router.get('/inseriruserform', function (req, res) {
    res.render('inseriruserform');
  });

  router.post('/inseriruser', function (req, res) {
    var response = {
        id:req.body.id,
        user:req.body.user, 
        pass:req.body.pass
    };
    console.log(response);
    res.redirect('http://localhost:8081');

 });




router.get('*', function(req, res){
    res.redirect('http://localhost:8081/erro.html');
});



module.exports = router;