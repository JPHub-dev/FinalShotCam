
const faqItems = document.querySelectorAll('.faq-item');
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach((question) => {
  question.addEventListener('click', () => {
    const faqItem = question.parentElement;
    
    // Close all other items
    faqItems.forEach((item) => {
      if (item !== faqItem) {
        item.classList.remove('open');
      }
    });
    
    // Toggle current item
    faqItem.classList.toggle('open');
  });
});

// ============================================
// TESTIMONIALS CAROUSEL
// ============================================

let currentTestimonialIndex = 0;
const testimonialItems = document.querySelectorAll('.testimonial-item');
const dotsContainer = document.querySelectorAll('.dot');
const totalTestimonials = testimonialItems.length;

function showTestimonial(index) {
  // Remove active class from all items and dots
  testimonialItems.forEach((item) => {
    item.classList.remove('active');
  });
  dotsContainer.forEach((dot) => {
    dot.classList.remove('active');
  });
  
  // Add active class to current item and dot
  testimonialItems[index].classList.add('active');
  dotsContainer[index].classList.add('active');
}

function nextTestimonial() {
  currentTestimonialIndex = (currentTestimonialIndex + 1) % totalTestimonials;
  showTestimonial(currentTestimonialIndex);
}

// Auto-rotate testimonials every 6 seconds
let testimonialInterval = setInterval(nextTestimonial, 6000);

// Manual dot navigation
dotsContainer.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    clearInterval(testimonialInterval);
    currentTestimonialIndex = index;
    showTestimonial(currentTestimonialIndex);
    
    // Restart auto-rotation
    testimonialInterval = setInterval(nextTestimonial, 6000);
  });
});

// Initialize first testimonial
showTestimonial(0);

// ============================================
// SMOOTH SCROLL BEHAVIOR
// ============================================

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  });
});

// ============================================
// PAGE ANIMATIONS ON SCROLL
// ============================================

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
  }
);

// Observe all sections
document.querySelectorAll('.best-photobooth, .faq, .testimonials').forEach((section) => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(30px)';
  section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(section);
});

// ============================================
// HEADER ACTIVE LINK MANAGEMENT
// ============================================

const navLinks = document.querySelectorAll('.nav a');
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

navLinks.forEach((link) => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});

// ============================================
// CARD ANIMATION ON HOVER
// ============================================

const cards = document.querySelectorAll('.card');

cards.forEach((card) => {
  card.addEventListener('mouseenter', () => {
    cards.forEach((c) => {
      if (c !== card) {
        c.style.opacity = '0.7';
        c.style.transform = 'scale(0.95)';
      }
    });
  });

  card.addEventListener('mouseleave', () => {
    cards.forEach((c) => {
      c.style.opacity = '1';
      c.style.transform = 'scale(1)';
    });
  });
});

// ============================================
// ADD TRANSITION STYLES DYNAMICALLY
// ============================================

const style = document.createElement('style');
style.textContent = `
  .card {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
`;
document.head.appendChild(style);

console.log('About page script loaded successfully!');
