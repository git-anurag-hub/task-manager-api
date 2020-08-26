const express = require("express");
require("./db/mangoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const app = express();
const path = require("path");
const pathName = path.join(__dirname, "../public");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.use(express.static(pathName));
app.use(cookieParser());

module.exports = app;
