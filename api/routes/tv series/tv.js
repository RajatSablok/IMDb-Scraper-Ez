const express = require("express");
const request = require("request");
const rp = require("request-promise");
const cheerio = require("cheerio");

const router = express.Router();

router.get("/title/:tvId", async (req, res, next) => {
  var options = {
    uri: "https://www.imdb.com/title/" + req.params.tvId,
    transform: function (html) {
      return cheerio.load(html);
    },
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    },
  };

  rp(options)
    .then(($) => {
      const imdbData = [];
      //   let $ = cheerio.load(response);
      let title = $('div[class="title_wrapper"] > h1').text().trim();
      let rating = $('div[class="ratingValue"] > strong > span').text();
      let runTime = $('div[class="subtext"] > time').text().trim();
      let genre = $('div[class="subtext"] > a')
        .text()
        .replace(/\d+/g, "")
        .trim()
        .split(" ")[0];
      let releaseDate = $('a[title="See more release dates"]').text().trim();
      let summary = $('div[class="summary_text"]').text().trim();
      let summaryArr = $('div[class="credit_summary_item"]')
        .text()
        .trim()
        .split("\n");
      let storyline = $('div[class="article"] > div > p > span').text().trim();

      let creators = summaryArr[1].trim();

      imdbData.push({
        title,
        rating,
        runTime,
        genre,
        releaseDate,
        summary,
        creators,
        storyline,
      });

      res.status(200).json(imdbData);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong",
        error: err,
      });
    });
});

module.exports = router;
