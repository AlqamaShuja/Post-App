require("./db/mongoose");
const express = require("express");
const userRouter = require("./router/userRouter");
const taskRouter = require("./router/postRouter");

const app = express();



// Middleware
app.use(express.json());

// Route Middleware
app.use(userRouter);
app.use(taskRouter);



const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
    console.log("Server is running on port " + port);
});