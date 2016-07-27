/* Nav */
document.querySelector('.button_container').addEventListener("click", function() {
   document.querySelector('.button_container').classList.toggle('active');
   document.querySelector('.overlay').classList.toggle('open');
 });

 var menuLinks = document.querySelectorAll(".menuLink");

 for(var i = 0; i < menuLinks.length; i++) {
   menuLinks[i].addEventListener("click", function() {
     document.querySelector('.button_container').classList.toggle('active');
     document.querySelector('.overlay').classList.toggle('open');
   });
 }

/* Random Highlight */
var pick=~~(Math.random()*359),
    tag=document.createElement('style'),
    style='::-moz-selection {color:white;text-shadow:rgba(0,0,0,.1)1px 2px 2px;background-color:hsl($pick,75%,50%)!important}::-webkit-selection{color:white;text-shadow:rgba(0,0,0,.1)1px 2px 2px;background-color:hsl($pick,75%,50%)!important}::selection{color:white;text-shadow:rgba(0,0,0,.1)1px 2px 2px;background-color:hsl($pick,75%,50%)!important}';
  tag.innerHTML=style.replace(/\$pick/g,pick);
  document.body.appendChild(tag);
  
  /* loader */
document.body.style.overflowY = "hidden"
setTimeout(function() {
  document.getElementById("loader").style.opacity = "0";
  document.body.style.overflowY = "auto"
  setTimeout(function() {
    document.getElementById("loader").style.display = "none";
  }, 750);
  // document.getElementById("loader").style.display = "none";
}, 750);