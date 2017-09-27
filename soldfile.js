const Sold = require('sold');
const Handlebars = require('handlebars');

Handlebars.registerHelper('reverse', function (arr) {
  arr.reverse();
});

Sold(__dirname)
  .data({
    title: "Blog"
  })
  .source("src")
  .destination("")
  .build()
