const telegramBot = require("node-telegram-bot-api");
require('dotenv').config();
const bot = new telegramBot(process.env.TOKEN, { polling: true });
const init = () => {

  bot.on("message", (message) => {
    console.log(message);
    let chatid= message.chat.id;
    bot.sendDice(chatid);
  
});
};
module.exports = init;
