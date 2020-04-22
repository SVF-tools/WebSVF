// Random tree
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

const vscode = acquireVsCodeApi();

let highlightNodes = new Set();
let highlightLink = new Set();

let hoverNode = null;

const Graph = ForceGraph3D()(document.getElementById("3d-graph")).graphData(
    gData
);

const { nodes, links } = Graph.graphData();

Graph.nodeColor((node) =>
    highlightNodes.has(node) ? "rgb(255,0,0,1)" : "rgba(0,255,255,0.6)"
)
    .linkWidth((link) => (highlightLink.has(link) ? 4 : 1))
    .linkDirectionalParticles((link) => (highlightLink.has(link) ? 4 : 0))
    .linkDirectionalParticleWidth(4)
    .onNodeHover((node) => {
        console.log("NODE: ", node);
        // no state change
        if (!node && !hoverNode) {
            return;
        }

        if (!node && hoverNode) {
            highlightNodes.delete(hoverNode);
            links.forEach((link) => {
                if (link.source === hoverNode && highlightLink.has(link)) {
                    highlightLink.delete(link);
                }
            });
            hoverNode = null;
        }

        if (node) {
            hoverNode = node;
            highlightNodes.add(node);
            links.forEach((link) => {
                if (link.source === node && !highlightLink.has(link)) {
                    highlightLink.add(link);
                }
            });
        }
        updateHighlight();
    })
    .onLinkHover((link) => {
        updateHighlight();
    })
    .onNodeClick((node) => {
        postMessage(`node.id: ${node.id}`);
        postInfo();
    });

function updateHighlight() {
    // trigger update of highlighted objects in scene
    Graph.nodeColor(Graph.nodeColor())
        .linkWidth(Graph.linkWidth())
        .linkDirectionalParticles(Graph.linkDirectionalParticles());
}
document.getElementById("leftBtn").addEventListener("click", () => {
    // document.getElementById("3d-graph").style.width = 300;
});
document.getElementById("middleBtn").addEventListener("click", () => {
    postMessage("This is test button.");
});
function postMessage(send_text) {
    vscode.postMessage({
        command: "alert",
        text: send_text,
    });
}

function postInfo() {
    let filePath = "filePath";
    let line = 5;
    let start = 3;
    let end = 7;
    vscode.postMessage({
        command: "toSomeWhere",
        path: filePath,
        line: line,
        start: start,
        end: end,
    });
}
window.addEventListener("resize", function () {
    Graph.width(window.innerWidth - 2).height(window.innerHeight - 2);
    console.log("width: ", window.innerWidth - 2);
    console.log("height: ", window.innerHeight - 2);
});

window.addEventListener("message", function () {
    Graph.graphData(gData);
    console.log("gData: \n", gData);
});
