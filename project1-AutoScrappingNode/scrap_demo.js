let request = require("request");
let fs = require("fs");
let cheerio = require('cheerio');
let removeEmptyLines = require("remove-blank-lines");
console.log("Before");
module.exports.pageUrl = function (curl) {

    request(curl, function (err, res, html) {
        if (err == null && res.statusCode == 200) {
            console.log("*****Received Data******");
            // fs.writeFileSync("test.html", html);
            parseHtml(html);
    }
    else if (res.statusCode == 404) {
        console.log("Invalid URL");
    }
    else {
        console.log(err);
        console.log(res.statusCode);
    }
})

function parseHtml(html) {
    console.log("*****parsing Html*****");
    let d = cheerio.load(html);
    let title = d(".title a")
    let cards = d(".summary ul")  
    fs.createWriteStream("file.txt")

    for(let i=0;i<title.length;i++){
        fs.appendFileSync("file.txt",(i+1));
        let jobName=(d(title[i])).text();
        fs.appendFileSync("file.txt",jobName)
        let role=(d(cards[i])).text();
        fs.appendFileSync("file.txt",role+"\n")
    }
    
}

}