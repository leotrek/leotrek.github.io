(() => {
  "use strict";

  const body = document.body;
  const header = document.querySelector("#header");
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");
  const scrollTop = document.querySelector(".scroll-top");
  const preloader = document.querySelector("#preloader");
  const navLinks = Array.from(document.querySelectorAll(".navmenu a"));

  function hasStickyHeader() {
    return !!(
      header &&
      (header.classList.contains("scroll-up-sticky") ||
        header.classList.contains("sticky-top") ||
        header.classList.contains("fixed-top"))
    );
  }

  function toggleScrolled() {
    if (!hasStickyHeader()) {
      return;
    }

    body.classList.toggle("scrolled", window.scrollY > 100);
  }

  function toggleMobileNav() {
    if (!mobileNavToggleBtn) {
      return;
    }

    body.classList.toggle("mobile-nav-active");
    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
  }

  function toggleScrollTop() {
    if (!scrollTop) {
      return;
    }

    scrollTop.classList.toggle("active", window.scrollY > 100);
  }

  function initAOS() {
    if (!window.AOS) {
      return;
    }

    window.AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }

  function restoreHashScroll() {
    if (!window.location.hash) {
      return;
    }

    const section = document.querySelector(window.location.hash);

    if (!section) {
      return;
    }

    const scrollMarginTop = parseInt(getComputedStyle(section).scrollMarginTop, 10) || 0;

    window.scrollTo({
      top: section.offsetTop - scrollMarginTop,
      behavior: "smooth",
    });
  }

  function navmenuScrollspy() {
    const position = window.scrollY + 200;

    navLinks.forEach((link) => {
      if (!link.hash) {
        return;
      }

      const section = document.querySelector(link.hash);

      if (!section) {
        link.classList.remove("active");
        return;
      }

      const isActive =
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight;

      link.classList.toggle("active", isActive);
    });
  }

  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener("click", toggleMobileNav);
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (body.classList.contains("mobile-nav-active")) {
        toggleMobileNav();
      }
    });
  });

  if (scrollTop) {
    scrollTop.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  window.addEventListener("load", () => {
    toggleScrolled();
    toggleScrollTop();
    initAOS();
    setTimeout(restoreHashScroll, 100);
    navmenuScrollspy();
  });

  document.addEventListener("scroll", () => {
    toggleScrolled();
    toggleScrollTop();
    navmenuScrollspy();
  });
})();
