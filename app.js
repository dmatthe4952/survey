if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}
// console.log("process.env: ",process.env);

var express = require('express');
var passport = require('passport');
const scraper = require('./scraper');
const urlTracks = 'http://www.railroadpark.org/events-trucks-by-the-tracks.html';
var mongoose = require('mongoose')
flash       = require("connect-flash"),
LocalStrategy = require("passport-local"),
User = require('./models/user'),
Evaluation = require('./models/evaluation'),
Total = require('./models/total'),
userSeedDB = require('./user_seeds'),
bodyParser  = require("body-parser");
var app = express();



app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
var url = process.env.MONGODB_URI || "mongodb://localhost/survey_v1";
mongoose.connect(url);

userSeedDB();

app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});
let trucksObject = {};
let list = [];
(function (){
    console.log("Starting Scraper...")
    scraper.dataScrape(urlTracks, (data) => {
        data.forEach(function(truck){
            list.push('"'+truck+'"');
        })
        var listString = "\{\"trucks\":\["+list+"\]}";
        console.log("Transferring data to global...");
        trucksObject = JSON.parse(listString);
        console.log("Transfer ended...");
        console.dir(trucksObject);
    })
}());

app.get("/", function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});
//handling login logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/trucks",
        failureRedirect: "/"
    }), function(req, res){
});

app.get("/trucks", function(req, res){
    res.render("trucks",{trucks:JSON.stringify(trucksObject), user:req.user.username});
});

app.get("/evaluate/:truck", function(req,res){
    var truck = req.params.truck;
    res.render("evaluate",{user:req.session.passport.user, truck:truck});
});

app.post("/evaluate", function(req,res){
    var eval = new Evaluation(req.body);
    eval.save();
    res.render("trucks",{trucks:JSON.stringify(trucksObject), user:req.session.passport.user})
})

app.get("*", function(req,res) {
  res.send("Page not found.  What are you doing with your life?")
});
console.log("process.env.PORT: ",process.env.PORT);
var port = process.env.PORT;

app.listen(port, process.env.IP, function(){
  console.log("Now serving the app on port %s.",process.env.PORT);
});
