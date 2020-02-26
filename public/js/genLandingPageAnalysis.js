 //console.log(json_length);

 var syntax_cnt = 0;
 var semantic_cnt = 0;
 var logical_cnt = 0;

 var syntax_map = new Map();
 var semantic_map = new Map();
 var logical_map = new Map();

 const initialiseChecklistMaps = () => {
   for (var i = 0; i < json_length; ++i) {
     const ers_length = Object.keys(bugreportjson.bugreport[i].Errors)
       .length;

     //console.log(ers_length);

     for (var j = 0; j < ers_length; ++j) {
       var er_item = bugreportjson.bugreport[i].Errors[j];
       if (er_item.Type == "Syntax") {
         if (syntax_map.has(er_item.Title)) {
           syntax_map.set(
             er_item.Title,
             syntax_map.get(er_item.Title) + 1
           );
           ++syntax_cnt;
         } else {
           syntax_map.set(er_item.Title, 1);
           ++syntax_cnt;
         }
       } else if (er_item.Type == "Semantic") {
         if (semantic_map.has(er_item.Title)) {
           semantic_map.set(
             er_item.Title,
             semantic_map.get(er_item.Title) + 1
           );
           ++semantic_cnt;
         } else {
           semantic_map.set(er_item.Title, 1);
           ++semantic_cnt;
         }
       } else if (er_item.Type == "Logical") {
         if (logical_map.has(er_item.Title)) {
           logical_map.set(
             er_item.Title,
             logical_map.get(er_item.Title) + 1
           );
           ++logical_cnt;
         } else {
           logical_map.set(er_item.Title, 1);
           ++logical_cnt;
         }
       }
     }
   }
 };

 const initErrorTotals = () => {
   $('#ttl-err').html(logical_cnt+syntax_cnt+semantic_cnt);
   $('#syntax-ttl').html(syntax_cnt);
   $('#semantic-ttl').html(semantic_cnt);
   $('#logical-ttl').html(logical_cnt);
 }

 const initCheckBoxesANDBugTable = () => {
   $('#syntax-error-checklist').empty();
   $('#semantic-error-checklist').empty();
   $('#logical-error-checklist').empty();
   $('#project-errors-list tbody').empty();

   var id_key = 0;
   var id_table = 1;
   for(let [key, value] of syntax_map){
     const syntax_box = 
`                    <li class="py-1">
                 <!-- Default checked -->
                 <div class="custom-control custom-checkbox">
                   <input type="checkbox" class="custom-control-input" id="syntax-box-${id_key}" checked="">
                   <label class="custom-control-label" for="syntax-box-${id_key}">${key}</label>
                 </div>
               </li>
`;
     const syntax_table =
`                  <tr id="syntax-row-${id_key}">
                    <th scope="row">${id_table}</th>
                    <td>${key}</td>
                    <td>Syntax Error</td>
                    <td>${value}</td>
                  </tr>
`;        
     $('#syntax-error-checklist').append(syntax_box);

     $('#project-errors-list tbody').append(syntax_table);  

     ++id_key;
     ++id_table;
   }
   
   id_key = 0;
   for(let [key, value] of semantic_map){
     const semantic_box = 
`                    <li class="py-1">
                 <!-- Default checked -->
                 <div class="custom-control custom-checkbox">
                   <input type="checkbox" class="custom-control-input" id="semantic-box-${id_key}" checked="">
                   <label class="custom-control-label" for="semantic-box-${id_key}">${key}</label>
                 </div>
               </li>
`;
     const semantic_table =
`                  <tr id="semantic-row-${id_key}">
                    <th scope="row">${id_table}</th>
                    <td>${key}</td>
                    <td>Semantic Error</td>
                    <td>${value}</td>
                  </tr>
`;         
     $('#semantic-error-checklist').append(semantic_box);

     $('#project-errors-list tbody').append(semantic_table);  

     ++id_key;
     ++id_table;
   }
   
   id_key = 0;
   for(let [key, value] of logical_map){
     const logical_box = 
`                    <li class="py-1">
                 <!-- Default checked -->
                 <div class="custom-control custom-checkbox">
                   <input type="checkbox" class="custom-control-input" id="logical-box-${id_key}" checked="">
                   <label class="custom-control-label" for="logical-box-${id_key}">${key}</label>
                 </div>
               </li>
`;
     const logical_table =
`                  <tr id="logical-row-${id_key}">
                    <th scope="row">${id_table}</th>
                    <td>${key}</td>
                    <td>Logical Error</td>
                    <td>${value}</td>
                  </tr>
`;        
     $('#logical-error-checklist').append(logical_box);

     $('#project-errors-list tbody').append(logical_table);
     ++id_key;
     ++id_table;
   }


   

 }

 const addListener = () => {

    $(document).ready(function(){
        $('input[type="checkbox"]').click(function() {
             if($(this).is(':checked')){
                 console.log($(this).parent().find('label').html())
                 //console.log('checked');
             } else if($(this).is(":not(:checked)")){
                const id = $(this).attr('id');
                const row_id = id.substring(11,id.length);
                console.log(row_id);
                
             }
         });
     });
 }

 initialiseChecklistMaps();
 initErrorTotals();
 initCheckBoxesANDBugTable();
 addListener();

 
 //project-errors-list
 /* Testing --
 console.log(`Syntax Map Size: ${syntax_map.size}`);
 console.log(`Semantic Map Size: ${semantic_map.size}`);
 console.log(`Logical Map Size: ${logical_map.size}`);

 for (let [key, value] of logical_map) {
   console.log(key + " - " + value);
 }
 -- */