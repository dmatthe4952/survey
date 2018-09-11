var mongoose = require('mongoose');

data = [
    {
        username: 'test2@example.com',
        password: 'password123'
    }
]
function userSeedDB() {
    User.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }

        if (!err){
            console.log("Users removed.")
            data.forEach(function(seed){
                // console.log(seed);
                var newUser = new User({username: seed.username});
                User.register(newUser, seed.password, function(err, user){
                if(err){
                    console.log(err);
                }else{
                user.save();
                }
                });
            })
        }            
    })
}
module.exports = userSeedDB;
