FROM ubuntu:19.04
MAINTAINER netbeen <netbeen.cn@gmail.com>

RUN sed -i s@/archive.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list
RUN apt-get clean && apt-get -qq update && apt-get -qqy install curl git

RUN git clone https://github.com/netbeen/wealth-manager.git \
    && chmod +x /wealth-manager/start.sh

WORKDIR /wealth-manager

ENTRYPOINT "/wealth-manager/start.sh"
