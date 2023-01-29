var express = require('express');
var mustacheExpress = require('mustache-express');
var app = express();
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
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

//app.engine('mustache', mustacheExpress());
//app.set('view engine', 'mustache'); //Extensão dos ficheiros das views
app.set('views', __dirname + '/view'); 

app.use(cookieParser());

//Rotas
router.get('/', function(req, res) {
  res.render('login', {
  });
});



router.get('/home', verifyJWT, function(req, res) {
  if(req.userAdmin == 1) {
    res.render('home', {

    });
  } else {
    res.render('homeC', {
      
    });
  }
  
})

router.get('/erro', function (req, res) {
    res.render('erro');

});

router.get('/registerform', function(req, res){
  res.render('registerform');
});

//-------------------------LOGIN------------------------------------------------

 router.post('/login', (req,res,next) => {
  console.log(req.body);
  connection.query("SELECT * FROM conta where nomeConta='"+req.body.user+"'", function (err, rows, fields) {
    if (err) {
      console.log(err);
      res.status(500).json({message: 'Invalid Login.'});
    }
    else {
      try{
      if(req.body.pass == rows[0].senha){
        const data = {
          userid: rows[0].idconta,
          admin: rows[0].administrador
        }
        const token = jwt.sign(data, 'PIS',{
          expiresIn:300
        });

        res.cookie("access_token", token);
        res.status(200).json({ auth: true, data: data });
        
      }
      else res.status(500).json({message: 'Invalid Login.'});
    }
    catch{
      res.status(500).json({message: 'Invalid Login.'});
    }

    }
  });
});


//Cookies erro de core

