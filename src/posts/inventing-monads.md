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

This function takes the next function `f` along with the value `x` to pass to it. Since the inputs can be `null`, it checks and returns `null` whenever the input is `null`. If not, it passes `x` to the next function. Now the code will look like:

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
// 49% => "Bob", 51% => null
```

## Logging

Keeping the same example, let's say we want to keep track of log messages. In a functional language, you can't modify a global variable to keep track of all of the messages. Instead, each function can return an output along with a log message.

```js
const getId = () => [7, "Got an id of 7."];
const getUser = id => [{
	first: "John",
	last: "Doe",
	middle: "Bob"
}, id[1] + " Got a user with name John Bob Doe."];
const getMiddleName = user => [user[0].middle, user[1] + " Got the middle name of a user."];

{
	const id = getId ();
	const user = getUser (id);
	const middleName = getMiddleName (user);
}
```

This is messy, and we had to modify the utility functions in order to handle the incoming array input. Instead, we can write the block as functions again, but change the `apply` function to propagate the log for us. In this case, everything has the same array type `[output, log]`.

```js
const apply = f => x => {
	const result = f (x[0]);
	return [result[0], x[1] + " " + result[1]];
};
```

Since everything has the same array type, we take it as an input. Instead of passing the log to the function though, we only pass the output of the value `x[0]` to the function `f`. This function will return its own output and log. We return a new pair with the function output along with the combined logs.

The full code will then be much simpler, and doesn't include anything related to the previous log message in the utility functions:

```js
// Get various data from a user.
const getId = () => [7, "Got an id of 7."];
const getUser = id => [{
	first: "John",
	last: "Doe",
	middle: "Bob"
}, "Got a user with name John Bob Doe."];
const getMiddleName = user => [user.middle, "Got the middle name of a user."];

// Get the middle name along with logs.
const apply = f => x => {
	const result = f (x[0]);
	return [result[0], x[1] + " " + result[1]];
};
const middleName = apply (
	id => apply (
		user => getMiddleName (user)
	) (getUser (id))
) (getId ());

console.log(middleName);
// => ["Bob", "Got an id of 7. Got a user with name John Bob Doe. Got the middle name of a user."]
```

## Global Environment

Let's say we have a global object fetched from somewhere, and it holds data for a user.

```js
{
	id: 7,
	first: "John",
	last: "Doe"
}
```

Along with that, we have a calculation based on this environment.

```js
const getInitials = environment => environment.first[0] + environment.last[0];
const getName = initials => environment => `${initials} ${environment.first} ${environment.last}`;
const getIdentity = name => environment => environment.id.toString() + " " + name;

{
	const initials = getInitials (environment);
	const name = getName (initials) (environment);
	const identity = getIdentity (name) (environment);
}
```

In this case, every single function requires the `environment` as an input. What if we made that implicit?

```js
const getInitials = environment => environment.first[0] + environment.last[0];
const getName = initials => environment => `${initials (environment)} ${environment.first} ${environment.last}`;
const getIdentity = name => environment => environment.id.toString() + " " + name (environment);

{
	const initials = getInitials;
	const name = getName (initials);
	const identity = getIdentity (name);
}
```

It looks nicer, but the utility functions had to change. They now have to call their first argument with the environment in order to get their true value. The functional version of the block would look like this:

```js
const identity = apply (
	initials => apply (
		name => getIdentity (name)
	) (getName (initials))
) (getInitials);
```

Here, every function has a _function of the environment_ as both input and output. What if we kept that property, but the applied function could get the previous value directly? We can change the definition of `apply`:

```js
const apply = f => x => environment => f (x (environment)) (environment);
```

It's a little confusing, but the `apply` function still has a function of the environment as input and output. It returns a new function that takes the environment as input. In this function, it takes the input value `x`, which is a function of the environment, and applies it with the environment. This value is fed into `f`, so that it can expect the actual output of the function without having to worry about passing it the environment. Since `f` returns yet another function of the environment, it finally applies it with the environment once again.

It's a lot of function application, but the key idea is that `apply` keeps the property that every input and every output is a function of the environment. It just applies the next function with an actual value so it won't have to worry about the input being a function.

With that, the final code looks like:

```js
// Utility functions to return calculations based on an environment.
const getInitials = environment => environment.first[0] + environment.last[0];
const getName = initials => environment => `${initials} ${environment.first} ${environment.last}`;
const getIdentity = name => environment => environment.id.toString() + " " + name;

// Get the identity of the environment user.
const apply = f => x => environment => f (x (environment)) (environment);
const identity = apply (
	initials => apply (
		name => getIdentity (name)
	) (getName (initials))
) (getInitials);

// Since `identity` is a function of an environment, we can pass it any environment.
console.log(identity ({
	id: 7,
	first: "John",
	last: "Doe"
}));
// => 7 JD John Doe
```

## Passing State

Let's say we have a state for holding the seed of a random number generator.

```js
7
```

In pure functional languages, there is no concept of mutation, only pure functions. However, for things like random number generation, there is often a seed that is kept track of as state. It needs to be sent around so that the next number and seed can be generated from it. We can write a block like this:

```js
const getRandom = state => {
	const result = 7 * state + 7;
	return [result % 100, result];
};

const getSum = x => y => state => {
	const xResult = x (state);
	const yResult = y (xResult[1]);
	return [xResult[0] + yResult[0], yResult[1]];
};

{
	const random1 = getRandom;
	const random2 = getRandom;
	const sum = getSum (random1) (random2);
}
```

In this example, every value is a function of state that returns and output along with new state. It's not the best code though, because `getSum` has to call both of its arguments with the state in order to get their value, then it has to correctly manage the latest state and return it. The functional version of the block looks like:

```js
const random1 = getRandom;
const random2 = getRandom;
const sum = getSum (random1) (random2);

const sum = apply (
	random1 => apply (
		random2 => getSum (random1) (random2)
	) (getRandom)
) (getRandom);
```

Every function has _a function of state that returns and output and new state_ as its input and output. Instead of having to deal with a function as input, we can change `apply` to apply the function with an actual value and handle state changes.

```js
const apply = f => x => state => {
	const result = x (state);
	return f (result[0]) (result[1]);
};
```

It's elegant, but dense. Since the input `x` and the output of `apply` are both functions of state, it returns a new function of state. In this function, it first applies the input with the state and stores the `result`. Now, the next function `f` is applied with the _output_ portion of the result, so it doesn't have to worry about the state. `f` outputs another function of state, so it is called with the _state_ portion of the result in order to get a new output and new state.

The full code looks like:

```js
// Utility functions for number manipulation.
const getRandom = state => {
	const result = 7 * state + 7;
	console.log("Random number: " + (result % 100)); // Log random numbers for debugging.
	return [result % 100, result];
};

const getSum = x => y => state => [x + y, state];

// Generate the sum of two random numbers.
const apply = f => x => state => {
	const result = x (state);
	return f (result[0]) (result[1]);
};

const sum = apply (
	random1 => apply (
		random2 => getSum (random1) (random2)
	) (getRandom)
) (getRandom);

console.log(sum (7));
// => Random number: 56
// => Random number: 99
// => [155, 399]
```

## Conclusion

TODO
