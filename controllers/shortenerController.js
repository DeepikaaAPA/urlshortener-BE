const { JWT_SECRET, FORNTEND_LINK } = require("../utils/config");
const Url = require("../models/url");
const Log = require("../models/log");
const shortenerController = {
  shorten: async (req, res) => {
    try {
      const longUrl = req.body.longUrl;
      const userId = req.userId;

      const url_retrieved = await Url.findOne({ longUrl });

      /** url already present  */
      if (url_retrieved)
        return res.status(201).json({
          shortUrl: `${FORNTEND_LINK}/shorts/${url_retrieved.shortnerCode}`,
        });

      /* generate a short code */
      const maxCodeItem = await Url.findOne().sort({ shortnerCode: -1 }).exec();
      const shortnerCode = maxCodeItem
        ? maxCodeItem.shortnerCode + 1
        : 1; /*find max code from th URls */
      const shortUrl = `${FORNTEND_LINK}/shorts/${shortnerCode}`;

      /** insert into db  */
      const newUrl = new Url({ userId, longUrl, shortnerCode });
      await newUrl.save();

      return res.status(200).json({ shortUrl });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  retrieveUrl: async (req, res) => {
    try {
      const shortnerCode = Number(req.params.code);
      const userId = req.userId;
      const answer = await Url.findOne({ shortnerCode });
      if (!answer) return res.status(400).json({ message: "Not found" });

      const date = new Date();
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const clickedDay = date.getDate();
      const clickedMonth = monthNames[date.getMonth()];
      const clickedYear = date.getFullYear();
      const newLog = new Log({
        userId,
        shortnerCode,
        clickedDay,
        clickedMonth,
        clickedYear,

        clickedMonthYear: `${clickedMonth}-${clickedYear}`,
      });
      await newLog.save();
      res.status(200).json({ longUrl: answer.longUrl });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  getURLs: async (req, res) => {
    try {
      const userId = req.userId;
      const result = await Url.find({ userId }).select("-__v -_id");
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  getCLickCount: async (req, res) => {
    try {
      const monthYear = req.params.monthYear;
      const userId = req.userId;
      const results = await Log.aggregate([
        {
          $match: { userId: userId, clickedMonthYear: monthYear },
        },
        {
          $group: {
            _id: "$clickedDay",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);
      return res.status(200).json({ results });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};
module.exports = shortenerController;
