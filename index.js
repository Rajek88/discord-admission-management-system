// I watched https://www.youtube.com/watch?v=PFJNJQCU_lo

// setup google sheet api
const { google } = require("googleapis");
const sheetId = "1U_4ritKqM3hDty8lhHisiT5JMJgzjvBC8oTgsfxkNgo";
// configure
require("dotenv").config();
const { Client, Intents } = require("discord.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const PREFIX = "!";

const authenticate = async () => {
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

  console.log("metadata : ", metaData);
};

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
  //   if its human then its ok
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

    console.log("cmd : " + cmd + " clan : " + clan + " clan-Num : " + clanNum);

    if (cmd === "join" && clan == "clan") {
      message.reply("Ok wait");
      authenticate();
    } else {
      message.reply("Thats an invalid command, recheck it !");
    }
  } else {
    message.reply("Thats an invalid command, recheck it !");
  }
});

client.login(process.env.TOKEN);
