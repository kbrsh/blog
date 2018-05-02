---
title: Gradient Descent
date: January 1, 2018
order: 8
math: true
draft: true
---

Neural networks work by receiving a set of inputs, multiplying them by a set of weights, and then returning an output. At first, the weights are initialized with random values. Over time, the neural network refines the weights so that it can return a plausible output for any input.

A neural network uses a _loss function_ to find how close a neural network output is to the target output. The goal of the network is to change the weights in such a way that the loss function returns an output close to zero. A low loss value means that the output for all inputs was incredibly close to the expected output for the inputs.

A method called _gradient descent_ is often used to refine ("train") the weights so that the loss value gradually becomes smaller.

### Two Variables

Instead of jumping right into a 1000-dimensional gradient descent example, let's start out with a simple function that uses two variables, where `$x$` is the input, and `$w$` is the weight.

```math
f(x, w) = xw
```

Let's say we want to optimize the weight in a way that gives an output of `$4$` when given an input of `$2$`. We want `$f(2, w) = 4$`. First, let's start out with a random weight `$1$`. Currently, our function gives us a wrong output.

```math
f(2, 1) = 2
```

To help solve this problem, we can define a _loss function_ that takes the output of the function and tells us the error in our output.

```math
l(x, w, t) = t - f(x, w)
```

It just gives us the difference between the target output `$t$` and the output of our function `$f$` given `$x$` and `$w$`. With the initial random weight of `$1$`, we can find the current loss. Remember, we want the output of the function to be `$4$` when given `$2$`.

```math
l(2, 1, 4) = 4 - 2 = 2
```

This makes sense, since increasing the output by `$2$` would get us our target output `$4$`. Now, we need to find a way to decrease the output of our loss function by changing `$w$`. To do this, we need to see how changes in `$w$` affect the loss function. Formally, seeing how one variable changes depending on another is called the _partial derivative_.

Finding _derivatives_ involves using a formula.

```math
\frac{df}{dx} = \lim_{h \to 0}\frac{f(x + h) - f(x)}{h}
```

1. `$\frac{df}{dx}$` represents the derivative of `$f$`. It can be thought of as how `$f(x)$` changes as `$x$` changes.
2. `$h$` is a variable that is infinitely small (approaching `$0$`)
3. `$\frac{f(x + h) - f(x)}{h}$` represents how the output of `$f$` changes as `$x$` is changed by `$h$`.

Finding _partial derivatives_ involves the same formula, but represents how the output of `$f$` changes as only _one_ variable changes while treating other variables as constants.

We can find the partial derivative of the loss function example with respect to `$w$` by substituting the function into the formula.

```math
\begin{align}
  \frac{\partial l}{\partial w} & = \lim_{h \to 0}\frac{l(x, w + h, t) - l(x, w, t)}{h} \\
  & = \lim_{h \to 0}\frac{(t - f(x, w + h)) - (t - f(x, w))}{h} \\
  & = \lim_{h \to 0}\frac{(t - x(w + h)) - (t - xw)}{h} \\
  & = \lim_{h \to 0}\frac{t - xw - xh - t + xw}{h} \\
  & = \lim_{h \to 0}\frac{-xh}{h} \\
  & = -x
\end{align}
```

Looking at this, we can see that as `$w$` changes, `$l(x, w, t)$` changes by `$-x$`. We can use this information to change `$w$` by _the opposite_ of the partial derivative, `$x$`, to get a lower value.

```math
r = 0.1 \\
w \leftarrow 1 \\
l(2, w, 4) = 4 - 2(1) = 2 \\
\\
w \leftarrow w + rx \leftarrow 1 + 0.1(2) \leftarrow 1.2 \\
l(2, w, 4) = 4 - 2(1.2) = 1.6
```
