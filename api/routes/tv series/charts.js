const express = require("express");
const request = require("request");
const rp = require("request-promise");
const cheerio = require("cheerio");

const router = express.Router();

var titleArr = [];
var yearArr = [];
var ratingArr = [];
var posterArr = [];
var tvURLArr = [];
var resultObj = [];
var popularMoviesObj = [];

//Get a list of top rated tv series
router.get("/top", async (req, res, next) => {
  var options = {
    uri: "https://www.imdb.com/chart/toptv/?ref_=nv_tvv_250",
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
      $(".titleColumn").each((i, el) => {
        var title = $(el).find("a").text().trim();
        titleArr[i] = title;

        var year = $(el).find("span").text().replace(/[()]/g, "").trim();
        yearArr[i] = year;

        var tvSeriesURL = $(el).find("a").attr("href");
        tvURLArr[i] = "https://www.imdb.com/" + tvSeriesURL;
      });

      $(".posterColumn ")
        .find("a")
        .each((i, el) => {
          var poster = $(el).find("a img").attr("src");
          posterArr[i] = poster;
        });

      $(".imdbRating ").each((i, el) => {
        var rating = $(el).text().trim();
        ratingArr[i] = rating;
      });

      for (var i = 0; i < titleArr.length; i++) {
        resultObj.push({
          rank: i + 1,
          title: titleArr[i],
          yearOfRelease: yearArr[i],
          rating: ratingArr[i],
          posterURL: posterArr[i],
          tvSeriesURL: tvURLArr[i],
        });
      }

      res.status(200).json({
        message: "List successfully retrieved",
        result: resultObj,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong",
        error: err,
      });
    });
});

module.exports = router;
