const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const user = require("../resources/stud/stud.model");
var excelToJson = require("convert-excel-to-json");
const _url =
  "http://karaj.alborz.pnu.ac.ir/portal/home/?473699/%D8%B4%D9%85%D8%A7%D8%B1%D9%87-%D8%B5%D9%86%D8%AF%D9%84%DB%8C-%D8%A2%D8%B2%D9%85%D9%88%D9%86-%D9%87%D8%A7%DB%8C-%D9%86%DB%8C%D9%85%D8%B3%D8%A7%D9%84-%D8%AA%D8%A7%D8%A8%D8%B3%D8%AA%D8%A7%D9%86-97-96";
let links = [];

const getLinks = async (url) => {
  try {
    const response = await axios.get(url);
    const _$ = cheerio.load(response.data);
    let temp = _$(".Summary").html();
    const $ = cheerio.load(temp);
    $("td").each(function (i, elem) {
      let link = $(elem).find("a").attr("href");
      if (link !== undefined) {
        links.push({
          _link: "http://karaj.alborz.pnu.ac.ir" + link,
          name: link
            .replace("/portal/file/", "")
            .replace("/", "")
            .replace("?", "")
            .toString(),
        });
      }
    });
    links = links.slice(-5);
  } catch (error) {
    console.log(error);
  }
};

const ExcelTodb = async (file) => {
  console.log("im here");  try {
    await sleep(3000);
    const data = excelToJson({
      sourceFile: "./shared/" + file,
      sheets: [
        {
          name: "Sheet1",
          header: {
            rows: 1,
          },
        },
      ],
      columnToKey: {
        A: "id",
        B: "name",
        C: "fname",
        D: "evidence",
        E: "course_code",
        F: "course_name",
        G: "date",
        H: "time",
        I: "seat_number",
        J: "exam_type",
        K: "course_type",
        L: "department",
        M: "class",
        N: "row",
      },
    });
    data.Sheet1 = data.Sheet1.map((obj) => ({
      ...obj,
      date: `${obj.date} - ${
        new Date(obj.time).getHours() == 12
          ? new Date(obj.time).getHours() +
            1 +
            ":" +
            (new Date(obj.time).getMinutes() + 5)
          : new Date(obj.time).getHours() +':' + new Date(obj.time).getMinutes() 
      }`, 
    }));
    await user.insertMany(data.Sheet1, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        fs.unlink(path.join("shared", file), (err) => {
          if (err) console.log(err);
        });
        console.log("done");
      }
    });
  } catch (error) {
    console.log(error);
  }
};
const downloads = async (links) => {
  user.remove({}, function (err) {
    console.log("collection removed");
  });
  await downloadFiles(links);
};

const downloadFiles = async (links) => {
  for (const link of links) {
    let name = link.name;
    let url = link._link;
    let file = await fs.createWriteStream("shared/" + name);
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });
    await response.data.pipe(file);
    await sleep(6000);
  }

  for (const f of links) {
    await ExcelTodb(f.name);
  }
};
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
const init = async () => {
  await getLinks(_url);
  await downloads(links);
};
module.exports = init;
