---
title: "Moon: Pure UI"
date: January 12, 2020
draft: true
---

[Moon](https://moonjs.org) is a web library that runs applications as pure functions.

User interfaces (UIs) underpin almost all software. As with other programs, they transform and process data. However, they must also harmonize users with the underlying computer. People input an endless stream of data, and the application output affects them in real-time.

This means that a UI must be responsive and easy to conceptualize. Users interact with the application expecting constant, instant feedback. They want to work with it to solve their problems. The interface is the barrier between the problem and the solution. Users shouldn't have to wrestle with it. Thus, they should be capable of forming a clear mental representation of the UI.

![Fast and easy UI](/img/moon/Figure1FastEasyUI.png)

Functional programming, responsiveness, and conceptualization are connected. Pure functions allow both developers and users to visualize input and output states. Being simple to grok means clear implementations, free of scattered imperative code. Clear implementations lead to smooth optimization, speed, and efficiency.

Moon streamlines UI development with pure functions. I've lost count of the number of times that I've redesigned its API. Every single iteration felt incomplete. Little inconsistencies here and there would leave the perfectionist in me unsatisfied.

Other libraries had conditioned me to lean towards similar designs. The mental model that came with React or Vue always found its way into Moon. So, over a week, I erased everything that I knew about user interfaces and tried to create something from scratch.

That week grew philosophical as I questioned modern UI development.

* _Why is view a function of state?_
* _Why do we need components?_
* _Why do components have local state?_
* _If the view is a function of state, what about other effects?_

Popular UI libraries treat views as functions of state, but UIs aren't states and views. They're everything: mapping inputs from the user to outputs on the computer.

A UI can take information from the mouse, keyboard, webcam, or mic. After processing this data, it can output to the screen, speakers, network, or hard drive.

With this definition, UI becomes a pure function.

```
application(sensory input) = output signals
```

Four years of reiterating on Moon with complex API rewrites led to this idea. In hindsight, it seems obvious; represent UI as a function. But it can be hard to see through the forest of abstractions in the UI development world. If anything, the simplicity reinforces that functions are a natural way of defining UIs.

Pure functions replace contrived models. Moon allows applications to interact with the world using drivers. It revitalizes UI development with composition, straightforward testing, time-travel debugging, and faster performance.

## Background

UI development finds its roots in object-oriented, imperative code. As paradigms shift, two ideas have remained constant: state and views.

State is a data structure. This structure can hold any value relevant to the application, including numbers, strings, lists, or objects. Applications initialize the state with data and store it in memory. As users interact with the UI, it transforms the state.

Most UIs revolve around state. This means that if an application holds a certain state, it will always have the same UI. In these cases, the state is the sole source of truth and describes every aspect of the UI.

Null values describe the absence of a value. Applications use them to handle states that can't exist yet. For example, a UI can use state to store a selected item in a list. If the user hasn't selected an item, developers may represent it with `null`.

Boolean values represent two states, true or false. Two states are so convenient that programming languages natively support them. They are effective at denoting loading states, activation states, or authentication status.

Numbers represent quantatative data. They can describe values such as counts, ages, money, likes, or followers. In addition, they can track the index to a list. For example, a number state value can reference the index of a selected item in a list.

Strings represent text. This includes names, usernames, descriptions, and other text content. Similar to numbers, they can serve as a key to an object. For example, a string state value can hold a selected username. This username can map to user information in an object.

Lists represent sets of ordered data. This can be a list of todos, users, transactions, or recipes. They are often cons cells or arrays with integer indexes.

Objects resemble lists with indexes, but accept any index type instead of integers. For example, numbers and strings can both map to a value in an object. These are useful for structuring state in general or mapping keys to values. As state compounds, an object is useful for structure.

```js
{
	user: {
		name: "",
		email: "",
		age: 0
	},
	users: [],
	selected: null,
	isLoaded: false
}
```

This is the most common way of holding structured state. The overarching state tree should have a well-defined shape, and it determines the character of the UI.

The view displays data from the state. In graphical user interfaces, the view is a screen. Views can exhibit the state on devices such as smart watches, mobile phones, laptops, monitors, or television screens. Operating systems represent the display with a buffer holding colors for each pixel.

TODO: define state, what it represents, how it is managed, and what it does for an application. define views, what they represent, how they are represented in pixels, how they are abstracted with GUI widgets and the DOM, and how the DOM is constructed and manipulated. define existing models: vanilla js with event loop and DOM manipulation, vue.js reactive updates, react component view as function of local component state, elm model-view-update. in each model, describe a basic example (counter) and mention how they each allow composition and building of reponsive UIs with easy conceptualization, including ideas such as components, events, state, and communication between components.

TODO: define current state of managing state (especially difficulties). start with object oriented and imperative state updates and move into functional programming techniques for representing state, which is a fundamentally mutable value. have examples of state management code throughout.

Manipulating the display buffer palls when managing complex elements. Developers would have to define every interaction's effect in terms of individual pixels. This means conducting text, images, inputs, and buttons at the same time.

GUI frameworks circumvent this by defining reusable widgets. On the web, browsers abstract the view with the document object model (DOM).

TODO: define GUI frameworks and DOM, saying how they use imperative code for construction and mutation. show the problems with composition and reuse due to mutation. have code samples for DOM construction and mutation. transition into MVC.

TODO: define MVC, difficulties with MVC, and some examples with MVC. transition into using functional programming to solve some issues with state management and views by representing the view as a value, and defining it as a function of state.

Developers are drifting away from object-oriented components and the Model-View-Controller (MVC) model. The current status quo of UI development defines views as a function of state.

```
application(state) = view
```

With this model, the state, a dynamic value, is immutable. Applications change the state by constructing a new one from scratch and replacing the old one.

TODO: add more examples and justification for this functional idea then transition into current frameworks for functional UI in the imperative DOM (react, elm, cycle). introduce the mental models that comes with each of these frameworks

[React](https://reactjs.org) popularized this idea. It introduces components, each of which returns a view based on local state. The state is a JavaScript object, and the view is an object representing a virtual DOM. The virtual DOM is a tree describing the DOM.

For example, a counter application in React stores a count in state and renders it to a view.

```js
import React, { useState } from "react";

function Counter() {
	// Access state with an magical "hook".
	const [count, setCount] = useState(0);

	// Return a view.
	return (
		<button onClick={() => setCount(count + 1)}>
			{count}
		</button>
	);
}
```

The goal is to represent the view as a pure function of state, but React uses "hooks" instead. Rather than passing global state as a parameter, it links local state to components. Hooks like `useState` access this state and store it based on a component's position in a tree.

Local state replacing function parameters means that React apps are not pure. They rely on positions in the tree to store local state, requiring abstractions like keys, context, and state libraries to maintain.

The React model also limits UI input to state and output to views. All other inputs and effects are second-class citizens.

For example, displaying the time would break out of the functional mental model. It needs input from an impure function and depends on the developer to handle timing effects.

```js
import React, { useState } from "react";

function Time() {
	// Store time in state.
	const [time, setTime] = useState(Date.now());

	// Manually handle a timing interval effect.
	useEffect(() => {
		const interval = () => {
			setTime(Date.now());
		};

		setInterval(interval, 1000);

		return () => clearInterval(interval);
	}, []);

	// Return a view based on the time stored in the state.
	return <p>{new Date(time).toLocaleTimeString()}</p>;
}
```

Most applications need inputs other than state and effects other than views. Even the basic clock UI needs them. React allows writing custom events with the effect hook. But as with all other hooks, writing effects in the body of a function rather than as a return value introduces impurity.

Since local state is the sole input, it must store the time. However, this is convoluted. Passing it as an input to the function is clearer.

## Moon

TODO: introduce Moon's mental model of a UI as a function. introduce drivers and run function.

Computers are imperative, based on operations that mutate the internal state. This includes registers, memory, and other hardware. Until computers treat software as a function, providing inputs and handling outputs, we'll use drivers.

Drivers are an interface between software and hardware. They bridge the gap between functional applications and imperative devices.

A driver captures data coming in from devices and sends data back to them. Consequently, in most modern languages, a driver is a module with two functions: one for input and one for output.

In an ideal world, a computer would call an application function every cycle. To simulate this, the computer should run the application when inputs change. One can pipe input data from drivers to the application. Then, they can route return values to the appropriate driver output functions.

Moon's [run](https://github.com/kbrsh/moon/blob/master/packages/moon/src/run.js) function does this. The implementation (without error handling) is succinct.

```js
function run(application) {
	// Get inputs from all drivers.
	const input = {};

	for (const driver in drivers) {
		input[driver] = drivers[driver].input();
	}

	// Get the application output.
	const output = application(input);

	// Execute drivers with the outputs.
	for (const driver in output) {
		drivers[driver].output(output[driver]);
	}
}
```

Each driver is an object with an input and output function. For example, a driver for manipulating RAM, i.e. storing data in a variable is trivial to implement.

```js
let data;

const driver = {
	input() {
		return data;
	},
	output(dataNew) {
		data = dataNew;
	}
};
```

In fact, this is how Moon's [data driver](https://github.com/kbrsh/moon/blob/master/packages/moon/src/data/driver.js) works.

## Data

TODO: define data driver, discuss implementation, introduce single state tree, describe examples of managing single state trees with determinism, purity, reducers, etc.

## Views

TODO: define view driver, discuss implementation details (virtual DOM, node reference check), Moon View Language, components

## Time

TODO: define time driver, discuss implementation

## Storage

TODO: define storage driver, discuss implementation

## HTTP

TODO: define HTTP driver, discuss implementation

## Route

TODO: define route driver, discuss implementation

## Composition

TODO: define composition of functions that each take driver inputs and return driver outputs (similar to cycle)

## Concurrency

TODO: define concurrency, say how it can be used in general when running the application function just like any other functional language and when outputting to multiple drivers at once. inputs can't be concurrent because they are sampled directly from devices, and these devices must be responsible for tracking concurrent inputs (such as a keyboard, where the browser or keyboard automatically orders events)

## Testing

TODO: define testing, introduce testing techniques using input/output assertions, discuss how even randomness, time, or even network requests can be made deterministic because of the nature of drivers

## Debugging

TODO: define debugging, introduce advantages of debugging with pure functions that use immutable state for all drivers (time travel debugging)

## Optimization

TODO: define optimization techniques of functional programming, including tail recursion, memoization, caching, loop unrolling, etc.

## Examples

TODO: counter, clock, todo app, chat app, audio (radio?)/video app

## Conclusion

TODO: summarize old techniques and Moon's new model
