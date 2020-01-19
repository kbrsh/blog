---
title: "Moon: Pure UI"
date: January 12, 2020
draft: true
---

[Moon](https://moonjs.org) is a web library that runs applications as pure functions.

I've lost count of the number of times that I've redesigned Moon's API. Every single iteration felt incomplete. Little inconsistencies here and there would leave the perfectionist in me unsatisfied.

Other libraries had conditioned me to lean towards similar designs. The mental model that came with React or Vue always found its way into Moon. So, over a week, I erased everything that I knew about user interfaces and tried to create something from scratch.

That week grew philosophical as I questioned modern UI development:

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

Developing UIs is complex. As with other software, a UI transforms and processes data. Moreover, it forms a link between the user and computer. Much of the input data comes from users. The outputs also affect the user in real time.

This means that a UI must be responsive and easy to conceptualize. Users interact with the application expecting constant, instant feedback. They want to work with it to solve their problems. The interface is the barrier between the problem and solution. Users shouldn't have to wrestle with it. Thus, they should be capable of forming a clear mental representation of the UI.

Functional programming, responsiveness, and conceptualization are connected. Pure functions allow both developers and users to visualize input and output states. Being simple to grok means clear implementations, free of scattered imperative code. Clear implementations lead to speed and efficiency.

Pure functions replace contrived models. They interact with the world using drivers. Moon revitalizes UI development with determinism, composition, single state trees, straightforward testing, and faster performance.

## Background

UI development is drifting away from the Model-View-Controller (MVC) model and mutating views with JQuery. Now, most libraries try to represent the view as a function of state.

```
application(state) = view
```

[React](https://reactjs.org) popularized this idea. For example, a counter application in React stores a count in state and renders it to a view.

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

## Drivers

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
