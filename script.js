// ========== MAIN HOMEPAGE FUNCTIONALITY ==========
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
  
  // Smooth scroll for navigation links (only for # links on homepage)
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#') && href !== '#') {
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
    if (window.location.hash && window.location.hash !== '#') {
      const targetElement = document.querySelector(window.location.hash);
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  });
  
  // Contact form submission handler (only if form exists on page)
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
  
  // Hover effect for badges (only if badges exist)
  const badges = document.querySelectorAll('.badge-item');
  if (badges.length) {
    badges.forEach(badge => {
      badge.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
        this.style.transition = '0.2s';
      });
      badge.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
      });
    });
  }
  
  // Intersection Observer for service cards animation (only if cards exist)
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
  } else if (serviceCards.length) {
    serviceCards.forEach(card => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
  }
  
  console.log('Inalyze Property — Homepage loaded with fixed navbar and active section highlighting!');
})();

// ========== GALLERY PAGE FUNCTIONS ==========
(function() {
  // Gallery management with localStorage (easy for admin to add photos)
  let galleryPhotos = [];

  // Load photos from localStorage
  function loadGalleryPhotos() {
    const saved = localStorage.getItem('galleryPhotos');
    if (saved) {
      galleryPhotos = JSON.parse(saved);
    } else {
      // Default sample photos
      galleryPhotos = [
        { id: 1, title: "Driveway Pressure Washing", description: "Before and after showing amazing results", image: "https://placehold.co/600x400/e2e8f0/02093f?text=Driveway+Cleaning" },
        { id: 2, title: "House Exterior Wash", description: "Complete house refresh", image: "https://placehold.co/600x400/e2e8f0/02093f?text=House+Washing" },
        { id: 3, title: "Deck Restoration", description: "Like new deck after our treatment", image: "https://placehold.co/600x400/e2e8f0/02093f?text=Deck+Cleaning" },
        { id: 4, title: "Window Cleaning", description: "Streak-free crystal clear windows", image: "https://placehold.co/600x400/e2e8f0/02093f?text=Window+Cleaning" },
        { id: 5, title: "Gutter Cleaning", description: "Clean gutters for proper drainage", image: "https://placehold.co/600x400/e2e8f0/02093f?text=Gutter+Service" },
        { id: 6, title: "Lawn Care", description: "Perfectly manicured lawn", image: "https://placehold.co/600x400/e2e8f0/02093f?text=Lawn+Care" }
      ];
      saveGalleryPhotos();
    }
    renderGallery();
  }

  function saveGalleryPhotos() {
    localStorage.setItem('galleryPhotos', JSON.stringify(galleryPhotos));
  }

  function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    
    grid.innerHTML = galleryPhotos.map(photo => `
      <div class="gallery-item" onclick="openGalleryLightbox('${photo.image}', '${photo.title}')">
        <img src="${photo.image}" alt="${photo.title}" loading="lazy">
        <div class="gallery-info">
          <h3>${escapeHtml(photo.title)}</h3>
          <p>${escapeHtml(photo.description || '')}</p>
        </div>
      </div>
    `).join('');
  }

  window.openGalleryLightbox = function(imageSrc, title) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    if (lightbox && lightboxImg) {
      lightboxImg.src = imageSrc;
      lightboxImg.alt = title;
      lightbox.classList.add('active');
    }
  };

  function closeGalleryLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
      lightbox.classList.remove('active');
    }
  }

  // Add new photo
  function addGalleryPhoto(title, description, imageData) {
    const newPhoto = {
      id: Date.now(),
      title: title,
      description: description,
      image: imageData
    };
    galleryPhotos.push(newPhoto);
    saveGalleryPhotos();
    renderGallery();
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Initialize gallery when on gallery page
  function initGallery() {
    // Check if we're on the gallery page
    if (document.getElementById('galleryGrid')) {
      loadGalleryPhotos();
      
      // Handle file upload
      const showUploadBtn = document.getElementById('showUploadBtn');
      const uploadForm = document.getElementById('uploadForm');
      const cancelUploadBtn = document.getElementById('cancelUploadBtn');
      const savePhotoBtn = document.getElementById('savePhotoBtn');
      
      if (showUploadBtn) {
        showUploadBtn.addEventListener('click', () => {
          if (uploadForm) {
            uploadForm.classList.toggle('active');
          }
        });
      }
      
      if (cancelUploadBtn) {
        cancelUploadBtn.addEventListener('click', () => {
          if (uploadForm) {
            uploadForm.classList.remove('active');
          }
          const photoTitle = document.getElementById('photoTitle');
          const photoDesc = document.getElementById('photoDesc');
          const photoFile = document.getElementById('photoFile');
          if (photoTitle) photoTitle.value = '';
          if (photoDesc) photoDesc.value = '';
          if (photoFile) photoFile.value = '';
        });
      }
      
      if (savePhotoBtn) {
        savePhotoBtn.addEventListener('click', () => {
          const titleInput = document.getElementById('photoTitle');
          const descInput = document.getElementById('photoDesc');
          const fileInput = document.getElementById('photoFile');
          
          const title = titleInput ? titleInput.value : '';
          const description = descInput ? descInput.value : '';
          const file = fileInput ? fileInput.files[0] : null;
          
          if (!title) {
            alert('Please enter a photo title');
            return;
          }
          
          if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
              addGalleryPhoto(title, description, e.target.result);
              if (uploadForm) uploadForm.classList.remove('active');
              if (titleInput) titleInput.value = '';
              if (descInput) descInput.value = '';
              if (fileInput) fileInput.value = '';
              alert('Photo added successfully!');
            };
            reader.readAsDataURL(file);
          } else {
            alert('Please select an image file');
          }
        });
      }
      
      // Lightbox event listeners
      const closeLightboxBtn = document.querySelector('.close-lightbox');
      const lightbox = document.getElementById('lightbox');
      
      if (closeLightboxBtn) {
        closeLightboxBtn.addEventListener('click', closeGalleryLightbox);
      }
      
      if (lightbox) {
        lightbox.addEventListener('click', (e) => {
          if (e.target === lightbox) closeGalleryLightbox();
        });
      }
      
      console.log('Inalyze Property — Gallery page loaded!');
    }
  }

  // Run gallery initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGallery);
  } else {
    initGallery();
  }
})();