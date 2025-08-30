(() => {
  "use strict";

  const forms = document.querySelectorAll('.needs-validation')

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

if (taxSwitch) {
  taxSwitch.addEventListener("click", () => {
    let taxInfo = document.getElementsByClassName("tax-info");
    for (info of taxInfo) {
      if (info.style.display != "inline") {
        info.style.display = "inline";
      } else {
        info.style.display = "none";
      }
    }
  });
}


const filters = document.getElementById("filters");

if (filters) {
    const scrollLeftBtn = document.querySelector(".scroll-left");
    const scrollRightBtn = document.querySelector(".scroll-right");

    scrollLeftBtn.addEventListener("click", () => {
        filters.scrollBy({ left: -150, behavior: "smooth" });
    });

    scrollRightBtn.addEventListener("click", () => {
        filters.scrollBy({ left: 150, behavior: "smooth" });
    });

    
    function updateScrollButtons() {
        const scrollLeft = filters.scrollLeft;
        const scrollWidth = filters.scrollWidth;
        const clientWidth = filters.clientWidth;

        if (scrollLeft <= 0) {
            scrollLeftBtn.style.display = "none";
        } else {
            scrollLeftBtn.style.display = "block";
        }

        if (scrollLeft + clientWidth >= scrollWidth - 1) {
            scrollRightBtn.style.display = "none";
        } else {
            scrollRightBtn.style.display = "block";
        }
    }

    filters.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("load", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);
}
