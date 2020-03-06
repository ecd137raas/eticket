/*importar o mongodb */
const MongoClient = require('mongodb').MongoClient;

var connMongoDB = function() {
	const url = 'mongodb://localhost:27017/ticket';
	// Create a new MongoClient
	const client = new MongoClient(url);
	// Use connect method to connect to the Server
	return client;
}

module.exports = function(){
	return connMongoDB;
}
