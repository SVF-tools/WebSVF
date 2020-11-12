const vscode = acquireVsCodeApi();
const svg = document.getElementById("svg");

let elements = Array.from(svg.querySelectorAll(".node"));
let ctrlDown = false;

elements.forEach(function (el) {

    el.addEventListener("mousedown", e => {
        let text = Array.from(el.querySelectorAll("text"));
        let ln = null;
        let fl = null;
        for (let len = 0; len < text.length; len++) {
            let inner = text[len].innerHTML;
            let split = inner.slice(1, -1).split(" ");


            for (let i = 0; i < split.length; i++) {
                if ((split[i] === "line:" || split[i] === "ln:") && i + 1 < split.length) {
                    ln = split[i + 1];
                }
                if ((split[i] === "file:" || split[i] === "fl:") && i + 1 < split.length) {
                    fl = split[i + 1];
                }
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

// window.addEventListener("mousewheel", wheel);
// document.addEventListener('DOMMouseScroll', wheel, false);
// document.addEventListener('mousewheel', wheel, false);
window.onmousewheel = document.onmousewheel = wheel;
let zoom = 1;
function wheel(event) {
    document.body.style.overflow = 'visible';
    if (ctrlDown) {
        document.body.style.overflow = 'hidden';


        // document.body.style.zoom += (event.wheelDelta / 12000);

        zoom += (event.wheelDelta / 12000);
        console.log(`zoom: ${zoom}`);
        svg.style.zoom = zoom;
    }
}

window.addEventListener("keydown", (event) => {
    if (event.ctrlKey) {
        ctrlDown = true;
        console.log("ctrl down");
    }
})

window.addEventListener("keyup", (event) => {
    if (event.key === "Control") {
        ctrlDown = false;
        console.log("ctrl up");
    }
})

window.addEventListener("message", (event) => {
    const message = event.data;
    switch (message.command) {
        case "connect":
            // document.getElementById("info").textContent = "CONNECTED";
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