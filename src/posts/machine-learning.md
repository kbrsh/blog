---
title: Machine Learning
date: April 29, 2017
order: 2
---

Artificial Intelligence is a topic that has been attracting a lot of interest from people lately, myself included. Around 6 months ago, I became interested in machine learning, specifically neural networks. There are a couple great lectures from Stanford, and some nice articles out there that explain the topic nicely.

Nonetheless, most of them included complex mathematic notations and often used a machine learning framework to show code samples. While the frameworks are great, they I think it is just as important to know what exactly goes on under the hood.

This will be a series of blog posts set to help you understand how machine learning works, and have the code to go with it. The code samples will use Python, with NumPy. NumPy allows for complex math operations to be extremely simple in code, and is not specifically for machine learning. We will be using it for matrix multiplication, dot products, etc.

## What is Machine Learning?

Machine learning essentially allows for a machine to learn patterns between certain items without any of it having to be hard-coded or specified. The machine itself learns these patterns as it trains.

The flexibility of machine learning allows it to be used for a variety of topics. They are used to solve problems such as **classification** and **regression** problems.

I'll use an example of emails and spam to explain these two types of problems.

Classification problems are problems in which an input is taken in, and it is classified into a certain group.

![Classification Visual](../img/machine-learning/classification.svg)

Regression problems are problems in which an input is taken in, and there is an output that doesn't correspond to a group.

![Regression Visual](../img/machine-learning/regression.svg)

There are also **two types of learning** methods: supervised and unsupervised.

Supervised learning is when you have a set of inputs and outputs, and you train the machine on that. Unsupervised learning is when you only have a set of inputs, and you train the machine to find patterns between them.

## Feedforward Neural Networks

One method of machine learning is to use a **Feedforward Neural Network**. They work by:

* Taking an input (a 2D array of numbers)
* Multiplying the input by a certain set of weights
* Applying an **activation function**
* Returning an output

Those **weights** are where the magic happens. The neural network has to find the perfect set of weights to get the desired output, after starting with a random set of weights. The act of multiplying the inputs by the weights to form an output is **forward propagation**, as you are moving the inputs through the network. The activation function is just a function that can squash a value between a certain range, it introduces **nonlinearity** into the model.

The multiplication of the inputs to weights to convert it into the shape of the output is a **dot product**.

In terms of math, we are doing the following:

<script type="math/tex">activation((X W_h) + b_h)</script>

Where <script type="math/tex">X</script> is the input, <script type="math/tex">W_h</script> is the set of weights, and <script type="math/tex">b_h</script> is the bias.

#### How does a neural network find the perfect weights?

We have a random set of weights initially, and we need to get them to the perfect place, where all of our inputs passed through the network are equal to their corresponding outputs.

First, we need a way to see how far our network was. We can do that by using a **loss function**. We'll use the **mean sum squared** loss function, represented mathematically as:

<script type="math/tex">0.5\sum (o - y)^2</script>

Where <script type="math/tex">o</script> is the output of our network, and <script type="math/tex">y</script> is the target output.

Now that he have a loss function, we need to find a way to get it to equal 0. This is the same as finding the derivative of the loss function with respect to the weights. This allows us adjust the weights in the correct way in order to lower the loss.

Let's visualize this by graphing a range of weights and their corresponding loss.

![Weight to Loss Visual](../img/machine-learning/weightToLoss.svg)

If we find the derivative of the loss function with respect to the weights, we can find our way downhill from where we are, and move a little closer to our goal: having a loss of 0.

For simplicity, let's have a simple function that takes some input <script type="math/tex">X</script> and returns it multiplied by a weight <script type="math/tex">w</script>.

<script type="math/tex">f(x, y) = x y</script>


## The Problem

Let's begin writing a program that will use supervised machine learning to solve a problem.

<script src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>