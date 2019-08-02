---
title: Inventing Monads
date: August 1, 2019
order: 8
draft: true
---

Monads are an esoteric concept to many, resulting in hundreds of tutorials, guides, and examples attempting to explain them. Curious developers might look into them only to find the classic answer, "Monads are monoids in the category of endofunctors". In the end, they're just another abstraction to help deal with repetitive patterns in functional code.

This guide will use JavaScript instead of a pure functional programming language (e.g. Haskell) to make things more approachable for developers accustomed to imperative languages. It will, however, assume you have basic knowledge of functional programming, including currying and lambdas.

Think of monads as a way to overload a semicolon. It might sound a little crazy at first, but imagine being able to override the semicolon to reduce boilerplate in specific code blocks. That's basically how monads are used in practice.

## Blocks

First, blocks of code wrapped in curly braces can usually be transformed into function calls. Being explicit about composing functions in this way can help clarify how exactly monads can modify the flow of a program.

For example, the following block of code:

```js
{
	const id = getId ();
	const user = getUser (id);
	const middleName = getMiddleName (user);
}
```

Can be represented as:

```js
const middleName = (
	id => (
		user => getMiddleName (user)
	) (getUser (id))
) (getId ());
```

It's a little confusing, but they are equivalent. Functions are called with a space between the name and parenthesis. This is done to simulate calling functions by juxtaposition, and it's helpful for calling curried functions. This functional version of block syntax is syntactically similar to turning everything inside out, with the last expression in the middle.

It can be thought of this way:

```js
{
	const id = getId ();

	// Everything below is a function of "id".
	const user = getUser (id);

	// Everything below is a function of "user".
	const middleName = getMiddleName (user);
}
```

## Null Everywhere

Revisiting the previous example, the code might look like this:

```js
{
	const id = getId ();
	const user = getUser (id);
	const middleName = getMiddleName (user);
}
```

It's clean enough, right? Now imagine if `id` could be `null`, `user` could be `null`, or `middleName` could be `null`. The utility functions will all end up looking like this:

```js
// Simulate the fetching of an ID.
const getId = () => {
	const random = Math.floor(Math.random() * 1000);

	return random < 700 ? random : null;
};

// Simulate the fetching of a user.
const getUser = id => {
	if (id === null) {
		return null;
	} else {
		return {
			first: "John",
			last: "Doe",
			middle: Math.random() < 0.7 ? "Bob" : null
		};
	}
};

// Simulate the fetching of a middle name.
const getMiddleName = user => {
	if (user.middle === null) {
		return null;
	} else {
		return user.middle;
	}
};
```

Every utility function has to check and handle `null` values, and has the possibility of returning `null` as well. But what if it could be checked for automatically? That's where monads come in.

Once again, the functional version of the block would look like this:

```js
const middleName = (
	id => (
		user => getMiddleName (user)
	) (getUser (id))
) (getId ());
```

Looking at this, we can find a pattern: every function takes a nullable value as input and output. Instead of handling `null` within each function, we can create an `apply` function that will handle it for us.

```js
const apply = f => x => x === null ? null : f (x);
```

This function takes the next function `f` along with the value `x` to pass to it. Since the inputs can be `null`, it checks and returns `null` whenever the input is `null`. If not, it passes x to the next function. Now the code will look like:

```js
const middleName = apply (
	id => apply (
		user => getMiddleName (user)
	) (getUser (id))
) (getId ());
```

This preserves the quality that every function returns a nullable value, but allows them to assume that their input is not `null`. Before, every function had the same input and output type. Now, the `apply` function has the same input and output type, but it is free to use its given function however it likes, as long as it keeps the same input and output type. With this, the full code can be written as:

```js
// Simulate the fetching of an ID.
const getId = () => {
	const random = Math.floor(Math.random() * 1000);

	return random < 700 ? random : null;
};

// Simulate the fetching of a user.
const getUser = id => ({
	first: "John",
	last: "Doe",
	middle: Math.random() < 0.7 ? "Bob" : null
});

// Simulate the fetching of a middle name.
const getMiddleName = user => user.middle;

// Get the middle name, if it exists.
const apply = f => x => x === null ? null : f (x);
const middleName = apply (
	id => apply (
		user => getMiddleName (user)
	) (getUser (id))
) (getId ());

console.log(middleName);
```

## Logging

TODO

## Global Configuration

TODO

## Passing State

TODO

## Conclusion

TODO
