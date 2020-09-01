# GoogleSheets
Google Sheets API + Stock Market Index(Tiingo API)
*Example code to use Google Sheets API*

**Instructions:**
1. Download the contents of the repository to a folder and open the folder in terminal or Visual Studio Code.

2. Run the following commands:
```
   $ npm install googleapis@39 --save
   $ npm install request
   ```
    
3. Run google.js file using node or nodemon.
```
   $ nodemon google.js
   or
   $ node google.js
```
:v:That's It!!:v:

4. The token file for google apis is already added. If the token is expired it might ask for login. Kindly check the console for login link and follow the the steps below:
  <<only to create new token file>>
  * open the link from console.
  * login using your google ID and give required permissions.
  * copy the ID generated and paste it in console and click enter.
The new token file will be generated or exixting file will be updated.

5. Kindly check the sheet for updates.

**App Description:**
- App picks current date and calls the tiingo API for data of previous one month.
- The coloumns from the sheet are first collected using google sheets GET API.
- The column names are used as tokens to collect data from Tiingo API

**NOTE:** The Tiingo API is not premiun so it can only accepts 500 requests per hour. Kindly consider this while using the App.
