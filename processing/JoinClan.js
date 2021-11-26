// setup google sheet api
const { google } = require("googleapis");
const sheetId = "1U_4ritKqM3hDty8lhHisiT5JMJgzjvBC8oTgsfxkNgo";

const Sheet2Json = require("./Sheet2Json");

const JoinClan = async (message, clanNum) => {
  // manipulate sheet
  if (clanNum < 12 || clanNum > 13) {
    message.reply("No clan exists");
    return;
  }

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
  console.log("row data : ", getRows.data);
  const newJson = Sheet2Json(response.values);
  console.log("New JSON : ", newJson);
  // collect user data
  let userData = [];
  //assign authorID to memberID

  // ************************************** Join Clan ************************************************************************************************************
  // only take emaailbut verify it on the basis of user id

  // await joinClan(args, userData);

  // now I want to perform sql queries on the gsheet for dyanmic system crud

  // get all the values for given clan
  // first encode the string from here "https://developers.google.com/chart/interactive/docs/querylanguage#setting-the-query-from-javascript"

  // this is nice but not required in our project

  // const getClanRowQuery = "where%20Clan%20%3D%20Clan-" + clanNum;
  // const makeClanRowQuery =
  //   "https://docs.google.com/a/google.com/spreadsheets/d/" +
  //   sheetId +
  //   "/gviz/tq?tq=" +
  //   getClanRowQuery;
  // const resultOfCllanRowquery = fetch(makeClanRowQuery)
  //   .then((response) => response)
  //   .then((data) => console.log("data : ", data))
  //   .catch((err) => console.log(err));

  // console.log("output : ", resultOfCllanRowquery);

  // ***************************** getting hard data works but it is not reliable
  //   const getClanRow = response.values[1];
  //   const isClanRowEnabled = getClanRow[4].toUpperCase();

  //   check if clan exists or not, if exists check it is enabled or not
  let isClanRowEnabled = false;
  for (let clan of newJson) {
    if (clan.Clan === `Clan-${clanNum}`) {
      isClanRowEnabled = clan.Enabled.toUpperCase();
    }
  }
  console.log("is clan row Enabled : ", isClanRowEnabled);

  if (isClanRowEnabled === "YES") {
    //create user in sheet

    // try accessing the clan sheet
    console.log("Trying to access sheet.");
    const clanSheet = gsheets.spreadsheets.values
      .get({
        auth,
        spreadsheetId: sheetId,
        range: `Clan-${clanNum}`,
      })
      .catch((error) => {
        // if there is no clan sheet, create it
        console.log("Creating sheet : ", `Clan-${clanNum}`);

        // let values = [
        //   ["Email", "Candidate ID", "Command", "Role ID", "Time"],
        //   // Potential next row
        // ];

        // const resource = {
        //   values,
        // };
        const request = {
          // The ID of the spreadsheet
          spreadsheetId: sheetId,
          resource: {
            requests: [
              {
                addSheet: {
                  // Add properties for the new sheet
                  properties: {
                    sheetId: clanNum,
                    title: `Clan-${clanNum}`,
                  },
                },
              },
              {
                appendCells: {
                  rows: [
                    {
                      values: [
                        {
                          userEnteredValue: {
                            stringValue: "Email",
                          },
                        },
                        {
                          userEnteredValue: {
                            stringValue: "Candidate Id",
                          },
                        },
                        {
                          userEnteredValue: {
                            stringValue: "Command",
                          },
                        },
                        {
                          userEnteredValue: {
                            stringValue: "Role Id",
                          },
                        },
                        {
                          userEnteredValue: {
                            stringValue: "Time",
                          },
                        },
                      ],
                    },
                  ],
                  fields: "userEnteredValue",
                  sheetId: clanNum,
                },
              },
            ],
          },
        };
        gsheets.spreadsheets.batchUpdate(request, function (err, response) {
          if (err) {
            console.error(err);
            return;
          }
          console.log("creating Google sheet : ", response);
        });
      });

    message.reply("Please check your DM to verify your mail");
    // message.author.send("Enter your mail");
    isInDM = 2;

    // console.log(message.content);
  } else {
    message.reply("Admission full for now, Please try next time");
  }
};

module.exports = JoinClan;
