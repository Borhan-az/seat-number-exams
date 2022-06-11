const axios = require("axios");
const telegramBot = require("node-telegram-bot-api");
const persianDate = require("persian-date");
require("dotenv").config();
const bot = new telegramBot(process.env.TOKEN, { polling: true });
const init = () => {
  bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "شماره دانشجویی: ");
  });
  bot.on("message", (message) => {
    let text = message.text;
    let chatid = message.chat.id;
    const regx = /^[0-9]{1,9}$/;
    if (text !== null)
      if (!text.match(regx) && text != "/start" && text) {
        bot.sendMessage(
          message.chat.id,
          "شماره دانشجویی نامعتبر! \n دوباره امتحان کنید:"
        );
        return;
      }

    axios
      .get(
        //process.env.+ `/api/stud/find/${text}` ||
          `https://exampnu.herokuapp.com:${process.env.PORT}/api/stud/find/${text}`
      )
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
        if (res.data.length <= 0) {
          bot.sendMessage(
            chatid,
            "موردی یافت نشد! \n\n این خطا ممکن است به دلیل منتشر نشدن شماره صندلی های امتحانات پیش رو در سایت دانشگاه باشد. \n \n درصورت نیاز به بروز رسانی به ما اطلاع دهید."
          );
          return;
        }
      })
      .catch((err) => console.log(err));
  });
  bot.on("callback_query", (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = JSON.parse(callbackQuery.data);
    axios
      .get(
        process.env.baseURL +
          //`/api/stud/next/${data.course_code}/${data.seat_number}` ||
          `https://exampnu.herokuapp.com:${process.env.PORT}/api/stud/next/${data.course_code}/${data.seat_number}`
      )
      .then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          let stud = ` \n  ${res.data[i].name + " " + res.data[i].fname}  
          \n شماره صندلی: ${res.data[i].seat_number}`;
          bot
            .answerCallbackQuery(callbackQuery.id)
            .then(() => bot.sendMessage(msg.chat.id, stud));
        }
        // res.data.forEach((obj) => {
        //   let stud = ` \n  ${obj.name + " " + obj.fname}
        // \n شماره صندلی: ${obj.seat_number}`;
        //   bot
        //     .answerCallbackQuery(callbackQuery.id)
        //     .then(() => bot.sendMessage(msg.chat.id, stud));
        // });
      })
      .catch((err) => console.log(err));
  });
};

module.exports = init;
