// ============================
// Info  Resource for liberry
// ============================

var listResource = function (bot, message, params) {
	const utils = require('./utils.js');

	var pg = require('pg');
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	  var query = client.query('SELECT * FROM resources');
      var rows = [];
      query.on('row', function(row) {
        rows.push(row);
      });

	  query.on('end', function() {
	    done();
	  });


	  if (err) {
		bot.reply(message, 'Error listing resources ' + err);
		console.error(err);
		return;
	  } else {
		if (rows.length == 0) {
		  bot.reply(message, "I couldn't find any resources yet.  Try creating one.");
	      return;
		} else {
console.log("ok");
		  utils.usersList( function(userMap) {
			  reply_text = "Resources:\n";
		      for (var i = 0, len = rows.length; i < len; i++) {
				  var row = rows[i];
				  reply_text += "\t" + row.name;
				  if (row.checkedout_to_id !== null) {
				     reply_text += " is locked by " + row.checkedout_to_id;
				     //reply_text += " is locked by " + userMap[row.checkedout_to_id].name;
				  };
				  bot.reply(message, reply_text);
			  };
		  });
		};
	  };
	});
};

module.exports = {
  listResource: listResource
}
