const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000; // Default port 3000 kullanılır
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const { getToken } = require("./apiIntegration");

require("dotenv/config");
const dotenv = require("dotenv");
dotenv.config();

const DB_CONNECTION = process.env.DB_CONNECTION;

app.use(bodyParser.json());
app.use(
    session({
        secret: "secret-key",
        resave: false,
        saveUninitialized: true,
    })
);

// Import Routes
const postsRoute = require("./routes/posts");
const authRoute = require("./controller/authController");

app.use("/posts", postsRoute);
app.post("/register", authRoute.register);
app.post("/login", authRoute.login);
app.post("/logout", authRoute.logout);

// Routes
app.get("/", (req, res) => {
    res.send("We are one Home");
});

// Login route
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const result = await getToken(username, password);

    if (result.response && result.response.token) {
        req.session.token = result.response.token;
        res.redirect("/posts");
    } else {
        res.send(`Error: ${result.messages[0].message}`);
    }
});

mongoose.connect(DB_CONNECTION);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB Bağlantı Hatası"));
db.once("open", function () {
    console.log("MongoDB Bağlantısı Kuruldu");
});

app.use(express.json());
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
