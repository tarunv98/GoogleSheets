# CodeAstra

Hello,

Following are the steps to run the app:

1. Download the contents of the repository to a folder and open the folder in terminal or Visual Studio Code.

2. Run the following commands:
   $ npm install googleapis@39 --save
   $ npm install request
    
    This should create the required nodemodules for the app.

3. Run server.js file using node or nodemon.

4. The token file for google apis is already added. If the token is expired it might ask for login. Kindly check the console for login link and follow the the steps below:
  <<only to create new token file>>
  (A) open the link from console.
  (B) login using your google ID and give required permissions.
  (C) copy the ID generated and paste it in console and click enter.
The new token file will be generated or exixting file will be updated.

5. That's it. Kindly check the sheet for updates.

APP DESCRIPTION:
=> App picks current date and calls the tiingo API for data of previous one month.
=> The coloumns from the sheet are first collected using google sheets GET API.
=> The column names are used as tokens to collect data from Tiingo API

NOTE: The Tiingo API is not premiun so it can only accepts 500 requests per hour. Kindly consider this while using the App.

Thankyou,

Tarun Vasagiri
tarunvasagiri98@gmail.com
