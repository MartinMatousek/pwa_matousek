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
    const { userName } = req.query;

    if (req.method === 'GET') {
        const result = await client.db.collection("users").findOne({ name: userName.toString() });
        if (result === null) {
            res.status(404).send("User not found.");
        } else {
            res.json(result);
        }
    } else if (req.method === 'POST') {
        const result = await client.db.collection("users").findOne({ name: userName.toString() });
        if (result === null) {
            let id = crypto.randomUUID();
            var name = userName[0];
            client.db.collection("users").insertOne({ name });
            res.json(name);
        } else {
            res.status(400).send("User with that name already exists.");
        }
    } else if (req.method === 'DELETE') {
        const result = await client.db.collection("users").findOne({ name: userName.toString() });
        if (result === null) {
            res.status(404).send("User not found.");
        }
        await client.db.collection("users").deleteOne({ name: userName.toString() });
        res.json("Deleted user: " + userName.toString());
    }
}