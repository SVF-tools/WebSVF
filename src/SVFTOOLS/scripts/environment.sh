PROJECTHOME=$(pwd)
sysOS=$(uname -s)
function highlight() {
    echo -e "\033[1;45;37m$1\033[0m"
}
function errorshow() {
    echo -e "\033[1;41;37m$1\033[0m"
}

if [[ $sysOS == "Linux" ]]; then

    release_name=$(lsb_release -i --short)
    release_num=$(lsb_release -r --short)

    echo "System: ${release_name} ${release_num}"

    if [[ $release_name == "Ubuntu" ]]; then
        if [[ $release_num == 18.04 ]] || [[ $release_num == 20.04 ]]; then
            # for basic tools
            cd ~
            flagFile=".allsvfinstall.flag"
            if [ ! -f $flagFile ]; then
                sudo apt-get update
                sudo apt-get upgrade -y
                sudo apt-get install build-essential libtinfo-dev libtinfo5 wget curl git cmake python3-pip libgraphviz-dev graphviz -y
                touch $flagFile
                # sudo pip3 install pygraphviz
            fi

            if [ `command -v npm` ]; then
                npm_postion=$(command -v npm)
                npm_version=$(npm -v)
                echo "        Npm v${npm_version}"
            else
                curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
                sudo apt install nodejs
                sudo npm install -g npm
            fi


            # for svf build
            npm i -silent svf-lib --prefix ${HOME}
            cd ~
            BACKENDFOLDER="SVF-example"
            if [ ! -d ${BACKENDFOLDER} ]; then
                git clone https://github.com/SVF-tools/SVF-example.git
            fi
            cd ~/SVF-example
            source ./env.sh
            cmake .
            make

            highlight "[BUILD BACKEND DONE.]"
        else
            errorshow "CANNOT SUPPORT YOU SYSTEM. SUPPORT UBUNTU 18.04 or 20.04."
        fi
    else
        errorshow "CANNOT SUPPORT YOU SYSTEM. SUPPORT UBUNTU 18.04 or 20.04."
    fi
else
    errorshow "CANNOT SUPPORT YOU SYSTEM. SUPPORT UBUNTU 18.04 or 20.04."
fi

cd ~
script="environment.sh"
if [[ -f $script ]]; then
    rm $script
fi

backup="SVFBackup"
if [[ -d $backup ]]; then
    cd $backup
    count=`ls | wc -w`
    # echo "Backup count: ${count}"
    if [[ $count > 0 ]]; then
        cd ~
        # echo "Up to limit. Release all backup."
        rm -rf $backup
    fi
fi

cd ~