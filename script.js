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

// 5. CHART DATA: edit these numbers to match your honest self-assessment.
//    Each chart is built from these lists, so you never touch the HTML.
const skills = [
  { name: 'SEO',                 value: 95 },
  { name: 'Content Writing',     value: 90 },
  { name: 'Safari Consultation', value: 90 },
  { name: 'Web Development',     value: 85 },
  { name: 'Paid Advertising',    value: 85 },
  { name: 'Digital Strategy',    value: 85 }
];

const workMix = [  // these should add up to 100
  { name: 'SEO',                     value: 30 },
  { name: 'Web Development',         value: 25 },
  { name: 'Paid Advertising',        value: 20 },
  { name: 'Content Writing',         value: 15 },
  { name: 'Strategy and Consulting', value: 10 }
];

const adPlatforms = [
  { name: 'Google',   value: 90 },
  { name: 'Meta',     value: 85 },
  { name: 'LinkedIn', value: 75 },
  { name: 'YouTube',  value: 70 }
];

// 6. BUILD THE HORIZONTAL BARS
// forEach runs the code once for every item in the list.
// The backticks ` ` let us put ${variables} inside text (a "template literal").
const skillBars = document.getElementById('skill-bars');
skills.forEach(skill => {
  const row = document.createElement('div');   // create a new <div> in memory
  row.className = 'bar';
  row.innerHTML = `
    <div class="bar-top"><span>${skill.name}</span><span>${skill.value}%</span></div>
    <div class="track"><div class="fill" style="--v:${skill.value}%"></div></div>`;
  skillBars.appendChild(row);                  // add it to the page
});

// 7. BUILD THE VERTICAL BARS
const adBars = document.getElementById('ad-bars');
adPlatforms.forEach(ad => {
  const col = document.createElement('div');
  col.className = 'vbar';
  col.innerHTML = `
    <span class="vval">${ad.value}%</span>
    <div class="vtrack"><div class="vfill" style="--v:${ad.value}%"></div></div>
    <span class="vname">${ad.name}</span>`;
  adBars.appendChild(col);
});

// 8. BUILD THE PIE (DONUT) CHART
// SVG shapes need createElementNS because they use a different XML namespace than HTML.
const SVG_NS = 'http://www.w3.org/2000/svg';
const donut = document.getElementById('donut');
const legend = document.getElementById('donut-legend');
let used = 0; // how much of the circle is already taken

workMix.forEach((item, i) => {
  // One circle per slice. The dash is the colored part, the gap is the rest.
  const seg = document.createElementNS(SVG_NS, 'circle');
  seg.setAttribute('class', 'seg');
  seg.setAttribute('cx', '21');
  seg.setAttribute('cy', '21');
  seg.setAttribute('r', '15.915');                     // makes the edge exactly 100 long
  seg.setAttribute('stroke-dashoffset', 25 - used);    // 25 starts the slice at 12 o'clock
  seg.style.setProperty('--dash', item.value);
  seg.style.setProperty('--gap', 100 - item.value);
  seg.style.stroke = `var(--c${i + 1})`;               // picks --c1, --c2, ...
  donut.appendChild(seg);
  used += item.value;

  // The matching legend row
  const li = document.createElement('li');
  li.innerHTML = `<span class="dot" style="background:var(--c${i + 1})"></span>${item.name}<strong>${item.value}%</strong>`;
  legend.appendChild(li);

  // Hover: dim the other slices and highlight this one
  [li, seg].forEach(el => {
    el.addEventListener('mouseenter', () => {
      donut.classList.add('dim');
      seg.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
      donut.classList.remove('dim');
      seg.classList.remove('active');
    });
  });
});

// 9. SCROLL REVEAL: IntersectionObserver tells us when an element enters the screen.
// Adding .visible also starts the chart animations, because the CSS listens for it.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // animate once only
    }
  });
}, { threshold: 0.15 }); // trigger when 15% of the element is visible

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// 10. COUNTERS: count up from 0 to the data-target number when scrolled into view
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

// 11. BACK-TO-TOP BUTTON: shows after 500px of scrolling, scrolls smoothly to the top on click
const toTop = document.getElementById('to-top');

window.addEventListener('scroll', () => {
  toTop.classList.toggle('show', window.scrollY > 500); // add "show" if true, remove if false
});

toTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});