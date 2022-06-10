const { Router } = require("express");
require("dotenv").config();
const user = require("./stud.model");
const crawler = require("../../crawler/crawler");
const router = Router();

router.get("/updateData/:key", async (req, res) => {
  let key = req.params.key;
  if (key == process.env.KEY) crawler();
  throw "oops wrong place!";
});

router.get("/api/stud/find/:id", async (req, res) => {
  let id = req.params.id;
  const info = await user.find(
    { id: id },
    {
      _id: 0,
      id: 0,
    }
  );

  if (info) await res.send(info);
  else res.status(404).send("موردی یافت نشد");
});
router.get("/api/stud/next/:code/:seat", async (req, res) => {
  let c_code = req.params.code;
  let s_number = req.params.seat;
  let infos = await user
    .find({ course_code: c_code, seat_number: { $gte: (s_number - 3) } })
    .limit(5)
    .sort({ seat_number: 1 });
  res.send(infos);
});
module.exports = router;
