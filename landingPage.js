//Loading Required Node Modules
const fs = require("fs"); //File Reader/Writer Library
var jsdom = require("jsdom"); //JSDOM library for emulating DOM in NodeJS
const jquery = require("jquery"); //jQuery Library for NodeJS

const make_pillTab = (index, name) => {
    var output;
    var name_noDot = name.replace('.','');

    if(index == 0)
    output = '\n\n\t\t\t\t\t\t\t<a class="nav-link mb-3 p-3 d-flex justify-content-center shadow active" id="v-pills-' + name + '-tab" data-toggle="pill" href="#v-pills-' + name_noDot + '" role="tab" aria-controls="v-pills-' + name_noDot + '" aria-selected="true">\n\t\t\t\t\t\t\t\t<i class="far fa-file-code fa-2x mr-4"></i>\n\t\t\t\t\t\t\t\t<span class="font-weight-bold large text-uppercase text-center" style="font-size: 1.5rem; ">' + name + '</span></a>\n\n\t\t\t\t\t\t\t';
    else
    output = '<a class="nav-link mb-3 p-3 d-flex justify-content-center shadow" id="v-pills-' + name + '-tab" data-toggle="pill" href="#v-pills-' + name_noDot + '" role="tab" aria-controls="v-pills-' + name_noDot + '" aria-selected="false">\n\t\t\t\t\t\t\t\t<i class="far fa-file-code fa-2x mr-4"></i>\n\t\t\t\t\t\t\t\t<span class="font-weight-bold large text-uppercase text-center" style="font-size: 1.5rem; ">' + name + '</span></a>\n\n\t\t\t\t\t\t\t';

    return output;
} 

const make_pill = (index, name) => {
    var output;
    var name_noDot = name.replace('.','');

    if (index == 0)
    output = '\n\n\t\t\t\t\t\t\t\t\t<div class="tab-pane fade shadow rounded bg-white show active p-5" id="v-pills-' + name_noDot + '" role="tabpanel" aria-labelledby="v-pills-' + name_noDot + '-tab">\n\t\t\t\t\t\t\t\t\t\t\t<h4 class="font-italic mb-4"><a href="#" target="_blank">' + name + '</a></h4>\n\t\t\t\t\t\t\t\t\t\t\t<p class="font-italic text-muted mb-2">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\n\t\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t\t\t';
    else
    output = '<div class="tab-pane fade shadow rounded bg-white p-5" id="v-pills-' + name_noDot + '" role="tabpanel" aria-labelledby="v-pills-' + name_noDot + '-tab">\n\t\t\t\t\t\t\t\t\t\t\t<h4 class="font-italic mb-4"><a href="#" target="_blank">' + name + '</a></h4>\n\t\t\t\t\t\t\t\t\t\t\t<p class="font-italic text-muted mb-2">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\n\t\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t\t\t';

    return output;
}

const gen_landing_page = () => {

    var jsonReport = JSON.parse(fs.readFileSync('test.json','utf8'));

    var jsonReport_length = Object.keys(jsonReport).length;

    //console.log(jsonReport_length);

    //Reading Static Web Page File
    const web_page = fs.readFileSync("./public/index.html").toString();

    //Create Virtual DOM for NodeJS for the input Web Page (.html) file
    const dom = new jsdom.JSDOM(web_page);

    //Invoke jQuery on the created Virtual DOM window 
    const $ = jquery(dom.window);
    $('#v-pills-tab').html('');
    $('#v-pills-tabContent').html('');

    for(var i = 0; i<=jsonReport_length; ++i){
        //console.log(jsonReport.bugreport[i].id);

        var fileName = jsonReport.bugreport[i].FileName;
        var filePath = jsonReport.bugreport[i].FilePath;

        $('#v-pills-tab').append(make_pillTab(i,fileName));

        $('#v-pills-tabContent').append(make_pill(i,fileName));






    }


    /*Write changes from the Virtual DOM to the Web Page (.html)
    file to be loaded by the ExpressJS WebServer */
    fs.writeFileSync("./public/index.html", dom.serialize());

}

//gen_landing_page();


module.exports = {
    generate: gen_landing_page
};
