if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}
// console.log("process.env: ",process.env);
var path = require('path');
var express = require('express');
var passport = require('passport');
const scraper = require('./scraper');
const urlTracks = 'http://www.railroadpark.org/events-trucks-by-the-tracks.html';
var mongoose = require('mongoose');
var assert = require('assert');
var app = express();
var qualityRecs = require('./modules/qualityRecords');
var choiceRecs = require('./modules/choicesRecords');
var priceRecs = require('./modules/priceRecords');
var authenticityRecs = require('./modules/authenticityRecords');
var flash       = require("connect-flash");
LocalStrategy = require("passport-local"),
User = require('./models/user'),
Evaluation = require('./models/evaluation'),
Total = require('./models/total'),
Summary = require('./models/summary'),
userSeedDB = require('./user_seeds'),
bodyParser  = require("body-parser");


app.use(express.static(path.join(__dirname , "/public")));
app.set("view engine", "ejs");
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
var url = process.env.MONGODB_URI || "mongodb://localhost/survey_v1";
mongoose.connect(url,{useNewUrlParser:true});

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
        // console.dir(trucksObject);
    })
}());

app.get("/", function(req,res){
  res.render("home");
});

app.get("/summary", function(req,res){
    summary=[];
    out={}
    Total.find({}, function(err,result){
        if(result.length>0){
            result.forEach(function(total){
                out["quality"] = total.quality/total.updates;
                out["choices"] = total.choices/total.updates;
                out["price"] = total.price/total.updates;
                out["authenticity"] = total.authenticity/total.updates;
                // console.log(out);
                Summary.collection.updateOne({"truck": total.truck},
                 {$set:{"quality":out.quality,
                  "choices":out.choices,
                  "price":out.price,
                  "authenticity":out.authenticity}}, {"upsert":true})
            });
        }
    });
    let qualRecs=[{"truck":"init1","quality":0}];
    var promise1 = qualityRecs();
    var promise2 = choiceRecs();
    var promise3 = priceRecs();
    var promise4 = authenticityRecs();
    Promise.all([promise1,promise2,promise3,promise4])
    .then((data) => {
        let out = {};
        out["qualRecs"] = data[0];
        out["choiceRecs"] = data[1];
        out["priceRecs"] = data[2];
        out["authenticityRecs"] = data[3];
        return out
    }).then((data)=>{
        res.render("summary",{qualRecs:data.qualRecs,
            choiceRecs:data.choiceRecs,
            priceRecs:data.priceRecs,
            authenticityRecs:data.authenticityRecs})
    })

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
    Total.find({truck:eval.truck},function(err,result){
        // console.log("Found: ",result);
        if (result.length==0){
            Total.collection.insertOne({"truck":eval.truck,
             "quality":eval.quality,
             "choices":eval.choices,
             "price":eval.price,
             "authenticity":eval.authenticity,
             "updates": 1},function(err,result){
                if(err){
                    consol.log(err);
                }
            })
        }else{
            Total.collection.updateOne({"truck":eval.truck},
             {$inc: {"quality":eval.quality,
             "choices":eval.choices,
             "price":eval.price,
             "authenticity":eval.authenticity,
             "updates": 1}}, function(err, result){
                 assert.equal(null,err);
             })
        }
    });
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
