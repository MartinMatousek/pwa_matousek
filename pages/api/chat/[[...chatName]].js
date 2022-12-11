const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");

app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/pwa", { useNewUrlParser: true });
var client = mongoose.connection;

if (!client) console.log("Error connecting db");
else console.log("Db connected successfully");

export default async function handler(req, res) {
    const { chatName } = req.query;

    if (req.method === 'GET') {
        const result = await client.db.collection("chats").findOne({ name: chatName.toString() });
        if (result === null) {
            res.status(404).send("Chat not found.");
        } else {
            res.json(result);
        }
    } else if (req.method === 'POST') {
        const result = await client.db.collection("chats").findOne({ name: chatName.toString() });
        if (result === null) {
            let userArray = req.body.users;

            let users = [];
            for (let i = 0; i < userArray.length; i++) {
                users[i] = await client.db.collection("users").findOne({ name: userArray[i] });;
            }

            let name = chatName[0];
            client.db.collection("chats").insertOne({ name, users });
            res.json(name);
        } else {
            res.status(400).send("Chat already exists.");
        }
    } else if (req.method === 'DELETE') {
        const result = await client.db.collection("chats").findOne({ name: chatName.toString() });
        if (result === null) {
            res.status(404).send("Chat not found.");
        }
        client.db.collection("chats").deleteOne({ name: chatName.toString() });
        res.json("Deleted chat: " + chatName.toString());
    }
}
