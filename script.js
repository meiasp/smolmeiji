// Some random colors
const colors = ["#93D8EF","#fff", "#FFECD9"];

const numBalls = 50;
const balls = [];

for (let i = 0; i < numBalls; i++) {
  let ball = document.createElement("div");
  ball.classList.add("ball");
  ball.style.background = colors[Math.floor(Math.random() * colors.length)];
  ball.style.left = `${Math.floor(Math.random() * 100)}vw`;
  ball.style.top = `${Math.floor(Math.random() * 100)}vh`;
  ball.style.transform = `scale(${Math.random()})`;
  ball.style.width = `${Math.random()}em`;
  ball.style.height = ball.style.width;
  
  balls.push(ball);
  document.body.append(ball);
}

// Keyframes
balls.forEach((el, i, ra) => {
  let to = {
    x: Math.random() * (i % 2 === 0 ? -11 : 11),
    y: Math.random() * 12
  };

  let anim = el.animate(
    [
      { transform: "translate(0, 0)" },
      { transform: `translate(${to.x}rem, ${to.y}rem)` }
    ],
    {
      duration: (Math.random() + 1) * 2000, // random duration
      direction: "alternate",
      fill: "both",
      iterations: Infinity,
      easing: "ease-in-out"
    }
  );
});

document.addEventListener('DOMContentLoaded', () => {
  const currentPage = document.body.dataset.page;

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === currentPage);
  });

  const currentPackage = document.body.dataset.package;
  document.querySelectorAll('.subnav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.package === currentPackage);
  });

  document.querySelectorAll('.acc-head').forEach(head => {
    const item = head.parentElement;
    const body = item.querySelector('.acc-body');
    const setState = () => {
      body.style.maxHeight = item.classList.contains('open') ? body.scrollHeight + 'px' : '0px';
    };
    setState();
    head.addEventListener('click', () => {
      item.classList.toggle('open');
      setState();
    });
    window.addEventListener('resize', () => {
      if (item.classList.contains('open')) setState();
    });
  });

  buildMobileNav();
  initUsagePricing();
  initCarousels();

  document.querySelectorAll('.footer-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
});

function initUsagePricing() {
  document.querySelectorAll('.commission-package').forEach(pkg => {
    const basePrice = parseFloat(pkg.dataset.basePrice) || 0;
    const priceValue = pkg.querySelector('.price-value');
    const options = Array.from(pkg.querySelectorAll('.usage-option'));
    if (!priceValue || !options.length) return;

    const formatTHB = n => Math.round(n).toLocaleString('en-US') + ' THB';

    const applySelection = selected => {
      options.forEach(opt => opt.classList.toggle('checked', opt === selected));
      const multiplier = parseFloat(selected.dataset.multiplier) || 1;
      priceValue.textContent = formatTHB(basePrice * multiplier);
    };

    options.forEach(opt => {
      opt.addEventListener('click', () => applySelection(opt));
    });
  });
}

function initCarousels() {
  document.querySelectorAll('.carousel-row').forEach(row => {
    const track = row.querySelector('.carousel-track');
    const left = row.querySelector('.carousel-btn.left');
    const right = row.querySelector('.carousel-btn.right');
    if (!track) return;

    const scrollStep = () => {
      const item = track.querySelector('.carousel-item');
      return item ? item.getBoundingClientRect().width + 20 : track.clientWidth;
    };

    if (left) left.addEventListener('click', () => {
      track.scrollBy({ left: -scrollStep(), behavior: 'smooth' });
    });
    if (right) right.addEventListener('click', () => {
      track.scrollBy({ left: scrollStep(), behavior: 'smooth' });
    });
  });
}

function buildMobileNav() {
  const desktopLinks = Array.from(document.querySelectorAll('.nav-wrap .nav-btn'));
  if (!desktopLinks.length) return;

  const current = desktopLinks.find(a => a.classList.contains('active'));
  const currentLabel = current ? current.textContent : '';

  const wrap = document.createElement('div');
  wrap.className = 'mobile-nav';

  const bar = document.createElement('button');
  bar.type = 'button';
  bar.className = 'mobile-nav-bar';
  bar.setAttribute('aria-expanded', 'false');
  bar.innerHTML =
    '<span class="mobile-nav-current">' + currentLabel + '</span>' +
    '<span class="mobile-chevron"><svg viewBox="0 0 24 24" fill="none" stroke="#93D8EF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>';

  const dropdown = document.createElement('div');
  dropdown.className = 'mobile-nav-dropdown';
  desktopLinks.forEach(link => {
    const a = link.cloneNode(true);
    a.classList.remove('nav-btn');
    dropdown.appendChild(a);
  });

  wrap.appendChild(bar);
  wrap.appendChild(dropdown);
  document.body.prepend(wrap);

  bar.addEventListener('click', () => {
    const isOpen = wrap.classList.toggle('open');
    bar.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) {
      wrap.classList.remove('open');
      bar.setAttribute('aria-expanded', 'false');
    }
  });
}