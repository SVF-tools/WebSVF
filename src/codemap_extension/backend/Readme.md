# System require
- **Ubuntu 20.04 or higher**

# Install require tools

- **Install python3 (It is a ubuntu 20.04 comes with software.)**
- **Run `sudo apt install -y python3-pip`**
- **Run `sudo apt install libgraphviz-dev graphviz`**
- **Run `sudo pip3 install pygraphviz`**

# How to use scripts

- **`CodeMap.sh`, `Bc2Dot.sh`, `Dot2Json.py` must put in same folder.**
- **Compile you project to generate a `xx.bc` file, use `clang/clang++ -g` or wllvm debug model for more debug information.**
- **Run as `bash CodeMap.sh xx.bc`**

After all scripts accomplished, they should generate **3D_CODE_GRAPH** folder and there should be two json files and two dot files in the folder. 

They are **control follow graph** files and **value follow graph** files.

**3D CODE MAP** extension will use all of them. So put the folder into the you project to make the extension find the corresponding file and line number.