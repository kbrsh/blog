---
title: Gradient Descent
date: November 1, 2017
order: 7
---

Neural networks work by getting a set of inputs, multiplying them by a set of weights, and then returning an output. At first, the weights are initialized with random values. Eventually, the neural network refines the weights so that it can return a plausible output for a given input.

A neural network uses a _loss function_ to find how wrong the output was. The goal of the network is to change the weights in such a way that the loss function returns an output close to zero. A low loss value means that the output for all inputs was incredibly close to the expected output for the inputs.

A method called _gradient descent_ is often used to refine ("train") the weights so that the loss value gradually becomes smaller.
