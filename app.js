var express = require('express');
var app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function(req,res){
  // res.send("Hi there, welcome to my assignment.")
  res.render("home");
});

app.get("/fallInLoveWith/:thing", function(req,res){
  var thing = req.params.thing;
  res.render("love", {thing:thing});
});

app.get("/posts", function(req, res){
  var posts =[
    {title:"Day 1", author: "Dave"},
    {title:"Day 7", author: "George"},
    {title:"Everyday", author: "Sam"},
  ]

  res.render("posts",{posts:posts})
});

app.get("*", function(req,res) {
  res.send("Page not found.  What are you doing with your life?")
});

app.listen(process.env.PORT,process.env.IP , function(){
  console.log("Now serving the app.");
} );
