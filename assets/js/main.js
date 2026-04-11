/*
  main.js
  - Navigation between sections (About/Resume/Portfolio/Blog/Contact)
  - Sidebar "show contacts" toggle
  - Theme (light/dark) toggle with persistence
  - Language (FR/EN) toggle with persistence
*/

(function () {
  "use strict";

  // ---------- Helpers
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---------- Sidebar toggle (contacts)
  const sidebar = $("[data-sidebar]");
  const sidebarBtn = $("[data-sidebar-btn]");
  if (sidebar && sidebarBtn) {
    sidebarBtn.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });
  }

  // ---------- Page navigation
  const navLinks = $$("[data-nav-link]");
  const pages = $$("[data-page]");

  function setActivePage(pageName) {
    pages.forEach((p) => p.classList.toggle("active", p.dataset.page === pageName));
    navLinks.forEach((btn) => {
      const target = (btn.textContent || "").trim().toLowerCase();
      // The original template uses matching by text. Here we store the page in DOM order.
      // We'll map by index to keep it simple and robust.
    });
  }

  navLinks.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      // page order must match navbar order
      const page = pages[index]?.dataset?.page;
      if (!page) return;

      // update active button
      navLinks.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // show page
      pages.forEach((p) => p.classList.remove("active"));
      pages[index].classList.add("active");

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // ---------- Theme toggle
  const themeBtn = $("#themeToggle");
  const THEME_KEY = "abdou_theme";

  function applyTheme(theme) {
    // theme: 'dark' | 'light'
    document.body.classList.toggle("theme-dark", theme === "dark");
    document.body.classList.toggle("theme-light", theme === "light");
    localStorage.setItem(THEME_KEY, theme);

    if (themeBtn) {
      themeBtn.innerHTML = theme === "dark"
        ? '<ion-icon name="sunny-outline"></ion-icon>'
        : '<ion-icon name="moon-outline"></ion-icon>';
    }
  }

  function toggleTheme() {
    const current = localStorage.getItem(THEME_KEY) || "dark";
    applyTheme(current === "dark" ? "light" : "dark");
  }

  // ---------- i18n
  const langBtn = $("#langToggle");
  const LANG_KEY = "abdou_lang";

  const translations = {
    fr: {
      sidebar_role: "Étudiant Réseaux & Télécommunications",
      sidebar_focus: "Cybersécurité · Admin Réseau · Virtualisation",
      show_contacts: "Afficher les contacts",
      email: "Email",
      phone: "Téléphone",
      location: "Localisation",

      nav_about: "À propos",
      nav_resume: "Parcours",
      nav_portfolio: "Projets",
      nav_blog: "Blog",
      nav_contact: "Contact",

      about_title: "À propos de moi",
      about_p1:
        "Étudiant en Réseaux & Télécommunications, je construis des compétences solides en administration réseau, cybersécurité et virtualisation. J’aime transformer une idée (ou un besoin) en solution concrète : une infra plus fiable, un service mieux sécurisé, ou une automatisation qui fait gagner du temps.",
      about_p2:
        "Mon objectif : progresser sur des environnements réels (LAN/WAN, VLAN, routage, services, pare-feu), documenter proprement, et livrer quelque chose de clair et maintenable.",

      skills_title: "Compétences que je développe",
      skill1_title: "Analyse réseau",
      skill1_text: "Capture et interprétation du trafic (Wireshark) pour diagnostiquer et résoudre des problèmes.",
      skill2_title: "Cybersécurité",
      skill2_text: "Bonnes pratiques, segmentation, durcissement, et compréhension des attaques courantes en LAN.",
      skill3_title: "Administration systèmes & réseaux",
      skill3_text: "Gestion de services (DHCP/DNS/Web), Linux/Windows, et supervision basique.",
      skill4_title: "Automatisation",
      skill4_text: "Scripts (Python/PowerShell) et Docker pour automatiser l’installation, la config et les sauvegardes.",

      resume_title: "Parcours",
      edu_title: "Formation",
      edu1_title: "BUT Réseaux & Télécommunications",
      edu1_time: "2024 — 2026 (en cours)",
      edu1_text: "Routage, VLAN, services réseaux, cybersécurité, virtualisation, projets SAÉ.",

      portfolio_title: "Projets",
      proj1_cat: "Flutter · Firebase",
      proj2_cat: "FreeSWITCH · AWS",

      blog_title: "Blog",
      blog_cat: "Réseaux",
      blog_item_title: "Exemple d’article",
      blog_item_text: "Ici tu peux mettre tes comptes rendus / explications de TP et SAÉ.",

      contact_title: "Contact",
      contact_subtitle: "Écris-moi",
      send: "Envoyer",
      ph_name: "Nom",
      ph_email: "Email",
      ph_message: "Message",
    },

    en: {
      sidebar_role: "Networks & Telecommunications Student",
      sidebar_focus: "Cybersecurity · Network Admin · Virtualization",
      show_contacts: "Show contacts",
      email: "Email",
      phone: "Phone",
      location: "Location",

      nav_about: "About",
      nav_resume: "Resume",
      nav_portfolio: "Portfolio",
      nav_blog: "Blog",
      nav_contact: "Contact",

      about_title: "About Me",
      about_p1:
        "I’m a Networks & Telecommunications student building strong skills in network administration, cybersecurity, and virtualization. I like turning needs into practical solutions: more reliable infrastructure, better-secured services, and automation that saves time.",
      about_p2:
        "My goal is to grow on real environments (LAN/WAN, VLANs, routing, services, firewalls), write clear documentation, and deliver maintainable results.",

      skills_title: "Skills I’m developing",
      skill1_title: "Network analysis",
      skill1_text: "Capture and interpret traffic (Wireshark) to diagnose and fix network issues.",
      skill2_title: "Cybersecurity",
      skill2_text: "Best practices, segmentation, hardening, and understanding common LAN attacks.",
      skill3_title: "Systems & network administration",
      skill3_text: "Operating services (DHCP/DNS/Web), Linux/Windows, and basic monitoring.",
      skill4_title: "Automation",
      skill4_text: "Scripts (Python/PowerShell) and Docker to automate setup, configuration, and backups.",

      resume_title: "Resume",
      edu_title: "Education",
      edu1_title: "B.U.T. Networks & Telecommunications",
      edu1_time: "2024 — 2026 (ongoing)",
      edu1_text: "Routing, VLANs, network services, cybersecurity, virtualization, hands-on projects.",

      portfolio_title: "Portfolio",
      proj1_cat: "Flutter · Firebase",
      proj2_cat: "FreeSWITCH · AWS",

      blog_title: "Blog",
      blog_cat: "Networking",
      blog_item_title: "Sample post",
      blog_item_text: "You can publish your lab reports / explanations for projects here.",

      contact_title: "Contact",
      contact_subtitle: "Message me",
      send: "Send",
      ph_name: "Name",
      ph_email: "Email",
      ph_message: "Message",
    },
  };

  function applyLang(lang) {
    const dict = translations[lang] || translations.fr;
    document.documentElement.lang = lang;
    localStorage.setItem(LANG_KEY, lang);

    // text nodes
    $$('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });

    // placeholders
    $$('[data-i18n-ph]').forEach((el) => {
      const key = el.getAttribute('data-i18n-ph');
      if (dict[key]) el.setAttribute('placeholder', dict[key]);
    });

    if (langBtn) langBtn.textContent = lang.toUpperCase();
  }

  function toggleLang() {
    const current = localStorage.getItem(LANG_KEY) || guessInitialLang();
    applyLang(current === 'fr' ? 'en' : 'fr');
  }

  function guessInitialLang() {
    const nav = (navigator.language || '').toLowerCase();
    return nav.startsWith('fr') ? 'fr' : 'en';
  }

  // ---------- Init on load
  document.addEventListener('DOMContentLoaded', () => {
    // init theme
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
    applyTheme(savedTheme);
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    // init lang
    const savedLang = localStorage.getItem(LANG_KEY) || guessInitialLang();
    applyLang(savedLang);
    if (langBtn) langBtn.addEventListener('click', toggleLang);
  });
})();
