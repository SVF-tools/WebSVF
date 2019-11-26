const fs = require("fs");
// const path = require("path");
const { execSync } = require('child_process');

export function cpResult() {
    const stdout = execSync(`bash wllvm.sh`, {
        stdio: [0,// child input use parent input
            1, // child output use parent output, if use 'pipe', it means child output send into pipe
            fs.openSync("./error/err.out", 'w') // child error send into error/err.out
        ],
        maxBuffer: 1024 * 40960 // it will let child process have enough space to show information thereby avoiding being killed
    });
}