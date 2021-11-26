// DM Handler

const { MessageCollector } = require("discord.js-collector");
const isUserExists = require("./processing/EmailValidator");
const validateEmail = require("./processing/EmailValidator");

const DMHandlerForEmailVerification = async (message) => {
  if (message.author.bot) {
    return;
  }
  console.log("message received DM : ", message.content);
  console.log("message channel is DM ? : ", message.channel.type);

  if (validateEmail(message.content)) {
    console.log("message.mentions.users.first() : ", message.mentions);
    // now check in every sheet and every sheet's email field that the given mail exists
    const isEmailExists = await isUserExists(message.content); //this acquires claan name if user dont exists
    console.log("isMail exists ? -> ", isEmailExists);
    if (isEmailExists !== "false") {
      message.channel.send(`User is already admitted to ${isEmailExists}`);
    } else {
      message.channel.send("Verified Successfully !");
    }

    return;
  }

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

  //   let member = message.member;
  //   console.log("member : ", member);
  //   const filter = (m) => m.author.id === message.author.id;

  //   let botMessage = await message.author.send("Please provide your email id");
  //   const userMessage = await MessageCollector.asyncQuestion({
  //     botMessage,
  //     user: message.author.id,
  //     collectorOptions: {
  //       time: 3000,
  //     },
  //   })
  //     .then((message) => console.log("message by user in DM : ", message))
  //     .catch(() => {
  //       message.author.send("Time out");
  //       console.log("Time out1");
  //       timeout = 1;
  //     });

  //   if (timeout == 1) {
  //     message.author.send(
  //       "Request Timed out because you did not responded in time"
  //     );
  //     console.log("Request timed out because you did not responded in time ");
  //     timeout = 0;
  //     return 1;
  //   } else {
  //     timeout = 0;
  //     console.log("user msg : ", userMessage);
  //     UserValidator(userMessage);
  //   }

  let filter = (m) => m.author.id === message.author.id;
  message.author
    .send(`Hey ${message.author}, Enter your email to verify`)
    .then(() => {
      message.channel
        .awaitMessages(filter, {
          max: 1,
          time: 300,
          errors: ["time"],
        })
        .then((message) => {
          message = message.first();
          console.log("user Reply : ", message);
        })
        .catch((collected) => {
          message.channel.send("Timeout");
        });
    });
};

module.exports = DMHandlerForEmailVerification;

// const DMHandler = (message) => {
//   console.log("message received : ", message.content);
//   if (validateEmail(message.content)) {
//     DMHandlerForEmailVerification(message);
//   } else {
//     message.channel.send("Oops ! You DM'd me for no reason");
//   }
// };

// module.exports = DMHandler;
