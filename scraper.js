const request = require('request');
const cheerio = require('cheerio');

exports.dataScrape=(url,cb) => {
    request(url,(error, resp, body) => {
        if (error){
            console.log(error);
            cb({
                error: error
            });
        }
        let $=cheerio.load(body);
        let $url = url;
        let list = [];
        let $data = $('#content > div:nth-of-type(3) > ul >li').each(function(index){
            // console.log($(this).text());
            list.push($(this).text());
        });
        // console.log("Data scraped by scraper",JSON.stringify(list));
        cb(list);
    })
}
