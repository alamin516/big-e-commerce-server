const express = require("express");
const cors = require('cors')
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");


const userRouter = require("./routers/userRouter");
const { seedRouter } = require("./routers/seedRouter");
const { errorResponse } = require("./controllers/responseController");
const authRouter = require("./routers/authRouter");
const categoryRouter = require("./routers/categoryRouter");
const productRouter = require("./routers/productRouter");

const app = express();

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, //1 minute
  max: 60,
  message: "Too many request from this IP. Please try again later",
});

app.use(cors())
app.use(cookieParser());
app.use(rateLimiter);
app.use(xssClean());
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
// User
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/seed", seedRouter);

// Product
app.use("/api/v1/categories", categoryRouter)
app.use("/api/v1/products", productRouter)

app.get("/api/v1/testing", (req, res) => {
  res.status(200).sendFile(__dirname + '/index.html');
});

// Client Error handle
app.use((req, res, next) => {
  // Use createError for more structured error handling
  next(createError(404, "Route not found"));
});

// Server Error handle
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message,
  });
});

module.exports = app;
