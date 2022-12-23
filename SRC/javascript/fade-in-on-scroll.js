// Get all elements with the "fade-in-on-scroll" class
const fadeInElements = document.querySelectorAll('.fade-in-on-scroll');

// Function to check if an element is in the viewport
const isElementInViewport = (el) => {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Function to fade in an element and translate it up
const fadeInAndTranslateUp = (el) => {
  // Set the element's initial state
  el.style.opacity = 0;
  el.style.transform = 'translateY(60px)';

  // Fade in the element and translate it up when it's in the viewport
  const fadeIn = () => {
    if (isElementInViewport(el)) {
      el.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
    }
  };

  // Check if the element is in the viewport on load and on scroll
  fadeIn();
  window.addEventListener('scroll', fadeIn);
};

// Asynchronously process all fade-in elements
fadeInElements.forEach(async (el) => {
  await fadeInAndTranslateUp(el);
});

// Check if any fade-in elements are in the viewport on page resize
window.addEventListener('resize', () => {
  fadeInElements.forEach((el) => {
    fadeInAndTranslateUp(el);
  });
});