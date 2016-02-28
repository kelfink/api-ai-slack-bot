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
		client.query('SELECT * FROM resources where resource_name = ', function(err, result) {
		  done();
		  if (err) {
			console.error(err); response.send("Error " + err);
			return;
		  } else {
		   console.log('pages/db', {results: result.rows} ); 
		  }
		});
	});


//	  console.log(messageResult);

	  var messageResult = "Created resource " + params.resource_name;
	  bot.reply(message, messageResult);
}

module.exports = {
  createResource: createResource
}
