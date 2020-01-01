const Sold = require("sold");
const marked = require("marked");
const Prism = require("prismjs");
const katex = require("katex");

const renderer = new marked.Renderer();

renderer.heading = (text, level, raw, slugger) => {
	return `<h${level} id="${slugger.slug(text)}" class="s-x-26">${text}</h${level}>`;
};

renderer.paragraph = text => {
	return `<p class="s-x-26">${text}</p>`;
};

renderer.listitem = text => {
	return `<li><p class="s-x-26">${text}</p></li>`;
};

renderer.code = (code, lang, escaped) => {
	if (lang === "js") {
		lang = "javascript";
	}

	if (lang === "math") {
		return katex.renderToString(code, {
			displayMode: true
		});
	} else if (lang in Prism.languages) {
		return `<pre class="s-x-26 s-b-2 p-x-4 p-y-4"><code>${Prism.highlight(code, Prism.languages[lang], lang)}</code></pre>`;
	} else {
		return `<pre class="s-x-26 s-b-2 p-x-4 p-y-4"><code>${code}</code></pre>`;
	}
};

renderer.codespan = code => {
	if (code[0] === "$" && code[code.length - 1] === "$") {
		return katex.renderToString(code.slice(1, -1));
	} else {
		return `<code class="s-b-2 p-x-2 p-y-2">${code}</code>`;
	}
};

Sold({
	root: __dirname,
	template: "template",
	source: "src",
	destination: "",
	feed: {
		JSON: {
			title: "Blog of Kabir Shah",
			home_page_url: "https://blog.kabir.sh",
		}
	},
	marked: {
		renderer
	}
});
