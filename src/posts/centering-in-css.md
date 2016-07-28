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

<br/>

### #2: Table

Using a table view will need a little more work than flexbox, but will support many more browsers. Including IE 6 and up! 👌

Say you have the following HTML:

```html
<div class="center">
    <div class="cell">
        <div class="content">
            <h1>I'm Centered!</h1>
        </div>
    </div>
</div>
```

Unlike flexbox, you will need three containers:

1) one on the outside, representing a `table`
2) a `cell` inside of of the `table`, this will be a `table-cell`
3) lastly, you will need a container for all of the content

Now, you can style them:

```css
.center {
    display: table; /* make it so .center acts like a table */
}

.cell {
    display: table-cell; /* make .cell act like a cell within the table */
    vertical-align: middle; /* align the cell vertically in the middle */
}

.content {
    margin-left: auto; /* the content's left side is auto (centering it) */
    margin-right: auto; /* the content's right side is auto (centering it) */
    text-align: center; /* align any other text items in the center (optional) */
}
```

<div id="disqus_thread"></div>
<script src="../../comments.js"></script>