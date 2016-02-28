// ============================
// Info  Resource for liberry
// ============================

var infoResource = function (bot, message, params) {
	var pg = require('pg');
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			client.query('SELECT * FROM resources where name = $1', [params.resource_name], function(err, result) {
				done();
				if (err) {
				  bot.reply(message, 'Error finding resource ' + err);
				  console.error(err);
				  return;
				} else {
				  if (result.rows.length == 0) {
				    bot.reply(message, "I couldn't find resource " + params.resource_name);
				    return;
				  } else {
				    if (!message.user) {
				    bot.reply(message, "Resource " + params.resource_name + "  looks like it's available");
				    } else {
				        bot.reply(message, "Resource " + params.resource_name + " is locked by " + result.rows[0].checkedout_to_id);
				    }
				  }
				};
		});
	});
}

module.exports = {
  infoResource: infoResource
}
