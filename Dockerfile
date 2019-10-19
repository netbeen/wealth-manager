FROM ubuntu:19.04
MAINTAINER netbeen <netbeen.cn@gmail.com>

RUN sed -i s@/archive.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list
RUN apt-get clean && apt-get -qq update && apt-get -qqy install curl unzip

RUN curl -O https://codeload.github.com/netbeen/wealth-manager/zip/master \
    && unzip -o master && chmod +x /wealth-manager-master/start.sh

WORKDIR /wealth-manager-master

ENTRYPOINT "/wealth-manager-master/start.sh"
