const Sold = require('sold');
const Handlebars = require('handlebars');

Handlebars.registerHelper("reverse", function(arr) {
  arr.reverse();
});

Sold({
  root: __dirname,
  template: "template",
  source: "src",
  destination: ""
});
