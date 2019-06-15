# NASA Image Search Web App (Capital One May 2019 SES Summit Application Winner)

## Link to Deployed Website
* https://ayang4114.github.io/nasa_image_search/

## Introduction
This project was made as part of an application for __Capital One's Software Engineering Summit__ (SES). The goal of the project was to design a web app that could access NASA's Image Gallery API. When a user provides specific search terms/queries, the web app requests image results under the search parameters and displays those results.

## Important Notes
This repository has been greatly updated (and hopefully improved) since its submission for the SES application. As such, the following [Solution](#Solution) and [Algorithms](#Algorithms) section do not accurately reflect the submitted code base.

You may find the submitted repository by navigating through the commit history, but a brief summary of what has changed since then is listed below:
* The `App` component now manages and renders all pages of the application rather than just rendering the first search page. Originally, the search results were shown by directly manipulating the _DOM_ using __ReactDOM__ and rendering the search result.
    * __Reasoning__: This change suits and supports the idea of React, where changes are made in the state of the components rather than by manipulating the DOM. 
* All `.js` and `.css` files were originally contained in the root directory. This has been changed such that all individual components are separated into their own file directories. These directories are placed in the `components` directory.
    * __Reasoning__: Provides better component-modularity and organization across the files.
* The `.js` files with React components have been renamed into `.jsx` files.
    * __Reasoning__: Gives a distinction between React files and JavaScript files.

## Solution


## Algorithms
When the user searches, the URL used to retrieve the search results is made. The API root concatenated to “/search”, and then the parameters are concatenated to the ends of the URL. Any parameters that are empty strings are not added to the URL and ignored during the search. After the URL is produced, an HTTP request is made to the NASA API server, which returns a JSON, where the values are saved as part of the App component's states. 

This JSON is passed as a prop to the Search component, which uses the information to display the search the search results. Since each JSON returned by the HTTP request has 100 items per page, the Search component also computes and stores in its state the JSONs of the next and previous pages if any of them exist. When the JSONs of the previous and/or next pages are processed, the Search component determines what navigation buttons (Previous only, Next only, both Previous and Next, or neither) are to be rendered at the bottom of the page. 

The information about the current page in the JSON is passed as a prop to the Table component, which renders a 5 x 5 table.  Each cell in that table is rendered by a Photo component, which displays the image based on the table cell index and the page number. 

Since each JSON returns 100 items per page, and each page in the web app renders up to 25 photos, each page displays a quarter of the images in the JSON. As such, the formula to calculate the index number in the items array of the JSON is the following:

index = ((current_page_number - 1) mod 4)*25 + (i - 1), where the value of current_page_number is an integer greater than or equal to 1, and i represents the ith table cell of the current image.


## Additional Information/Context
You may find more information regarding this project in the following links:
* The Project Challenge
    * https://www.mindsumo.com/contests/nasa-image-archive
* Capital One Summits
    * https://campus.capitalone.com/summits/
* NASA Image Gallery API
    * https://api.nasa.gov/api.html#Images


## Technology/Tools 
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). The project uses the __fetch__ API to make _GET_ requests from NASA's API.

## Available Scripts

The following scripts are provided by React upon running `npx create-react-app <name>`. In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
