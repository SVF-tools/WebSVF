#use the latest version of ubuntu as base
FROM ubuntu:18.04
# RUN rm /bin/sh && ln -s /bin/bash /bin/sh
# use bash by default, so that later the extension could configure the environment
ENV SHELL /bin/bash
SHELL ["/bin/bash","-c"]

#avoid geographic dialog with tzdata
ENV DEBIAN_FRONTEND=noninteractive

# install necessary
RUN apt update
RUN apt install -y curl git zsh vim lsb-core net-tools cmake sudo wget build-essential libtinfo-dev libtinfo5 wget curl git cmake python3-pip libgraphviz-dev graphviz
# install oh-my-zsh
RUN echo y | sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
# install code-server
RUN curl -fsSL https://code-server.dev/install.sh | sh
# install nodejs 14
RUN curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
RUN apt-get install -y nodejs
#install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt update && apt install yarn

# cd ~
WORKDIR /root

# clone WebSVF project into the image
RUN git clone https://github.com/SVF-tools/WebSVF.git --depth 1
# RUN npm install

# generate extension
WORKDIR /root/WebSVF/src/SVFTOOLS
RUN yarn
RUN npm install -y -g vsce
RUN vsce package

# install env 
WORKDIR /root/
RUN npm i -silent svf-lib --prefix ${HOME}
RUN git clone https://github.com/SVF-tools/SVF-example.git
WORKDIR /root/SVF-example/
RUN source env.sh && cmake . && make

# start code-server without pwd and automatically install the extension, along with some port forwarding
ENV SHELL /bin/zsh
RUN code-server --install-extension /root/WebSVF/src/SVFTOOLS/svftools-0.0.3.vsix --force
RUN code-server --install-extension liviuschera.noctis --force
RUN code-server --install-extension pkief.material-icon-theme --force
RUN cp /root/WebSVF/docs/settings.json /root/.local/share/code-server/User/settings.json
RUN mkdir /root/INPUT_PROJECT/
RUN mkdir /root/INPUT_PROJECT/.vscode
RUN cp /root/WebSVF/docs/settings.json /root/INPUT_PROJECT/.vscode/settings.json
CMD code-server --auth="none" --host 0.0.0.0 --port 9000