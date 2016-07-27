var Sold = require('sold');
var fs = require('fs');
var marked = require('meta-marked');
var ncp = require('ncp');

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
        html.push("<div class='post'><div class='container small-container'><h3 class='post-title'>" + markedFile.meta.title + "</h3><p class='post-description'>" + markedFile.meta.description + "</p><a class='read-btn' target='_blank' href='/posts/" + file.replace(".md", "") + "'>Read</a></div></div>");
    });
    
    var newLanding = landingTemplate.replace("{{posts}}", html);

    fs.writeFile("index.html", newLanding, "utf-8", function() {
    
    });
    if(err) console.log(err);
});

console.log("Copying files from /build to /posts =>")
setTimeout(function() {
    ncp(__dirname + "/build", __dirname, function(err) {
    if(err) {
        console.log(err); 
    }
    console.log("copied files!");
});
}, 1000);