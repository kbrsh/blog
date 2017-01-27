var Sold = require('sold');

Sold(__dirname)
  .data({
    title: "Blog",
  })
  .source("src")
  .postSource("posts")
  .destination("")
  .build()
