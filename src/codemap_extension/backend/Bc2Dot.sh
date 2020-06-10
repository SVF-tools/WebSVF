file=$1
fullname="${fullfile##*/}"
if [ ${fullname##*.}x != "bc"x ]; then
    echo "Please input a bc file."
    return;
fi
dir="${file%/*}"
optFile="${file%.*}.opt"


rm "${optFile}"
opt -mem2reg "${file}" -o "${optFile}"
wpa -ander -svfg -dump-svfg "${optFile}"
wpa -type -dump-icfg "${optFile}"

rm ander_svfg.dot
rm vfg_initial.dot
rm SVFG_before_opt.dot
rm "${optFile}"

mv svfg_final.dot value_flow_graph.dot
mv icfg_initial.dot control_flow_graph.dot

