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
window.showBlogDetail = function(title, img, desc, tags, hasGallery = false) {
  const gridView = document.getElementById('blog-grid-view');
  const detailView = document.getElementById('blog-detail-view');
  const imgElement = document.getElementById('blog-detail-img');
  const galleryElement = document.getElementById('ping-gallery');

  if (!gridView || !detailView) return;

  document.getElementById('blog-detail-title').innerText = title;
  document.getElementById('blog-detail-desc').innerHTML = desc;
  document.getElementById('blog-detail-tags').innerText = "Tags : " + tags;

  if (hasGallery && galleryElement) {
    imgElement.style.display = 'none';
    galleryElement.style.display = 'block';
  } else {
    if (galleryElement) galleryElement.style.display = 'none';
    imgElement.style.display = 'block';
    imgElement.src = img;
  }

  gridView.style.display = 'none';
  detailView.style.display = 'block';
  window.scrollTo(0, 0);
}

window.hideBlogDetail = function() {
  document.getElementById('blog-grid-view').style.display = 'block';
  document.getElementById('blog-detail-view').style.display = 'none';
}

/**
 * FORMULAIRE DE CONTACT
 */
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

    setTimeout(() => {
      if (status) {
        status.style.display = "block";
        status.innerText = "Merci ! Message bien reçu.";
      }
      contactForm.reset();
      formBtn.innerHTML = originalBtnHTML;
      formBtn.setAttribute("disabled", "");
    }, 2000);
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