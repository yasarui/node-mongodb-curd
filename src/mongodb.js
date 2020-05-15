const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'jscourses';
var _db;
module.exports = {
    connectToServer: function (callback) {
        MongoClient.connect(connectionURL,{useNewUrlParser: true }, function (err, client) {
            if(err) return callback(err);
            _db = client.db(databaseName);
            return callback(undefined);
        });
    },
    getDb: function(){
        return _db;
    }
}

