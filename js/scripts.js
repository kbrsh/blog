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
