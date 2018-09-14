function getAuthenticityRecs(){
    return new Promise(function(resolve,reject){
    let authenticityRecs = [];
    var query = Summary.find({},'truck authenticity');
    query = query.limit(5);
    query = query.sort({"authenticity":1});
    query.exec(function(err,doc){
        doc.forEach(function(rec){
            authenticityRecs.push(rec);
        })
        resolve(authenticityRecs);
    })
})};

module.exports = getAuthenticityRecs;
