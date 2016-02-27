#!/usr/bin/env bash

. keys.sh

node src/index.js --accesskey="$accesskey" \
                  --subscriptionkey="$subscriptionkey" \
                  --slackkey="$slackkey" \
                  --filterambient="$filterambient"
