const express = require("express");
var cors = require("cors");

const app = express();

const moiveChartRoutes = require("./api/routes/movies/charts");
const tvChartRoutes = require("./api/routes/tv series/charts");
const movieRoutes = require("./api/routes/movies/movie");
const tvRoutes = require("./api/routes/tv series/tv");

app.use(cors());
app.use("/movies", moiveChartRoutes);
app.use("/tv", tvChartRoutes);
app.use("/movie", movieRoutes);
app.use("/tv", tvRoutes);

app.use((req, res, next) => {
  const error = new Error("Page not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
