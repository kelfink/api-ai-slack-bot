// Module must be started with parameters
//
//  --accesskey="api.ai client access key"
//  --subscriptionkey="api.ai subscription key"
//  --slackkey="slack bot key"
//

//'use strict';

const Botkit = require('botkit');


const apiai = require('apiai');
const uuid = require('node-uuid');
const argv = require('minimist')(process.argv.slice(2));
const utils = require('./utils.js');

const libCreateResource = require('./liberryCreateResource.js');
const libDeleteResource = require('./liberryDeleteResource.js');
const libLockResource = require('./liberryLockResource.js');
const libUnlockResource = require('./liberryUnlockResource.js');
const libInfoResource = require('./liberryInfoResource.js');
const libListResource = require('./liberryListResource.js');

const Entities = require('html-entities').XmlEntities;
const decoder = new Entities();

const apiAiService = apiai(argv.accesskey, argv.subscriptionkey);

var sessionIds = {};

const port = process.env.PORT || 3000;

const controller = Botkit.slackbot({
    debug: true
    //include "log: false" to disable logging
});

controller.setupWebserver(port, (err) => {
  if (err) {console.error(err); }
});


var bot = controller.spawn({
    token: argv.slackkey
}).startRTM();

function isDefined(obj) {
    if(typeof obj == 'undefined') {
        return false;
    }

    if (!obj) {
        return false;
    }

    return obj != null;
}

var pg = require('pg');
 pg.connect(process.env.DATABASE_URL, function(err, client, done) {
	client.query('CREATE TABLE IF NOT EXISTS resources (name varchar(250) PRIMARY KEY, checkedout_to_id varchar(250), locked_since timestamp)', function(err, result) {
	  done();
	  if (err)
	   { console.error(err);}
	});
});
  
function replyUserName(userMap, message) {
  bot.reply(message,'Oh, you are actually ' + userMap[message.user]);
}

controller.hears(['realname'],'direct_message,direct_mention,mention',function(bot, message) {
		bot.reply(message,'Your id is "' + message.user + '"');
        utils.usersList( function(userMap) {
             bot.reply(message, 'Oh, you are actually ' + userMap[message.user].name
                 + " your tz is " + userMap[message.user].tz_label);
           }
        );
});

controller.hears(['userlist'],'direct_message,direct_mention,mention',function(bot, message) {
        utils.usersList( function(userMap) {
			var userString = "";
		    Object.keys(userMap).forEach(function(key) {
				userString += userMap[key].name + ',' ;
			});
			console.log("Got a response: ", userString);
			bot.reply(message,'users: ' + userString);
          }
        )}
);

controller.hears(['.*'], ['direct_message', 'direct_mention', 'mention', 'ambient'], function (bot, message) {

    console.log(message.text);

    if (message.type == 'message') {
        if (message.user == bot.identity.id) {
            // message from bot can be skipped
        }
        else if (message.text.indexOf("<@U") == 0 && message.text.indexOf(bot.identity.id) == -1) {
            // skip other users direct mentions
        }
        else {
            var requestText = decoder.decode(message.text);
            requestText = requestText.replace("’", "'");

            var channel = message.channel;
            var messageType = message.event;
            var botId = "<@" + bot.identity.id + ">";

            console.log(messageType);

            if (requestText.indexOf(botId) > -1) {
                requestText = requestText.replace(botId, '');
            }

            if (!(channel in sessionIds)) {
                sessionIds[channel] = uuid.v1();
            }

            var request = apiAiService.textRequest(requestText,
                {
                    sessionId: sessionIds[channel]
                });

            request.on('response', function (response) {
                console.log(response);

                if (isDefined(response.result)) {
                    var responseText = response.result.fulfillment.speech;
                    var action = response.result.action;
                    var params = response.result.parameters;

                    if (isDefined(responseText)) {
                        bot.reply(message, responseText);
                    }
                     else {
                       if (isDefined(action)) {
                            switch (action) {
								case "list_resources":
								  libListResource.listResource (bot, message, params);
                                  break;
								case "create_resource":
								  libCreateResource.createResource (bot, message, params);
                                  break;
								case "checkout_resource":
								  libLockResource.lockResource (bot, message, params);
                                  break;
								case "checkin_resource":
								  libUnlockResource.unlockResource (bot, message, params);
                                  break;
								case "info_resource":
								  libInfoResource.infoResource (bot, message, params);
                                  break;
                                case "delete_resource":
                                  libDeleteResource.deleteResource (bot, message, params);
								  break;
                                case "help":
                                  bot.reply(message, "Hi, I can handle requests for create_resource, checkout_resource, checkin_resource, info_resource, list_resources, delete_resource, help ");
								  break;
                                case "input.unknown":
                                  bot.reply(message, "I don't know what you said, there.")
								  break;
                                default :
                                  bot.reply(message, "unhandled action " + action);
                            }
                          }
                       }
                }
            });

            request.on('error', function (error) {
                console.log(error);
            });

            request.end();
        }
    }
});
