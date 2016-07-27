---
title: Centering In CSS
description: We all need to center in CSS, but how?
---

Hello everyone, today I will be showing you multiple ways to center in CSS. We all need to center things in CSS at some point, but how?

There is no built in support for centering in CSS, sadly, but there are some ways to do it. I will be talking about two ways to do it.

### #1: Flexbox

Using flexbox will provide clean, hack-free CSS to center elements, the only downside is browser support, don't use this if you need to support users with IE 10 and below.

Say you have the following HTML:
```html
<div class="center">
    <h1>I'm Centered!</h1>
</div>
```

You need to center everything **within** the `div`. So you would apply the following styles to the **parent element**. Which is `.center` in this case.

```css
.center {
   display: flex; /* activates the power of flexbox */
   align-items: center; /* align items vertically */
   justify-content: center; /* align items horizontally */
}
```

That should do the trick 👊
