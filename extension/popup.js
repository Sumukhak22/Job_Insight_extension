const API_BASE = 'http://127.0.0.1:5000';

document.addEventListener('DOMContentLoaded', () => {
  const loginSection = document.getElementById('login-section');
  const mainSection  = document.getElementById('main-section');
  const nameInput    = document.getElementById('name');
  const emailInput   = document.getElementById('email');
  const loginBtn     = document.getElementById('login-btn');
  const scrapeBtn    = document.getElementById('scrape-btn');
  const mailBtn      = document.getElementById('mail-btn');
  const logoutBtn    = document.getElementById('logout-btn');
  const resultsDiv   = document.getElementById('results');
  const titleInput   = document.getElementById('title');
  const companyInput = document.getElementById('company');

  // restore session
  chrome.storage.local.get(['email'], data => {
    if (data.email) {
      loginSection.style.display = 'none';
      mainSection.style.display  = 'block';
    }
  });

  loginBtn.addEventListener('click', async () => {
    const name  = nameInput.value.trim();
    const email = emailInput.value.trim();
    if (!name || !email) return alert('Both fields required');

    const form = new FormData();
    form.append('name', name);
    form.append('email', email);

    try {
      const resp = await fetch(`${API_BASE}/login`, { method: 'POST', body: form });
      if (!resp.ok) throw new Error(await resp.text());
      chrome.storage.local.set({ email }, () => {
        loginSection.style.display = 'none';
        mainSection.style.display  = 'block';
      });
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  });

  async function doScrape() {
    const res = await fetch(`${API_BASE}/scrape`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        title:   titleInput.value.trim(),
        company: companyInput.value.trim()
      })
    });
    const data = await res.json();
    if (!res.ok) {
      resultsDiv.textContent = 'Error: ' + (data.error||res.status);
      return;
    }
    renderResults(data.jobs);
  }

  async function doMail() {
    const res = await fetch(`${API_BASE}/mail`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        title:   titleInput.value.trim(),
        company: companyInput.value.trim()
      })
    });
    const data = await res.json();
    if (!res.ok) {
      resultsDiv.textContent = 'Mail Error: ' + (data.error||res.status);
      return;
    }
    resultsDiv.textContent = data.status;
  }

  async function doLogout() {
    await fetch(`${API_BASE}/logout`);
    chrome.storage.local.remove('email', () => {
      mainSection.style.display  = 'none';
      loginSection.style.display = 'block';
      resultsDiv.textContent     = '';
    });
  }

  function renderResults(jobs) {
    if (!jobs.length) {
      resultsDiv.textContent = 'No jobs found.';
      return;
    }
    let html = `<table>
      <thead><tr><th>Title</th><th>Company</th></tr></thead><tbody>`;
    jobs.forEach(j => {
      html += `<tr><td>${j.title}</td><td>${j.company}</td></tr>`;
    });
    html += `</tbody></table>`;
    resultsDiv.innerHTML = html;
  }

  scrapeBtn.addEventListener('click', doScrape);
  mailBtn.addEventListener('click', doMail);
  logoutBtn.addEventListener('click', doLogout);
});
