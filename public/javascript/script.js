(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add('was-validated');
    }, false);
  });
})();


let taxSwitch = document.getElementById("switchCheckDefault");
  taxSwitch.addEventListener("click", () =>{
    let taxInfo = document.getElementsByClassName("tax-info");
      for(info of taxInfo) {
        if(info.style.display != "inline"){
            info.style.display = "inline";
        } else {
            info.style.display = "none";
        }
      }
  });


const filters = document.getElementById("filters");
const scrollLeftBtn = document.querySelector(".scroll-left");
const scrollRightBtn = document.querySelector(".scroll-right");

// Scroll by clicking buttons
scrollLeftBtn.addEventListener("click", () => {
  filters.scrollBy({ left: -150, behavior: "smooth" });
});

scrollRightBtn.addEventListener("click", () => {
  filters.scrollBy({ left: 150, behavior: "smooth" });
});

// Function to update button visibility
function updateScrollButtons() {
  const scrollLeft = filters.scrollLeft;
  const scrollWidth = filters.scrollWidth;
  const clientWidth = filters.clientWidth;

  // Agar bilkul left me hai → Left button hide
  if (scrollLeft <= 0) {
    scrollLeftBtn.style.display = "none";
  } else {
    scrollLeftBtn.style.display = "block";
  }

  // Agar bilkul right me hai → Right button hide
  if (scrollLeft + clientWidth >= scrollWidth - 1) {
    scrollRightBtn.style.display = "none";
  } else {
    scrollRightBtn.style.display = "block";
  }
}

// Update on scroll
filters.addEventListener("scroll", updateScrollButtons);

// Update on load & resize
window.addEventListener("load", updateScrollButtons);
window.addEventListener("resize", updateScrollButtons);
