/*importar o mongodb */
const MongoClient = require('mongodb').MongoClient;

var connMongoDB = function() {
	const url = 'mongodb://172.121.15.33:27017/ticket';
	// Create a new MongoClient
	const client = new MongoClient(url);
	// Use connect method to connect to the Server
	return client;
}

module.exports = function(){
	return connMongoDB;
}
