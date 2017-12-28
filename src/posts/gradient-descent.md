---
title: Gradient Descent
date: Draft
order: 7
math: true
draft: true
---

Neural networks work by getting a set of inputs, multiplying them by a set of weights, and then returning an output. At first, the weights are initialized with random values. Eventually, the neural network refines the weights so that it can return a plausible output for a given input.

A neural network uses a _loss function_ to find how wrong the output was. The goal of the network is to change the weights in such a way that the loss function returns an output close to zero. A low loss value means that the output for all inputs was incredibly close to the expected output for the inputs.

A method called _gradient descent_ is often used to refine ("train") the weights so that the loss value gradually becomes smaller.

### Two Variables

Instead of jumping right into a 500-dimensional gradient descent example, let's start out with a simple function that uses two variables, where `$x$` is the input, and `$w$` is the weight.

```math
f(x, w) = xw
```

Looking at this, it is fairly straightforward to find how changing `$x$` by one changes the output by `$w$`, and how changing `$w$` by one changes the output by `$x$`.
