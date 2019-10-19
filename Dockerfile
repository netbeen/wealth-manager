FROM ubuntu:19.04
MAINTAINER netbeen <netbeen.cn@gmail.com>
RUN apt -qq update && apt -qqy install wget git
RUN wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.0/install.sh | bash && \
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")" && \
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm && \
nvm install v8.4.0
RUN git clone https://github.com/netbeen/wealth-manager.git && \
cd wealth-manager && \
npm install && \
npm install -g egg-scripts && \
RUN node --version

