const route = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../model/userModel");


route.get("/users/me", auth, (req, res) => {
    res.status(200).send(req.user);
});


route.post("/users", async (req, res) => {
    try {
        const user = new User(req.body);
        const token = await user.generateAuthToken();
        console.log(user);
        console.log(token);
        await user.save();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

route.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        if (!user) {
            throw new Error({ error: "Unable to login, please provide a valid Email and Password" });
        }
        const token = await user.generateAuthToken();
        await user.save();
        res.status(200).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});


module.exports = route;