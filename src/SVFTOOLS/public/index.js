const vscode = acquireVsCodeApi();
const svg = document.getElementById("svg");

let elements = Array.from(svg.querySelectorAll(".node"));

elements.forEach(function (el) {

    el.addEventListener("mousedown", e => {
        let text = Array.from(el.querySelectorAll("text"));
        let inner = text[text.length - 1].innerHTML;
        let split = inner.slice(1, -1).split(" ");

        let ln = null;
        let fl = null;
        for (let i = 0; i < split.length; i++) {
            if ((split[i] === "line:" || split[i] === "ln:") && i + 1 < split.length) {
                ln = split[i + 1];
            }
            if ((split[i] === "file:" || split[i] === "fl:") && i + 1 < split.length) {
                fl = split[i + 1];
            }
        }
        console.log("ln:", +ln, "fl:", fl);
        vscode.postMessage({
            command: "pos",
            text: "pos",
            line: ln,
            file: fl
        });
    });
})

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
