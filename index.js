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
var path = __dirname + "/src/posts";
fs.readdir(path, function(err, files) {
    files.forEach(function(file) {
        var markedFile = marked(fs.readFileSync(__dirname + "/src/posts/" + file, "utf-8"));
        html.push("<div class='post'><h3>" + markedFile.meta.title + "</h3><p>" + markedFile.meta.description + "</p><a class='' href='/posts/" + file.replace(".md", "") + "'>Read</a></div>");
    });
    
    var newLanding = landingTemplate.replace("{{posts}}", html);

    fs.writeFile("index.html", newLanding, "utf-8", function() {
    
    });
    if(err) console.log(err);
});
