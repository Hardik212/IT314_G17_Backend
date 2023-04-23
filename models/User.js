const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    role: {
        type: String,
        default: "user"
    },
    name: {
        type: String,
        default: "Anonymous"
    },
    bio: {
        type: String,
        default: "Just started surveying."
    },
    profilepic: {
        type: String,
        default: "https://www.w3schools.com/w3images/avatar2.png"
    },
    phone: {
        type: String,
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    pollscreated: [             // polls created by the user
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Poll",
        },
    ]

});

// make the model
const User = mongoose.model("User", userSchema);

// export the model
module.exports = User;
