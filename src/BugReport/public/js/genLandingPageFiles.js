
const make_pillTab = (index, name, index_last) => {
    var output;
    var name_noDot = name.replace('.','');

    if(index == 0)
    output = `${'\n'.repeat(2)}${'\t'.repeat(7)}<a class="nav-link mb-3 p-3 d-flex justify-content-center shadow active" id="v-pills-${name}-tab" data-toggle="pill" href="#v-pills-${name_noDot}" role="tab" aria-controls="v-pills-${name_noDot}" aria-selected="true">${'\n'.repeat(1)}${'\t'.repeat(8)}<i class="far fa-file-code fa-2x mr-4"></i>${'\n'.repeat(1)}${'\t'.repeat(8)}<span class="font-weight-bold large text-uppercase text-center" style="font-size: 1.5rem; ">${name}</span></a>${'\n'.repeat(2)}${'\t'.repeat(7)}`;
    else if(!(index <index_last))
    output = `<a class="nav-link mb-3 p-3 d-flex justify-content-center shadow" id="v-pills-${name}-tab" data-toggle="pill" href="#v-pills-${name_noDot}" role="tab" aria-controls="v-pills-${name_noDot}" aria-selected="false">${'\n'.repeat(1)}${'\t'.repeat(8)}<i class="far fa-file-code fa-2x mr-4"></i>${'\n'.repeat(1)}${'\t'.repeat(8)}<span class="font-weight-bold large text-uppercase text-center" style="font-size: 1.5rem; ">${name}</span></a>${'\n'.repeat(2)}${'\t'.repeat(4)}`;
    else
    output = `<a class="nav-link mb-3 p-3 d-flex justify-content-center shadow" id="v-pills-${name}-tab" data-toggle="pill" href="#v-pills-${name_noDot}" role="tab" aria-controls="v-pills-${name_noDot}" aria-selected="false">${'\n'.repeat(1)}${'\t'.repeat(8)}<i class="far fa-file-code fa-2x mr-4"></i>${'\n'.repeat(1)}${'\t'.repeat(8)}<span class="font-weight-bold large text-uppercase text-center" style="font-size: 1.5rem; ">${name}</span></a>${'\n'.repeat(2)}${'\t'.repeat(4)}`;

    return output;
}; 

const make_co_heirarKey = (er_index,f_index) => {
 
    const cross_o = bugreportjson.bugreport[f_index].Errors[er_index].CrossOrigin;
    const cross_o_length = Object.keys(cross_o).length;

    if(!$.isEmptyObject(cross_o)){
        const co_header = 
`                    <div id="cross-o-${er_index}" style="display:none;">
                        <hr class="mt-5">
                        <h2 class="text-center py-4">${bugreportjson.bugreport[f_index].FileName} - ${bugreportjson.bugreport[f_index].Errors[er_index].Title} - ${bugreportjson.bugreport[f_index].Errors[er_index].Type} Error</h2>
                    </div>    
                    `;
        $(`#files-analysed #v-pills-tabContent #errors-${bugreportjson.bugreport[f_index].FileName.replace('.','')}`).append(`\n${co_header}\n`);

        add_clickListener(`#files-analysed #v-pills-tabContent #errors-${bugreportjson.bugreport[f_index].FileName.replace('.','')} #co-${bugreportjson.bugreport[f_index].FileName.replace('.','')}-errIndex-${er_index}`,`#files-analysed #v-pills-tabContent #errors-${bugreportjson.bugreport[f_index].FileName.replace('.','')} #cross-o-${er_index}`);


        for(let i = 0; i < cross_o_length; ++i ){
            if(i!=0){            
                $(`#files-analysed #v-pills-tabContent #errors-${bugreportjson.bugreport[f_index].FileName.replace('.','')} #cross-o-${er_index} #accordion-${i-1} #collapse${i-1} .card-body`).append(`\n${make_co_tab(bugreportjson.bugreport[f_index].Errors[er_index].CrossOrigin[i],i)}\n\n`);
            }
            else{
                $(`#files-analysed #v-pills-tabContent #errors-${bugreportjson.bugreport[f_index].FileName.replace('.','')} #cross-o-${er_index}`).append(`\n${make_co_tab(bugreportjson.bugreport[f_index].Errors[er_index].CrossOrigin[i],i)}\n\n`);
            }
            

        }

                
    
    }

};

const add_clickListener = (button_id, target_id) => {
    $(button_id).click(function(){
        $(target_id).toggle();
      });
}

