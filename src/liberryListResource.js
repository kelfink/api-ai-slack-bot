// ============================
// List  Resource for liberry
// ============================

var listResource = function (bot, message, params) {
	const utils = require('./utils.js');

    var resultArray = [];

    var respond = function(result) {
	   bot.reply(message, "I couldn't find resource " + params.resource_name);
    }

	var pg = require('pg');
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	  var query = client.query('SELECT * FROM resources');
      query.on('row', function(row, result) {
        result.addRow(row);
      });
      query.on('end', function(result) {
        done();
        console.log(result.rows.length + ' rows were received');
	    bot.reply(message, "resources: " + result.rows.length + ". first is " + results.rows[0].name);
      });
    });
};

module.exports = {
  listResource: listResource
}
