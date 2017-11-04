const Sold = require("sold");
const Handlebars = require("handlebars");
const Himalaya = require("himalaya");
const toHTML = require("himalaya/translate").toHTML;
const minifyHTML = require("html-minifier").minify;
const MathJax = require("mathjax-node");

MathJax.start();

Handlebars.registerHelper("list", function(arr) {
  arr.reverse();
  let i = arr.length;
  while((i--) !== 0) {
    if(arr[i].draft === true) {
      arr.splice(i, 1);
    }
  }
});

const mathLink = Himalaya.parse(`<link rel="stylesheet" type="text/css" href="../css/post-math.css">`)[0];

const loop = (arr, body, done) => {
  const next = () => {
    if(arr.length === 0) {
      done();
    } else {
      body(arr.shift(), next);
    }
  }

  next();
}

const compileTemplate = (template, data) => {
  return minifyHTML(Handlebars.compile(template)(data), {
    caseSensitive: true,
    keepClosingSlash: true,
    removeAttributeQuotes: false,
    collapseWhitespace: true,
    minifyJS: true
  });
}

const typeSet = (math, display, parentChildren, index, next) => {
  MathJax.typeset({
    math: math,
    type: "TeX",
    html: true,
    css: true
  }, (data) => {
    const compiledMath = Himalaya.parse(data.html)[0];

    if(display === true) {
      compiledMath.attributes.className.push("post-math");
    } else {
      const className = compiledMath.attributes.className;
      className.splice(1, 1);
      className.push("post-math-inline");
    }

    parentChildren[index] = compiledMath;
    next();
  });
}

Sold({
  root: __dirname,
  template: "template",
  source: "src",
  destination: "",
  engine: (template, data, options, done) => {
    if(data.math === true) {
      let compiledHTML = Himalaya.parse(data.content);
      let elements = compiledHTML.map((element, index) => {
        return {
          parentChildren: compiledHTML,
          index: index,
          element: element
        }
      });

      loop(elements, (data, next) => {
        const element = data.element;
        if(element.type === "Element") {
          const tagName = element.tagName;
          const children = element.children;

          if(tagName === "pre") {
            const code = children[0];
            if(code.attributes.className[0] === "lang-math") {
              typeSet(code.children[0].content, true, data.parentChildren, data.index, next);
            } else {
              next();
            }
          } else if(tagName === "code") {
            const codeText = children[0].content;
            if(codeText[0] === "$" && codeText[codeText.length - 1] === "$") {
              typeSet(codeText.slice(1, -1), false, data.parentChildren, data.index, next);
            } else {
              next();
            }
          } else {
            for(let i = 0; i < children.length; i++) {
              elements.push({
                parentChildren: children,
                index: i,
                element: children[i]
              });
            }
            next();
          }
        } else {
          next();
        }
      }, () => {
        data.content = toHTML(compiledHTML);
        const compiledTemplate = Himalaya.parse(compileTemplate(template, data));
        compiledTemplate[1].children[0].children.splice(10, 0, mathLink);
        done(toHTML(compiledTemplate).replace("view-box", "viewBox"));
      });
    } else {
      done(compileTemplate(template, data));
    }
  }
});
