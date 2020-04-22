const generateTabs = () => {

    for(let ctr = 0; ctr<3; ++ctr){
        if(ctr==0){
            gen_bugTypeTabs('syntax');
        }
        else if(ctr==1){
            gen_bugTypeTabs('semantic')
        }
        else if(ctr==2){
            gen_bugTypeTabs('logical')
        }
    }
};
 
const make_pill = (index, name, index_last) => {
    var output;
    var name_noDot = name.replace('.','');

    if (index == 0)
    output = `${'\n'.repeat(1)}${'\t'.repeat(7)}<h4 class="font-italic mb-4"><a id="${index}*!*${name}" class="fileRepLink h1" href="#" style="padding-left: 3rem;">${name}</a></h4><hr>${'\n'.repeat(1)}${'\t'.repeat(7)}<div id="errors-${name_noDot}" class="container">${'\n'.repeat(1)}${'\t'.repeat(8)}<div class="row">${'\n'.repeat(1)}${'\t'.repeat(8)}</div>${'\n'.repeat(1)}${'\t'.repeat(5)}${'\n'.repeat(2)}${'\t'.repeat(5)}`;
    else if(!(index <index_last))
    output = `${'\n'.repeat(1)}${'\t'.repeat(7)}<h4 class="font-italic mb-4"><a id="${index}*!*${name}" class="fileRepLink h1" href="#" style="padding-left: 3rem;">${name}</a></h4><hr>${'\n'.repeat(1)}${'\t'.repeat(7)}<div id="errors-${name_noDot}" class="container">${'\n'.repeat(1)}${'\t'.repeat(8)}<div class="row">${'\n'.repeat(1)}${'\t'.repeat(8)}</div>${'\n'.repeat(1)}${'\t'.repeat(5)}${'\n'.repeat(2)}${'\t'.repeat(9)}`;
    else
    output = `${'\n'.repeat(1)}${'\t'.repeat(7)}<h4 class="font-italic mb-4"><a id="${index}*!*${name}" class="fileRepLink h1" href="#" style="padding-left: 3rem;">${name}</a></h4><hr>${'\n'.repeat(1)}${'\t'.repeat(7)}<div id="errors-${name_noDot}" class="container">${'\n'.repeat(1)}${'\t'.repeat(8)}<div class="row">${'\n'.repeat(1)}${'\t'.repeat(8)}</div>${'\n'.repeat(1)}${'\t'.repeat(5)}${'\n'.repeat(2)}${'\t'.repeat(4)}`;

    console.log(output);
    return output;
};

const make_co_heirarKey = (er_index,f_index,type_bug) => {
 
    const cross_o = bugreportjson.bugreport[f_index].Errors[er_index].CrossOrigin;
    const cross_o_length = Object.keys(cross_o).length;

    if(!$.isEmptyObject(cross_o)){
        const co_header = 
`                    <div id="cross-o-${er_index}" style="display:none;">
                        <hr class="mt-5">
                        <h2 class="text-center py-4">${bugreportjson.bugreport[f_index].FileName} - ${bugreportjson.bugreport[f_index].Errors[er_index].Title} - ${bugreportjson.bugreport[f_index].Errors[er_index].Type} Error</h2>
                    </div>    
                    `;
        $(`#test #v-pills-tabContent #v-pills-${type_bug}Error #errors-${bugreportjson.bugreport[f_index].FileName.replace('.','')}`).append(`\n${co_header}\n`);

        add_clickListener(`#test #v-pills-tabContent #v-pills-${type_bug}Error #errors-${bugreportjson.bugreport[f_index].FileName.replace('.','')} #co-${bugreportjson.bugreport[f_index].FileName.replace('.','')}-errIndex-${er_index}`,`#test #v-pills-tabContent #v-pills-${type_bug}Error #errors-${bugreportjson.bugreport[f_index].FileName.replace('.','')} #cross-o-${er_index}`);


        for(let i = 0; i < cross_o_length; ++i ){
            if(i!=0){            
                $(`#test #v-pills-tabContent #v-pills-${type_bug}Error #errors-${bugreportjson.bugreport[f_index].FileName.replace('.','')} #cross-o-${er_index} #accordion-${i-1} #collapse${i-1} .card-body`).append(`\n${make_co_tab(bugreportjson.bugreport[f_index].Errors[er_index].CrossOrigin[i],i)}\n\n`);
            }
            else{
                $(`#test #v-pills-tabContent #v-pills-${type_bug}Error #errors-${bugreportjson.bugreport[f_index].FileName.replace('.','')} #cross-o-${er_index}`).append(`\n${make_co_tab(bugreportjson.bugreport[f_index].Errors[er_index].CrossOrigin[i],i)}\n\n`);
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

const gen_bugTypeTabs = (type_bug) => {

    
    // Initialises Bug Analysis Overview Elements on the Landing Page
    for(var i = 0; i<json_length; ++i){
        
        var fileName = bugreportjson.bugreport[i].FileName;
        var fileErrors = bugreportjson.bugreport[i].Errors;
        
        //Initialize Bug Type Tabs
        $(`#test #v-pills-tabContent #v-pills-${type_bug}Error`).append(`${make_pill(i,fileName,json_length)}`);

        /* Insert Errors into Landing Page's Display Tabs with correct formatting */
        const errors_length = Object.keys(fileErrors).length;
        
        for(var j = 0; j<errors_length; ++j){
            if(fileErrors[j].Type == 'Syntax' && type_bug == 'syntax'){

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

                $(`#test #v-pills-tabContent #v-pills-${type_bug}Error #errors-${fileName.replace('.','')} .row`).append(`\n${syntax_erbx}`);

                if($.isEmptyObject(fileErrors[j].CrossOrigin))
                ;
                else make_co_heirarKey(j,i,type_bug);                
            }
            else if(fileErrors[j].Type == 'Semantic' && type_bug == 'semantic'){

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

                $(`#test #v-pills-tabContent #v-pills-${type_bug}Error #errors-${fileName.replace('.','')} .row`).append(`\n${semantic_erbx}`);

                if($.isEmptyObject(fileErrors[j].CrossOrigin))
                ;
                else make_co_heirarKey(j,i,type_bug);
            }
            else if(fileErrors[j].Type == 'Logical' && type_bug == 'logical'){

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
                                                
                $(`#test #v-pills-tabContent #v-pills-${type_bug}Error #errors-${fileName.replace('.','')} .row`).append(`\n${logical_erbx}`);

                if($.isEmptyObject(fileErrors[j].CrossOrigin))
                ;
                else make_co_heirarKey(j,i, type_bug);

            }
        }

        //Fix HTML Indentation
        $(`#files-analysed #v-pills-tabContent #errors-${fileName.replace('.','')} .row`).append(`${'\n'.repeat(1)}${'\t'.repeat(8)}`);
        
    }

};

generateTabs();