var Sold = require('sold');

Sold(__dirname)
  .data({
    title: "Blog"
  })
  .source("src")
  .destination("")
  .build()
