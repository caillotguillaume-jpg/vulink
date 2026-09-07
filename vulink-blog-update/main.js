// ── MOBILE MENU ──
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const nav = document.querySelector('.nav');

  // Positionner le menu juste sous la nav
  const navHeight = nav.getBoundingClientRect().height;
  menu.style.top = navHeight + 'px';
  menu.style.paddingTop = '1.5rem';

  menu.classList.toggle('open');
}

// Close mobile menu on link click
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.remove('open');
  });
});

// ── SCROLL ANIMATIONS ──
const fadeEls = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 100);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => observer.observe(el));

// ── NAV SHADOW ON SCROLL ──
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.nav');
  if (window.scrollY > 20) {
    nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
  } else {
    nav.style.boxShadow = 'none';
  }
});

// ── CONTACT FORM (simulation — à connecter à un vrai backend ou Formspree) ──
function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const success = document.getElementById('formSuccess');

  // Pour activer un vrai envoi, remplacez ce bloc par un appel fetch vers Formspree :
  // fetch('https://formspree.io/f/VOTRE_ID', { method:'POST', body: new FormData(form) })

  form.querySelectorAll('input, select, textarea, button').forEach(el => el.disabled = true);
  success.style.display = 'block';
}
