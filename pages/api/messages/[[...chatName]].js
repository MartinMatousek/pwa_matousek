const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");

app.use(bodyParser.json());

mongoose.connect("mongodb://host.docker.internal:27017/pwa", {useNewUrlParser: true});
var client = mongoose.connection;

if (!client) console.log("Error connecting db");
else console.log("Db connected successfully");

export default async function handler(req, res) {
    const {chatName} = req.query;
    if (req.method === 'GET') {
        const cursor = client.db.collection("messages").find({chat: chatName.toString()});
        const results = await cursor.toArray();

        let response = [];
        results.forEach(myFunction);

        function myFunction(item) {
            response.push({"user": item.user, "text": item.text});
        }

        res.json(response);
    }
}