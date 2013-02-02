var page = require('webpage').create();
page.open('https://mega.co.nz/#!PBdDHDSD!YEV6GFtAKDIyD6nVzqfPHXOiYDAW2xWuRXM0bsBrlp4', function() {
    page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js", function() {
        page.evaluate(function() {
            console.log("lol: ",$("body").text());
            phantom.exit();
        });
    });
});