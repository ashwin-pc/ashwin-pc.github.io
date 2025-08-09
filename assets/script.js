function deriveAccentFromImage(img) {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let r = 0, g = 0, b = 0;
  const len = data.length / 4;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  r = Math.round(r / len);
  g = Math.round(g / len);
  b = Math.round(b / len);
  const accent = `rgb(${r}, ${g}, ${b})`;
  document.documentElement.style.setProperty('--accent', accent);
  document.documentElement.style.setProperty('--bg1', `rgb(${(r * 0.1) | 0}, ${(g * 0.1) | 0}, ${(b * 0.1) | 0})`);
  document.documentElement.style.setProperty('--bg2', `rgb(${(r * 0.25) | 0}, ${(g * 0.25) | 0}, ${(b * 0.25) | 0})`);
  document.documentElement.style.setProperty('--bg3', `rgb(${(r * 0.5) | 0}, ${(g * 0.5) | 0}, ${(b * 0.5) | 0})`);
  document.documentElement.style.setProperty('--bg4', `rgb(${(r * 0.25) | 0}, ${(g * 0.25) | 0}, ${(b * 0.25) | 0})`);
}

async function fetchProfile() {
  const res = await fetch('https://api.github.com/users/ashwin-pc');
  const data = await res.json();
  const avatar = document.getElementById('avatar');
  avatar.crossOrigin = 'anonymous';
  avatar.src = data.avatar_url;
  avatar.onload = () => deriveAccentFromImage(avatar);
  document.getElementById('name').textContent = data.name;
  document.getElementById('bio').textContent = data.bio;
  document.getElementById('company').textContent = data.company || '';
  document.getElementById('location').textContent = data.location || '';
  const blog = document.getElementById('blog');
  if (data.blog) {
    blog.textContent = data.blog.replace(/^https?:\/\//, '');
    blog.href = data.blog;
  } else {
    blog.parentElement.style.display = 'none';
  }
  document.querySelector('.hero').classList.add('visible');
}

async function fetchRepos() {
  const res = await fetch('https://api.github.com/users/ashwin-pc/repos?sort=updated&per_page=6');
  const repos = await res.json();
  const grid = document.getElementById('projects-grid');
  repos.forEach(repo => {
    const card = document.createElement('a');
    card.href = repo.html_url;
    card.target = '_blank';
    card.className = 'project-card glass hidden';
    card.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description || ''}</p>
      <span class="language">${repo.language || ''}</span>
    `;
    grid.appendChild(card);
  });
}

function revealOnScroll() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.hidden').forEach(el => observer.observe(el));
}

async function init() {
  await fetchProfile();
  await fetchRepos();
  revealOnScroll();
}

init();
