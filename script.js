// ========== GALLERY PHOTOS DATA ==========
// 👇 ONLY EDIT THIS ARRAY - NOTHING ELSE!
// To ADD a photo: add a new object to the array
// To REMOVE a photo: delete the object from the array
// To EDIT: change title, description, or image path
// Start with EMPTY array - no default photos

const galleryPhotosData = [
  {
    id: 1,
    title: "Fascia & Soffit",
    description: "",
    image: "images/Soffit-Fascia.jpg"
  }
];

// ========== DECORATOR PATTERN IMPLEMENTATION ==========

// Base Gallery Component
class BaseGallery {
  constructor() {
    this.photos = [];
  }
  
  getPhotos() {
    return this.photos;
  }
  
  setPhotos(photos) {
    this.photos = [...photos];
  }
  
  addPhoto(photo) {
    this.photos.push(photo);
  }
  
  removePhoto(photoId) {
    this.photos = this.photos.filter(p => p.id !== photoId);
  }
}

// Decorator: Adds filtering capability
class FilterableGallery {
  constructor(gallery) {
    this.gallery = gallery;
  }
  
  getPhotos() {
    return this.gallery.getPhotos();
  }
  
  filterByKeyword(keyword) {
    return this.gallery.getPhotos().filter(photo => 
      photo.title.toLowerCase().includes(keyword.toLowerCase()) ||
      photo.description.toLowerCase().includes(keyword.toLowerCase())
    );
  }
}

// Decorator: Adds sorting capability
class SortableGallery {
  constructor(gallery) {
    this.gallery = gallery;
  }
  
  getPhotos() {
    return this.gallery.getPhotos();
  }
  
  sortByNewest() {
    return [...this.gallery.getPhotos()].sort((a, b) => b.id - a.id);
  }
  
  sortByOldest() {
    return [...this.gallery.getPhotos()].sort((a, b) => a.id - b.id);
  }
  
  sortByTitle() {
    return [...this.gallery.getPhotos()].sort((a, b) => 
      a.title.localeCompare(b.title)
    );
  }
  
  resetOrder() {
    return [...this.gallery.getPhotos()].sort((a, b) => a.id - b.id);
  }
}

// Initialize gallery with data
const baseGallery = new BaseGallery();
galleryPhotosData.forEach(photo => baseGallery.addPhoto(photo));

// Apply decorators
const filterableGallery = new FilterableGallery(baseGallery);
const sortableGallery = new SortableGallery(baseGallery);

// Current display photos
let currentPhotos = [...baseGallery.getPhotos()];

// ========== RENDER FUNCTIONS ==========

function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  const sortContainer = document.getElementById('sortContainer');
  
  if (!grid) return;
  
  if (currentPhotos.length === 0) {
    // Hide sort dropdown when no photos
    if (sortContainer) {
      sortContainer.style.display = 'none';
    }
    
    // Show "No photos yet" message
    grid.innerHTML = `
      <div style="text-align: center; padding: 80px 20px; grid-column: 1 / -1;">
        <div style="font-size: 5rem; margin-bottom: 20px;">📸</div>
        <h3 style="color: #02093f; margin-bottom: 10px; font-size: 1.8rem;">No Photos Yet</h3>
        <p style="color: #666; max-width: 400px; margin: 0 auto;">Check back soon to see our latest work and projects!</p>
      </div>
    `;
    return;
  }
  
  // Show sort dropdown when photos exist
  if (sortContainer) {
    sortContainer.style.display = 'block';
  }
  
  grid.innerHTML = currentPhotos.map(photo => `
    <div class="gallery-item" onclick="openLightbox('${photo.image}', '${escapeHtml(photo.title)}')">
      <img src="${photo.image}" alt="${photo.title}" loading="lazy" onerror="this.src='https://placehold.co/600x400/e2e8f0/02093f?text=Image+Not+Found'">
      <div class="gallery-info">
        <h3>${escapeHtml(photo.title)}</h3>
        <p>${escapeHtml(photo.description || '')}</p>
      </div>
    </div>
  `).join('');
}

// ========== SORT FUNCTIONS ==========

function sortByNewest() {
  currentPhotos = sortableGallery.sortByNewest();
  renderGallery();
}

function sortByOldest() {
  currentPhotos = sortableGallery.sortByOldest();
  renderGallery();
}

function sortByTitle() {
  currentPhotos = sortableGallery.sortByTitle();
  renderGallery();
}

function resetGalleryOrder() {
  currentPhotos = sortableGallery.resetOrder();
  renderGallery();
}

// Handle sort dropdown
function handleSort(value) {
  if (value === 'newest') {
    sortByNewest();
  } else if (value === 'oldest') {
    sortByOldest();
  } else if (value === 'title') {
    sortByTitle();
  } else {
    resetGalleryOrder();
  }
}

// ========== LIGHTBOX FUNCTIONS ==========

window.openLightbox = function(imageSrc, title) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  if (lightbox && lightboxImg) {
    lightboxImg.src = imageSrc;
    lightboxImg.alt = title;
    lightbox.classList.add('active');
  }
};

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
  }
}

// ========== HELPER FUNCTIONS ==========

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ========== INITIALIZATION ==========

function initGallery() {
  if (document.getElementById('galleryGrid')) {
    renderGallery();
    
    // Sort dropdown listener
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        handleSort(e.target.value);
      });
    }
    
    // Lightbox event listeners
    const closeLightboxBtn = document.querySelector('.close-lightbox');
    const lightbox = document.getElementById('lightbox');
    
    if (closeLightboxBtn) {
      closeLightboxBtn.addEventListener('click', closeLightbox);
    }
    
    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });
    }
    
    console.log('Inalyze Property — Gallery loaded with Decorator Pattern!');
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGallery);
} else {
  initGallery();
}

// ========== MAIN HOMEPAGE FUNCTIONALITY ==========
(function() {
  // Get all navigation links
  const navLinks = document.querySelectorAll('.nav-option, .contact-btn');
  const sections = ['home', 'services', 'about', 'reviews', 'contact'];
  
  // Function to update active link based on scroll position
  function updateActiveSection() {
    let currentSection = '';
    const scrollPosition = window.scrollY + 120;
    
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
    
    if (!currentSection && window.scrollY < 150) {
      currentSection = 'home';
    }
    
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
      if (href && href.startsWith('#') && href !== '#') {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          history.pushState(null, null, href);
        }
      }
    });
  });
  
  // Navbar scroll effect
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
    
    if (window.location.hash && window.location.hash !== '#') {
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
  } else if (serviceCards.length) {
    serviceCards.forEach(card => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
  }
  
  console.log('Inalyze Property — Website loaded with fixed navbar and active section highlighting!');
})();