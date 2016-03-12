// ============================
// Info  Resource for liberry
// ============================

var listResource = function (bot, message, params) {
	const utils = require('./utils.js');

	var pg = require('pg');
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			client.query('SELECT * FROM resources', [], function(err, result) {
				done();
				if (err) {
				  bot.reply(message, 'Error listing resources ' + err);
				  console.error(err);
				  return;
				} else {
				  if (result.rows.length == 0) {
				    bot.reply(message, "I couldn't find any resources yet.  Try creating one.");
				    return;
				  } else {
                    reply_text = "Resources:\n";
                    for (var i = 0, len = rows.length; i < len; i++) {
                      var row = rows[i];
                      reply_text += "\t" + row.resource_name
                      if (row.checkedout_to_id) {
                        reply_text += " is locked by " + userMap[result.rows[0].checkedout_to_id].name;
                      }
                    }
                    bot.reply(message, reply_text);
				  }
				};
		});
	});
}

module.exports = {
  infoResource: infoResource
}
