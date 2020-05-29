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

function addSpriteText(node) {
    const sprite = new SpriteText(node.id);
    sprite.color = "#fff";
    sprite.textHeight = 10;
    sprite.position.set(0, 12, 0);
    return sprite;
}

const Graph = ForceGraph3D()(document.getElementById("graph"))
    .enableNodeDrag(false)
    .graphData(gData);

const { nodes, links } = Graph.graphData();

Graph.nodeColor((node) =>
    highlightNodes.has(node) ? "rgb(255,0,0,1)" : "rgba(0,255,255,0.6)"
)
    .linkWidth((link) => (highlightLink.has(link) ? 4 : 1))
    .linkDirectionalParticles((link) => (highlightLink.has(link) ? 4 : 0))
    .linkDirectionalParticleWidth(4)
    .nodeRelSize(6)
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
    })
    .onLinkHover((link) => {
        updateHighlight();
    })
    .onNodeClick((node) => {
        // postMessage(`node.id: ${node.id}`);
        info = {
            path:
                "/Users/apple/WORKSPACE_3/WebSVF/src/WebSVF-frontend-server/public/js/genLandingPageAnalysis.js",
            line: node.id,
            start: 5,
            end: 10,
        };
        postInfo(info);
        if (node) {
            if (highlightNodes.has(node)) {
                locking = false;
                highlightNodes.delete(node);
                links.forEach((link) => {
                    if (link.source === node && highlightLink.has(link)) {
                        highlightLink.delete(link);
                    }
                });
            } else {
                locking = true;
                highlightNodes.add(node);
                links.forEach((link) => {
                    if (link.source === node && !highlightLink.has(link)) {
                        highlightLink.add(link);
                    }
                });
            }
        }

        updateHighlight();
    })
    .nodeThreeObject((node) => {
        const sprite = new SpriteText(node.id);
        sprite.color = "#fff";
        sprite.textHeight = 10;
        sprite.position.set(0, 12, 0);
        return sprite;
    })
    .nodeThreeObjectExtend((node) => {
        return true;
    });

function updateHighlight() {
    // trigger update of highlighted objects in scene
    Graph.nodeColor(Graph.nodeColor())
        .linkWidth(Graph.linkWidth())
        .linkDirectionalParticles(Graph.linkDirectionalParticles());
}
document.getElementById("leftBtn").addEventListener("click", () => {});
document.getElementById("middleBtn").addEventListener("click", () => {
    postMessage("This is test button.");
});
function postMessage(send_text) {
    vscode.postMessage({
        command: "alert",
        text: send_text,
    });
}

function postInfo(info) {
    vscode.postMessage({
        command: "toSomeWhere",
        path: info.path,
        line: info.line,
        start: info.start,
        end: info.end,
    });
}
window.addEventListener("resize", function () {
    Graph.width(window.innerWidth - 2).height(window.innerHeight - 2);
    console.log("width: ", window.innerWidth - 2);
    console.log("height: ", window.innerHeight - 2);
});

window.addEventListener("message", (event) => {
    const message = event.data;
    document.getElementById("showSpan").textContent = message.status;
});

document.onreadystatechange = function () {
    if (document.readyState === "complete") {
        vscode.postMessage({
            command: "connect",
            text: "Hello world",
        });
    }
};
