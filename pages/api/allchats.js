const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

var port = process.env.PORT || 3333;
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());

mongoose.connect("mongodb://mongo:A68ocJ99eOG6ackEhPbj@containers-us-west-164.railway.app:7745/pwa", { useNewUrlParser: true });
var client = mongoose.connection;

if (!client) console.log("Error connecting db");
else console.log("Db connected successfully");

export default async function handler (req, res) {
    if (req.method === 'GET') {
        const cursor = client.db.collection("chats").find({});
        const results = await cursor.toArray();

        res.json(results);
    }
}