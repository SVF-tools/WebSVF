const fs = require('fs');
const path = require('path');


const WholeDataPath = "./SVFG_before_opt.json";


initEdgeForce();
setEdgeForce();



function getWholeData() {
    return getJsonFileData(WholeDataPath);
}

function getJsonFileData(file_path) {
    const init_nodes = fs.readFileSync(file_path).toString();//beacuse it always much big, So need use await
    return JSON.parse(init_nodes);
}

function getTime() {
    const myDate = new Date();
    return myDate.toLocaleString();
}

function findNodeListidID(whole_info_json, orinigal_id) {
    for (let i = 0; i < whole_info_json.nodes.length; i++) {
        if (whole_info_json.nodes[i].id === orinigal_id) {
            return i;
        }
    }
    return -1;
}
function initEdgeForce() {
    whole_data = getWholeData();
    for (let i = 0; i < whole_data.nodes.length; i++) {
        whole_data.nodes[i].edge_force = 0;
    }
    fs.writeFileSync(WholeDataPath, JSON.stringify(whole_data, null, 4));
}
function setEdgeForce() {
    whole_data = getWholeData();
    for (let i = 0; i < whole_data.links.length; i++) {
        const source_listid = findNodeListidID(whole_data, whole_data.links[i].source);
        const target_listid = findNodeListidID(whole_data, whole_data.links[i].target);
        whole_data.nodes[source_listid].edge_force++;
        whole_data.nodes[target_listid].edge_force++;
    }
    fs.writeFileSync(WholeDataPath, JSON.stringify(whole_data, null, 4));
}
