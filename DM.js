// DM Handler

const { MessageCollector } = require("discord.js-collector");
const validateEmail = require("./processing/EmailValidator");

const DMHandlerForEmailVerification = async (message) => {
  console.log("message received DM : ", message.content);

  //   let filter = (m) => m.author.id === message.author.id;
  //   console.log("filter : ", filter);

  //   const botMessage = "Enter your registered email Id please?";
  //   const userMessage = await MessageCollector.asyncQuestion({
  //     botMessage,
  //     user: message.author.id,
  //     collectorOptions: { time: 3000 },
  //   }).catch(() => {
  //     // catch code here...
  //     message.channel.send("Request Timed out");
  //   });
  //   console.log("Users DM : ", userMessage);
  //   message.author
  //     .send("Please enter your email id for verification")
  //     .then(() => {
  //       message.channel
  //         .awaitMessages(filter(message), {
  //           max: 1,
  //           time: 300,
  //           errors: ["time"],
  //         })
  //         .then((message) => {
  //           message = message.first();
  //           console.log("DM 1 : ", message);
  //         })
  //         .catch((collected) => {
  //           message.channel.send("Request Timed out");
  //         });
  //     });

  let member = message.member;
  console.log("member : ", member);
  const filter = (m) => m.author.id === message.author.id;

  let botMessage = await message.author.send("Please provide your email id");
  const userMessage = await MessageCollector.asyncQuestion({
    botMessage,
    user: message.author.id,
    collectorOptions: {
      time: 3000,
    },
  }).catch(() => {
    message.author.send("Time out");
    console.log("Time out1");
    timeout = 1;
  });

  if (timeout == 1) {
    message.author.send(
      "Request Timed out because you did not responded in time"
    );
    console.log("Request timed out because you did not responded in time ");
    timeout = 0;
    return 1;
  } else {
    timeout = 0;
    console.log("user msg : ", userMessage);
    UserValidator(userMessage);
  }
};

module.exports = DMHandlerForEmailVerification;

const DMHandler = (message) => {
  console.log("message received : ", message.content);
  if (validateEmail(message.content)) {
    DMHandlerForEmailVerification(message);
  } else {
    message.channel.send("Oops ! You DM'd me for no reason");
  }
};

module.exports = DMHandler;
