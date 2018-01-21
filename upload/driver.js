const fs = require('fs')
const {promisify} = require('util')
const request = require('request')
const path = require('path')
const readline = require('readline')
const google = require('googleapis')
const googleAuth = require('google-auth-library')
const jsonfile = require('jsonfile')
const folder = '1iW6EGigDAyUMQ2E23tSR-pb1FMJICV1Z'
// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/drive-nodejs-quickstart.json
const SCOPES = ['https://www.googleapis.com/auth/drive']
const TOKEN_DIR = './.credentials/'
const TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json'


// // Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets (err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err)
    return
  }
  // Authorize a client with the loaded credentials, then call the
  // Drive API.
  // var auth = await authorizeAsync(JSON.parse(content))
  // console.log(auth)
  // listFiles(auth)
  authorize(JSON.parse(content), uploadFiles)
})

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize (credentials, callback) {
  var clientSecret = credentials.installed.client_secret
  var clientId = credentials.installed.client_id
  var redirectUrl = credentials.installed.redirect_uris[0]
  var auth = new googleAuth()
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl)

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function (err, token) {
    if (err) {
      getNewToken(oauth2Client, callback)
    } else {
      oauth2Client.credentials = JSON.parse(token)
      callback(oauth2Client)
    }
  })
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken (oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })
  console.log('Authorize this app by visiting this url: ', authUrl)
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  rl.question('Enter the code from that page here: ', function (code) {
    rl.close()
    oauth2Client.getToken(code, function (err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err)
        return
      }
      oauth2Client.credentials = token
      storeToken(token)
      callback(oauth2Client)
    })
  })
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken (token) {
  try {
    fs.mkdirSync(TOKEN_DIR)
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token))
  console.log('Token stored to ' + TOKEN_PATH)
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles (auth) {
  var service = google.drive('v3')
  service.files.list({
    auth: auth,
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)'
  }, function (err, response) {
    if (err) {
      console.log('The API returned an error: ' + err)
      return
    }
    var files = response.files
    if (files.length == 0) {
      console.log('No files found.')
    } else {
      console.log('Files:')
      for (var i = 0; i < files.length; i++) {
        var file = files[i]
        console.log('%s (%s)', file.name, file.id)
      }
    }
  })
}

async function uploadFiles (auth) {
  var jsonDB = jsonfile.readFileSync('../json/lb.json')
  const start = 500;
  const breakpoint = 650;
  for (let index in jsonDB){
    if (index >=start && index < breakpoint) {
      await sleep(1500)
      var drive = google.drive('v3')
      var resource = {
        'name': jsonDB[index].number + '.jpg',
        'parents': [folder],
      }
      var media = {
        mimeType: 'image/jpeg',
        body: await streamSync(jsonDB[index].cover)
      }

      var file = await uploadSync(drive, {
        auth,
        resource,
        media,
        fields: 'id'
      })
      console.log(file.id, index)
      delete drive
    }
  }
  
}

function streamSync(uri) {
  return new Promise(function(resolve, reject) {
    request.get(uri)
        .on('response', function(response) {
            response.pause();
            resolve(response);  
        });
    })
}

function uploadSync(drive, query) {
  return new Promise((resolve, reject) => {
    drive.files.create(query, function (err, file) {
      if (err) {
        // Handle error
        reject(err)
      } else {
        resolve(file)
      }
    })
  })
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
