var ObjectID = require('mongodb').ObjectId;

module.exports = function(application){

	application.get('/home', function(req, res){
		var client = new application.config.dbConnection;
		client.connect(function(err, client){
				var db = client.db();
				var qtd_tot=0;
				var qta=0;
				var qtb=0;
				var qtc=0;
				var atrasado=0;

				db.collection('controle').find({
					$or: [{status: "Andamento"}, {status: "Aberto"}, {status: "Fechado"}]}).sort({status: 1}).toArray(function(err, result){
						var dataatual = new Date();
						for(var i=0; i< result.length; i++){
							if(result[i].status =='Aberto'){
								qta=qta+1;
							} else {
								if(result[i].status =='Andamento'){
									qtb=qtb+1;
								} else {
									qtc=qtc+1;
								}
						   }
						}
						var qtd_tot=qta+qtb+qtc;

						client.close();
						res.render('dashboard', {user: req.session.nome, qtd: qtd_tot, open: qta, doing: qtb, done: qtc});
					});
				});
		});

	application.get('/', function(req, res){
		res.render('login');
	});

	application.get('/registrar', function(req, res){
		res.render('register');
	});

	application.get('/ticket', function(req, res){
		res.render('add-ticket')
	});

	application.get('/edit-ticket', function(req, res){
		res.render('edit-ticket')
	});


    /*usuários do sistema */
	application.get('/profile', function(req, res){
		var client = new application.config.dbConnection;
		client.connect(function(err, client){
				var db = client.db();
				db.collection('usuarios').find({email: req.session.email}).toArray(function(err, result){
					res.render('user', {usuarios: result})
					console.log(result)
					client.close();
				});

		});

	});

	application.post('/profile-id', function(req, res){
		var dadosForm = req.body;

		var client = new application.config.dbConnection;
		client.connect(function(err, client){
				var db = client.db();
				db.collection('usuarios').update(
					{_id: ObjectID(dadosForm.id)},
					{
						$set:
						{
							nome: dadosForm.nome,
							endereco: dadosForm.endereco,
							cidade: dadosForm.cidade,
							pais: dadosForm.pais,
							cep: dadosForm.cep,
							departamento: dadosForm.depto

						}
					});
				client.close();
				});
				res.redirect('/home');
		});

	application.post('/registrar', function(req, res) {
		var dadosForm = req.body;
		var client = new application.config.dbConnection;
		dadosForm.endereco = '';
		dadosForm.cidade = '';
		dadosForm.pais = '';
		dadosForm.cep = '';
		dadosForm.departamento = '';
		client.connect(function(err, client) {
			var db = client.db();
			db.collection('usuarios').insert(dadosForm);
			client.close();
		});
		res.render('register');
	});

	application.post('/autenticar', function(req, res){
		var dadosForm = req.body;

		var client = new application.config.dbConnection;
		client.connect(function(err, client) {
			var db = client.db();
			db.collection('usuarios').find({email: {$eq: dadosForm.email}, password: {$eq: dadosForm.password}}).toArray(function(err, result){
				if(result.length > 0){
					req.session.email=result[0].email;
					req.session.nome=result[0].nome;
					res.redirect('/home');
				}else{
					res.redirect('/login');
				}
				client.close();
			});

		});
	});
/* tickets criar e listar */
	application.post('/criarticket', function(req, res) {
		var dadosForm = req.body;
		dadosForm.usuario=req.session.email;
		dadosForm.resposta='';
		dadosForm.severidade='';
		dadosForm.data= new Date();
		dadosForm.dataresposta=new Date();
		var client = new application.config.dbConnection;
		client.connect(function(err, client) {
			var db = client.db();
			console.log(dadosForm)
			db.collection('controle').insert(dadosForm);
			client.close();
		});

		res.redirect('/listar-ticket');
	});


	application.get('/listar-ticket', function(req, res){
		var client = new application.config.dbConnection;
		client.connect(function(err, client){
				var db = client.db();
				db.collection('controle').find({}).sort({data: -1}).toArray(function(err, result){
				res.render('list-ticket', {tickets: result})
				client.close();
				});

		});
	});

	application.get('/listar-ticket-id', function(req, res){
		var url_query = req.query;
		var id = url_query.id_ticket;
		var client = new application.config.dbConnection;
		client.connect(function(err, client){
				var db = client.db();
				db.collection('controle').find({_id: ObjectID(id)}).toArray(function(err, result){
				res.render('edit-ticket', {tickets: result})
				client.close();
				});

		});
	});

	application.post('/editarticket', function(req, res){
		var dadosForm = req.body;
		var dataatual = new Date()
		var client = new application.config.dbConnection;
		client.connect(function(err, client){
				var db = client.db();
				db.collection('controle').update(
					{_id: ObjectID(dadosForm.id)},
					{
						$set:
						{
							assunto: dadosForm.assunto,
							descricao: dadosForm.descricao,
							resposta: dadosForm.resposta,
							dataresposta: dataatual,
							status: dadosForm.status,
							severidade: dadosForm.severidade
						}
					});
				client.close();
				});
				res.redirect('/listar-ticket');
		});

		application.get('/remover-ticket', function(req, res){
			var url_query = req.query;
			var id = url_query.id_ticket;
			var client = new application.config.dbConnection;
			client.connect(function(err, client){
					var db = client.db();
					db.collection('controle').remove({_id: ObjectID(id)});
					client.close();
					});
					res.redirect('/listar-ticket');
			});
}
