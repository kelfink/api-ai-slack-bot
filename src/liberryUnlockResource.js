// ============================
// Unlock  Resource for liberry
// ============================

var unlockResource = function (bot, message, params) {
	var pg = require('pg');
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			client.query("UPDATE resources set checkedout_to_id = NULL where checkedout_to_id = $2 AND name = $1", [params.resource_name, message.user], function(err, result) {
				done();
				if (err) {
				  console.error(err);
				    return;
				} else {
				  // Check to see if we updated
				  if (result.rowCount == 0) {
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
                          if (message.user !== '') {
				            bot.reply(message, "You don't have Resource " + params.resource_name + " checked out.  Looks like " + result.rows[0].checkedout_to_id + " has it);
                          } else {
				            bot.reply(message, "Resource " + params.resource_name + " is already locked by " + result.rows[0].checkedout_to_id);
                          }
			            }
					  }
					});	
				  } else {
					bot.reply(message, "Resource " + params.resource_name + " is checked out to you, " + message.user );
				  }
				}
              }
	);
	});
}

module.exports = {
  lockResource: lockResource
}