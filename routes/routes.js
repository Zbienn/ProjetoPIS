var express = require('express');
var mustacheExpress = require('mustache-express');
var app = express();
var bodyParser = require('body-parser');
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

//app.engine('mustache', mustacheExpress());
//app.set('view engine', 'mustache'); //Extensão dos ficheiros das views
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

//-------------------------LOGIN------------------------------------------------

 router.post('/login', (req,res,next) => {
  console.log(req.body);
  connection.query("SELECT * FROM conta where `nomeConta`="+req.body.username, function (err, rows, fields) {
    if (err)
      console.log(err);
    else
      if(req.body.psw == rows[0].senha){
        const data = {
            userid:row[0].idconta,
            admin:row[0].administrador
        }
        const token = jwt.sign(data, 'PIS',{
          expiresIn:300
        });
        return res.json({ auth:true, token: token});

      }
  });
  res.status(500).json({message: 'Invalid Login.'});
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
  connection.query("SELECT * FROM conta where `idconta`="+req.params.id, function (err, rows, fields) {
    if (err)
    console.log(err);
    else
    res.render('updateuser', {
      id:rows[0].idconta,
      user:rows[0].nomeConta,
      pass:rows[0].senha,
      email:rows[0].emailConta,
      number:rows[0].telemovel
    });

  }); 

});


router.put('/users', function(req,res){
  console.log(req.body);  
  connection.query("UPDATE conta SET nomeConta='"+req.body.user +"', emailConta='"+req.body.email+"', senha='"+req.body.pass+"',  telemovel='"+req.body.number+"' WHERE idconta ='"+req.body.id+"'", function (err, rows, fields) {
    if (err)
    console.log(err);
    else
    res.sendStatus(200);

  });

  
});



//------------------LIVROS------------------------------------------------------  
router.get('/livros', function(req, res) {
 
  //connection.query("SELECT * FROM editora inner join (livro INNER JOIN (livroautor INNER JOIN autor ON livroautor.idAutor = autor.idAutor) ON livroautor.idLivro = livro.idLivro) ON editora.idEditora = livro.idEditora", function (err, rows, fields) {
  connection.query("SELECT * FROM editora inner join livro ON editora.idEditora = livro.idEditora", function (err, rows, fields) {
    if (err)
    console.log(err);
    else
    res.render('livros', {
      tabela:true,
      livros:rows
    });
    });
   
});

router.get('/livros/:id', function (req, res) {
  let checker = 0;

    //connection.connect();
  connection.query("SELECT * FROM editora inner join (livro INNER JOIN (livroautor INNER JOIN autor ON livroautor.idAutor = autor.idAutor) ON livroautor.idLivro = livro.idLivro) ON editora.idEditora = livro.idEditora where livro.idLivro="+req.params.id, function (err, rows, fields) {
  if (err)
  console.log(err);
  else
  res.render('livros', {
    tabela:true,
    livros:rows
  });
  });
});

  router.post('/livros', function(req, res){
    
      var response = {
        isbn: req.body.isbn,
        nomeLivro:req.body.titulo, 
        descricao:req.body.descricao,
        numeroPaginas:req.body.numeroPaginas,
        stock:req.body.stock,
        idEditora: req.body.idEditora
      };

    console.log(response);


    connection.query("INSERT INTO `livro` (`isbn`, `tituloLivro`, `descricao`, `numeroPaginas`, `stock`, `idEditora`) VALUES ('"+req.body.isbn+"', '"+req.body.titulo+"', '"+req.body.descricao+"', "+parseInt(req.body.numeroPaginas)+", "+parseInt(req.body.stock)+", "+parseInt(req.body.idEditora)+")", function (err, rows, fields) {
      if (err) {
        console.log(err);
        res.render('livros', {
          tabela:false,
          alert: "Livro não inserido!!"
        });
      }
      else
      res.redirect("http://localhost:8081/livros");

    });
  });

router.delete('/livros/:id', function (req, res) {
  let removerID = req.params.id;
  connection.query("DELETE FROM livro where idLivro="+req.params.id, function (err, rows, fields) {
    if (err)
    console.log(err);
    else
    res.sendStatus(200);
    //req.method ="GET";
    //res.redirect(303,"http://localhost:8081/users");
  });
  
});


router.get('/updateLivro/:id', function(req,res){
  let updateId = req.params.id;
  connection.query("SELECT * FROM livro where `idLivro`="+req.params.id, function (err, rows, fields) {
    if (err)
    console.log(err);
    else
    res.render('updateLivro', {
      id:rows[0].idLivro,
      isbn:rows[0].isbn,
      titulo:rows[0].tituloLivro,
      descricao:rows[0].descricao,
      numeroPaginas:rows[0].numeroPaginas,
      stock:rows[0].stock,
      idEditora:rows[0].idEditora
    });

  }); 

});


  router.get('/inserirLivroform', function (req, res) {
    /*connection.query("SELECT * FROM editora"), function (err, rows, fields) { 
      if (err) {
        console.log(err);
        res.render('livros', {
          tabela:false,
          alert: "Editora Erro!!"
        });
      }
      else {
        res.render('inserirLivroform', {
          tabela:true,
          editoras: rows
        });
      }

  }*/
    res.render('inserirLivroform');
    
  });

  router.put('/livros', function(req,res){
    console.log(req.body);  
    connection.query("UPDATE livro SET isbn='"+req.body.isbn +"', tituloLivro='"+req.body.titulo+"', descricao='"+req.body.descricao+"',  numeroPaginas='"+req.body.numeroPaginas+"',  stock='"+req.body.stock+"',  idEditora='"+req.body.idEditora+"' WHERE idLivro ='"+req.body.id+"'", function (err, rows, fields) {
      if (err) {
        console.log(err);
        res.render('livros', {
          tabela:false,
          alert: "Livro não Atualizado!!"
        });
      }
      else
      res.sendStatus(200);
  
    });
  
    
  });


//Login ------------------------------
 router.get('/login', function (req, res) {
    res.render('login');

});





module.exports = router;