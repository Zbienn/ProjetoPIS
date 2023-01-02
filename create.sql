DROP DATABASE IF EXISTS biblioteca;
CREATE DATABASE IF NOT EXISTS biblioteca;

USE biblioteca;

CREATE TABLE conta(idconta int PRIMARY KEY AUTO_INCREMENT, 
nomeConta varchar(50) not null unique,
emailConta varchar(100) not null unique,
senha varchar(50) not null,
telemovel varchar(9) not null unique,
optionalTel varchar(9),
administrador boolean );

CREATE TABLE autor(idAutor int PRIMARY KEY AUTO_INCREMENT, 
nomeAutor varchar(70) not null);

CREATE TABLE categoria(idCategoria int PRIMARY KEY AUTO_INCREMENT,
nomeCategoria varchar(40) not null unique);

CREATE TABLE editora(idEditora int PRIMARY KEY AUTO_INCREMENT, 
nomeEditora varchar(50) not null unique,
sigla varchar(10) not null,
morada varchar(40));

CREATE TABLE livro(idLivro int PRIMARY KEY AUTO_INCREMENT,
isbn varchar(20) not null unique,
nomeLivro varchar(40) not null,
descricao varchar(300),
stock int not null,
idEditora int not null unique,
FOREIGN KEY(idEditora) REFERENCES editora(idEditora));

CREATE TABLE livroCategoria(idLivro int not null,
idCategoria int not null,
FOREIGN KEY(idLivro) REFERENCES livro(idLivro),
FOREIGN KEY(idCategoria) REFERENCES categoria(idCategoria),
PRIMARY KEY(idLivro, idCategoria));

CREATE TABLE livroAutor(idLivro int not null,
idAutor int not null,
FOREIGN KEY(idLivro) REFERENCES livro(idLivro),
FOREIGN KEY(idAutor) REFERENCES autor(idAutor), 
PRIMARY KEY(idLivro, idAutor));

CREATE TABLE requesitado(idLivro int not null, 
idConta int not null,
FOREIGN KEY(idLivro) REFERENCES livro(idLivro),
FOREIGN KEY(idConta) REFERENCES conta(idConta),
PRIMARY KEY(idLivro, idConta));