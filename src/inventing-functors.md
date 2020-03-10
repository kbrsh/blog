---
title: Inventing Functors
date: March 9, 2020
draft: true
---

Let's say we have a function named `double`.

```js
const double = x => x * 2;
```

It's simple and worries about one type: numbers.

![Double](/img/inventing-functors/double.png)

In real world code, we encounter numbers wrapped inside of containers. For example, lists, optionals, and other functions can wrap numbers. However, our `double` function doesn't know what to do with them.

## Lists

We come across a list of numbers that we want to double. Naturally, we pass it to `double` and pray that it works.

```js
double ([1, 2, 3]); // => error
```

![Double list](/img/inventing-functors/double-list.png)

It doesn't. Reluctantly, we extend `double` to work with lists.

```js
const double = x => {
	if (Array.isArray(x)) {
		const doubled = [];

		for (let i = 0; i < x.length; i++) {
			doubled[i] = x[i] * 2;
		}

		return doubled;
	} else {
		return x * 2;
	}
};
```

Our code works, but the implementation of `double` isn't crystal clear anymore. We move on to the next task anyway: incrementing numbers by one. Once again, we write a tiny function that works with only numbers.

```js
const increment = x => x + 1;
```

Yet again, we encounter a list that wraps numbers, so we rewrite `increment` to work with lists.

```js
const increment = x => {
	if (Array.isArray(x)) {
		const incremented = [];

		for (let i = 0; i < x.length; i++) {
			incremented[i] = x[i] + 1;
		}

		return incremented;
	} else {
		return x + 1;
	}
};
```

Our code works, and we can compose the functions on both numbers and lists. Nice!

```js
increment (double ([1, 2, 3])); // => [3, 5, 7]
```

Still, we implemented the same logic for working with lists twice. That's not very DRY. We would have to rewrite the exact same thing for every function we want to apply to lists. We want to limit `double` and `increment` to only numbers and handle numbers wrapped in lists separately.

So, we write a function called `map` to handle this unwrapping process.

```js
const map = f => x => {
	const result = [];

	for (let i = 0; i < x.length; i++) {
		result[i] = f(x[i]);
	}

	return result;
};
```

It takes two parameters: a function and a list. The function expects normal values, but they are wrapped by a list. `map` unwraps them by accessing each value in the list, passes them to the function and rewraps them into a new list.

Now we can map functions onto lists without worrying about rewriting them to work with lists.

```js
const double = x => x * 2;
const increment = x => x + 1;

double (7); // => 14
increment (7); // => 8

map (double) ([1, 2, 3]); // => [2, 4, 6]
map (increment) ([1, 2, 3]); // => [2, 3, 4]
```

![Map double](/img/inventing-functors/map-double.png)

## Optionals

We find that some of our sources are unreliable and return optional values, i.e. values that may be `null`. Just like last time, we start by taking the easy way out and change each function to handle optional values.

```js
const double = x => {
	if (x === null) {
		return null;
	} else {
		return x * 2;
	}
};

const increment = x => {
	if (x === null) {
		return null;
	} else {
		return x + 1;
	}
};
```

The déjà vu kicks in. This is similar to what we did for lists, except the values are wrapped inside of an optional type instead of a list. So, we try writing a new `map` function.

```js
const map = f => x => {
	if (x === null) {
		return null;
	} else {
		return f(x);
	}
};
```

This map function unwraps the actual value from the optional if it exists, passes it through the function, and wraps it into a new optional value. Everything is DRY again.

```js
const double = x => x * 2;
const increment = x => x + 1;

map (double) (7); // => 14
map (double) (null); // => null

map (increment) (7); // => 8
map (increment) (null); // => null
```

![Map optional](/img/inventing-functors/map-optional.png)
