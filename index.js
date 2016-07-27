var Sold = require('sold');
var fs = require('fs');
var mkdirp = require('mkdirp');
var marked = require('meta-marked');

Sold(__dirname)
    .data({
        title: "Blog",
        description: "Kabir Shah's Blog"
    })
    .build();
    
var landingTemplate = fs.readFileSync(__dirname + "/template.html", "utf-8");

var html = [];

fs.readdir(__dirname + "src/posts", function(err, files) {
    files.forEach(function(file) {
        html.push(file.)
    });
    if(err) console.log(err);
});

var newLanding = landingTemplate.replace(/{{posts}}/, html.join(""));

fs.writeFile("index.html", landingTemplate, "utf-8", function() {
    
});