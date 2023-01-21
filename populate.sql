insert into conta (nomeConta, emailConta, senha, telemovel,administrador) values ("Guilherme", 'gui@gmail.com', "adm321", '901234567',  1); 
insert into conta (nomeConta, emailConta, senha, telemovel, administrador) values ("Leonardo", 'leo@gmail.com', "adm123", '972354651',  1); 

insert into autor (nomeAutor) values ("Fernando Pessoa"); 
insert into autor (nomeAutor) values ("José Saramago"); 
insert into autor (nomeAutor) values ("Luís de Camões"); 

insert into categoria (nomeCategoria) values ("Drama");
insert into categoria (nomeCategoria) values ("Ficção Cientifica");
insert into categoria (nomeCategoria) values ("Romance");
insert into categoria (nomeCategoria) values ("Biografia");

insert into editora (nomeEditora, sigla, morada) values ("Porto Editora", "PE", "R. Prof. Jorge da Silva Horta 1");
insert into editora (nomeEditora, sigla, morada) values ("LeYa", "LeYa", "R. Cidade de Cordova 2");

insert into livro (isbn, tituloLivro, descricao, numeroPaginas, stock, preco, idEditora) values ("212564", "O Sol e a Lua", "Relação do dia com amanhecer e anoitecer", "215", "4", "20.2", "2");
insert into livro (isbn, tituloLivro, descricao, numeroPaginas, stock, preco, idEditora) values ("3369854", "Big Bang", "O inicio do sistema solar e os seus acontecimentos", "472", "12", "30", "1");

insert into livroAutor(idLivro, idAutor) values ("1", "2");
insert into livroAutor(idLivro, idAutor) values ("2", "1");

insert into livroCategoria(idLivro, idCategoria) values (1, 2);
insert into livroCategoria(idLivro, idCategoria) values (2, 2);
