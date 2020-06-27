const express = require("express");
var cors = require("cors");

const app = express();

const chartRoutes = require("./api/routes/charts");

app.use(cors());
app.use("/chart", chartRoutes);

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
