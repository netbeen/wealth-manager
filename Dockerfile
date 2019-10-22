FROM ubuntu:19.04
MAINTAINER netbeen <netbeen.cn@gmail.com>

RUN sed -i s@/archive.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list
RUN apt-get clean && apt-get -qq update && apt-get -qqy install curl git

ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 8.4.0

RUN curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.0/install.sh | bash \
    && source $NVM_DIR/nvm.sh \
    && nvm install v$NODE_VERSION \
    && nvm use v$NODE_VERSION \
    && nvm alias default v$NODE_VERSION \
    && git clone https://github.com/netbeen/wealth-manager.git

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/v$NODE_VERSION/bin:$PATH

WORKDIR /wealth-manager

CMD ["top"]
