var STR_RE = /(["'`])((?:.|\n)*?)\1/g;
var SPECIAL_RE = /\b(new|var|let|if|do|function|while|switch|for|foreach|in|continue|break|return)\b/g;
var GLOBAL_VARIABLE_RE = /\b(document|window|Array|String|undefined|true|false|Object|this|Boolean|Function|Number|\d)\b/g;
var CONST_RE = /\b(const )([\w\d]+)/g;
var METHODS_RE = /\b([\w\d]+)\(/g;
var MULTILINE_COMMENT_RE  = /(\/\*.*\*\/)/g;
var COMMENT_RE = /(\/\/.*)/g;
var HTML_COMMENT_RE = /(\&lt;\!\-\-(?:(?:.|\n)*)\-\-\&gt;)/g;
var HTML_ATTRIBUTE_RE = /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g;
var HTML_TAG_RE = /(&lt;\/?[\w\d-]*?)(\s(?:.|\n)*?)?(\/?&gt;)/g;

var code = document.getElementsByTagName("code");

var compile = function(val, lang) {
  var compiled = val;

  compiled = compiled.replace(STR_RE, "<span class=\"string\">$1$2$1</span>");

  if(lang === "html") {
    compiled = compiled.replace(HTML_COMMENT_RE, "<span class=\"comment\">$1</span>");
    compiled = compiled.replace(HTML_TAG_RE, function(match, start, content, end) {
      if(content === undefined) {
        content = "";
      } else {
        content = content.replace(HTML_ATTRIBUTE_RE, function(match, name, value) {
          if(value === "string") {
            return match;
          } else {
            if(value === undefined) {
              value = "";
            } else {
              value = "=" + value;
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

for(var i = 0; i < code.length; i++) {
  var el = code[i];
  var classes = el.getAttribute("class");
  if(classes !== null && classes.substring(0, 5) === "lang-") {
    var lang = classes.substring(5);
    el.setAttribute("lang", lang);
    el.removeAttribute("class");
    el.innerHTML = compile(el.innerHTML, lang);
  }
}