const make_co_tab = (err_obj, indx) => {
    var output;
    const syn_co = 
`                    <div id="accordion-${indx}" role="tablist">
                        <div class="card">
                            <div class="card-header text-center bg-dark" role="tab" id="heading${indx}">
                                <h5 class="mb-0">
                                    <a data-toggle="collapse" href="#collapse${indx}" aria-expanded="true" aria-controls="collapse${indx}">
                                    <strong>${err_obj.FileName}</strong> at Line No.: <strong>${err_obj.ln}</strong> in Directory: <strong>${err_obj.FilePath}</strong>
                                    </a>
                                </h5>
                            </div>
                            <div id="collapse${indx}" class="collapse show" role="tabpanel" aria-labelledby="heading${indx}" data-parent="#accordion-${indx}">
                                <div class="card-body"></div>
                            </div>
                        </div>
                    </div>    
                    `;

    output = syn_co;
    return output;
};

const make_pill = (index, name, index_last) => {
    var output;
    var name_noDot = name.replace('.','');

    if (index == 0)
    output = `${'\n'.repeat(1)}${'\t'.repeat(6)}<div class="tabBody tab-pane fade shadow rounded bg-white show active p-5" id="v-pills-${name_noDot}" role="tabpanel" aria-labelledby="v-pills-${name_noDot}-tab">${'\n'.repeat(1)}${'\t'.repeat(7)}<h4 class="font-italic mb-4"><a id="${index}*!*${name}" class="fileRepLink h1" style="padding-left: 3rem;" href="#" target="_self">${name}</a></h4><hr>${'\n'.repeat(1)}${'\t'.repeat(7)}<div id="errors-${name_noDot}" class="container">${'\n'.repeat(1)}${'\t'.repeat(8)}<div class="row">${'\n'.repeat(1)}${'\t'.repeat(8)}</div>${'\n'.repeat(1)}${'\t'.repeat(5)}${'\n'.repeat(2)}${'\t'.repeat(5)}`;
    else if(!(index <index_last))
    output = `<div class="tabBody tab-pane fade shadow rounded bg-white p-5" id="v-pills-${name_noDot}" role="tabpanel" aria-labelledby="v-pills-${name_noDot}-tab">${'\n'.repeat(1)}${'\t'.repeat(7)}<h4 class="font-italic mb-4"><a id="${index}*!*${name}" class="fileRepLink h1" style="padding-left: 3rem;" href="#" target="_self">${name}</a></h4><hr>${'\n'.repeat(1)}${'\t'.repeat(7)}<div id="errors-${name_noDot}" class="container">${'\n'.repeat(1)}${'\t'.repeat(8)}<div class="row">${'\n'.repeat(1)}${'\t'.repeat(8)}</div>${'\n'.repeat(1)}${'\t'.repeat(5)}${'\n'.repeat(2)}${'\t'.repeat(9)}`;
    else
    output = `<div class="tabBody tab-pane fade shadow rounded bg-white p-5" id="v-pills-${name_noDot}" role="tabpanel" aria-labelledby="v-pills-${name_noDot}-tab">${'\n'.repeat(1)}${'\t'.repeat(7)}<h4 class="font-italic mb-4"><a id="${index}*!*${name}" class="fileRepLink h1" style="padding-left: 3rem;" href="#" target="_self">${name}</a></h4><hr>${'\n'.repeat(1)}${'\t'.repeat(7)}<div id="errors-${name_noDot}" class="container">${'\n'.repeat(1)}${'\t'.repeat(8)}<div class="row">${'\n'.repeat(1)}${'\t'.repeat(8)}</div>${'\n'.repeat(1)}${'\t'.repeat(5)}${'\n'.repeat(2)}${'\t'.repeat(4)}`;

    return output;
};

