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
