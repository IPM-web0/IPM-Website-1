(function() {
  // Get all navigation links
  const navLinks = document.querySelectorAll('.nav-option, .contact-btn');
  const sections = ['home', 'services', 'about', 'reviews', 'contact'];
  
  // Function to update active link based on scroll position
  function updateActiveSection() {
    let currentSection = '';
    const scrollPosition = window.scrollY + 120; // Offset for fixed navbar
    
    // Check which section is currently in view
    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const offsetTop = element.offsetTop;
        const offsetBottom = offsetTop + element.offsetHeight;
        
        if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
          currentSection = section;
          break;
        }
      }
    }
    
    // If no section found and near the top, default to home
    if (!currentSection && window.scrollY < 150) {
      currentSection = 'home';
    }
    
    // Update active class on navigation links
    navLinks.forEach(link => {
      const linkSection = link.getAttribute('data-section');
      if (linkSection === currentSection) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  
  // Add data-section attributes to navigation links
  const homeLink = document.querySelector('a[href="#home"]');
  const servicesLink = document.querySelector('a[href="#services"]');
  const aboutLink = document.querySelector('a[href="#about"]');
  const reviewsLink = document.querySelector('a[href="#reviews"]');
  const contactLink = document.querySelector('a[href="#contact"]');
  
  if (homeLink) homeLink.setAttribute('data-section', 'home');
  if (servicesLink) servicesLink.setAttribute('data-section', 'services');
  if (aboutLink) aboutLink.setAttribute('data-section', 'about');
  if (reviewsLink) reviewsLink.setAttribute('data-section', 'reviews');
  if (contactLink) contactLink.setAttribute('data-section', 'contact');
  
  // Smooth scroll for navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Update URL without jumping
          history.pushState(null, null, href);
        }
      }
    });
  });
  
  // Navbar scroll effect - shrinks navbar when scrolling down
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', function() {
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    updateActiveSection();
  });
  
  // Initialize on page load
  window.addEventListener('load', function() {
    updateActiveSection();
    
    // If there's a hash in URL, scroll to that section
    if (window.location.hash) {
      const targetElement = document.querySelector(window.location.hash);
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  });
  
  // Contact form submission handler
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const nameInput = document.getElementById('formName');
      const emailInput = document.getElementById('formEmail');
      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      
      if (name === '' || email === '') {
        if (formFeedback) {
          formFeedback.textContent = '⚠️ Please enter both name and email address.';
          formFeedback.style.color = '#FFD966';
          setTimeout(() => {
            if (formFeedback) formFeedback.textContent = '';
          }, 3000);
        }
        return;
      }
      
      if (formFeedback) {
        formFeedback.textContent = '✅ Thank you! A member of our team will contact you shortly.';
        formFeedback.style.color = '#c8f0c1';
      }
      
      contactForm.reset();
      
      setTimeout(() => {
        if (formFeedback) formFeedback.textContent = '';
      }, 4000);
    });
  }
  
  // Hover effect for badges
  const badges = document.querySelectorAll('.badge-item');
  badges.forEach(badge => {
    badge.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.02)';
      this.style.transition = '0.2s';
    });
    badge.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });
  
  // Intersection Observer for service cards animation
  const serviceCards = document.querySelectorAll('.service-card');
  if (serviceCards.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    serviceCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      observer.observe(card);
    });
  } else {
    serviceCards.forEach(card => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
  }
  
  console.log('Inalyze Property — Website loaded with fixed navbar and active section highlighting!');
})();