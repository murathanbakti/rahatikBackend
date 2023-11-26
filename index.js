const express = require("express");
const app = express();
const PORT = process.env.PORT
const mongoose = require("mongoose");
require("dotenv/config");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
dotenv.config();


const DB_CONNECTION = process.env.DB_CONNECTION;

app.use(bodyParser.json());

//Import Routes
const postsRoute = require("./routes/posts");

app.use("/posts", postsRoute);

//Routes
app.get("/", (req, res) => {
    res.send("We are one Home");
});

mongoose.connect(DB_CONNECTION);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB Bağlantı Hatası"));
db.once("open", function () {
    console.log("MongoDB Bağlantısı Kuruldu");
});

app.use(express.json());
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
  });
