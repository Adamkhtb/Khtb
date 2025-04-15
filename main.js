
function closePopup() {
    document.getElementById("popup").style.display = "none";
  }

  window.addEventListener("load", () => {
    if (window.innerWidth < 1024) { // Adjust breakpoint if needed
      document.getElementById("popup").style.display = "flex";
    }
  });


  const previewContainer = document.getElementById("image-preview");

  document.querySelectorAll(".project").forEach((project) => {
    project.addEventListener("mouseover", (e) => {
      const gif = e.target.getAttribute("data-image");
      if (gif) {
        previewContainer.innerHTML = `<img src="${gif}" alt="preview">`;
        previewContainer.style.display = "flex";
      }
    });

    project.addEventListener("mouseout", () => {
      previewContainer.style.display = "none";
    });
  });

  const leftScroll = document.getElementById("left");
  const header = document.getElementById("header");
  const footer = document.getElementById("footer");

  let headerTicking = false;
  let footerTicking = false;

  leftScroll.addEventListener("scroll", function () {
    if (!headerTicking) {
      window.requestAnimationFrame(function () {
        const threshold = 100;
        if (leftScroll.scrollTop > threshold) {
          header.classList.add("shrink");
        } else {
          header.classList.remove("shrink");
        }
        headerTicking = false;
      });
      headerTicking = true;
    }
  });

  leftScroll.addEventListener("scroll", function () {
    if (!footerTicking) {
      window.requestAnimationFrame(function () {
        const threshold = 100;
        if (leftScroll.scrollTop > threshold) {
          footer.classList.add("grow");
        } else {
          footer.classList.remove("grow");
        }
        footerTicking = false;
      });
      footerTicking = true;
    }
  });



  $(".change-btn").click(function(){
    $(".picture img").toggleClass("grayscale");
  });


