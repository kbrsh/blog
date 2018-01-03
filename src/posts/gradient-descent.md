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

Looking at this, it is fairly straightforward to find how changing `$x$` by one changes the output by `$w$`, and how changing `$w$` by one changes the output by `$x$`. Formally, seeing how one variable changes depending on another is called the _partial derivative_.

Finding _derivatives_ involves using a formula.

```math
\frac{df}{dx} = \lim_{h \to 0}\frac{f(x + h) - f(x)}{h}
```

1. `$\frac{df}{dx}$` represents the derivative of `$f$`. It can be thought of as how `$f(x)$` changes as `$x$` changes.
2. `$h$` is a variable that is infinitely small (approaching `$0$`)
3. `$\frac{f(x + h) - f(x)}{h}$` represents how the output of `$f$` changes as `$x$` is changed by `$h$`.

Finding _partial derivatives_ involves the same formula, but represents how the output of `$f$` changes as only _one_ variable changes while treating other variables as constants.

We can find the partial derivative of of the two variable example with respect to `$w$` by substituting the function into the formula.

```math
\begin{align}
  \frac{df}{dw} & = \lim_{h \to 0}\frac{f(x, w + h) - f(x, w)}{h} \\
  & = \lim_{h \to 0}\frac{x(w + h) - xw}{h} \\
  & = \lim_{h \to 0}\frac{xw + xh - xw}{h} \\
  & = \lim_{h \to 0}\frac{xh}{h} \\
  & = x
\end{align}
```

Looking at this, we can see that as `$w$` changes, `$f(x, w)$` changes by `$x$`. We can use this information to change `$w$` to get lower and higher outputs as we please.
