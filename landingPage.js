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
    else if(!(index < index_last))
    output = `<a class="nav-link mb-3 p-3 d-flex justify-content-center shadow" id="v-pills-${name}-tab" data-toggle="pill" href="#v-pills-${name_noDot}" role="tab" aria-controls="v-pills-${name_noDot}" aria-selected="false">${'\n'.repeat(1)}${'\t'.repeat(8)}<i class="far fa-file-code fa-2x mr-4"></i>${'\n'.repeat(1)}${'\t'.repeat(8)}<span class="font-weight-bold large text-uppercase text-center" style="font-size: 1.5rem; ">${name}</span></a>${'\n'.repeat(2)}${'\t'.repeat(4)}`;
    else
    output = `<a class="nav-link mb-3 p-3 d-flex justify-content-center shadow" id="v-pills-${name}-tab" data-toggle="pill" href="#v-pills-${name_noDot}" role="tab" aria-controls="v-pills-${name_noDot}" aria-selected="false">${'\n'.repeat(1)}${'\t'.repeat(8)}<i class="far fa-file-code fa-2x mr-4"></i>${'\n'.repeat(1)}${'\t'.repeat(8)}<span class="font-weight-bold large text-uppercase text-center" style="font-size: 1.5rem; ">${name}</span></a>${'\n'.repeat(2)}${'\t'.repeat(4)}`;

    return output;
} 

const make_pill = (index, name, index_last, insert_html) => {
    var output;
    var name_noDot = name.replace('.','');

    if (index == 0)
    output = `${'\n'.repeat(1)}${'\t'.repeat(6)}<div class="tab-pane fade shadow rounded bg-white show active p-5" id="v-pills-${name_noDot}" role="tabpanel" aria-labelledby="v-pills-${name_noDot}-tab">${'\n'.repeat(1)}${'\t'.repeat(7)}<h4 class="font-italic mb-4"><a id="${index}*!*${name}" class="fileRepLink" href="#" target="_blank">${name}</a></h4>${'\n'.repeat(1)}${'\t'.repeat(7)}<div id="errors-${name_noDot}" class="container">${'\n'.repeat(1)}${'\t'.repeat(8)}<div class="row">${'\n'.repeat(1)}${'\t'.repeat(8)}</div>${'\n'.repeat(1)}${'\t'.repeat(5)}${'\n'.repeat(2)}${'\t'.repeat(5)}`;
    else if(!(index < index_last))
    output = `<div class="tab-pane fade shadow rounded bg-white p-5" id="v-pills-${name_noDot}" role="tabpanel" aria-labelledby="v-pills-${name_noDot}-tab">${'\n'.repeat(1)}${'\t'.repeat(7)}<h4 class="font-italic mb-4"><a id="${index}*!*${name}" class="fileRepLink" href="#" target="_blank">${name}</a></h4>${'\n'.repeat(1)}${'\t'.repeat(7)}<div id="errors-${name_noDot}" class="container">${'\n'.repeat(1)}${'\t'.repeat(8)}<div class="row">${'\n'.repeat(1)}${'\t'.repeat(8)}</div>${'\n'.repeat(1)}${'\t'.repeat(5)}${'\n'.repeat(2)}${'\t'.repeat(9)}`;
    else
    output = `<div class="tab-pane fade shadow rounded bg-white p-5" id="v-pills-${name_noDot}" role="tabpanel" aria-labelledby="v-pills-${name_noDot}-tab">${'\n'.repeat(1)}${'\t'.repeat(7)}<h4 class="font-italic mb-4"><a id="${index}*!*${name}" class="fileRepLink" href="#" target="_blank">${name}</a></h4>${'\n'.repeat(1)}${'\t'.repeat(7)}<div id="errors-${name_noDot}" class="container">${'\n'.repeat(1)}${'\t'.repeat(8)}<div class="row">${'\n'.repeat(1)}${'\t'.repeat(8)}</div>${'\n'.repeat(1)}${'\t'.repeat(5)}${'\n'.repeat(2)}${'\t'.repeat(4)}`;

    return output;
}

