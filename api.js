require("dotenv").config();
const { MongoClient } = require("mongodb");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const conStr = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// MongoDB connect helper
async function getDatabase() {
    const client = await MongoClient.connect(conStr);
    return client.db("videolibrary");
}

// ROUTES
app.get("/admin", async(req, res) => {
    const db = await getDatabase();
    const docs = await db.collection("admin").find({}).toArray();
    res.send(docs);
});

app.get("/videos", async(req, res) => {
    const db = await getDatabase();
    const docs = await db.collection("videos").find({}).toArray();
    res.send(docs);
});

app.get("/categories", async(req, res) => {
    const db = await getDatabase();
    const docs = await db.collection("categories").find({}).toArray();
    res.send(docs);
});

app.get("/users", async(req, res) => {
    const db = await getDatabase();
    const docs = await db.collection("users").find({}).toArray();
    res.send(docs);
});

app.get("/users/:id", async(req, res) => {
    const db = await getDatabase();
    const doc = await db.collection("users").findOne({ UserId: req.params.id });
    if (!doc) return res.status(404).send({ error: "User not found" });
    res.send(doc);
});

app.get("/video/:id", async(req, res) => {
    const db = await getDatabase();
    const docs = await db
        .collection("videos")
        .find({ VideoId: parseInt(req.params.id) })
        .toArray();
    res.send(docs);
});

app.get("/videos/:categoryid", async(req, res) => {
    const db = await getDatabase();
    const docs = await db
        .collection("videos")
        .find({ CategoryId: parseInt(req.params.categoryid) })
        .toArray();
    res.send(docs);
});

app.post("/register-user", async(req, res) => {
    const user = req.body;
    const db = await getDatabase();
    await db.collection("users").insertOne(user);
    res.send({ message: "User registered successfully" });
});

app.post("/add-video", async(req, res) => {
    const video = req.body;
    const db = await getDatabase();
    await db.collection("videos").insertOne(video);
    res.send({ message: "Video added successfully" });
});

app.put("/edit-video/:id", async(req, res) => {
    const video = req.body;
    const db = await getDatabase();
    await db
        .collection("videos")
        .updateOne({ VideoId: parseInt(req.params.id) }, { $set: video });
    res.send({ message: "Video updated successfully" });
});

app.delete("/delete-video/:id", async(req, res) => {
    const db = await getDatabase();
    await db
        .collection("videos")
        .deleteOne({ VideoId: parseInt(req.params.id) });
    res.send({ message: "Video deleted successfully" });
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));