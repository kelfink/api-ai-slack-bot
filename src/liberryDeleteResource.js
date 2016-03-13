// ============================
// Delete Resource for liberry
// ============================
var deleteResource = function (bot, message, params) {
	var pg = require('pg');
	 pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT * FROM resources where upper (name) = $1', [params.resource_name.toUpperCase()], function(err, result) {
		  done();
		  if (err) {
			console.error(err);
			return;
		  } else {
			  if (result.rows.length == 1) {
			  	client.query('DELETE FROM resources where name = $1', [params.resource_name], function(err, result) {
					done();
					if (err) {
						console.error(err);
						return;
					} else {
						bot.reply(message, 'Delete resource ' + params.resource_name);
					}
				});	
			  } else {
				bot.reply(message, 'Resource ' + params.resource_name + ' did not exist. Try listing resources');
			  }
		  }
		});
	});
}

module.exports = {
  deleteResource: deleteResource
}