const gen_landing_page = () => {

    const jsonReport_string = fs.readFileSync('test.json','utf8');

    const jsonReport = JSON.parse(jsonReport_string);

    fs.writeFileSync("./public/js/bugReportJSON.js",`\nconst bugreportjson = ${jsonReport_string};`);

    const jsonReport_length = Object.keys(jsonReport).length;

    //Reading Static Web Page File
    const web_page = fs.readFileSync("./public/index.html").toString();

    //Create Virtual DOM for NodeJS for the input Web Page (.html) file
    const dom = new jsdom.JSDOM(web_page);

    //Invoke jQuery on the created Virtual DOM window 
    const $ = jquery(dom.window);

    //Clear Contents in the Analysed .c files HTML tabs (#files-analysed)
    $('#files-analysed #v-pills-tab').empty();
    $('#files-analysed #v-pills-tabContent').empty();
    


    for(var i = 0; i<=jsonReport_length; ++i){
        //console.log(jsonReport.bugreport[i].id);

        var fileName = jsonReport.bugreport[i].FileName;
        var filePath = jsonReport.bugreport[i].FilePath;
        var fileErrors = jsonReport.bugreport[i].Errors;
        
        //Initialize Landing Page's Display Tabs
        $('#files-analysed #v-pills-tab').append(`${make_pillTab(i,fileName,jsonReport_length)}`);

        $('#files-analysed #v-pills-tabContent').append(`${make_pill(i,fileName,jsonReport_length)}`);

        //console.log(fileErrors[2].Type);

        /* Insert Errors into Landing Page's Display Tabs with correct formatting */

        const errors_length = Object.keys(fileErrors).length;
        
        //console.log($.isEmptyObject({}));

        for(var j = 0; j<errors_length; ++j){
            if(fileErrors[j].Type == 'Syntax'){

                const syntax_erbx = 
`                    <div class="error-box col-xl-6">
                        <div class="card bg-syntax-gradient mb-3">
                            <div class="p-3 position-relative">
                                <span class="badge badge-dark mb-3"><a class="h5">${fileErrors[j].Type} Error</a></span>
                                                                
                                <div class="list-card-dark px-2">
                                    <h6 class="mb-1">
                                        <a href="#" class="" style="color:black;font-weight: bolder;font-size: 24px;">${fileErrors[j].Title}</a>
                                    </h6>
                                    <p class="mb-3" style="color:black;font-weight:500;">${fileErrors[j].Description}</p>
                                    <p class="mb-3 time"><span class="bg-semi-light rounded-sm border border-dark pl-2 pb-1 pt-1 pr-2" style="color:black;font-weight:500;">Line No: ${fileErrors[j].ln}</span>${$.isEmptyObject(fileErrors[j].CrossOrigin)? '' : '<span class="bg-semi-dark rounded-sm mb-1 px-2 py-1 float-right"><a href="#" style="color:white;font-weight: bold;font-size: 14px;">Cross-Origin</a></span>'} </p>
                                </div>
                                <div>
                                    <span class="badge badge-danger ml-1"><a class="h6">${fileErrors[j].Occurrence}</a></span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;


                $(`#files-analysed #v-pills-tabContent #errors-${fileName.replace('.','')} .row`).append(`\n${syntax_erbx}`);

                
            }
            else if(fileErrors[j].Type == 'Semantic'){

                const semantic_erbx = 
`                    <div class="error-box col-xl-6">
                        <div class="card bg-semantic-gradient mb-3">
                            <div class="p-3 position-relative">
                                <span class="badge badge-dark mb-3"><a class="h5">${fileErrors[j].Type} Error</a></span>
                                                                
                                <div class="list-card-dark px-2">
                                    <h6 class="mb-1">
                                        <a href="#" class="" style="color:black;font-weight: bolder;font-size: 24px;">${fileErrors[j].Title}</a>
                                    </h6>
                                    <p class="mb-3" style="color:black;font-weight:500;">${fileErrors[j].Description}</p>
                                    <p class="mb-3 time"><span class="bg-semi-light rounded-sm border border-dark pl-2 pb-1 pt-1 pr-2" style="color:black;font-weight:500;">Line No: ${fileErrors[j].ln}</span> ${$.isEmptyObject(fileErrors[j].CrossOrigin)? '' : '<span class="bg-semi-dark rounded-sm mb-1 px-2 py-1 float-right"><a href="#" style="color:white;font-weight: bold;font-size: 14px;">Cross-Origin</a></span>'}</p>
                                </div>
                                <div>
                                    <span class="badge badge-danger ml-1"><a class="h6">${fileErrors[j].Occurrence}</a></span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                $(`#files-analysed #v-pills-tabContent #errors-${fileName.replace('.','')} .row`).append(`\n${semantic_erbx}`);

            }
            else if(fileErrors[j].Type == 'Logical'){

                const logical_erbx = 
`                    <div class="error-box col-xl-6">
                        <div class="card bg-logical-gradient mb-3">
                            <div class="p-3 position-relative">
                                <span class="badge badge-dark mb-3"><a class="h5">${fileErrors[j].Type} Error</a></span>
                                                                
                                <div class="list-card-dark px-2">
                                    <h6 class="mb-1">
                                        <a href="#" class="" style="color:black;font-weight: bolder;font-size: 24px;">${fileErrors[j].Title}</a>
                                    </h6>
                                    <p class="mb-3" style="color:black;font-weight:500;">${fileErrors[j].Description}</p>
                                    <p class="mb-3 time"><span class="bg-semi-light text-dark rounded-sm border border-dark pl-2 pb-1 pt-1 pr-2" style="color:black;font-weight:500;">Line No: ${fileErrors[j].ln}</span> ${$.isEmptyObject(fileErrors[j].CrossOrigin)? '' : '<span class="bg-semi-dark rounded-sm mb-1 px-2 py-1 float-right"><a href="#" style="color:white;font-weight: bold;font-size: 14px;">Cross-Origin</a></span>'}</p>
                                </div>
                                <div>
                                    <span class="badge badge-danger ml-1"><a class="h6">${fileErrors[j].Occurrence}</a></span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                                                
                $(`#files-analysed #v-pills-tabContent #errors-${fileName.replace('.','')} .row`).append(`\n${logical_erbx}`);

            }
        }
        //Fix HTML Indentation
        $(`#files-analysed #v-pills-tabContent #errors-${fileName.replace('.','')} .row`).append(`${'\n'.repeat(1)}${'\t'.repeat(8)}`);
        
        //$(`#files-analysed #v-pills-tabContent #errors-${fileName.replace('.','')}`).html(`\n${JSON.stringify(fileErrors, undefined, 4)}${'\n'.repeat(1)}${'\t'.repeat(11)}`);

    }


    /*Write changes from the Virtual DOM to the Web Page (.html)
    file to be loaded by the ExpressJS WebServer */
    fs.writeFileSync("./public/index.html", dom.serialize());

}

//gen_landing_page();


module.exports = {
    generate: gen_landing_page
};
