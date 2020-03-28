function add_errLines(err_index){
    const stack_arr = bugreportjson.bugreport[file_id].Errors[err_index].StackTrace;
    var st_lines = [];
    var line_clr;

    if(!$.isEmptyObject(stack_arr)){
       const st_length = Object.keys(stack_arr).length;
              
      for(let i = 0; i<st_length-1;++i){
        var ll_st = {};
        ll_st['start'] = `${stack_arr[i].ln}`;
        ll_st['end'] = `${stack_arr[i+1].ln}`;
        st_lines.push(ll_st);
      }
      
      console.log(bugreportjson.bugreport[file_id].Errors[err_index].Type);
      
      if(bugreportjson.bugreport[file_id].Errors[err_index].Type=='Syntax'){
      line_clr = 'rgba(61, 178, 255, 0.50)';
      }
      else if(bugreportjson.bugreport[file_id].Errors[err_index].Type=='Semantic'){
      line_clr = 'rgba(251, 255, 19, 0.50)';
      }
      else if(bugreportjson.bugreport[file_id].Errors[err_index].Type=='Logical'){
      line_clr = 'rgba(125, 253, 125, 0.50)';
      }  
      
      st_lines.forEach(function(line) {
      var start = document.getElementById(line.start),
        end = document.getElementById(line.end);
        
      if (start !== null && end !== null) {
        line.obj = new LeaderLine(start, end, {
    /*    Add/Change Options here for altering the Leader-Lines */
          color: line_clr,
          size: 2,
          //path: "straight",
          startPlug: "disc",
          //startPlugSize: 1.2,
          startSocket: "left",
          //endPlug: "arrow3",
          endPlug: "arrow2",
          endPlugSize: 1.2,
          endSocket: "right",
          dash: {animation: true}
        });
      }
    });

    }
      
}   
    