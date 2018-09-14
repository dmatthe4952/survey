function getQualRecs(){
    return new Promise(function(resolve,reject){
    let qualRecs = [];
    var query = Summary.find({},'truck quality');
    query = query.limit(5);
    query = query.sort({"quality":1});
    query.exec(function(err,doc){
        doc.forEach(function(rec){
            qualRecs.push(rec);
        })
        resolve(qualRecs);
    })
})};

module.exports = getQualRecs;
