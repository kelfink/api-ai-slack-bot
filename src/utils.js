// utils.js
// ========
console.log("LOADING UTILS");
// utils.js
// ========
var parseUsers = function(jsonBody) {
    var users = {};
	var userlistResponse = JSON.parse(jsonBody);
	userlistResponse.members.forEach(function(member) {
	  users[member.id] = member;
	});
    return users;
}

var usersList = function (action) {
	var request = require('request');
	var url = 'https://slack.com/api/users.list?pretty=1&token=' + process.env.slackkey;
	request(url, function (error, response, body) {
			if (!error && response.statusCode == 200) {
              action(parseUsers(body));
			} else {
			  console.log("Got an error: ", error, ", status code: ", response.statusCode);
			}
			});
}

module.exports = {
  usersList: usersList
}
