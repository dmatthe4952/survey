var mongoose = require('mongoose');

data = [
    {
        username: 'test2@example.com',
        password: 'password123'
    }
    {
        username: 'becky_duckett',
        password: 'password123'
    }
    {
        username: 'carol',
        password: 'password123'
    }
    {
        username: 'candy',
        password: 'password123'
    }
    {
        username: 'dave',
        password: 'password123'
    }
    {
        username: 'other',
        password: 'password123'
    }
]
function userSeedDB() {
    User.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }

        if (!err){
            console.log("Users initialized....")
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
