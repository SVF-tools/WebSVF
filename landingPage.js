//Loading Required Node Modules
const fs = require("fs"); //File Reader/Writer Library
var jsdom = require("jsdom"); //JSDOM library for emulating DOM in NodeJS
const jquery = require("jquery"); //jQuery Library for NodeJS

const initialise_pillTab = () => {

}

const initialise_pill = () => {
    
}

const make_pillTab = (index, name, index_last) => {
    var output;
    var name_noDot = name.replace('.','');

    if(index == 0)
    output = `${'\n'.repeat(2)}${'\t'.repeat(7)}<a class="nav-link mb-3 p-3 d-flex justify-content-center shadow active" id="v-pills-${name}-tab" data-toggle="pill" href="#v-pills-${name_noDot}" role="tab" aria-controls="v-pills-${name_noDot}" aria-selected="true">${'\n'.repeat(1)}${'\t'.repeat(8)}<i class="far fa-file-code fa-2x mr-4"></i>${'\n'.repeat(1)}${'\t'.repeat(8)}<span class="font-weight-bold large text-uppercase text-center" style="font-size: 1.5rem; ">${name}</span></a>${'\n'.repeat(2)}${'\t'.repeat(7)}`;
    else if(!(index <= index_last))
    output = `<a class="nav-link mb-3 p-3 d-flex justify-content-center shadow" id="v-pills-${name}-tab" data-toggle="pill" href="#v-pills-${name_noDot}" role="tab" aria-controls="v-pills-${name_noDot}" aria-selected="false">${'\n'.repeat(1)}${'\t'.repeat(8)}<i class="far fa-file-code fa-2x mr-4"></i>${'\n'.repeat(1)}${'\t'.repeat(8)}<span class="font-weight-bold large text-uppercase text-center" style="font-size: 1.5rem; ">${name}</span></a>${'\n'.repeat(2)}${'\t'.repeat(7)}`;
    else
    output = `<a class="nav-link mb-3 p-3 d-flex justify-content-center shadow" id="v-pills-${name}-tab" data-toggle="pill" href="#v-pills-${name_noDot}" role="tab" aria-controls="v-pills-${name_noDot}" aria-selected="false">${'\n'.repeat(1)}${'\t'.repeat(8)}<i class="far fa-file-code fa-2x mr-4"></i>${'\n'.repeat(1)}${'\t'.repeat(8)}<span class="font-weight-bold large text-uppercase text-center" style="font-size: 1.5rem; ">${name}</span></a>${'\n'.repeat(2)}${'\t'.repeat(4)}`;

    return output;
} 

const make_pill = (index, name, index_last) => {
    var output;
    var name_noDot = name.replace('.','');

    if (index == 0)
    output = `${'\n'.repeat(2)}${'\t'.repeat(9)}<div class="tab-pane fade shadow rounded bg-white show active p-5" id="v-pills-${name_noDot}" role="tabpanel" aria-labelledby="v-pills-${name_noDot}-tab">${'\n'.repeat(1)}${'\t'.repeat(11)}<h4 class="font-italic mb-4"><a id="${index}*!*${name}" class="fileRepLink" href="#" target="_blank">${name}</a></h4>${'\n'.repeat(1)}${'\t'.repeat(11)}<pre id="errors-${name_noDot}" style="overflow-x: hidden; color:green; font-size: 1rem; font-weight: bold;"></pre>${'\n'.repeat(1)}${'\t'.repeat(9)}</div>${'\n'.repeat(2)}${'\t'.repeat(9)}`;
    else if(!(index <= index_last))
    output = `<div class="tab-pane fade shadow rounded bg-white p-5" id="v-pills-${name_noDot}" role="tabpanel" aria-labelledby="v-pills-${name_noDot}-tab">${'\n'.repeat(1)}${'\t'.repeat(11)}<h4 class="font-italic mb-4"><a id="${index}*!*${name}" class="fileRepLink" href="#" target="_blank">${name}</a></h4>${'\n'.repeat(1)}${'\t'.repeat(11)}<pre id="errors-${name_noDot}" style="overflow-x: hidden; color:green; font-size: 1rem; font-weight: bold;"></pre>${'\n'.repeat(1)}${'\t'.repeat(9)}</div>${'\n'.repeat(2)}${'\t'.repeat(9)}`;
    else
    output = `<div class="tab-pane fade shadow rounded bg-white p-5" id="v-pills-${name_noDot}" role="tabpanel" aria-labelledby="v-pills-${name_noDot}-tab">${'\n'.repeat(1)}${'\t'.repeat(11)}<h4 class="font-italic mb-4"><a id="${index}*!*${name}" class="fileRepLink" href="#" target="_blank">${name}</a></h4>${'\n'.repeat(1)}${'\t'.repeat(11)}<pre id="errors-${name_noDot}" style="overflow-x: hidden; color:green; font-size: 1rem; font-weight: bold;"></pre>${'\n'.repeat(1)}${'\t'.repeat(9)}</div>${'\n'.repeat(2)}${'\t'.repeat(4)}`;

    return output;
}

const gen_landing_page = () => {

    var jsonReport = JSON.parse(fs.readFileSync('test.json','utf8'));

    var jsonReport_length = Object.keys(jsonReport).length;

    //Reading Static Web Page File
    const web_page = fs.readFileSync("./public/index.html").toString();

    //Create Virtual DOM for NodeJS for the input Web Page (.html) file
    const dom = new jsdom.JSDOM(web_page);

    //Invoke jQuery on the created Virtual DOM window 
    const $ = jquery(dom.window);

    //Clear Contents in the Analysed .c files HTML tabs (#files-analysed)
    $('#files-analysed #v-pills-tab').html('');
    $('#files-analysed #v-pills-tabContent').html('');
    

    for(var i = 0; i<=jsonReport_length; ++i){
        //console.log(jsonReport.bugreport[i].id);

        var fileName = jsonReport.bugreport[i].FileName;
        var filePath = jsonReport.bugreport[i].FilePath;
        var fileErrors = jsonReport.bugreport[i].Errors;
        

        $('#files-analysed #v-pills-tab').append(make_pillTab(i,fileName,jsonReport_length));

        $('#files-analysed #v-pills-tabContent').append(make_pill(i,fileName,jsonReport_length));

        //console.log(jsonReport.bugreport[i].Errors);

        $('#files-analysed #v-pills-tabContent #errors-'+fileName.replace('.','')).html(`\n${JSON.stringify(fileErrors, undefined, 4)}${'\n'.repeat(1)}${'\t'.repeat(11)}`);

    }


    /*Write changes from the Virtual DOM to the Web Page (.html)
    file to be loaded by the ExpressJS WebServer */
    fs.writeFileSync("./public/index.html", dom.serialize());

}

//gen_landing_page();


module.exports = {
    generate: gen_landing_page
};
