// DM Handler

const DMHandlerForEmailVerification = async (message) => {
  console.log("message received : ", message.content);

  let filter = (m) => m.author.id === message.author.id;
  const botMessage = "Enter your registered email Id please?";
  const userMessage = await MessageCollector.asyncQuestion({
    botMessage,
    user: message.author.id,
    collectorOptions: { time: 3000 },
  }).catch(() => {
    // catch code here...
    message.channel.send("Request Timed out");
  });
  console.log("Users DM : ", userMessage);
  //   message.author
  //     .send("Please enter your email id for verification")
  //     .then(() => {
  //       message.channel
  //         .awaitMessages(filter, {
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
  return 1;
};

module.exports = DMHandlerForEmailVerification;

const DMHandler = (message) => {
  console.log("message received : ", message.content);

  message.channel.send("Oops ! You DM'd me for no reason");
};

module.exports = DMHandler;
