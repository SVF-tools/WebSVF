#use the latest version of ubuntu as base
FROM ubuntu:20.04

#use bash by default, so that later the extension could configure the environment
ENV SHELL /bin/bash

#avoid geographic dialog with tzdata
ENV DEBIAN_FRONTEND=noninteractive

#update ubuntu 
RUN apt-get update 

#install OS environment 
RUN apt-get install -y curl git nodejs npm lsb-core net-tools cmake sudo wget build-essential libtinfo-dev libtinfo5 wget curl git cmake python3-pip libgraphviz-dev graphviz
#install code-server
RUN curl -fsSL https://code-server.dev/install.sh | sh



#install yarn properly
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt update && apt install yarn


#first create root folder
WORKDIR /root

#clone WebSVF project into the image
RUN git clone https://github.com/SVF-tools/WebSVF.git --depth 1
RUN npm install 


#change working directory for this is where the extension gets generated
WORKDIR /root/WebSVF/src/SVFTOOLS
RUN yarn

#generate extension
RUN npm install -y -g vsce
RUN vsce package 
RUN mkdir -p ~/.local/share/code-server/extensions
ENV XDG_DATA_HOME="~/.local/share/code-server/extensions"
RUN cp svftools-0.0.3.vsix ~/.local/share/code-server/extensions

#install env 
WORKDIR /root/
RUN npm i -silent svf-lib --prefix ${HOME}
RUN git clone https://github.com/SVF-tools/SVF-example.git
WORKDIR /root/SVF-example/
RUN . ./env.sh

#start code-server without pwd and automatically install the extension, along with some port forwarding
CMD code-server ~/SVF-example --install-extension ~/.local/share/code-server/extensions/svftools-0.0.3.vsix --force && code-server --auth="none" --host 0.0.0.0 --port 8080
