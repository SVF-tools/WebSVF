const fs = require("fs");
const path = require("path");
const { execSync } = require('child_process');

const file = "./out/info.json";
const resolve_file = path.resolve(file);
const result = JSON.parse(fs.readFileSync(resolve_file));
console.log(result.path);

if (result.mode === "FOLDER") {

    if (!fs.existsSync('wllvm')) {
        fs.mkdirSync('wllvm')
    }
    if (!fs.existsSync('result')) {
        fs.mkdirSync('result')
    }
    if (!fs.existsSync('error')) {
        fs.mkdirSync('error')
    }
    const stdout = execSync(`bash wllvm.sh ${result.path}`, {
        stdio: [0,// child input use parent input
            1, // child output use parent output, if use 'pipe', it means child output send into pipe
            fs.openSync("./error/err.out", 'w') // child error send into error/err.out
        ],
        maxBuffer: 1024 * 40960 // it will let child process have enough space to show information thereby avoiding being killed
    });

}

