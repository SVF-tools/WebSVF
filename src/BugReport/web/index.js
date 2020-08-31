const vscode = acquireVsCodeApi();

window.addEventListener("resize", function () {
    Graph.width(window.innerWidth - 2).height(window.innerHeight - 2);
    console.log("width: ", window.innerWidth - 2);
    console.log("height: ", window.innerHeight - 2);
});

window.addEventListener("message", (event) => {
    const message = event.data;
    switch (message.command) {
        case "connect":
            document.getElementById("info").textContent = "CONNECTED";
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
