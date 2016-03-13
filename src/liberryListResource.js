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
        var reply = "Resource list:"
		utils.usersList( function(userMap) {
          for (var i = 0; i < result.rows.length; i++) {
            reply += "\n\t" + result.rows[i].name ;
            if (result.rows[i].checkedout_to_id) {
			  user = userMap[result.rows[i].checkedout_to_id]
              if (!user) {
                  user = result.rows[i].checkedout_to_id;
              } else {
               user = "@" + user.name;
              };
			  reply += " checked out to " +  user;
            }
          }
	      bot.reply(message,  reply);
        });
      });
    });
};

module.exports = {
  listResource: listResource
}
