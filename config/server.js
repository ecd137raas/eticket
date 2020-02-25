/* importar o módulo do framework express */
var express = require('express');

/* importar o módulo do consign */
var consign = require('consign');

/* importar o módulo do body-parser */
var bodyParser = require('body-parser');

/* importar o módulo do express-validator */
//var expressValidator = require('express-validator');
var expressSession = require('express-session');
/* iniciar o objeto do express */
var app = express();

/* setar as variáveis 'view engine' e 'views' do express */
app.set('view engine', 'ejs');
app.set('views', './app/views');

/* configurar o middleware express.static */
app.use(express.static('./app/public'));

/* configurar o middleware body-parser */
app.use(bodyParser.urlencoded({extended: true}));

/* configurar o middleware express-validator
//app.use(expressValidator());
*/
app.use(expressSession({
	secret:'abcdefgh12345iop4',
	resave:false,
	saveUninitialized:false
}));

/* efetua o autoload das rotas, dos models e dos controllers para o objeto app */
consign()
	.include('/app/routes')
	.then('config/dbConnection.js')
	.into(app);

/* exportar o objeto app */
module.exports = app;