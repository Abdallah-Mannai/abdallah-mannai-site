'use strict';

/**
 * UTILS
 */
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

/**
 * SIDEBAR (Mobile)
 */
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");
if (sidebarBtn) {
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
}

/**
 * FILTRAGE PORTFOLIO
 */
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-select-value]"); // Corrigé : selecct -> select
const filterBtn = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");

const applyFilter = function (btnText) {
  const categoryMap = {
    "all": "all",
    "tout": "all",
    "projets": "projects",
    "certifs": "certifications",
    "cyber": "cybersecurity",
    "réseaux": "networks",
    "systèmes": "systems"
  };

  const selectedCategory = categoryMap[btnText.toLowerCase().trim()] || "all";

  filterItems.forEach(item => {
    if (selectedCategory === "all" || item.dataset.category === selectedCategory) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

let lastClickedBtn = filterBtn[0];
filterBtn.forEach(btn => {
  btn.addEventListener("click", function () {
    if (selectValue) selectValue.innerText = this.innerText;
    applyFilter(this.innerText);
    if (lastClickedBtn) lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
});

if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });
}

selectItems.forEach(item => {
  item.addEventListener("click", function () {
    let selectedText = this.innerText;
    if (selectValue) selectValue.innerText = selectedText;
    elementToggleFunc(select);
    applyFilter(selectedText);
  });
});

/**
 * NAVIGATION DES PAGES (Correction de la logique d'index)
 */
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

navigationLinks.forEach(link => {
  link.addEventListener("click", function () {
    const btnText = this.innerText.toLowerCase().trim();
    
    // Mapping complet FR/EN
    const pageMap = {
      "à propos": "about", "about": "about",
      "parcours": "resume", "resume": "resume",
      "portfolio": "portfolio",
      "blog": "blog",
      "contact": "contact"
    };

    const targetId = pageMap[btnText] || btnText;

    // 1. Gérer l'état actif des liens de navigation
    navigationLinks.forEach(nav => nav.classList.remove("active"));
    this.classList.add("active");

    // 2. Gérer l'affichage des pages
    pages.forEach(page => {
      if (page.dataset.page === targetId) {
        page.classList.add("active");
        window.scrollTo(0, 0);
      } else {
        page.classList.remove("active");
      }
    });
  });
});

/**
 * GESTION DÉTAIL PORTFOLIO
 */
window.showProjectDetail = function(title, desc, img, tech, link = '', videoSrc = '') {
  const gridView = document.getElementById('portfolio-grid-view');
  const detailView = document.getElementById('project-detail-view');
  const imgElement = document.getElementById('detail-img');
  const videoElement = document.getElementById('detail-video');
  const linkElement = document.getElementById('detail-link');

  if (!gridView || !detailView) return;

  document.getElementById('detail-title').innerText = title;
  document.getElementById('detail-desc').innerHTML = desc;
  document.getElementById('detail-tech').innerText = "Stack : " + tech;

  if (videoSrc) {
    imgElement.style.display = 'none';
    videoElement.style.display = 'block';
    videoElement.src = videoSrc;
    videoElement.play();
  } else {
    videoElement.style.display = 'none';
    imgElement.style.display = 'block';
    imgElement.src = img;
  }

  if (linkElement) {
    linkElement.style.display = (link && link !== '#') ? 'flex' : 'none';
    linkElement.href = link;
  }

  gridView.style.display = 'none';
  detailView.style.display = 'block';
  window.scrollTo(0, 0);
}

// Variable globale pour gérer l'arrêt du timer
window.carouselTimer = null; 

window.showProjectDetailCarousel = function(title, desc, photos, tech, link = '') {
  const gridView = document.getElementById('portfolio-grid-view');
  const detailView = document.getElementById('project-detail-view');
  if (!gridView || !detailView) return;

  document.getElementById('detail-title').innerText = title;
  document.getElementById('detail-desc').innerHTML = desc;
  document.getElementById('detail-tech').innerText = 'Stack : ' + tech;

  const linkEl = document.getElementById('detail-link');
  if (linkEl) {
    linkEl.style.display = (link && link !== '#') ? 'inline-flex' : 'none';
    linkEl.href = link;
  }

  // Cacher img/video normaux, montrer carousel
  document.getElementById('detail-img').style.display = 'none';
  document.getElementById('detail-video').style.display = 'none';
  const carousel = document.getElementById('detail-carousel');
  carousel.style.display = 'block';

  // Init carousel
  let current = 0;
  const imgEl = document.getElementById('carousel-img');
  imgEl.style.transition = 'opacity 0.2s ease'; // Ajout de la transition ici
  const captionEl = document.getElementById('carousel-caption');
  const counterEl = document.getElementById('carousel-counter');

  function showSlide(index) {
    current = (index + photos.length) % photos.length;
    
    // On force l'opacité et l'affichage immédiat
    imgEl.style.transition = 'none'; 
    imgEl.style.opacity = '1';
    
    // Mise à jour de la source et des textes
    imgEl.src = photos[current].src;
    imgEl.alt = photos[current].caption;
    captionEl.textContent = photos[current].caption;
    counterEl.textContent = (current + 1) + ' / ' + photos.length;
  }

  showSlide(0);

  document.getElementById('carousel-prev').onclick = (e) => {
    e.stopPropagation();
    clearInterval(window.carouselTimer);
    showSlide(current - 1);
  };
  
  document.getElementById('carousel-next').onclick = (e) => {
    e.stopPropagation();
    clearInterval(window.carouselTimer);
    showSlide(current + 1);
  };

  // Nettoyer l'ancien timer avant d'en lancer un nouveau
  clearInterval(window.carouselTimer);
  // Défilement automatique toutes les 3 secondes
  window.carouselTimer = setInterval(() => showSlide(current + 1), 3000);

  gridView.style.display = 'none';
  detailView.style.display = 'block';
  window.scrollTo(0, 0);
}

// MISE À JOUR : On arrête le carrousel en quittant la vue
window.hideProjectDetail = function() {
  const videoElement = document.getElementById('detail-video');
  if (videoElement) {
    videoElement.pause();
    videoElement.src = "";
  }
  
  // Cacher le carrousel et stopper le défilement auto
  const carousel = document.getElementById('detail-carousel');
  if (carousel) carousel.style.display = 'none';
  clearInterval(window.carouselTimer);

  document.getElementById('portfolio-grid-view').style.display = 'block';
  document.getElementById('project-detail-view').style.display = 'none';
}

/**
 * GESTION DÉTAIL BLOG
 */
window.showBlogDetail = function(title, img, desc, tags, hasGallery = false, photos = []) {
  const gridView = document.getElementById('blog-grid-view');
  const detailView = document.getElementById('blog-detail-view');
  const imgElement = document.getElementById('blog-detail-img');
  const carouselElement = document.getElementById('blog-detail-carousel');

  if (!gridView || !detailView) return;

  document.getElementById('blog-detail-title').innerText = title;
  document.getElementById('blog-detail-desc').innerHTML = desc;
  document.getElementById('blog-detail-tags').innerText = "Tags : " + tags;

  if (photos && photos.length > 0) {
    // Mode carousel avec 3 images côte à côte
    imgElement.style.display = 'none';
    carouselElement.style.display = 'none';

    // Créer ou réutiliser le bloc galerie
    let gallery = document.getElementById('blog-photo-gallery');
    if (!gallery) {
      gallery = document.createElement('div');
      gallery.id = 'blog-photo-gallery';
      imgElement.parentNode.insertBefore(gallery, imgElement);
    }

    gallery.innerHTML = '';
    gallery.style.cssText = `
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      width: 100%;
    `;

    photos.forEach(photo => {
      const wrapper = document.createElement('div');
      wrapper.style.cssText = `
        position: relative;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid var(--jet);
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      `;

      const img = document.createElement('img');
      img.src = photo.src;
      img.alt = photo.caption;
      img.style.cssText = `
        width: 100%;
        height: 160px;
        object-fit: cover;
        display: block;
        transition: transform 0.3s ease;
      `;

      const caption = document.createElement('p');
      caption.textContent = photo.caption;
      caption.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,0.75);
        color: var(--orange-yellow-crayola);
        font-size: 11px;
        text-align: center;
        padding: 6px;
        margin: 0;
        transform: translateY(100%);
        transition: transform 0.3s ease;
      `;

      wrapper.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.08)';
        caption.style.transform = 'translateY(0)';
        wrapper.style.boxShadow = '0 0 15px hsla(45, 100%, 72%, 0.3)';
      });

      wrapper.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
        caption.style.transform = 'translateY(100%)';
        wrapper.style.boxShadow = 'none';
      });

      // Clic pour agrandir
      wrapper.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.style.cssText = `
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.9);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        `;
        const bigImg = document.createElement('img');
        bigImg.src = photo.src;
        bigImg.style.cssText = `
          max-width: 90vw;
          max-height: 90vh;
          border-radius: 12px;
          object-fit: contain;
        `;
        modal.appendChild(bigImg);
        modal.addEventListener('click', () => modal.remove());
        document.body.appendChild(modal);
      });

      wrapper.appendChild(img);
      wrapper.appendChild(caption);
      gallery.appendChild(wrapper);
    });

  } else {
    // Mode image simple
    let gallery = document.getElementById('blog-photo-gallery');
    if (gallery) gallery.style.display = 'none';
    imgElement.style.display = 'block';
    imgElement.src = img;
  }

  gridView.style.display = 'none';
  detailView.style.display = 'block';
  window.scrollTo(0, 0);
}

window.hideBlogDetail = function() {
  const gallery = document.getElementById('blog-photo-gallery');
  if (gallery) gallery.remove();
  document.getElementById('blog-grid-view').style.display = 'block';
  document.getElementById('blog-detail-view').style.display = 'none';
}

/**
 * FORMULAIRE DE CONTACT - EmailJS
 */
// Charger EmailJS
const emailjsScript = document.createElement('script');
emailjsScript.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
emailjsScript.onload = function() {
  emailjs.init('mXcdCxAf1AFQvh_ob');
};
document.head.appendChild(emailjsScript);

const contactForm = document.querySelector("#contact-form");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

if (contactForm) {
  formInputs.forEach(input => {
    input.addEventListener("input", function () {
      if (contactForm.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }
    });
  });

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const status = document.getElementById("form-status");

    formBtn.setAttribute("disabled", "");
    const originalBtnHTML = formBtn.innerHTML;
    formBtn.innerHTML = `<ion-icon name="sync-outline" class="rotate"></ion-icon> <span>Envoi...</span>`;

    const templateParams = {
      from_name: contactForm.querySelector('[name="fullname"]').value,
      from_email: contactForm.querySelector('[name="email"]').value,
      message: contactForm.querySelector('[name="message"]').value
    };

    emailjs.send('service_7oadz5h', 'template_anfzgzx', templateParams)
      .then(function() {
        if (status) {
          status.style.display = "block";
          status.innerText = "Merci ! Message bien reçu. 🎉";
        }
        contactForm.reset();
        formBtn.innerHTML = originalBtnHTML;
        formBtn.setAttribute("disabled", "");
      })
      .catch(function(error) {
        if (status) {
          status.style.display = "block";
          status.innerText = "Erreur d'envoi. Réessayez.";
          status.style.color = "red";
        }
        formBtn.innerHTML = originalBtnHTML;
        formBtn.removeAttribute("disabled");
        console.error('EmailJS error:', error);
      });
  });
}
/**
 * THEME DARK / LIGHT
 */
const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
  const videoDark  = document.getElementById('bg-video-dark');
  const videoLight = document.getElementById('bg-video-light');
  const themeToggleBtn = document.getElementById('theme-toggle'); // Sécurité : on le cherche ici

  if (theme === 'light') {
    document.body.classList.add('light-theme');
    if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
    if (videoDark && videoLight) {
      videoDark.classList.remove('active-video');
      videoLight.classList.add('active-video');
    }
  } else {
    document.body.classList.remove('light-theme');
    if (themeToggleBtn) themeToggleBtn.textContent = '🌙';
    if (videoDark && videoLight) {
      videoLight.classList.remove('active-video');
      videoDark.classList.add('active-video');
    }
  }
  
  localStorage.setItem('theme', theme);
}

// Highlight langue active
function updateLangButtons(lang) {
  document.getElementById('lang-fr')?.classList.toggle('active', lang === 'fr');
  document.getElementById('lang-en')?.classList.toggle('active', lang === 'en');
}

document.addEventListener("DOMContentLoaded", () => {
  // Init thème
  const savedTheme = localStorage.getItem("theme") || "dark";
  applyTheme(savedTheme);

  // Écouteur bouton thème
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isLight = document.body.classList.contains('light-theme');
      applyTheme(isLight ? 'dark' : 'light');
    });
  }

  // Écouteurs boutons langue
  document.getElementById('lang-fr')?.addEventListener('click', () => {
    if (typeof setLanguage === 'function') setLanguage('fr');
    updateLangButtons('fr');
  });

  document.getElementById('lang-en')?.addEventListener('click', () => {
    if (typeof setLanguage === 'function') setLanguage('en');
    updateLangButtons('en');
  });

  // Init langue
  const currentLang = localStorage.getItem('lang') || 'fr';
  updateLangButtons(currentLang);
});
// Protection clic droit
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if (e.key === 'F12' || 
      (e.ctrlKey && e.shiftKey && e.key === 'I') ||
      (e.ctrlKey && e.shiftKey && e.key === 'J') ||
      (e.ctrlKey && e.key === 'u')) {
    e.preventDefault();
  }
});