const gen_filesHTML = () => {

    //Clear Contents in the Analysed .c files HTML tabs (#files-analysed)
    $('#files-analysed #v-pills-tab').empty();
    $('#files-analysed #v-pills-tabContent').empty();
    
    // Initialises Bug Analysis Overview Elements on the Landing Page
    for(var i = 0; i<json_length; ++i){
        
        var fileName = bugreportjson.bugreport[i].FileName;
        var fileErrors = bugreportjson.bugreport[i].Errors;
        
        //Initialize Landing Page's Display Tabs
        $('#files-analysed #v-pills-tab').append(`${make_pillTab(i,fileName,json_length)}`);

        $('#files-analysed #v-pills-tabContent').append(`${make_pill(i,fileName,json_length)}`);

        /* Insert Errors into Landing Page's Display Tabs with correct formatting */
        const errors_length = Object.keys(fileErrors).length;
        
        for(var j = 0; j<errors_length; ++j){
            if(fileErrors[j].Type == 'Syntax'){

                const syntax_erbx = 
`                    <div class="error-box col-xl-6">
                        <div class="card bg-syntax-gradient mb-3">
                            <div class="p-3 position-relative">
                                <span class="badge badge-dark mb-3"><a class="h5">${fileErrors[j].Type} Error</a></span>
                                                                
                                <div class="list-card-dark px-2">
                                    <h6 class="mb-1">
                                        <a href="#${fileErrors[j].ln}" class="fileRepLink1" style="color:black;font-weight: bolder;font-size: 24px;">${fileErrors[j].Title}</a>
                                    </h6>
                                    <p class="mb-3" style="color:black;font-weight:500;">${fileErrors[j].Description}</p>
                                    <p class="mb-3 time"><span class="bg-semi-light rounded-sm border border-dark pl-2 pb-1 pt-1 pr-2" style="color:black;font-weight:500;">Line No: ${fileErrors[j].ln}</span>${$.isEmptyObject(fileErrors[j].CrossOrigin)? `` : `<button id="co-${fileName.replace('.','')}-errIndex-${j}" class="bg-semi-dark rounded-sm mb-1 px-2 py-1 float-right"><a style="color:white;font-weight: bold;font-size: 14px;">Cross-Origin</a></button>`} </p>
                                </div>
                                <div>
                                    <span class="badge badge-danger ml-1"><a class="h6">${fileErrors[j].Occurrence}</a></span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                $(`#files-analysed #v-pills-tabContent #errors-${fileName.replace('.','')} .row`).append(`\n${syntax_erbx}`);

                if($.isEmptyObject(fileErrors[j].CrossOrigin))
                ;
                else make_co_heirarKey(j,i);                
            }
            else if(fileErrors[j].Type == 'Semantic'){

                const semantic_erbx = 
`                    <div class="error-box col-xl-6">
                        <div class="card bg-semantic-gradient mb-3">
                            <div class="p-3 position-relative">
                                <span class="badge badge-dark mb-3"><a class="h5">${fileErrors[j].Type} Error</a></span>
                                                                
                                <div class="list-card-dark px-2">
                                    <h6 class="mb-1">
                                        <a href="#${fileErrors[j].ln}" class="fileRepLink1" style="color:black;font-weight: bolder;font-size: 24px;">${fileErrors[j].Title}</a>
                                    </h6>
                                    <p class="mb-3" style="color:black;font-weight:500;">${fileErrors[j].Description}</p>
                                    <p class="mb-3 time"><span class="bg-semi-light rounded-sm border border-dark pl-2 pb-1 pt-1 pr-2" style="color:black;font-weight:500;">Line No: ${fileErrors[j].ln}</span> ${$.isEmptyObject(fileErrors[j].CrossOrigin)? `` : `<button id="co-${fileName.replace('.','')}-errIndex-${j}" class="bg-semi-dark rounded-sm mb-1 px-2 py-1 float-right"><a style="color:white;font-weight: bold;font-size: 14px;">Cross-Origin</a></button>`}</p>
                                </div>
                                <div>
                                    <span class="badge badge-danger ml-1"><a class="h6">${fileErrors[j].Occurrence}</a></span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                $(`#files-analysed #v-pills-tabContent #errors-${fileName.replace('.','')} .row`).append(`\n${semantic_erbx}`);

                if($.isEmptyObject(fileErrors[j].CrossOrigin))
                ;
                else make_co_heirarKey(j,i);
            }
            else if(fileErrors[j].Type == 'Logical'){

                const logical_erbx = 
`                    <div class="error-box col-xl-6">
                        <div class="card bg-logical-gradient mb-3">
                            <div class="p-3 position-relative">
                                <span class="badge badge-dark mb-3"><a class="h5">${fileErrors[j].Type} Error</a></span>
                                                                
                                <div class="list-card-dark px-2">
                                    <h6 class="mb-1">
                                        <a href="#${fileErrors[j].ln}" class="fileRepLink1" style="color:black;font-weight: bolder;font-size: 24px;">${fileErrors[j].Title}</a>
                                    </h6>
                                    <p class="mb-3" style="color:black;font-weight:500;">${fileErrors[j].Description}</p>
                                    <p class="mb-3 time"><span class="bg-semi-light text-dark rounded-sm border border-dark pl-2 pb-1 pt-1 pr-2" style="color:black;font-weight:500;">Line No: ${fileErrors[j].ln}</span> ${$.isEmptyObject(fileErrors[j].CrossOrigin)? `` : `<button id="co-${fileName.replace('.','')}-errIndex-${j}" class="bg-semi-dark rounded-sm mb-1 px-2 py-1 float-right"><a style="color:white;font-weight: bold;font-size: 14px;">Cross-Origin</a></button>`}</p>
                                </div>
                                <div>
                                    <span class="badge badge-danger ml-1"><a class="h6">${fileErrors[j].Occurrence}</a></span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                                                
                $(`#files-analysed #v-pills-tabContent #errors-${fileName.replace('.','')} .row`).append(`\n${logical_erbx}`);

                if($.isEmptyObject(fileErrors[j].CrossOrigin))
                ;
                else make_co_heirarKey(j,i);

            }
        }
        
        //Fix HTML Indentation
        $(`#files-analysed #v-pills-tabContent #errors-${fileName.replace('.','')} .row`).append(`${'\n'.repeat(1)}${'\t'.repeat(8)}`);
        
    }

};

gen_filesHTML();