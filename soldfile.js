const Sold = require("sold");
const Handlebars = require("handlebars");
const Himalaya = require("himalaya");
const toHTML = require("himalaya/translate").toHTML;
const minifyHTML = require("html-minifier").minify;
const MathJax = require("mathjax-node");

const STR_RE = /((?:&quot;)|'|`)((?:.|\n)*?)\1/g;
const SPECIAL_RE = /\b(new|var|let|if|do|function|while|switch|for|foreach|in|continue|break|return)\b/g;
const GLOBAL_VARIABLE_RE = /\b(document|window|Array|String|undefined|true|false|Object|this|Boolean|Function|Number|\d+(?:\.\d+)?)\b/g;
const CONST_RE = /\b(const )([\w\d]+)/g;
const METHODS_RE = /\b([\w\d]+)\(/g;
const MULTILINE_COMMENT_RE  = /(\/\*.*\*\/)/g;
const COMMENT_RE = /(\/\/.*)/g;
const HTML_COMMENT_RE = /(\&lt;\!\-\-(?:(?:.|\n)*)\-\-\&gt;)/g;
const HTML_ATTRIBUTE_RE = /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g;
const HTML_TAG_RE = /(&lt;\/?[\w\d-]*?)(\s(?:.|\n)*?)?(\/?&gt;)/g;
const escapeRE = /&(?:amp|gt|lt);/g;
const escapeMap = {
  "&amp;": '&',
  "&gt;": '>',
  "&lt;": '<'
};

MathJax.start();

Handlebars.registerHelper("list", function(arr) {
  arr.reverse();
  let i = arr.length;
  while ((i--) !== 0) {
    if (arr[i].draft) {
      arr.splice(i, 1);
    }
  }
});

const escape = (text) => text.replace(escapeRE, (match) => escapeMap[match]);

const loop = (arr, body, done) => {
  const next = () => {
    if (arr.length === 0) {
      done();
    } else {
      body(arr.shift(), next);
    }
  }

  next();
};

const highlight = function(compiled, lang) {
  compiled = compiled.replace(STR_RE, "<span class=\"string\">$1$2$1</span>");

  if (lang === "html") {
    compiled = compiled.replace(HTML_COMMENT_RE, "<span class=\"comment\">$1</span>");
    compiled = compiled.replace(HTML_TAG_RE, function(match, start, content, end) {
      if (content === undefined) {
        content = '';
      } else {
        content = content.replace(HTML_ATTRIBUTE_RE, function(match, name, value) {
          if (value !== "string") {
            if (value === undefined) {
              value = '';
            } else {
              value = '=' + value;
            }
            return "<span class=\"global\">" + name + "</span>" + value;
          }
        });
      }

      return "<span class=\"method\">" + start + "</span>" + content + "<span class=\"method\">" + end + "</span>";
    });
  } else {
    compiled = compiled.replace(COMMENT_RE, "<span class=\"comment\">$1</span>");
    compiled = compiled.replace(MULTILINE_COMMENT_RE, "<span class=\"comment\">$1</span>");

    compiled = compiled.replace(SPECIAL_RE, "<span class=\"special\">$1</span>");
    compiled = compiled.replace(GLOBAL_VARIABLE_RE, "<span class=\"global\">$1</span>");

    compiled = compiled.replace(CONST_RE, "<span class=\"special\">$1</span><span class=\"global\">$2</span>");
    compiled = compiled.replace(METHODS_RE, function(match, name) {
      return "<span class=\"method\">" + name + "</span>(";
    });
  }

  return compiled;
}

const compileTemplate = (template, data) => {
  return minifyHTML(Handlebars.compile(template)(data), {
    caseSensitive: true,
    keepClosingSlash: true,
    removeAttributeQuotes: false,
    collapseWhitespace: true,
    minifyJS: true
  });
};

const typeSet = (math, display, parentChildren, index, next) => {
  MathJax.typeset({
    math: escape(math),
    type: "TeX",
    html: true,
    css: true
  }, (data) => {
    const compiledMath = Himalaya.parse(data.html)[0];

    if (display === true) {
      compiledMath.attributes.className.push("post-math");
    } else {
      const className = compiledMath.attributes.className;
      className.splice(1, 1);
      className.push("post-math-inline");
    }

    parentChildren[index] = compiledMath;
    next();
  });
};

Sold({
  root: __dirname,
  template: "template",
  source: "src",
  destination: '',
  engine: (template, data, options, done) => {
    if (data.content === undefined) {
      done(compileTemplate(template, data));
    } else {
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
        if (element.type === "Element") {
          const tagName = element.tagName;
          const children = element.children;

          if (tagName === "pre") {
            const code = children[0];
            const codeText = code.children[0].content;
            const codeAttributes = code.attributes;
            const codeAttributesClassName = codeAttributes.className;

            if (codeAttributesClassName === undefined) {
              next();
            } else {
              const lang = codeAttributesClassName[0].substring(5);
              if (lang === "math") {
                typeSet(codeText, true, data.parentChildren, data.index, next);
              } else {
                codeAttributes.lang = lang;
                delete codeAttributes.className;
                code.children = Himalaya.parse(highlight(codeText, lang));
                next();
              }
            }
          } else if (tagName === "code") {
            const codeText = children[0].content;
            if (codeText[0] === '$' && codeText[codeText.length - 1] === '$') {
              typeSet(codeText.slice(1, -1), false, data.parentChildren, data.index, next);
            } else {
              element.children = Himalaya.parse(highlight(codeText, "js"));
              next();
            }
          } else {
            for (let i = 0; i < children.length; i++) {
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
        done(compileTemplate(template, data));
      });
    }
  }
});
