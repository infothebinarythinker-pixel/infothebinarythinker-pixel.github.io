// Typing animation
const text = ["Future Teacher", "IT Enthusiast", "Curious Learner"];
let i = 0;
let j = 0;
let current = "";
let isDeleting = false;
const typingElement = document.querySelector(".typing");

function type() {
if (i < text.length) {
if (!isDeleting && j <= text[i].length) {
current = text[i].substring(0, j++);
typingElement.innerHTML = current;
}
if (isDeleting && j >= 0) {
current = text[i].substring(0, j--);
typingElement.innerHTML = current;
}
if (j == text[i].length) isDeleting = true;
if (j == 0 && isDeleting) {
isDeleting = false;
i++;
if (i == text.length) i = 0;
}
}
setTimeout(type, 100);
}
type();

// EmailJS
(function(){
emailjs.init("YOUR_PUBLIC_KEY");
})();

document.getElementById("contact-form").addEventListener("submit", function(e){
e.preventDefault();
emailjs.sendForm("YOUR_SERVICE_ID","YOUR_TEMPLATE_ID",this)
.then(function(){
alert("Message Sent Successfully!");
});
});