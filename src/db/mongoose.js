const mongoose = require("mongoose");
const dbURL = "mongodb://127.0.0.1:27017/post-app-api";

mongoose.connect(dbURL, () => {
    console.log("DB successfully connected.!");
});