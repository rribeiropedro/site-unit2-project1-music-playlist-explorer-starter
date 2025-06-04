const modal = document.getElementsByClassName("modal-overlay")[0];
const span = document.getElementsByClassName("close")[0];

span.onclick = function() {
   modal.style.display = "none";
}