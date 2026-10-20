var express = require("express"); // Requires the Express module
// Calls the express function to start a new Express application
var app = express();
var cors=require("cors");

// tracks incoming requests
app.use(function(request, response, next) {
    console.log("Incoming " + request.method + " request for " + request.url);
    next();
});

app.use(cors());
app.use(express.json());

var orders = [];

//app.use(function(request, response) { // middleware
//console.log("In comes a request to: " + request.url);
app.get("/lessons", function(request, response) {

// lessons for front end to pull form
lessons =  [{ 
    
id: 1, subject: "Mathematics", location: "Room A1", price: 25, availability: 5 },
{ id: 2, subject: "Computer Science", location: "Lab B2", price: 30, availability: 5 },
{ id: 3, subject: "English Literature", location: "Room C3", price: 20, availability: 5 },
{ id: 4, subject: "Physics", location: "Science Lab", price: 28, availability: 5 },
{ id: 5, subject: "Music", location: "Music Room", price: 22, availability: 5 },
{ id: 6, subject: "Art and Design", location: "Art Studio", price: 24, availability: 5 },
{ id: 7, subject: "Business Studies", location: "Room D4", price: 26, availability: 5 },
{ id: 8, subject: "Biology", location: "Science Lab", price: 27, availability: 5 },
{ id: 9, subject: "History", location: "Room E5", price: 18, availability: 5 },
{ id: 10, subject: "Drama", location: "Theatre Room", price: 23, availability: 5 }]




// responses with json encoding lessons
response.json(lessons);
});

app.post("/orders", function(request, response) {
    var order = {
        id: orders.length + 1,
        name: request.body.name,
        phone: request.body.phone,
        lessonIds: request.body.lessonIds,
        createdAt: new Date().toISOString()
    };

    orders.push(order);
    console.log("Order received:");
    console.log("Name:", order.name);
    console.log("Phone:", order.phone);
    console.log("Lesson IDs:", order.lessonIds);
    response.status(201).json(order);
});

app.get("/orders", function(request, response) {
    response.json(orders);
});

// to start the server on port 3k
app.listen(3000, function() {
console.log("App started on port 3000");
});