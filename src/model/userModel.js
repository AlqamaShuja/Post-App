const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error({ error: "Please provide valid Email" });
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        default: 0,
        validate: function (val) {
            if (val < 0) throw new Error("Age must be positive");
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.virtual("posts", {
    ref: "Post",
    localField: "_id",
    foreignField: "owner"
});

userSchema.methods.generateAuthToken = function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, "HeyNodeJSDeveloper");
    user.tokens = user.tokens.concat({ token });
    return token;
}

userSchema.statics.findByCredentials = async (email, pass) => {
    try {
        const user = await User.findOne({ email });
        if (!user) throw new Error("Credentials does not match");
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) throw new Error("Credentials does not match");
        return user;
    } catch (error) {
        return res.status(404).send(error);
    }
}


userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});





const User = mongoose.model("User", userSchema);

module.exports = User;