function verifyJWT(req, res, next){
  const token = req.cookies.access_token;
 
  if (!token) 
    return res.status(401).json({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, 'PIS', function(err, decoded) {
    if (err) 
      return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
  
    // se tudo estiver ok, salva no request para uso posterior
    req.userAdmin = decoded.admin;
    req.userid = decoded.userid;
    next();
  });
}
 


//------------------USERS------------------------------------------------------

router.get('/users',verifyJWT, function (req, res) {
  if(req.userAdmin == 1){
    console.log(req.userid);
    connection.query("SELECT * FROM conta", function (err, rows, fields) {
    if (err)
    console.log(err);
    else
    res.render('users', {
      tabela:true,
      users:rows
    });
    });
  }else{
    res.redirect("http://localhost:8081/home");
  }
  //connection.end();
    
});


router.get('/usersClientes',verifyJWT, function (req, res) {
  console.log(req.userid);
  connection.query("SELECT * FROM conta where idconta = "+ req.userid, function (err, rows, fields) {
  if (err)
  console.log(err);
  else
  res.render('usersClientes', {
    tabela:true,
    users:rows
  });
  });
  //connection.end();
    
});

router.get('/users/:id', verifyJWT,function (req, res) {
  if(req.userAdmin == 1){
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
  }else{
    res.redirect("http://localhost:8081/home");
  }
});

router.get('/usersClientes/:id', verifyJWT,function (req, res) {
  let checker = 0;

  //connection.connect();
connection.query("SELECT * FROM conta where `idconta`="+req.params.id, function (err, rows, fields) {
if (err)
console.log(err);
else
res.render('usersClientes', {
  tabela:true,
  users:rows
});
});
});


router.delete('/users/:id',verifyJWT, function (req, res) {
  if(req.userAdmin == 1){
      let removerID = req.params.id;
      connection.query("DELETE FROM conta where idconta="+req.params.id, function (err, rows, fields) {
        if (err)
        console.log(err);
        else
        res.sendStatus(200);
        //req.method ="GET";
        //res.redirect(303,"http://localhost:8081/users");
      });
    }else{
      res.redirect("http://localhost:8081/home");
    }
  });

  router.get('/inseriruserform',verifyJWT, function (req, res) {
    if(req.userAdmin == 1){
      res.render('inseriruserform');
    }else{
      res.redirect("http://localhost:8081/home");
    }
  });

  router.post('/users',verifyJWT, function(req, res){
    if(req.userAdmin == 1){
  
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
}else{
  res.redirect("http://localhost:8081/home");
}
});

router.post('/register', function(req, res){
  connection.query("INSERT INTO `conta` (`nomeConta`, `emailConta`, `senha`, `telemovel`, `administrador`) VALUES ('"+req.body.user+"', '"+req.body.email+"', '"+req.body.pass+"', "+parseInt(req.body.number)+", 0)", function (err, rows, fields) {
    if (err)
    console.log(err);
    else
    res.sendStatus(200);

  });
});

router.get('/updateuser/:id',verifyJWT, function(req,res){
  if(req.userAdmin == 1){
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
}else{
  res.redirect("http://localhost:8081/home");
}
});

router.get('/updateuserClientes/:id',verifyJWT, function(req,res){
  let updateid = req.params.id;
  connection.query("SELECT * FROM conta where `idconta`="+req.params.id, function (err, rows, fields) {
    if (err)
    console.log(err);
    else
    res.render('updateuserClientes', {
      id:rows[0].idconta,
      user:rows[0].nomeConta,
      pass:rows[0].senha,
      email:rows[0].emailConta,
      number:rows[0].telemovel
    });

  }); 

});


router.put('/users',verifyJWT, function(req,res){
  if(req.userAdmin == 1){
  console.log(req.body);  
  connection.query("UPDATE conta SET nomeConta='"+req.body.user +"', emailConta='"+req.body.email+"', senha='"+req.body.pass+"',  telemovel='"+req.body.number+"' WHERE idconta ='"+req.body.id+"'", function (err, rows, fields) {
    if (err)
    console.log(err);
    else
    res.sendStatus(200);

  });
}else{
  res.redirect("http://localhost:8081/home");
}
  
});


router.put('/usersClientes',verifyJWT, function(req,res){
  console.log(req.body);  
  connection.query("UPDATE conta SET nomeConta='"+req.body.user +"', emailConta='"+req.body.email+"', senha='"+req.body.pass+"',  telemovel='"+req.body.number+"' WHERE idconta ='"+req.body.id+"'", function (err, rows, fields) {
    if (err) {
      console.log(err);
    }
    else {
      res.clearCookie("access_token");
      res.sendStatus(200);
    }
    
  });

  
});

//------------------LIVROS------------------------------------------------------  
router.get('/livros', verifyJWT, function(req, res) {
  if(req.userAdmin == 1){
 
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
  }else{
    res.redirect("http://localhost:8081/home");
  }
});

router.get('/livros/:id',verifyJWT, function (req, res) {
  if(req.userAdmin == 1){
 
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
}else{
  res.redirect("http://localhost:8081/home");
}
});

router.get('/livrosClientes/:id', function (req, res) {
  let checker = 0;

    //connection.connect();
  connection.query("SELECT * FROM editora inner join (livro INNER JOIN (livroautor INNER JOIN autor ON livroautor.idAutor = autor.idAutor) ON livroautor.idLivro = livro.idLivro) ON editora.idEditora = livro.idEditora where livro.idLivro="+req.params.id, function (err, rows, fields) {
  if (err)
  console.log(err);
  else
  res.render('livrosClientes', {
    tabela:true,
    livros:rows
  });
  });
});

router.get('/livrosClientes', function(req, res) {
 
  //connection.query("SELECT * FROM editora inner join (livro INNER JOIN (livroautor INNER JOIN autor ON livroautor.idAutor = autor.idAutor) ON livroautor.idLivro = livro.idLivro) ON editora.idEditora = livro.idEditora", function (err, rows, fields) {
  connection.query("SELECT * FROM editora inner join livro ON editora.idEditora = livro.idEditora", function (err, rows, fields) {
    if (err)
    console.log(err);
    else
    res.render('livrosClientes', {
      tabela:true,
      livros:rows
    });
    });
   
});

router.post('/livros',verifyJWT, function(req, res){
  if(req.userAdmin == 1){
 
    
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
  }else{
    res.redirect("http://localhost:8081/home");
  }
});

router.delete('/livros/:id',verifyJWT, function (req, res) {
  if(req.userAdmin == 1){
  let removerID = req.params.id;
  connection.query("DELETE FROM livro where idLivro="+req.params.id, function (err, rows, fields) {
    if (err)
    console.log(err);
    else
    res.sendStatus(200);
    //req.method ="GET";
    //res.redirect(303,"http://localhost:8081/users");
  });
}else{
  res.redirect("http://localhost:8081/home");
}
});


router.get('/updateLivro/:id',verifyJWT, function(req,res){
  if(req.userAdmin == 1){
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
}else{
  res.redirect("http://localhost:8081/home");
}
});


router.get('/inserirLivroform',verifyJWT, function (req, res) {
  if(req.userAdmin == 1){
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
  }else{
    res.redirect("http://localhost:8081/home");
  }  
});

router.put('/livros',verifyJWT, function(req,res){
  if(req.userAdmin == 1){
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
  }else{
    res.redirect("http://localhost:8081/home");
  } 
    
});


//Login ------------------------------
 router.get('/loginform', function (req, res) {
    res.render('login');

});





module.exports = router;