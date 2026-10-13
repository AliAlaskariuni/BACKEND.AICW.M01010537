var express = require("express"); // Requires the Express module
// Calls the express function to start a new Express application
var app = express();
var cors=require("cors");
app.use(cors());
app.use(function(request, response) { // middleware
console.log("In comes a request to: " + request.url);
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
response.json(lessons);
});
app.listen(3000, function() {
console.log("App started on port 3000");
});