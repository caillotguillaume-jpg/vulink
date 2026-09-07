// ============================================================
// VULINK — Blog (Actualités)
// Charge les articles depuis data/articles.json.
// Pour ajouter un article : dupliquer un bloc dans articles.json,
// aucune modification de ce fichier ni du HTML n'est nécessaire.
// ============================================================

const ARTICLES_URL = 'data/articles.json';

function formatDateFR(isoDate) {
  const d = new Date(isoDate + 'T00:00:00');
  if (isNaN(d)) return isoDate;
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function loadArticles() {
  const res = await fetch(ARTICLES_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error('Impossible de charger les articles');
  const articles = await res.json();
  // Tri du plus récent au plus ancien
  return articles.sort((a, b) => new Date(b.date) - new Date(a.date));
}

const arrowSVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;

function renderCard(article) {
  return `
    <a class="blog-card" href="article.html?id=${encodeURIComponent(article.id)}">
      <div class="blog-card-cover">
        <img src="${article.cover}" alt="" loading="lazy">
      </div>
      <div class="blog-card-body">
        <div class="blog-card-meta">
          <span>${escapeHTML(article.category || 'Actualités')}</span>
          <span class="dot"></span>
          <span class="date">${formatDateFR(article.date)}</span>
        </div>
        <h2 class="blog-card-title">${escapeHTML(article.title)}</h2>
        <p class="blog-card-excerpt">${escapeHTML(article.excerpt || '')}</p>
        <span class="blog-card-link">Lire l'article ${arrowSVG}</span>
      </div>
    </a>
  `;
}

async function initBlogList() {
  const grid = document.getElementById('blogGrid');
  if (!grid) return;
  try {
    const articles = await loadArticles();
    if (!articles.length) {
      grid.innerHTML = '<p class="blog-empty">Les premiers articles arrivent très bientôt.</p>';
      return;
    }
    grid.innerHTML = articles.map(renderCard).join('');
  } catch (e) {
    grid.innerHTML = '<p class="blog-empty">Impossible de charger les actualités pour le moment.</p>';
    console.error(e);
  }
}

function renderContentBlock(block) {
  switch (block.type) {
    case 'heading':
      return `<h2>${escapeHTML(block.text)}</h2>`;
    case 'subheading':
      return `<h3>${escapeHTML(block.text)}</h3>`;
    case 'paragraph':
      return `<p>${escapeHTML(block.text)}</p>`;
    case 'list':
      return `<ul>${block.items.map(i => `<li>${escapeHTML(i)}</li>`).join('')}</ul>`;
    case 'quote':
      return `<blockquote>${escapeHTML(block.text)}</blockquote>`;
    default:
      return '';
  }
}

async function initArticlePage() {
  const container = document.getElementById('articleContainer');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  try {
    const articles = await loadArticles();
    const article = articles.find(a => a.id === id);

    if (!article) {
      container.innerHTML = `
        <div class="article-not-found">
          <h1>Article introuvable</h1>
          <p>Cet article n'existe pas ou plus.</p>
          <a href="blog.html" class="btn btn-primary">Retour aux actualités</a>
        </div>
      `;
      return;
    }

    document.title = article.title + ' — Vulink';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', article.excerpt || '');

    container.innerHTML = `
      <div class="article-header">
        <a href="blog.html" class="article-back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Retour aux actualités
        </a>
        <div class="article-meta">
          <span>${escapeHTML(article.category || 'Actualités')}</span>
          <span class="dot"></span>
          <span class="date">${formatDateFR(article.date)}</span>
          ${article.readingTime ? `<span class="dot"></span><span class="reading-time">${escapeHTML(article.readingTime)} de lecture</span>` : ''}
        </div>
        <h1 class="article-title">${escapeHTML(article.title)}</h1>
      </div>
      ${article.cover ? `
      <div class="article-cover">
        <img src="${article.cover}" alt="">
      </div>` : ''}
      <div class="article-body">
        ${article.content.map(renderContentBlock).join('')}
      </div>
      <div class="article-footer-cta">
        <div class="article-footer-cta-inner">
          <p>Un recrutement à venir dans l'optique ?</p>
          <a href="https://calendly.com/guillaume-vulink/30min" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Prendre rendez-vous</a>
        </div>
      </div>
    `;
  } catch (e) {
    container.innerHTML = '<p class="blog-empty">Impossible de charger cet article pour le moment.</p>';
    console.error(e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initBlogList();
  initArticlePage();
});
