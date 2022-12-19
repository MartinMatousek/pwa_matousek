const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(bodyParser.json());

mongoose.connect("mongodb://host.docker.internal:27017/pwa", { useNewUrlParser: true });
var client = mongoose.connection;

if (!client) console.log("Error connecting db");
else console.log("Db connected successfully");

export default async function handler (req, res) {
  if (req.method === 'GET') {
    const cursor = client.db.collection("users").find({});
    const results = await cursor.toArray();

    res.json(results);
  }
}