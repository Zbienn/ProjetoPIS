var express = require('express');
var mustacheExpress = require('mustache-express');
var app = express();
var router = express.Router();
var mysql = require('mysql');
var connectionOptions = {
host: "localhost",
user: "root",
password: "",
database: "biblioteca"
};
var connection = mysql.createConnection(connectionOptions);
connection.connect();

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

//------------------USERS------------------------------------------------------

router.get('/users', function (req, res) {
  
  connection.query("SELECT * FROM conta", function (err, rows, fields) {
  if (err)
  console.log(err);
  else
  res.render('users', {
    tabela:true,
    users:rows
  });
  });
  //connection.end();
    
});

router.get('/users/:id', function (req, res) {
    let checker = 0;

    //connection.connect();
  connection.query("SELECT * FROM conta where `idconta`="+req.params.id, function (err, rows, fields) {
  if (err)
  console.log(err);
  else
  res.render('users', {
    tabela:true,
    users:rows
  });
  });
});


router.delete('/users/:id', function (req, res) {
    let removerID = req.params.id;
    connection.query("DELETE FROM conta where idconta="+req.params.id, function (err, rows, fields) {
      if (err)
      console.log(err);
      else
      res.sendStatus(200);
      //req.method ="GET";
      //res.redirect(303,"http://localhost:8081/users");
    });
    
  });

  router.get('/inseriruserform', function (req, res) {
    res.render('inseriruserform');
  });

  router.post('/users', function(req, res){
  
    var response = {
      user:req.body.user, 
      email:req.body.email,
      pass:req.body.pass,
      number:req.body.number,
    };

  console.log(response);

  connection.query("INSERT INTO `conta` (`nomeConta`, `emailConta`, `senha`, `telemovel`, `administrador`) VALUES ('"+req.body.user+"', '"+req.body.email+"', '"+req.body.pass+"', "+parseInt(req.body.number)+", 0)", function (err, rows, fields) {
    if (err)
    console.log(err);
    else
    res.redirect("http://localhost:8081/users");

  });
});

router.get('/updateuser/:id', function(req,res){
  let updateid = req.params.id;
 // connection.query("INSERT INTO `conta` (`nomeConta`, `emailConta`, `senha`, `telemovel`, `administrador`) VALUES ('"+req.body.user+"', '"+req.body.email+"', '"+req.body.pass+"', "+parseInt(req.body.number)+", 0)", function (err, rows, fields) {
 //   if (err)
 //   console.log(err);
 //   else
 //   res.redirect("http://localhost:8081/users");

  //}); 
  res.render('updateuser');

});



//------------------LIVROS------------------------------------------------------  
router.get('/livros', function(req, res) {
 
  res.render('livros', {
    livros: livros,
    tabela: true
    });
});

router.get('/livros/:id', function (req, res) {
  let checker = 0;
  
  for(let i=0; i < livros.length; i++){
    if (livros[i].id==req.params.id){
      checker = 1;
      res.render('livros', {
        livros: livros[i],
        tabela: true
      });
    }
  }
  
  if(checker==0){
    res.render('livros', {
      tabela: false,
      alert:"Não foi encontrado nenhum livro com o ID "+req.params.id+"!"
    });
  }
});

router.delete('/livrosEliminar/:id', function (req, res) {
  let checker = 0;
  let removerID;  //Irá guardar a posição do array com o id correspondente a eliminar
  for(let i=0; i < livros.length; i++) {
    if (livros[i].id==req.params.id){
      removerID = i;
      checker = 1;
      
    }
  }

  if(checker == 1) {
    livros.splice(removerID, 1);
    res.render('livros', {
      tabela:false,
      alert: "Livro com o ID "+req.params.id+" removido!!"
    });
  } else {
    res.render('livros', {
      tabela:false,
      alert:"Não foi encontrado nenhum livro com o ID "+req.params.id+"!"
    });
  }
});



  router.get('/inserirLivroform', function (req, res) {
    res.render('inserirLivroform');
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





module.exports = router;