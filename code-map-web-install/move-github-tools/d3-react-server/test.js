const fs = require('fs');
const path = require('path');

const WholeDataPath = "./src/data/post.json";
const DirDataPath = "./src/data/dir_position.json";
const InitDataPath = "./src/test/data.json";
const InitAddPath = "./src/test/Add.json";

function getWholeData() {
    return getJsonFileData(WholeDataPath);
}

function getDirData() {
    return getJsonFileData(DirDataPath);
}

function getInitData() {
    return getJsonFileData(InitDataPath);
}
function getAddData() {
    return getJsonFileData(InitAddPath);
}

function getContralMarkPath() {
    return path.join(getDirData().path, ".vscode", "contralmarks.json");
}

function getJsonFileData(file_path) {
    const init_nodes = fs.readFileSync(file_path).toString();//beacuse it always much big, So need use await
    return JSON.parse(init_nodes);
}

whole_data = getWholeData();

let frist = 1;
let limit = 15;
let low = 10;
let height = 30;
let now_number = 0;
for (let i = 0; i < whole_data.nodes.length; i++) {
    if (whole_data.nodes[i].edge_force >= low && whole_data.nodes[i].edge_force <= height) {
        if (frist) {
            initData(i);
            frist -= 1;
        }
        else {
            addData(i);
        }
        now_number += 1;
        if (now_number === limit) {
            break;
        }
    }
}



function initData(listid) {
    init_nodes_json = getWholeData();
    data = {
        nodes: [],
        links: []
    }
    add = {
        nodes: [],
        links: []
    }
    console.log("initData");
    addNodeAllAround(init_nodes_json, listid, data, add);
    fs.writeFileSync(InitDataPath, JSON.stringify(data, null, 4));
    fs.writeFileSync(InitAddPath, JSON.stringify(add, null, 4));

    // setEdgeForce(init_nodes_json);
}

function addData(listid) {
    init_nodes_json = getWholeData();
    let data = getInitData();
    add = {
        nodes: [],
        links: []
    }
    console.log("listid: " + listid);
    console.log("length: " + data.nodes.length);
    addNodeAllAround(init_nodes_json, listid, data, add);
    // console.log(data.nodes.length);
    fs.writeFileSync(InitDataPath, JSON.stringify(data, null, 4));
    fs.writeFileSync(InitAddPath, JSON.stringify(add, null, 4));
}

function addNode(whole_info_json, node_listid, result, add) {
    if (whole_info_json.nodes.length < node_listid || node_listid < 0) {
        return false;
    }
    let node_listid_isin = false;
    for (let i = 0; i < result.nodes.length; i++) {
        if (node_listid == result.nodes[i].listid) {
            node_listid_isin = true;
            break;
        }
    }
    if (!node_listid_isin) {
        result.nodes.push(whole_info_json.nodes[node_listid]);
        add.nodes.push(whole_info_json.nodes[node_listid]);
    }
    return true;
}

function delNode(whole_info_json, node_listid, result, del) {
    let node_listid_isin = -1;
    for (let i = 0; i < result.nodes.length; i++) {
        if (node_listid == result.nodes[i].listid) {
            node_listid_isin = i;
            break;
        }
    }
    if (node_listid_isin >= 0) {
        result.nodes.splice(node_listid_isin, 1);
        del.nodes.push(whole_info_json.nodes[node_listid]);
    }
    return true;
}

function addLink(whole_info_json, links_listid, result, add) {
    if (whole_info_json.links.length < links_listid || links_listid < 0) {
        return false;
    }
    let links_listid_isin = false;
    for (let i = 0; i < result.links.length; i++) {
        if (links_listid == result.links[i].listid) {
            links_listid_isin = true;
            break;
        }
    }
    if (!links_listid_isin) {
        result.links.push(whole_info_json.links[links_listid]);
        add.links.push(whole_info_json.links[links_listid]);
    }
    return true;
}

function delLink(whole_info_json, links_listid, result, del) {
    let links_listid_isin = -1;
    for (let i = 0; i < result.links.length; i++) {
        if (links_listid == result.links[i].listid) {
            links_listid_isin = i;
            break;
        }
    }
    if (links_listid_isin >= 0) {
        result.links.splice(links_listid_isin, 1);
        del.nodes.push(whole_info_json.links[links_listid]);

    }
    return true;
}

function findNodeListidID(whole_info_json, orinigal_id) {
    for (let i = 0; i < whole_info_json.nodes.length; i++) {
        if (whole_info_json.nodes[i].id === orinigal_id) {
            return i;
        }
    }
    return -1;
}

function addNodeWithAllLinks(whole_info_json, node_listid, result, add) {
    if (whole_info_json.nodes.length < node_listid || node_listid < 0) {
        return false;
    }
    // console.log(node_listid);
    let node_origin_id = whole_info_json.nodes[node_listid].id
    for (let i = 0; i < whole_info_json.links.length; i++) {
        // console.log(whole_info_json.links[i].source);//do not use console.log here , it will let transport fail
        if (whole_info_json.links[i].source === node_origin_id) {
            addLink(whole_info_json, whole_info_json.links[i].listid, result, add);
            let target_listid = findNodeListidID(whole_info_json, whole_info_json.links[i].target);
            addNode(whole_info_json, target_listid, result, add);
        } else if (whole_info_json.links[i].target === node_origin_id) {
            addLink(whole_info_json, whole_info_json.links[i].listid, result, add);
            let source_listid = findNodeListidID(whole_info_json, whole_info_json.links[i].source);
            addNode(whole_info_json, source_listid, result, add);
        }
    }

    for (let i = 0; i < result.nodes.length; i++) {
        if (result.nodes[i].listid === node_listid) {
            continue;
        }
        for (let j = i + 1; j < result.nodes.length; j++) {
            if (result.nodes[j].listid === node_listid) {
                continue;
            }
            let max = 2;
            for (let k = 0; k < whole_info_json.links.length; k++) {
                if (result.nodes[i].id === whole_info_json.links.target && result.nodes[j].id === whole_info_json.links.source) {
                    max -= 1;
                    addLink(whole_info_json, whole_info_json.links[k].listid, result, add);
                } else if (result.nodes[i].id === whole_info_json.links.source && result.nodes[j].id === whole_info_json.links.target) {
                    max -= 1;
                    addLink(whole_info_json, whole_info_json.links[k].listid, result, add);
                }
                if (1 === max) {
                    break;
                }
            }
        }
    }

    return true;
}

function addNodeAllAround(whole_info_json, node_listid, result, add) {
    if (addNode(whole_info_json, node_listid, result, add)) {
        // console.log("addNodeAllAround node_listid " + node_listid);
        return (addNodeWithAllLinks(whole_info_json, node_listid, result, add))
    }
    return false;
}

function absoluteAddress(dir_position, file_path) {
    if ("NULL" != file_path) {
        if (file_path.includes(dir_position)) {
            return file_path
        } else {
            return path.join(dir_position, file_path);
        }
    }
    return "NULL";
}