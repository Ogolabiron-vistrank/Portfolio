// 1. FOOTER YEAR: sets the year automatically so you never update it by hand
document.getElementById('year').textContent = new Date().getFullYear();

// 2. MOBILE MENU: clicking the button adds/removes the "open" class on the nav
const nav = document.getElementById('nav');
document.getElementById('menu-btn').addEventListener('click', () => {
  nav.classList.toggle('open');
});
// Close the menu after tapping a link
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

// 3. DARK MODE: saves the choice in the browser (localStorage) so it's remembered
const themeBtn = document.getElementById('theme-btn');
const root = document.documentElement; // the <html> element

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);       // CSS reads this attribute
  themeBtn.textContent = theme === 'dark' ? 'Light' : 'Dark';
  localStorage.setItem('theme', theme);
}

applyTheme(localStorage.getItem('theme') || 'light');

themeBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

// 4. ROTATING ROLE TEXT: swaps the word in the hero every 2.5 seconds
const roles = ['SEO Specialist', 'Digital Marketer', 'Web Developer', 'Safari Content Writer'];
const typed = document.getElementById('typed');
let roleIndex = 0;

setInterval(() => {
  roleIndex = (roleIndex + 1) % roles.length; // % wraps back to 0 after the last item
  typed.textContent = roles[roleIndex];
}, 2500);

// 5. SCROLL REVEAL: IntersectionObserver tells us when an element enters the screen
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // animate once only
    }
  });
}, { threshold: 0.15 }); // trigger when 15% of the element is visible

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// 6. COUNTERS: count up from 0 to the data-target number when scrolled into view
function countUp(el) {
  const target = Number(el.dataset.target); // reads data-target="5" from the HTML
  let current = 0;
  const timer = setInterval(() => {
    current++;
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 150);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      countUp(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.num').forEach(el => counterObserver.observe(el));