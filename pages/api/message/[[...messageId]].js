const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");

app.use(bodyParser.json());

mongoose.connect("mongodb://mongo:A68ocJ99eOG6ackEhPbj@containers-us-west-164.railway.app:7745/pwa", {useNewUrlParser: true});
var client = mongoose.connection;

if (!client) console.log("Error connecting db");
else console.log("Db connected successfully");

export default async function handler (req, res) {
    const {messageId} = req.query;

    if (req.method === 'GET') {
        const result = await client.db.collection("messages").findOne({id: messageId.toString()});
        if (result === null) {
            res.status(404).send("Message not found.");
        } else {
            res.json(result);
        }
    } else if (req.method === 'POST') {
        let id = crypto.randomUUID();
        let user = req.body.user;
        let chat = req.body.chat;
        let text = req.body.text;

        let ts = Date.now();
        let dt = new Date(ts);

        let datetime = dt.getDate() + ". " + (dt.getMonth() + 1) + ". " + dt.getFullYear() + " " + dt.getHours() + ":" + ("00" + dt.getMinutes()).slice(-2) + ":" + ("0" + dt.getSeconds()).slice(-2);

        let response = {"id": id, "user": user, "chat": chat, "datetime": datetime, "text": text};

        client.db.collection("messages").insertOne(response);

        res.json(response);
    } else if (req.method === 'DELETE') {
        const result = await client.db.collection("messages").findOne({ id: messageId.toString() });
        if (result === null) {
            res.status(404).send("Message not found.");
        }
        client.db.collection("messages").deleteOne({id: messageId.toString()});
        res.json("Deleted message: " + messageId.toString());
    }
}