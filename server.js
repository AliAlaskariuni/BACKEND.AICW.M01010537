// Loads the configuration from config.env to process.env
require("dotenv").config({ path: "./config.env" });
const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let db;

async function connectToMongoDB() {
    try {
        await client.connect();
        db = client.db("lesson_store");
        console.log("You successfully connected to MongoDB!");
    } catch (err) {
        console.dir(err);
    }
}
connectToMongoDB();

var express = require("express"); // Requires the Express module
// Calls the express function to start a new Express application
var app = express();
var cors = require("cors");

// tracks incoming requests
app.use(function (request, response, next) {
    console.log("Incoming " + request.method + " request for " + request.url);
    next();
});

app.use(cors());
app.use(express.json());

// GET /lessons - returns all lessons from MongoDB for the front end
app.get("/lessons", async function (request, response) {
    try {
        const results = await db.collection("lessons").find({}).toArray();
        response.json(results);
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: err.message });
    }
});

// POST /lessons/reset - puts every lesson back to 5 spaces (called when the site is opened)
app.post("/lessons/reset", async function (request, response) {
    try {
        await db.collection("lessons").updateMany({}, { $set: { availability: 5 } });
        response.json({ message: "Lesson availability reset" });
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: err.message });
    }
});

// POST /orders - saves an order and reduces availability of booked lessons
app.post("/orders", async function (request, response) {
    try {
        const { name, phone, lessonIds } = request.body;

        if (!name || !phone || !Array.isArray(lessonIds) || lessonIds.length === 0) {
            return response.status(400).json({ error: "Name, phone and at least one lesson are required" });
        }

        const lessons = db.collection("lessons");

        // count spaces wanted per lesson (handles the same id appearing more than once)
        const counts = {};
        lessonIds.forEach(function (id) {
            counts[id] = (counts[id] || 0) + 1;
        });

        // reduce availability, only if enough spaces are left
        const done = [];
        for (const id of Object.keys(counts)) {
            const qty = counts[id];
            const result = await lessons.updateOne(
                { id: Number(id), availability: { $gte: qty } },
                { $inc: { availability: -qty } }
            );

            if (result.modifiedCount === 0) {
                // undo any lessons already reduced, then fail
                for (const d of done) {
                    await lessons.updateOne({ id: Number(d.id) }, { $inc: { availability: d.qty } });
                }
                return response.status(409).json({ error: "Lesson " + id + " does not have enough spaces left" });
            }
            done.push({ id: id, qty: qty });
        }

        const order = {
            name: name,
            phone: phone,
            lessonIds: lessonIds,
            createdAt: new Date().toISOString()
        };
        const saved = await db.collection("orders").insertOne(order);
        console.log("Order saved:", saved.insertedId, order);

        response.status(201).json(order);
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: err.message });
    }
});

// GET /orders - returns all saved orders
app.get("/orders", async function (request, response) {
    try {
        const results = await db.collection("orders").find({}).toArray();
        response.json(results);
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: err.message });
    }
});

// to start the server on port 3k
app.listen(3000, function () {
    console.log("App started on port 3000");
    console.log("working fine");
});