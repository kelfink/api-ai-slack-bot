// ============================
// Unlock  Resource for liberry
// ============================

var unlockResource = function (bot, message, params) {
	const utils = require('./utils.js');

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
                          if (message.user === nulL) {
				            bot.reply(message, "You don't have Resource " + params.resource_name + " checked out.  Looks like it is available");
                          } else {
							utils.usersList( function(userMap) {
								bot.reply(message, "Resource " + params.resource_name + " is already checked out by " + userMap[result.rows[0].checkedout_to_id].name);
							});
                          }
			            }
					  }
					});	
				  } else {
					bot.reply(message, "Resource " + params.resource_name + " is checked in now.  Thank you, good citizen" );
				  }
				}
              }
	);
	});
}

module.exports = {
  unlockResource: unlockResource
}
