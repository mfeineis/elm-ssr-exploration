/* eslint-env node */

const fs = require("fs");

const [_, __, src, target] = process.argv;

let code = fs.readFileSync(src, "utf-8").toString().replace(
    /XXXX(node\.parentNode\.replaceChild)([\s\S]+)(return \{\};)/gmu,
    (_, pre, toReplace, post) => {
        console.log(toReplace);
        //return `\n\n  console.log(node, virtualNode);\n\n` + _;
        return `

console.log(node, virtualNode);

node.parentNode.insertBefore(_VirtualDom_render(virtualNode, function() {}), node);

${post}

        `;
    }
);


code = code.replace(
	/var _VirtualDom_doc = typeof document !== 'undefined' \? document : \{\}/u,
	(_) => {
		return `

const FIDDLE_doc = IS_SERVER ? {} : document;

// FIDDLE
var _VirtualDom_doc = {
	createElement(tagName) {
		const attrs = {};
		const children = [];
		return {
			appendChild(child) {
				children.push(child);
			},
			attributes: attrs,
			children,
			childNodes: children,
			getAttribute(key) {
				return attrs[key];
			},
			getAttributeNS(ns, key) {
				return attrs[key];
			},
			insertBefore(node, beforeNode) {
				const index = children.findIndex(beforeNode);

				if (index < 0) {
					return;
				}

				children.splice(index, 0, node);
			},
			get length() {
				return children.length;
			},
			removeAttribute(key) {
				attrs[key] = null;
			},
			removeAttributeNS(ns, key) {
				attrs[key] = null;
			},
			removeChild(child) {
				children = children.filter(it => it !== child);
			},
			replaceChild(node, child) {
				const index = children.findIndex(node);

				if (index < 0) {
					return;
				}

				children.splice(index, 1, child);
			},
			setAttribute(key, value) {
				attrs[key] = value;
			},
			setAttributeNS(ns, key, value) {
				attrs[key] = value;
			},
			style: {},
			tagName,
		};
	},
	createTextNode(content) {
		return {
			textContent: content,
		};
	},
	getElementById(id) {
		return null;
	},
	hidden: false,
	location: {
		href: 'http://virtual.location',
		reload() {
			console.log('_VirtualDom_doc.location.reload');
		},
	},
	get title() {
		return FIDDLE_doc.title;
	},
	set title(it) {
		FIDDLE_doc.title = it;
	},
};
_VirtualDom_doc.body = IS_SERVER ? _VirtualDom_doc.createElement('body') : document.body;
_VirtualDom_doc.createDocumentFragment = () => _VirtualDom_doc.createElement('div');
_VirtualDom_doc.createNamespaceNS = (ns, tagName) => _VirtualDom_doc.createElement(tagName);

scope._VirtualDom_doc = _VirtualDom_doc;

if (typeof history === 'undefined') {
	scope.history = {
		go(url) {
			console.log('history.go', url);
		},
		pushState(state, key, url) {
			console.log('history.pushState', state, key, url);
		},
		replaceState(state, key, url) {
			console.log('history.replaceState', state, key, url);
		},
	};
};

console.log('history', history);

		`;

	}
);

code = code.replace(
	/var _Browser_doc = typeof document !== 'undefined' \? document : _Browser_fakeNode;/u,
	(_) => {

		return `

// FIDDLE
var _Browser_doc = _VirtualDom_doc;
scope._Browser_doc = _Browser_doc;

		`;
	}
);

code = code.replace(
	/var _Browser_window = typeof window !== 'undefined' \? window : _Browser_fakeNode;/u,
	(_) => {
		return `

// FIDDLE
var _Browser_window = {
	addEventListener() {
	},
	navigator: {
		userAgent: 'Virtuaaaal',
	},
	removeEventListener() {
	},
};

scope._Browser_window = _Browser_window;

		`;
	}
);

code = code.replace(
	/var node = document\.getElementById\(id\);/gu,
	(_) => {
		return `
// FIDDLE
var node = _Browser_doc.getElementById(id);

		`;
	}
);

code = code.replace(
	/: function\(callback\) \{ return setTimeout\(callback, 1000 \/ 60\); \};/u,
	(_) => {
		return `
// FIDDLE
: IS_SERVER ? function(callback) { return process.nextTick(callback); } :  function(callback) { return setTimeout(callback, 1000 / 60); };
		`;
	}
);

code = code.replace(
	/^\(function\(scope\)\{\n'use strict';\n/mu,
	`(function(scope, IS_SERVER){
		'use strict';

		console.log('IS_SERVER', IS_SERVER);
		
		`
);

code = code.replace(
	/\}\(this\)\);/u,
	(_) => {
		return `}(typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : this, typeof global !== 'undefined'));

console.log('Elm', Elm);

		`;
	}
);


console.log(src, "->", target);

fs.writeFileSync(target, code, "utf-8");
