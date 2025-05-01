document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  const currentPath = window.location.pathname.split("/").pop();

  navLinks.forEach((link) => {
    const linkPath = link.getAttribute("href");
    if (linkPath === currentPath) {
      link.classList.add("active", "border-bottom", "border-warning");
    } else {
      link.classList.remove("active", "border-bottom", "border-warning");
    }
  });
});
