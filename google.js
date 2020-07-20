const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
var request = require('request');


// scope for read/ write access
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// tolen file path of google api.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), getGoogle);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Prints the tokens from the spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1Jn1uxJ8_NVH3lOSB6pW6NbDJaOsdrrL1yq5oo0qTPl8/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function getGoogle(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: '1Jn1uxJ8_NVH3lOSB6pW6NbDJaOsdrrL1yq5oo0qTPl8',
    range: 'Sheet1!A3:A',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    console.log(rows);
    if (rows.length) {
      console.log('DATA FETCHED FROM SHEET');
      var i = 2;
      rows.map((row) => {
        console.log(`${row}`);
        i++;
        //calling function which calls tiingo api
        getValues(`${row}`, i, auth);
        
      });
    } else {
      console.log('No data found.');
    }

  });
}

function getValues(tok, row, auth){
    let date_ob = new Date();

    // current date
    let dd = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let mm = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let yyyy = date_ob.getFullYear();

    //calling tiingo daily prices api with token as tok
    //start and end dates are appended
var requestOptions = {
        'url': 'https://api.tiingo.com/tiingo/daily/'+ tok +'/prices?token=0bbff6cff38ccc4ba5a619971448ee557d10765f&startDate='+yyyy+'-'+(mm-1)+'-'+dd+'&endDate='+yyyy+'-'+mm+'-'+dd,
        'headers': {
            'Content-Type': 'application/json'
            }
        };

        

request(requestOptions,
        function(error, response, body) {
            const data = JSON.parse(body);
            var high = 0;
            var low = 1000;
            var vwap = 0;
            var PV = 0;
            var VOL = 0;
            if (body.length) {
           
            for(var i=0; i<data.length; i++){
                // highest price in month is checked
                if(data[i].high>high){high=data[i].high;}
                //lowest price in month is chesked
                if(data[i].low<low){low=data[i].low;}
                //summation of products of average price(high price + low price + close price divided by 3) and volume
                PV = PV + (((data[i].high+data[i].low+data[i].close)/3)*data[i].volume);
                //calculating summation of volumes if each day in the month
                VOL = VOL + data[i].volume;            }

            } else {
            console.log('No data found.');
            }
            //calculating vwap  = total sum of products of average prices and volumes / total sum of volumes
            vwap = PV/VOL;

            let values = [[`${high}`, `${low}`, `${vwap}`]];

            let range = 'Sheet1!'+'B'+row+':D'+row;

            // calling google sheet update api
            googleUpdate(range, values, auth);
        // return [`${high}`, `${low}`, `${vwap}`];

        }
);       
}

function googleUpdate(range, values, auth){
    const sheets = google.sheets({version: 'v4', auth});

      const data = [{
        range,
        values,
      }];
      const resource = {
        data,
        valueInputOption: 'RAW',
      };
      sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: '1Jn1uxJ8_NVH3lOSB6pW6NbDJaOsdrrL1yq5oo0qTPl8',
        resource,
      }, (err, result) => {
        if (err) {
          // Handle error
          console.log(err);
        } else {
          console.log(`${result.totalUpdatedCells}`+'cells updated.');
        }
      });
}

