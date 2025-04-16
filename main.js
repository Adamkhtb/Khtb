// Close mobile popup
function closePopup() {
    document.getElementById("popup").style.display = "none";
  }
  
  // Close the "You're already here!" popup
  function closeHerePopup() {
    document.getElementById("here-popup").style.display = "none";
  }
  
  // Show mobile popup if screen is narrow
  window.addEventListener("load", () => {
    if (window.innerWidth < 1024) {
      document.getElementById("popup").style.display = "flex";
    }
  });
  
  const previewContainer = document.getElementById("image-preview");
  const squareOverlay = document.querySelector(".square-overlay");
  
  // Project hover and click behavior
  document.querySelectorAll(".project").forEach((project) => {
    project.addEventListener("mouseover", (e) => {
      const gif = project.getAttribute("data-image");
      if (gif) {
        previewContainer.innerHTML = `<img src="${gif}" alt="preview">`;
        previewContainer.style.display = "flex";
        squareOverlay.style.display = "none"; // Hide squares
      }
    });
  
    project.addEventListener("mouseout", () => {
      previewContainer.style.display = "none";
      squareOverlay.style.display = "block"; // Show squares again
    });
  
    project.addEventListener("click", () => {
      const isSelf = project.getAttribute("data-self");
      const link = project.getAttribute("data-link");
  
      if (isSelf) {
        // Show the custom styled popup
        document.getElementById("here-popup").style.display = "flex";
      } else if (link) {
        window.location.href = link;
      }
    });
  });
  
  // Header shrink on scroll
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
  
  // Grayscale toggle for picture
  $(".change-btn").click(function () {
    $(".picture img").toggleClass("grayscale");
  });
  

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("here-popup").style.display = "none";
  });
  