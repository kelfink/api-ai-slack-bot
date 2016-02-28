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
const libLockResource = require('./liberryLockResource.js');
const libUnlockResource = require('./liberryUnlockResource.js');

const Entities = require('html-entities').XmlEntities;
const decoder = new Entities();

const apiAiService = apiai(argv.accesskey, argv.subscriptionkey);

var sessionIds = {};

const port = process.env.PORT || 3000;

const controller = Botkit.slackbot({
    debug: false
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
	client.query('CREATE TABLE IF NOT EXISTS resources (name varchar(250) PRIMARY KEY, checkedout_to_id varchar(250))', function(err, result) {
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
             bot.reply(message, 'Oh, you are actually ' + userMap[message.user].name);
           }
        );
        //console.log("userMap length " + userMap.length());

		//bot.reply(message,'Slackbot is:' + userMap['USLACKBOT']);
		//bot.reply(message,'Oh, you are actually ' + userMap[message.user]);
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
                                case "input_unknown":
                                  bot.reply(message, "I don't know what that is");
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
