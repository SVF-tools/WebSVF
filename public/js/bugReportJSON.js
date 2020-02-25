
const bugreportjson = {
  "bugreport": [
    {
      "id": 0,
      "FileName": "xxx.c",
      "FilePath": "./",
      "Errors": [
        {
          "ln": 4,
          "Type": "Logical",
          "Occurrence": "Dynamic (Run-Time)",
          "Title": "Null Reference",
          "Description": "Null",
          "CrossOrigin": []
        },
        {
          "ln": 8,
          "Type": "Semantic",
          "Occurrence": "Static (Compile-Time)",
          "Title": "Variable 'statc' not recognised",
          "Description": "Null",
          "CrossOrigin": [
            { "CrossOriginIndex": 0,"FileName": "xxy.c", "FilePath": "./c-code-files", "ln": 16 },
            { "CrossOriginIndex": 1,"FileName": "xxx.c", "FilePath": "./", "ln": 8 },
            { "CrossOriginIndex": 2,"FileName": "xxz.c", "FilePath": "./c-code-files", "ln": 18 }
          ]
        },
        {
          "ln": 10,
          "Type": "Syntax",
          "Occurrence": "Static (Compile-Time)",
          "Title": "Unexpected end of line",
          "Description": "Null",
          "CrossOrigin": []
        }
      ]
    },
    {
      "id": 1,
      "FileName": "xxy.c",
      "FilePath": "./c-code-files",
      "Errors": [
        {
          "ln": 4,
          "Type": "Syntax",
          "Occurrence": "Static (Compile-Time)",
          "Title": "Missing end of function '}'",
          "Description": "Null",
          "CrossOrigin": [
            { "CrossOriginIndex": 0,"FileName": "xxz.c", "FilePath": "./c-code-files", "ln": 12 },
            { "CrossOriginIndex": 1,"FileName": "xxy.c", "FilePath": "./c-code-files", "ln": 6 }
          ]
        },
        {
          "ln": 13,
          "Type": "Semantic",
          "Occurrence": "Static (Compile-Time)",
          "Title": "Function reference 'init()' not found",
          "Description": "Null",
          "CrossOrigin": []
        },
        {
          "ln": 18,
          "Type": "Logical",
          "Occurrence": "Dynamic (Run-Time)",
          "Title": "Null Reference",
          "Description": "Null",
          "CrossOrigin": []
        }
      ]
    }
  ]
}
;
console.log(bugreportjson.bugreport);