// ============================
// Create Resource for liberry
// ============================
// var parseUsers = function(jsonBody) {
    // var users = {};
	// var userlistResponse = JSON.parse(jsonBody);
	// userlistResponse.members.forEach(function(member) {
	  // users[member.id] = member;
	// });
    // return users;
//}

var createResource = function (bot, message, params) {
	var pg = require('pg');
	 pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT * FROM resources where name = $1', [params.resource_name], function(err, result) {
		  done();
		  if (err) {
			console.error(err);
			return;
		  } else {
			bot.reply(message, 'Created resource ' + resource_name);
			console.log('Results: ', {results: result.rows} ); 
		  }
		});
	});

}

module.exports = {
  createResource: createResource
}
