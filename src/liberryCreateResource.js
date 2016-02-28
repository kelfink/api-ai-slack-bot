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

var createResource = function (params) {
	  var messageResult = "Created resource " + params.resource_name;
	  console.log(messageResult);
	  bot.reply(message, messageResult);
}

module.exports = {
  createResource: createResource
}
