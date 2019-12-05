---
title: Optimal Virtual DOM
date: December 5, 2019
draft: true
---

The virtual DOM is an idea that stems from functional programming in user interfaces. One can create a new tree representing the UI on every update and replace the old tree with it. A problem arises, however, when this idea of an immutable, declarative view is applied in the browser.

JavaScript and the DOM are inherently imperative; they are updated through mutating method calls. A virtual DOM bridges this gap and allows for creating a new tree on each render in an imperative environment.

Still, a fast implementation of the virtual DOM can be a difficult task. As I've worked on [Moon](https://kbrsh.github.io/moon), I've tried many different approaches to the diffing algorithm, with the most [recent revision](https://github.com/kbrsh/moon/commit/e7a7cd9ab427be89cb7efee70df86dfe0401d770) being explained here. Recently, the algorithm has been able to achieve some pretty fast performance on benchmarks, and it boils down to one principle: avoiding the DOM as much as possible.

There are many ways to approach a virtual DOM implementation, each building on top of the previous one to gain better performance.

## Replace

The simplest way of building a virtual DOM would be to create a DOM element based on a virtual node and replacing a root element with the new one.

```js
node.parentNode.replaceChild(nodeFromVNode(vnode), node);
```

This is wasteful because the DOM was not designed to be manipulated in this way. It was designed for granular method calls rather than large numbers of new elements constantly being created.

## DOM Diff

Transforming the DOM through a diff and patch between a virtual node and the DOM can allow for more precise changes. For example, updating a `className` property may check against the current state of the DOM.

```js
if (node.className !== vnode.className) {
	node.className = vnode.className;
}
```

Even so, _reading_ the DOM is bad for performance. Virtual node object property access is much faster.

## Virtual DOM Diff

Instead of diffing against the DOM, the previous virtual DOM can be stored and used instead.

```js
if (vnodeOld.className !== vnodeNew.className) {
	node.className = vnodeNew.className;
}
```

Now, the DOM is accessed only when it is absolutely necessary — to modify it. However, when diffing against children, this can mean accessing `childNodes`:

```js
for (let i = 0; i < length; i++) {
	const vchildOld = vnodeOld.children[i];
	const vchildNew = vnodeNew.children[i];

	if (vchildOld !== vchildNew) {
		// Assume that `diff` takes an old virtual node, new virtual node, and a
		// DOM element to patch.
		diff(vchildOld, vchildNew, node.childNodes[i]);
	}
}
```

This can be transformed to a loop using `firstChild` and `nextSibling`, but it still means accessing the DOM on every iteration. This is slow. Moon gets around this by keeping track of children in a separate property on every DOM element called `MoonChildren`.

```js
for (let i = 0; i < length; i++) {
	const vchildOld = vnodeOld.children[i];
	const vchildNew = vnodeNew.children[i];

	if (vchildOld !== vchildNew) {
		diff(vchildOld, vchildNew, node.MoonChildren[i]);
	}
}
```

## Conclusion

I believe that a virtual DOM diff against the old and new virtual DOM while accessing the DOM only to update it is the fastest approach. It avoids the DOM as much as possible, favoring plain JavaScript objects instead. Reading and writing becomes incredibly cheap compared to the DOM. Combined with using constructors for virtual nodes, storing events on DOM nodes, and using a purely functional design, Moon's view driver is faster than ever before.
