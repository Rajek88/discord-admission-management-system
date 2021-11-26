// below line gave me ESM Error so downgrade fetch to v2
const fetch = require("node-fetch");
// I watched https://www.youtube.com/watch?v=PFJNJQCU_lo

// setup google sheet api
const { google } = require("googleapis");
const sheetId = "1U_4ritKqM3hDty8lhHisiT5JMJgzjvBC8oTgsfxkNgo";
// configure
require("dotenv").config();
const { Client, Intents } = require("discord.js");
const DMHandler = require("./DM");
const DMHandlerForEmailVerification = require("./DM");
const Sheet2Json = require("./processing/Sheet2Json");

// 1 = in normal DM, 2 = in Verfication DM
let isInDM = 1;

// use following commands to deal with DM u need to use partial channel and intent.flag.DM
const client = new Client({
  partials: ["CHANNEL"],
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
});

const PREFIX = "!";

// setup once ready for bot
client.once("ready", () => {
  console.log("Bot Online..");
});

// setup on message create
client.on("messageCreate", (message) => {
  // if the author of message is bot then it may get into loop, so handle it
  if (message.author.bot) {
    return;
  }

  console.log("msg type : ", message.channel.type);
  if (message.channel.type === "DM") {
    if (isInDM === 1) {
      DMHandler(message);
    } else if (isInDM === 2) {
      isInDM = DMHandlerForEmailVerification(message);
    }
    return;
  } else {
    if (message.content.startsWith(PREFIX)) {
      // if (message.content.substring(1) === "ping") {
      //   console.log("pinged");
      //   message.reply("Pong ...!");
      // }

      //   handle input
      const [cmd, clan, clanNum] = message.content
        .trim()
        .substring(PREFIX.length)
        .split("-");

      console.log(
        "cmd : " + cmd + " clan : " + clan + " clan-Num : " + clanNum
      );

      if (cmd === "join" && clan == "clan") {
        message.reply("Ok wait");

        // manipulate sheet
        const manipulate = async (clanNum) => {
          if (clanNum < 12 || clanNum > 13) {
            message.reply("No clan exists");
            return;
          }

          // initialize gauth
          const auth = new google.auth.GoogleAuth({
            keyFile: "creds.json",
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
          const getClanRow = response.values[1];
          const isClanRowEnabled = getClanRow[4].toUpperCase();
          console.log("is clan row Enabled : ", isClanRowEnabled);

          if (isClanRowEnabled === "YES") {
            //
            message.reply("Please check your DM to verify your mail");
            message.author.send("Enter your mail");
            isInDM = 2;

            // console.log(message.content);
          } else {
            message.reply("Admission full for now, Please try next time");
          }

          // now I will convert sheet to csv
        };
        manipulate(clanNum);
      } else {
        message.reply("Thats an invalid command, recheck it !");
      }
    } else {
      message.reply("Thats an invalid command, recheck it !");
    }
  }

  //   if its human then its ok
});

client.login(process.env.TOKEN);
