#!/usr/bin/env bash
cp config/secretConfig.template.js config/secretConfig.js && \
sed -i "s/PLACEHOLDER_MYSQL_HOST/192.168.6.2/" config/secretConfig.js && \
sed -i "s/PLACEHOLDER_MYSQL_PORT/3307/" config/secretConfig.js && \
sed -i "s/PLACEHOLDER_MYSQL_USERNAME/root/" config/secretConfig.js && \
sed -i "s/PLACEHOLDER_MYSQL_PASSWORD/yangyang/" config/secretConfig.js

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.0/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

nvm install v8.4.0 && nvm use v8.4.0
npm install && npm install -g egg-scripts

echo "before start"
env
cat config/secretConfig.js

egg-scripts stop && egg-scripts start --port=7001 --daemon
