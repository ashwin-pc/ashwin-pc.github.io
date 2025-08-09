(async function () {
  try {
    const res = await fetch('https://api.github.com/users/ashwin-pc/repos?per_page=100');
    const data = await res.json();
    const top = data
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6);
    const grid = document.getElementById('projectsGrid');
    top.forEach(repo => {
      const card = document.createElement('a');
      card.href = repo.html_url;
      card.target = '_blank';
      card.className = 'project-card';
      card.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description || 'No description provided.'}</p>
        <span>${repo.language || ''} ★${repo.stargazers_count}</span>
      `;
      grid.appendChild(card);
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.project-card').forEach(el => observer.observe(el));
    document.getElementById('year').textContent = new Date().getFullYear();
  } catch (e) {
    console.error('Failed to load projects', e);
  }
})();
