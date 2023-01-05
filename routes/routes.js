var express = require('express');
const data = require('..');
var router = express.Router();


router.get('/ola', function (req, res) {
    res.send('ola');

});


router.get('*', function(req, res){
    res.redirect('http://localhost:8081/erro.html');
});



module.exports = router;