# Liberry.club -- resource sharing made friendly

## Overview

Liberry club is Team Resource management in a Slack-friendly Bot format.
Using API.ai's natural language processor, you can ask Liberry to create and manage the status of the physical objects in your environment.

Liberry is a slack-native chatbot built to understand your team's available shared resources and to to enable
a friendly interface to help track down what's available at work, among friends, club members or neighbors.

As a librarian, our robot can understand a variety of commands (thanks to API.ai) to allow you to register a sharable
resource, check it out,  check on the status, or return it for others to use.

At wok, someone might bring in a book for others to borrow.   Liberry can help you out:

Bert>  @liberry:  create resource "The Thing Explainer"
liberry> Ok, "The Thing Explainer is available to check out"

Ernie> @liberry: borrow "The Thing Explainer"
liberry>  @Ernie:  It's yours

Bert> @liberry:  Who has The Thing explainer?
@liberry>  @Ernie checked out The Thing Explainer 2 minutes ago

Bert>  @liberry: checkout QA
@liberry>  Ok.  @Bert is using QA


API.ai is a great tool for building a dialog system like this.  It let us map the casual language we use around the office
 into formal commands our robot can understand.
 
Bert>  @liberry how can you help me?
@liberry:   I have four primary commands... the CRUD of lending.  
    Create a sharable resource,
    Read the state of the resoure or resources
    Update  (Checkout, return) an item
    Delete  ( take your resoure out of the borrowing pool)
    
    

Api.ai Slack integration allows you to create Slack bots with natural language understanding based on Api.ai technology.

We forked his from https://github.com/xVir/api-ai-slack-bot


To stop the bot from running in the interactive mode, press CTRL+C.

In the background mode, you can control the bot’s state via simple commands:

## Custom Bot Launch

If you want to customize your bot behavior, follow the steps below.

1. Clone the repository https://github.com/xVir/api-ai-slack-bot 

2. Change the code to `index.js`

3. In the Docker, use the `run` command specifying the full path to the directory containing the `index.js` file:

```sh
On Heroku, setup up these environment variables in your configuration

To run locally, do the same, and run 'sh ./startup.sh' to start the server.

