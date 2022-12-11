const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");

app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/pwa", {useNewUrlParser: true});
var client = mongoose.connection;

if (!client) console.log("Error connecting db");
else console.log("Db connected successfully");

export default async function handler (req, res) {
    if (req.method === 'DELETE') {
        client.db.collection("messages").deleteMany();
        client.db.collection("chats").deleteMany();
        client.db.collection("users").deleteMany();
        res.json("Deleted all.");
    }
}