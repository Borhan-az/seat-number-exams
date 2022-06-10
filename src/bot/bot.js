const axios = require("axios");
const telegramBot = require("node-telegram-bot-api");
const persianDate = require("persian-date");
require("dotenv").config();
const bot = new telegramBot(process.env.TOKEN, { polling: true });
const init = () => {
  bot.on("message", (message) => {
    bot.onText(/\/start/, (msg) => {
      bot.sendMessage(msg.chat.id, "شماره دانشجویی: ");
    });
    let text = message.text;
    let chatid = message.chat.id;
    const regx = /^[0-9]{1,9}$/;
    if (!text.match(regx)) {
      bot.sendMessage(
        message.chat.id,
        "شماره دانشجویی نامعتبر! \n دوباره امتحان کنید:"
      );
      return "";
    }
    axios
      .get(`http://localhost:5000/api/stud/find/${text}`)
      .then((res) => {
        res.data.forEach((obj) => {
          let stud = ` \n  ${obj.name + " " + obj.fname}  
          \n نام درس: ${obj.course_name} (${obj.course_code})
          \n تاریخ آزمون: ${obj.date}
          \n شماره صندلی: ${obj.seat_number}   
          \n نوع آزمون: ${obj.exam_type + " - " + obj.course_type} 
          \n محل آزمون: ${obj.department}
          \n کلاس:  '${obj.class}'
          \n ردیف: '${obj.row}'
          \n .
          `;
          bot.sendMessage(chatid, stud, {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "نفرات کناری",
                    callback_data: JSON.stringify({
                      course_code: obj.course_code,
                      seat_number: obj.seat_number,
                    }),
                  },
                ],
              ],
            },
          });
        });
      })
      .catch((err) => console.log(err));
  });
  bot.on("callback_query", (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = JSON.parse(callbackQuery.data);
    axios
    .get(`http://localhost:5000/api/stud/next/${data.course_code}/${data.seat_number}`)
    .then((res) => {
      res.data.forEach((obj) => {
        let stud = ` \n  ${obj.name + " " + obj.fname}  
        \n شماره صندلی: ${obj.seat_number}   
        \n . `;
        bot
        .answerCallbackQuery(callbackQuery.id)
        .then(() => bot.sendMessage(msg.chat.id, stud));     
      });
    })
    .catch((err) => console.log(err));
  });
};
module.exports = init;
