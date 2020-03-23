//Loading Required Node Modules
const fs = require("fs"); //File Reader/Writer Library
var jsdom = require("jsdom"); //JSDOM library for emulating DOM in NodeJS
const jquery = require("jquery"); //jQuery Library for NodeJS
const path = require("path");

const gen_landing_page = () => {

    const jsonReport_string = fs.readFileSync(path.join(__dirname,'/../test.json'),'utf8');

    const jsonReport = JSON.parse(jsonReport_string);

    //Add json object containing bug analysis report to 'bugReportJSON.js' which loads the object in the index.html (Landing Page) context
    fs.writeFileSync(path.join(__dirname,"/../public/js/bugReportJSON.js"),`\nconst bugreportjson = ${jsonReport_string};\nconst json_length = Object.keys(bugreportjson.bugreport).length;`);

}

module.exports = {
    generate: gen_landing_page
};
