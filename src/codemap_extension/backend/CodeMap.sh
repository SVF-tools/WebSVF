file=$1
bash Bc2Dot.sh "${file}"
dir="3D_CODE_GRAPH"

if [ -d ${dir} ]; then
    rm -rf "${dir}"
fi
mkdir $"${dir}"

cfg="control_flow_graph"
vfg="value_flow_graph"

mv "${cfg}.dot" "${dir}"
mv "${vfg}.dot" "${dir}"

cd "${dir}"

python3 ../Dot2Json.py "${cfg}.dot" "${cfg}.json"
python3 ../Dot2Json.py "${vfg}.dot" "${vfg}.json"

cd ..