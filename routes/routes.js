var express = require('express');
var mustacheExpress = require('mustache-express');
var app = express();
var router = express.Router();

//Dados Json
var users = require('../users.json');
var livros = require('../livros.json');

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache'); //Extensão dos ficheiros das views
app.set('views', __dirname + '/view'); 

//Rotas
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

  router.get('/users/:id', function (req, res) {
    let checker = 0;
    console.log(users.length);
    for(let i=0; i < users.length; i++){
      if (users[i].id==req.params.id){
        checker = 1;
        res.render('users', {
          users:users[i]
        });
      }
    }
    
    if(checker==0){
      res.render('users', {
        alert:"Não foi encontrado nenhum user com o ID "+req.params.id+"!"
      });
    }
  });

router.get('/livros', function(req, res) {
  res.render('livros', {
    livros: livros
  });
});

  router.get('/inseriruserform', function (req, res) {
    res.render('inseriruserform');
  });

  router.get('/inserirLivroform', function (req, res) {
    res.render('inserirLivroform');
  });

  router.post('/inseriruser', function (req, res) {
    let user = {id: 0, user: "", password: "", admin: false};
    user.id = parseInt(req.body.id);
    user.user = req.body.user;
    user.password = req.body.pass;
    users.push(user);
    console.log(users)
    res.redirect('http://localhost:8081');

 });

 router.post('/inserirlivro', function (req, res) {
  const livro = {id: 0, isbn: "", titulo: "", numeroPaginas: 0, stock: 0, idEditora: 0};
  livro.id = parseInt(req.body.id);
  livro.isbn = req.body.isbn;
  livro.titulo = req.body.titulo;
  livro.tituloLivro = req.body.titulo;
  livro.numeroPaginas = req.body.numeroPaginas;
  livro.stock = req.body.stock;
  livro.idEditora = parseInt(req.body.idEditora);
  livros.push(livro);
  console.log(livros);
  res.render('home', {
  });
});


 router.get('/login', function (req, res) {
    res.render('login');

});

router.get('*', function(req, res){
    res.redirect('http://localhost:8081/erro');
});



module.exports = router;