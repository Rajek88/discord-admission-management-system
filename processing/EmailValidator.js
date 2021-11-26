const { google } = require("googleapis");
const Sheet2Json = require("./Sheet2Json");
const sheetId = "1U_4ritKqM3hDty8lhHisiT5JMJgzjvBC8oTgsfxkNgo";

// validate email
const validateEmail = (emailAdress) => {
  let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (emailAdress.match(regexEmail)) {
    return true;
  } else {
    return false;
  }
};

module.exports = validateEmail;

const isUserExists = async (emailId) => {
  // initialize gauth
  const auth = new google.auth.GoogleAuth({
    keyFile: "./creds.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  //   create client instance for auth
  const gclient = await auth.getClient();

  // access google sheets
  const gsheets = google.sheets({ version: "v4", auth: gclient });

  //   get metadata of sheets
  const metaData = await gsheets.spreadsheets.get({
    auth,
    spreadsheetId: sheetId,
  });

  // console.log("metadata : ", metaData);

  // read spreadsheet

  const getRows = await gsheets.spreadsheets.values.get({
    auth,
    spreadsheetId: sheetId,
    range: "admissions",
  });

  const response = getRows.data;
  //   convert sheet to JSON
  const newJson = Sheet2Json(response.values);
  let isMail = "false";
  //   get all the clan names from admission file
  for (let clan of newJson) {
    let clanName = clan.Clan;
    const getRows = await gsheets.spreadsheets.values.get({
      auth,
      spreadsheetId: sheetId,
      range: clanName,
    });
    const clanResponse = getRows.data;
    console.log(`Clan Response for ${clanName} : `, clanResponse.values);
    //   convert sheet to JSON
    const eachClanJson = Sheet2Json(clanResponse.values);
    // console.log("each clan : ", eachClanJson);
    // get all the users from every clan
    for (let user of eachClanJson) {
      console.log(`each email in ${clanName} : `, user.Email + " & " + emailId);

      if (user.Email == emailId) {
        isMail = clanName;
        console.log("matched ", isMail);
      }
    }
  }
  if (isMail !== false) {
    return isMail;
  } else {
    return "false";
  }
};

module.exports = isUserExists;
