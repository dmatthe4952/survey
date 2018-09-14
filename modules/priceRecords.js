function getPriceRecs(){
    return new Promise(function(resolve,reject){
    let priceRecs = [];
    var query = Summary.find({},'truck price');
    query = query.limit(5);
    query = query.sort({"price":1});
    query.exec(function(err,doc){
        doc.forEach(function(rec){
            priceRecs.push(rec);
        })
        resolve(priceRecs);
    })
})};

module.exports = getPriceRecs;
