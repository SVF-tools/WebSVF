This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

To change the static contents of the WebPage, simply modify or add to the appropriate fields in the `src/staticData.json` file.
For image assets, place the images in the `public/img` folder.

## Note

The following landing page has a `homepage` field in the _package.json_ file pointing to the domain where this page is hosted.
When testing the project locally using `yarn start` some assets may fail to load because the `homepage` field exists in the _package.json_ file and during testing you are not currently accessing the page from the domain specified by the `homepage` field.
To fix this issue, simply remove the `homepage` field from the _package.json_ file as shown in the _package-test-local.json_ file.
Please remember to add the `homepage` field back into the _package.json_ before commiting changes so that the webpage deployment doesn't break post-commit.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.
