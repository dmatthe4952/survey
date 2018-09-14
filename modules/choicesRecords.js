function getChoiceRecs(){
    return new Promise(function(resolve,reject){
    let choiceRecs = [];
    var query = Summary.find({},'truck choices');
    query = query.limit(5);
    query = query.sort({"choices":1});
    query.exec(function(err,doc){
        doc.forEach(function(rec){
            choiceRecs.push(rec);
        })
        resolve(choiceRecs);
    })
})};

module.exports = getChoiceRecs;
