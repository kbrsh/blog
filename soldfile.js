const Sold = require("sold");
const Handlebars = require("handlebars");
const Himalaya = require("himalaya");
const toHTML = require("himalaya/translate").toHTML;
const minifyHTML = require("html-minifier").minify;
const MathJax = require("mathjax-node");

MathJax.start();

Handlebars.registerHelper("reverse", function(arr) {
  arr.reverse();
});

const mathLink = Himalaya.parse(`<link rel="stylesheet" type="text/css" href="../css/post-math.css">`)[0];

const loop = (arr, body, done) => {
  const length = arr.length;
  let i = 0;

  const next = () => {
    if(i === length) {
      done();
    } else {
      body(i++, next);
    }
  }

  next();
}

const compileTemplate = (template, data) => {
  return minifyHTML(Handlebars.compile(template)(data), {
    caseSensitive: true,
    keepClosingSlash: true,
    removeAttributeQuotes: false,
    collapseWhitespace: true
  });
}

Sold({
  root: __dirname,
  template: "template",
  source: "src",
  destination: "",
  engine: (template, data, options, done) => {
    if(data.math === true) {
      const compiledHTML = Himalaya.parse(data.content);
      loop(compiledHTML, (i, next) => {
        const element = compiledHTML[i];
        if(element.type === "Element" && element.tagName === "pre") {
          const code = element.children[0];
          if(code.attributes.className[0] === "lang-math") {
            MathJax.typeset({
              math: code.children[0].content,
              type: "TeX",
              html: true,
              css: true
            }, (data) => {
              const compiledMath = Himalaya.parse(data.html)[0];
              compiledMath.attributes.className.push("post-math");
              compiledHTML[i] = compiledMath;
              next();
            });
          } else {
            next();
          }
        } else {
          next();
        }
      }, () => {
        data.content = toHTML(compiledHTML);
        const compiledTemplate = Himalaya.parse(compileTemplate(template, data));
        compiledTemplate[1].children[0].children.splice(10, 0, mathLink);
        done(toHTML(compiledTemplate));
      });
    } else {
      done(compileTemplate(template, data));
    }
  }
});
