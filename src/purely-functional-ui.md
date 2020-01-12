---
title: Purely Functional UI
date: January 12, 2020
draft: true
---

I've lost count of the number of times that I've redesigned [Moon](https://moonjs.org)'s API. Every single iteration felt incomplete. Little inconsistencies here and there would leave the perfectionist in me unsatisfied.

Other libraries had conditioned me to lean towards similar designs. The mental model that came with React or Vue always found its way into Moon. So over a week, I erased everything I knew about user interfaces and tried to create something from scratch.

That week quickly grew philosophical as I questioned modern UI development:

* _Why is view a function of state?_
* _Why do we need components?_
* _Why do components have local state?_
* _If the view is a function of state, what about other effects?_

Popular UI libraries treat views as functions of state, but UIs aren't just states and views. They're everything: mapping inputs from the user to outputs on the computer.

A UI can take information from the mouse, keyboard, webcam, or mic. After processing this data, it can output to the screen, speakers, network, or hard drive.

With this definition, UI becomes a pure function.

```
ui(sensory input from computer) = output for computer to do
```

Four years of reiterating on Moon with complex API rewrites led to this idea. In hindsight, it seems obvious; represent UI as a function. But this patency suggests that functions are a natural way of defining UIs.
