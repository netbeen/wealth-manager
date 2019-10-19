#!/usr/bin/env bash
~/.nvm/versions/node/v8.4.0/bin/node /wealth-manager/node_modules/egg-scripts/bin/egg-scripts.js stop && \
~/.nvm/versions/node/v8.4.0/bin/node /wealth-manager/node_modules/egg-scripts/bin/egg-scripts.js start --port=7001 --daemon
