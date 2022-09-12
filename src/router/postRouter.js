const route = require("express").Router();
const auth = require("../middleware/auth");
const Post = require("../model/postModel");

route.get("/posts", auth, async (req, res) => {
    try {
        console.log(req.user);
        await req.user.populate("posts");
        res.send(req.user.posts);
    } catch (error) {
        res.status(500).send();
    }
});


route.post("/posts", auth, async (req, res) => {
    try {
        const post = new Post({
            ...req.body,
            owner: req.user._id
        });
        await post.save();
        res.status(201).send(post);
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = route;