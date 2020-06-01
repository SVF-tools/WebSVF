// Random tree

const vscode = acquireVsCodeApi();
let highlightNodes = new Set();
let highlightLink = new Set();
let hoverNode = null;
let locking = false;
const N = 80;
const gData = {
    nodes: [...Array(N).keys()].map((i) => ({ id: i })),
    links: [...Array(N).keys()]
        .filter((id) => id)
        .map((id) => ({
            source: id,
            target: Math.round(Math.random() * (id - 1)),
        })),
};
let label = "nodeid";

function addSpriteText(node) {
    const sprite = new SpriteText(node.id);
    sprite.color = "#fff";
    sprite.textHeight = 10;
    sprite.position.set(0, 12, 0);
    return sprite;
}

const Graph = ForceGraph3D()(document.getElementById("graph")).enableNodeDrag(
    true
);

Graph.nodeColor((node) =>
    highlightNodes.has(node) ? "rgb(255,0,0,1)" : "rgba(0,255,255,0.6)"
)
    .linkWidth((link) => (highlightLink.has(link) ? 4 : 1))
    .linkDirectionalParticles((link) => (highlightLink.has(link) ? 4 : 0))
    .linkDirectionalParticleWidth(4)
    .nodeRelSize(6)
    .onNodeDragEnd((node) => {
        node.fx = node.x;
        node.fy = node.y;
        node.fz = node.z;
    })
    .onNodeHover((node) => {
        // console.log("NODE: ", node);
        // if (locking) {
        //     return;
        // }
        // // no state change
        // if (!node && !hoverNode) {
        //     return;
        // }
        // if (!node && hoverNode) {
        //     highlightNodes.delete(hoverNode);
        //     links.forEach((link) => {
        //         if (link.source === hoverNode && highlightLink.has(link)) {
        //             highlightLink.delete(link);
        //         }
        //     });
        //     hoverNode = null;
        // }
        // if (node) {
        //     hoverNode = node;
        //     highlightNodes.add(node);
        //     links.forEach((link) => {
        //         if (link.source === node && !highlightLink.has(link)) {
        //             highlightLink.add(link);
        //         }
        //     });
        // }
        // updateHighlight();
        showNodeInfo(node);
    })
    .onLinkHover((link) => {
        updateHighlight();
    })
    .onNodeRightClick((node) => {
        info = {
            path: node.fsPath,
            line: node.line,
            start: 0,
            end: 0,
        };
        postPosition(info);
    })
    .onNodeClick((node) => {
        info = {
            path: node.fsPath,
            line: node.line,
            start: 0,
            end: 0,
            themeName: "Theme_2",
        };
        let hasSameHightLightNode = false;
        highlightNodes.forEach((h_node) => {
            // if same line and fsPath, we don't need to highlight the node
            if (
                node.id !== h_node.id &&
                node.line === h_node.line &&
                node.fsPath === h_node.fsPath
            ) {
                hasSameHightLightNode = true;
                return false;
            }
        });
        if (!hasSameHightLightNode) {
            postHighLightInfo(info);
        } else {
            postPosition(info);
        }
        console.log("NODE: ", node);
        if (node) {
            if (highlightNodes.has(node)) {
                locking = false;
                highlightNodes.delete(node);
                GraphData.links.forEach((link) => {
                    if (link.source === node && highlightLink.has(link)) {
                        highlightLink.delete(link);
                    }
                });
            } else {
                locking = true;
                highlightNodes.add(node);
                GraphData.links.forEach((link) => {
                    if (link.source === node && !highlightLink.has(link)) {
                        highlightLink.add(link);
                    }
                });
            }
        }

        updateHighlight();
    })
    .nodeLabel((node) => {
        let nodeLine = node.line === -1 ? "NULL" : node.line;
        labelInfo = "FILE: " + node.fsPath + " LINE: " + nodeLine;
        return labelInfo;
    })
    .nodeThreeObject((node) => {
        const sprite = new SpriteText(node.nodeid);
        sprite.color = "#fff";
        sprite.textHeight = 6;
        sprite.position.set(0, 0, 0);
        return sprite;
    })
    .nodeThreeObjectExtend((node) => {
        return true;
    });
function showNodeInfo(node) {
    if (node) {
        let obj = document.getElementById("infoGround");
        let child_h4 = document.createElement("h4");
        let child_p1 = document.createElement("p");
        let child_p2 = document.createElement("p");
        let child_hr = document.createElement("hr");
        child_h4.innerHTML = "NODE: " + node.nodeid;
        child_h4.setAttribute("class", "alert-heading");
        let nodeLine = node.line === -1 ? "NULL" : node.line;
        labelInfo1 = "FILE: " + node.fsPath + "\nLINE: " + nodeLine;
        child_p1.innerHTML = labelInfo1;
        labelInfo2 = node.wholelabel;
        child_p2.innerHTML = labelInfo2;
        obj.innerText = "";
        obj.appendChild(child_h4);
        obj.appendChild(child_p1);
        obj.appendChild(child_hr);
        obj.appendChild(child_p2);
        showNodeLinkInfo(true);
    }
}
function clearNodeInfo() {
    let obj = document.getElementById("infoGround");
    obj.innerText = "";
    let child_h4 = document.createElement("h4");
    child_h4.innerHTML = "NODE INFO";
    child_h4.setAttribute("class", "alert-heading");
    obj.appendChild(child_h4);
}

