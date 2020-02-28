const express = require('express');
const app = express();
app.use(express.json());
let cors = require('cors');
const fs = require('fs');
const path = require('path');
var http = require('http');
var https = require('https');
var privateKey = fs.readFileSync('./src/certificiate/private.pem', 'utf8');
var certificate = fs.readFileSync('./src/certificiate/file.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
var PORT = process.env.HTTP_PORT || 6996;
var SSLPORT = process.env.HTTPS_PORT || 6999;

httpServer.listen(PORT, function () {
    console.log('HTTP Server is running on: http://localhost:%s', PORT);
});
httpsServer.listen(SSLPORT, function () {
    console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
});

app.use(cors());
app.get('/', function (req, res) {
    if (req.protocol === 'https') {
        res.status(200).send('Welcome to Safety Land!');
    }
    else {
        res.status(200).send('Welcome!');
    }
});

app.get('/api', (req, res) => {
    res.send([1, 2, 3, 4, 5]);
});

app.get('/api/posts/:year/:month', (req, res) => {
    res.send(req.query);
});
app.get('/api/get_info', (req, res) => {
    res.send("OK");
    // initData(0);
});
app.get('/api/get_info_next', (req, res) => {
    res.send(JSON.stringify(getInitData()));
});
app.post('/api/add_info', (req, res) => {
    const listid = req.body.listid;
    // console.log(listid);
    const whole_data = getWholeData();
    // console.log(whole_data.nodes[listid].fsPath);
    const position = {
        fsPath: whole_data.nodes[listid].fsPath,
        line: whole_data.nodes[listid].line,
        character: 0,
        time: getTime()
    }
    let mark_path = getContralMarkPath();
    // console.log(mark_path);
    fs.writeFileSync(mark_path, JSON.stringify(position));

    addData(listid);
    res.send(JSON.stringify(getAddData()));
});
app.post('/api/jump_info', (req, res) => {
    const listid = req.body.listid;
    // console.log(listid);
    const whole_data = getWholeData();
    // console.log(whole_data.nodes[listid].fsPath);
    const position = {
        fsPath: whole_data.nodes[listid].fsPath,
        line: whole_data.nodes[listid].line,
        character: 0,
        time: getTime()
    }
    let jump_path = getContralJumpPath();
    // console.log(mark_path);
    fs.writeFileSync(jump_path, JSON.stringify(position));

    // addData(listid);
    // res.send(JSON.stringify(getAddData()));
});
app.post('/api/set_info', (req, res) => {
    const listid = req.body.listid;
    // console.log(listid);
    const whole_data = getWholeData();
    // console.log(whole_data.nodes[listid].fsPath);
    const position = {
        fsPath: whole_data.nodes[listid].fsPath,
        line: whole_data.nodes[listid].line,
        character: 0,
        time: getTime()
    }
    let mark_path = getContralMarkPath();
    // console.log(mark_path);
    fs.writeFileSync(mark_path, JSON.stringify(position));

    addData(listid);
    res.send(JSON.stringify(getInitData()));
});

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

function getContralJumpPath() {
    return path.join(getDirData().path, ".vscode", "jumpmarks.json");
}

function getJsonFileData(file_path) {
    const init_nodes = fs.readFileSync(file_path).toString();//beacuse it always much big, So need use await
    return JSON.parse(init_nodes);
}

function getTime() {
    const myDate = new Date();
    return myDate.toLocaleString();
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


function jsonPath() {
    data_post = "./src/data/post.json";
    data_finial = "./src/data/finial.json";
    data_dir = "./src/data/dir_position.json";
    const info = fs.readFileSync(data_post).toString();
    const info_json = JSON.parse(info);
    const dir = fs.readFileSync(data_dir).toString();
    const dir_json = JSON.parse(dir);
    for (let i = 0; i < info_json.nodes.length; i++) {
        info_json.nodes[i].fsPath = absoluteAddress(dir_json.path, info_json.nodes[i].fsPath);
    }
    const info_finial = JSON.stringify(info_json);
    fs.writeFileSync(data_finial, info_finial);
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