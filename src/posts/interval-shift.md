---
title: Interval Shift
date: January 21, 2018
order: 7
math: true
---

Many programs require a mathematical function capable of shifting an interval of numbers linearly onto another interval. A `$\mathit{shift}$` function maps one interval linearly onto another.

```math
\mathit{shift}(x):[a,b]\to[c,d] \\
\mathit{shift}(x) = \frac{d - c}{b - a}(x - a) + c
```

### Example

The interval `$[0, 10]$` can be mapped to `$[0, 100]$` using `$\mathit{shift}$`.

```math
\begin{align}
  \mathit{shift}(x) & = 10x \\
  \\
  \mathit{shift}(0) & = 0 \\
  \mathit{shift}(10) & = 100
\end{align}
```

### Derivation

The `$\mathit{shift}$` function can be thought of as a linear function that passes through the points `$(a,c)$` and `$(b,d)$`. This means that the function should map `$a$` to `$c$` and `$b$` to `$d$`.

```math
\begin{align}
  \mathit{shift}(a) & = c \\
  \mathit{shift}(b) & = d
\end{align}
```

With two points the slope can be obtained and the function can be written and simplified.

```math
\begin{align}
  \mathit{shift}(x) - c & = \frac{d - c}{b - a}(x - a) \\
  \mathit{shift}(x) & = \frac{d - c}{b - a}(x - a) + c
\end{align}
```

The function can be verified to ensure a correct mapping of `$a$` to `$c$`.

```math
\begin{align}
  \mathit{shift}(a) &= \frac{d - c}{b - a}(a - a) + c \\
  \mathit{shift}(a) &= c
\end{align}
```

The same can be done to ensure `$b$` maps to `$d$`.

```math
\begin{align}
  \mathit{shift}(b) &= \frac{d - c}{b - a}(b - a) + c \\
  \mathit{shift}(b) &= d - c + c \\
  \mathit{shift}(b) &= d
\end{align}
```
