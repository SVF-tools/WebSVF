const userSchema = require('../models/Users');

module.exports = (app) => {
  app.post('/db/saveFile/', async (req, res) => {
    //Check if the project exists in the current user's collection
    const projectFound = await userSchema.exists({
      googleID: 'abcd',
      'projects.projectID': 'abc',
    });

    //If the project does not exist respond to the req with status 404
    if (!projectFound) {
      res.status('404').send({
        message: 'Project Not Found',
      });
    }
    //If the project is found (core logic for this endpoint)
    else {
      //Check if the folder being sent already exists in the db if not create folder first
      const foundFolder = await userSchema.exists({
        googleID: 'abcd',
        'projects.projectID': 'abc',
        'projects.userCode.folderName': req.body.folderName,
      });

      if (foundFolder) {
        //Check if the file being sent already exists in the db
        const foundFile = await userSchema.exists({
          googleID: 'abcd',
          'projects.projectID': 'abc',
          'projects.userCode.folderName': req.body.folderName,
          'projects.userCode.files.fileName': req.body.fileName,
        });

        //If a file being sent through the req already exists
        if (foundFile) {
          //Get the existing file file from the db
          const file = await userSchema.findOne({
            googleID: 'abcd',
            'projects.projectID': 'abc',
            'projects.userCode.folderName': req.body.folderName,
            'projects.userCode.files.fileName': req.body.fileName,
          });

          //Find the index of the project in the projects array of the user
          const projectIndex = file.projects.findIndex((project) => {
            return project.projectID === 'abc';
          });
          //Find the index of the file in the userCode array of the current project
          const codeFolderIndex = file.projects[
            projectIndex
          ].userCode.findIndex((code) => {
            return code.folderName === req.body.folderName;
          });

          const codeFileIndex = file.projects[projectIndex].userCode[
            codeFolderIndex
          ].files.findIndex((code) => {
            return code.fileName === req.body.fileName;
          });

          //Calculate a new version for the file to be stored as a parameter in the userCode file being updated
          const newVersion = (
            Number(
              file.projects[projectIndex].userCode[codeFolderIndex].files[
                codeFileIndex
              ].version
            ) + 0.01
          ).toFixed(2);

          //Update the file with the new code sent through the req and update its versioning
          await userSchema.findOneAndUpdate(
            {
              googleID: 'abcd',
            },
            {
              $set: {
                'projects.$[i].userCode.$[j].files.$[k]': {
                  fileName: req.body.fileName,
                  version: newVersion,
                  fileID: 'xyz',
                  content: req.body.code,
                },
              },
            },
            {
              arrayFilters: [
                { 'i.projectID': 'abc' },
                { 'j.folderName': req.body.folderName },
                { 'k.fileName': req.body.fileName },
              ],
            }
          );

          //Respond to the request with status 201 with the code sent through the req and a message
          res.status('201').send({
            data: req.body.code,
            message: 'code updated in database',
          });
        }
        //If the file doesn't exist in the db
        else {
          //Add file to the db
          await userSchema.findOneAndUpdate(
            {
              googleID: 'abcd',
            },
            {
              $addToSet: {
                'projects.$[h].userCode.$[i].files': {
                  fileName: req.body.fileName,
                  version: '1.0',
                  fileID: 'xyz',
                  content: req.body.code,
                },
              },
            },
            {
              arrayFilters: [
                { 'h.projectID': 'abc' },
                { 'i.folderName': req.body.folderName },
              ],
              upsert: true,
            }
          );

          //Respond to the request with status 201 with the code sent through the req and a message
          res.status('201').send({
            data: req.body.code,
            message: 'code added to database',
          });
        }
      } else {
        res.status('201').send({
          message: 'folder not found: Create the folder first then try again',
        });
      }
    }
  });

  app.post('/db/saveFolder/', async (req, res) => {
    //Check if the project exists in the current user's collection
    const projectFound = await userSchema.exists({
      googleID: 'abcd',
      'projects.projectID': 'abc',
    });

    //Check if the file being sent already exists in the db
    const foundFolder = await userSchema.exists({
      googleID: 'abcd',
      'projects.projectID': 'abc',
      'projects.userCode.folderName': req.body.folderName,
    });

    //If the project does not exist respond to the req with status 404
    if (!projectFound) {
      res.status('404').send({
        message: 'Project Not Found',
      });
    }
    //If the project is found (core logic for this endpoint)
    else {
      //If a file being sent through the req already exists
      if (foundFolder) {
        //Respond to the request with status 201 with the code sent through the req and a message
        res.status('201').send({
          message: 'folder already exists in database',
        });
      }
      //If the file doesn't exist in the db
      else {
        //Add file to the db
        await userSchema.findOneAndUpdate(
          {
            googleID: 'abcd',
          },
          {
            $addToSet: {
              'projects.$[h].userCode': {
                folderID: Math.random().toString(),
                folderName: req.body.folderName,
              },
            },
          },
          {
            arrayFilters: [{ 'h.projectID': 'abc' }],
            upsert: true,
          }
        );

        //Respond to the request with status 201 with the code sent through the req and a message
        res.status('201').send({
          data: req.body.code,
          message: 'folder added to database',
        });
      }
    }
  });

  app.get('/db/getFiles', async (req, res) => {
    //Check if the project exists in the db for the current user
    const projectExists = await userSchema.exists({
      googleID: 'abcd',
      'projects.projectID': 'abc',
    });
    if (projectExists) {
      //Find and send the projects array of the current user
      const project = await userSchema.findOne({
        googleID: 'abcd',
        'projects.projectID': 'abc',
      });
      res.status('201').send(project);
    } else {
      //Respond with 404 to the request if project is not found
      res.status('404').send({
        message: 'Project Not Found',
      });
    }
  });

  //Test function for testing routes
  app.get('/db/mongoTest', async (req, res) => {
    // const find = await userSchema.exists({
    //   googleID: 'abcd',
    //   'projects.projectID': 'abc',
    // });
    // res.send(`Project Found (?): ${find}`);

    // await userSchema({
    //   googleID: 'abcd',
    //   projects: [
    //     {
    //       projectID: 'abc',
    //       userCode: [
    //         {
    //           folderID: 'xyz123',
    //           folderName: 'test',
    //         },
    //       ],
    //     },
    //   ],
    // }).save();

    res.send('Schema created');
  });
};
