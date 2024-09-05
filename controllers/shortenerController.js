const { JWT_SECRET, FORNTEND_LINK } = require("../utils/config");
const Url = require("../models/url");
const shortenerController = {
  shorten: async (req, res) => {
    try {
      const longUrl = req.body.longUrl;
      console.log(longUrl);
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
    const shortnerCode = req.params.code;
  
    const answer = await Url.findOne({ shortnerCode });
    if (!answer) return res.status(400).json({ message: "Not found" });
    res.status(301).redirect(answer.longUrl);
  },
};
module.exports = shortenerController;