function updateHighlight() {
    // trigger update of highlighted objects in scene
    Graph.nodeColor(Graph.nodeColor())
        .linkWidth(Graph.linkWidth())
        .linkDirectionalParticles(Graph.linkDirectionalParticles());
}
document.getElementById("modeBtn").addEventListener("click", () => {
    if (label === "wholelabel") {
        Graph.nodeLabel((node) => {
            let nodeLine = node.line === -1 ? "NULL" : node.line;
            labelInfo = "FILE: " + node.fsPath + " LINE: " + nodeLine;
            return labelInfo;
        })
            .nodeThreeObject((node) => {
                const sprite = new SpriteText(node.nodeid);
                sprite.color = "#fff";
                sprite.textHeight = 6;
                sprite.position.set(0, 0, 0);
                return sprite;
            })
            .nodeThreeObjectExtend((node) => {
                return true;
            });
        label = "nodeid";
        document.getElementById("modeBtn").innerText = "NODE ID MODE";
    } else {
        if (label === "nodeid") {
            Graph.nodeLabel((node) => {
                let nodeLine = node.line === -1 ? "NULL" : node.line;
                labelInfo = "FILE: " + node.fsPath + " LINE: " + nodeLine;
                return labelInfo;
            })
                .nodeThreeObject((node) => {
                    const sprite = new SpriteText(node.wholelabel);
                    sprite.color = "#fff";
                    sprite.textHeight = 4;
                    sprite.position.set(0, 12, 0);
                    return sprite;
                })
                .nodeThreeObjectExtend((node) => {
                    return true;
                });
            label = "wholelabel";
            document.getElementById("modeBtn").innerText = "WHOLE LABEL";
        }
    }
});
document.getElementById("leftBtn").addEventListener("click", () => {
    highlightNodes.clear();
    highlightLink.clear();
    postMessage("value_follow_graph", "3dCodeGraph");
    // postMessage("Value Follow Graph", "info");
    document.getElementById("showSpan").textContent = "MODE: VFG";
    deleteWelcome();
});
document.getElementById("middleBtn").addEventListener("click", () => {
    highlightNodes.clear();
    highlightLink.clear();
    postMessage("control_follow_graph", "3dCodeGraph");
    // postMessage("Control Follow Graph", "info");
    document.getElementById("showSpan").textContent = "MODE: CFG";
    deleteWelcome();
});
function deleteWelcome() {
    deleteDocElement("welcomeInfo");
}
function showNodeLinkInfo(handle) {
    if (handle) {
        document.getElementById("infoGround").style.display = "";
    } else {
        document.getElementById("infoGround").style.display = "none";
    }
}
function deleteDocElement(id) {
    let obj = document.getElementById(id);
    console.log(obj);
    if (obj) {
        let parentObj = obj.parentNode;
        parentObj.removeChild(obj);
    }
}
function postMessage(send_text, command) {
    vscode.postMessage({
        command: command,
        text: send_text,
    });
}
function postPosition(info) {
    vscode.postMessage({
        command: "toSomeWhere",
        path: info.path,
        line: info.line,
        start: info.start,
        end: info.end,
    });
}
function postHighLightInfo(info) {
    vscode.postMessage({
        command: "toSomeWhereHighLight",
        path: info.path,
        line: info.line,
        start: info.start,
        end: info.end,
        themeName: info.themeName,
    });
}
window.addEventListener("resize", function () {
    Graph.width(window.innerWidth - 2).height(window.innerHeight - 2);
    console.log("width: ", window.innerWidth - 2);
    console.log("height: ", window.innerHeight - 2);
});
window.addEventListener("message", (event) => {
    const message = event.data;
    switch (message.status) {
        case "connected":
            document.getElementById("showSpan").textContent = "CONNECTED";
            break;
        case "3dCodeGraph":
            // Graph.jsonUrl("vscode-resource:" + message.filePath);
            const dataObj = JSON.parse(message.data);
            Graph.graphData(dataObj);
            GraphData = Graph.graphData();

            console.log("GraphData:", GraphData);
            break;
        default:
            break;
    }
});

document.onreadystatechange = function () {
    if (document.readyState === "complete") {
        vscode.postMessage({
            command: "connect",
            text: "Hello world",
        });
    }
};
