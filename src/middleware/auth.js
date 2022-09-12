const jwt = require("jsonwebtoken");
const User = require("../model/userModel");


const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, "HeyNodeJSDeveloper");
        const user = await User.findOne({ _id: decoded._id, "tokens.token": token });
        console.log(user);
        if (!user) throw new Error("Please Authenticate");
        req.user = user;
        req.token = token
    } catch (error) {
        return res.status(401).send({ error: "Please Authenticate" });
    }
    finally {
        next();
    }
}

module.exports = auth;