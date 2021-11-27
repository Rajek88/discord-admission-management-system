// below line gave me ESM Error so downgrade fetch to v2
const fetch = require("node-fetch");
// I watched https://www.youtube.com/watch?v=PFJNJQCU_lo

// configure
require("dotenv").config();
const { Client, Intents } = require("discord.js");

// const DMHandler = require("./DM");
const DMHandlerForEmailVerification = require("./DM");
const JoinClan = require("./processing/JoinClan");
let clanNum1;
let lastMailAuthor;
const validateEmail = require("./processing/EmailValidator");

// user Info
let userData = {
  name: "",
  userID: "",
  emailID: "",
  joinedAt: "",
  userClan: "",
};

// 1 = in normal DM, 2 = in Verfication DM
let isInDM = 1;

// use following commands to deal with DM u need to use partial channel and intent.flag.DM
const client = new Client({
  partials: ["CHANNEL"],
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});

const PREFIX = "!";

// setup once ready for bot
client.once("ready", () => {
  console.log("Bot Online..");
});

// setup on when user joins clan
client.on("guildMemberAdd", (member) => {
  userData.name = member.displayName;
  userData.userID = member.user.id;
  userData.joinedAt = member.joinedAt;
  client.channels.cache.get("914046516581253132").send(
    `${member.displayName} just appeared ! \n
    User ID : ${member.user.id} \n
    Joined at : ${member.joinedAt} \n
    `
  );
});
// setup on message create
client.on("messageCreate", (message) => {
  // if the author of message is bot then it may get into loop, so handle it
  if (message.author.bot) {
    return;
  }

  console.log("msg type : ", message.channel.type);
  console.log("msg : ", message);

  if (message.channel.type === "DM" && !message.content.startsWith(PREFIX)) {
    DMHandlerForEmailVerification(message, clanNum1).then((status) => {
      // Added edge case to prevent multiple emails to get verified at same command
      if (status == "verified") {
        userData.userClan = clanNum1;
        userData.emailID = message.content;
        client.channels.cache.get("914046516581253132").send(
          `${message.author} just appeared ! \n
          User Email : ${message.content} \n
          User ID : ${message.author.id} \n
          Clan : ${userData.userClan}
          `
        );
        clanNum1 = undefined;
        if (validateEmail(message.content)) {
          lastMailAuthor = message.author.discriminator;
        }
      }
    });
    // console.log("Is verified in INDEX : ", isVerified);
    return;
  }
  if (message.content.startsWith(PREFIX) && message.channel.type !== "DM") {
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
    // first store the clanNum in global variable clanNum1
    clanNum1 = clanNum;

    if (cmd === "join" && clan == "clan") {
      // message.reply("Ok wait");
      if (
        message.author.discriminator === lastMailAuthor ||
        message.author.id === userData.userID
      ) {
        // to prevent user from executing Join clan cmd agin and again
        message.reply(`You are already admitted to a clan ${clanNum}`);
        return;
      }
      JoinClan(message, clanNum);
    } else {
      message.reply("Thats an invalid command, recheck it !");
    }
  } else {
    message.reply("Thats an invalid command, recheck it !");
  }

  //   if its human then its ok
});

client.login(process.env.TOKEN);
