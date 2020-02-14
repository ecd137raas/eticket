var app = require('./config/server');

/* parametrizar a porta de escuta */
app.listen(80, function(){
	console.log('Servidor online');
})