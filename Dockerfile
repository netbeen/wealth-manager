FROM ubuntu:19.04
MAINTAINER netbeen <netbeen.cn@gmail.com>

RUN sed -i s@/archive.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list
RUN apt-get clean && apt-get -qq update && apt-get -qqy install curl git

CMD ["top"]
