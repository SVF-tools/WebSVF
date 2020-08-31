var syntax_cnt = 0;
var semantic_cnt = 0;
var logical_cnt = 0;

var syntax_map = new Map();
var semantic_map = new Map();
var logical_map = new Map();
var table_map = new Map();

const initialiseChecklistMaps = () => {
  for (var i = 0; i < json_length; ++i) {
    const ers_length = Object.keys(bugreportjson.bugreport[i].Errors)
      .length;

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
  $('#ttl-err').html(logical_cnt + syntax_cnt + semantic_cnt);
  $('#syntax-ttl').html(syntax_cnt);
  $('#semantic-ttl').html(semantic_cnt);
  $('#logical-ttl').html(logical_cnt);
}

const initCheckBoxes = () => {
  $('#syntax-error-checklist').empty();
  $('#semantic-error-checklist').empty();
  $('#logical-error-checklist').empty();

  var id_key = 0;
  for (let key of syntax_map.keys()) {
    const syntax_box =
      `                    <li class="py-1">
                 <!-- Default checked -->
                 <div class="custom-control custom-checkbox">
                   <input type="checkbox" class="custom-control-input" id="syntax-box-${id_key}" checked="">
                   <label class="custom-control-label" for="syntax-box-${id_key}">${key}</label>
                 </div>
               </li>
`;

    $('#syntax-error-checklist').append(syntax_box);

    ++id_key;
  }

  id_key = 0;
  for (let key of semantic_map.keys()) {
    const semantic_box =
      `                    <li class="py-1">
                 <!-- Default checked -->
                 <div class="custom-control custom-checkbox">
                   <input type="checkbox" class="custom-control-input" id="semantic-box-${id_key}" checked="">
                   <label class="custom-control-label" for="semantic-box-${id_key}">${key}</label>
                 </div>
               </li>
`;

    $('#semantic-error-checklist').append(semantic_box);

    ++id_key;
  }

  id_key = 0;
  for (let key of logical_map.keys()) {
    const logical_box =
      `                    <li class="py-1">
                 <!-- Default checked -->
                 <div class="custom-control custom-checkbox">
                   <input type="checkbox" class="custom-control-input" id="logical-box-${id_key}" checked="">
                   <label class="custom-control-label" for="logical-box-${id_key}">${key}</label>
                 </div>
               </li>
`;

    $('#logical-error-checklist').append(logical_box);

    ++id_key;
  }
};

const initTableMap = () => {
  for (let [key, value] of syntax_map) {
    table_map.set(key, value);
  }
  for (let [key, value] of semantic_map) {
    table_map.set(key, value);
  }
  for (let [key, value] of logical_map) {
    table_map.set(key, value);
  }
}

const generateBugTable = () => {
  $('#project-errors-list tbody').empty();
  var id_table = 1;
  for (let [key, value] of table_map) {

    if (logical_map.has(key)) {
      const logical_table =
        `                  <tr>
                    <th scope="row">${id_table}</th>
                    <td>${key}</td>
                    <td><a href="bugTypeSummary.html#v-pills-logicalError-tab" target="_self">Logical Error</a></td>
                    <td class="text-center">${value}</td>
                  </tr>
`;
      $('#project-errors-list tbody').append(logical_table);
      ++id_table;
    }
    else if (semantic_map.has(key)) {
      const semantic_table =
        `                  <tr>
                    <th scope="row">${id_table}</th>
                    <td>${key}</td>
                    <td><a href="bugTypeSummary.html#v-pills-semanticError-tab" target="_self">Semantic Error</a></td>
                    <td class="text-center">${value}</td>
                  </tr>
`;
      $('#project-errors-list tbody').append(semantic_table);
      ++id_table;
    }
    else if (syntax_map.has(key)) {
      const syntax_table =
        `                  <tr>
                    <th scope="row">${id_table}</th>
                    <td>${key}</td>
                    <td><a href="bugTypeSummary.html#v-pills-syntaxError-tab" target="_self">Syntax Error</a></td>
                    <td class="text-center">${value}</td>
                  </tr>
`;
      $('#project-errors-list tbody').append(syntax_table);
      ++id_table;
    }

  }
};

const remFrmTable = (item) => {
  if (table_map.has(item)) {
    table_map.delete(item);
  }
};

const addToTable = (item) => {
  if (!table_map.has(item)) {
    if (syntax_map.has(item)) {
      table_map.set(item, syntax_map.get(item));
    }
    else if (logical_map.has(item)) {
      table_map.set(item, logical_map.get(item));
    }
    else if (semantic_map.has(item)) {
      table_map.set(item, semantic_map.get(item));
    }

  }
}

const addListener = () => {
  $(document).ready(function () {
    $('input[type="checkbox"]').click(function () {
      if ($(this).is(':checked')) {
        addToTable($(this).parent().find('label').html());
        generateBugTable();
      }
      else if ($(this).is(":not(:checked)")) {
        remFrmTable($(this).parent().find('label').html());
        generateBugTable();

      }
    });
  });
};

initialiseChecklistMaps();
initErrorTotals();
initCheckBoxes();
initTableMap();
generateBugTable();
addListener();