document.addEventListener('DOMContentLoaded', () => {
  const scrapeForm = document.getElementById('scrape-form');
  const mailBtn    = document.getElementById('mail-btn');
  const logoutBtn  = document.getElementById('logout-btn');
  const out        = document.getElementById('results');

  async function scrape() {
    const title   = document.getElementById('title').value;
    const company = document.getElementById('company').value;
    const res = await fetch('/scrape', {
      method:  'POST',
      headers: {'Content-Type':'application/json'},
      body:    JSON.stringify({ title, company })
    });
    const data = await res.json();
    if (!res.ok) {
      out.innerHTML = `<p>Error: ${data.error||res.status}</p>`;
      return;
    }
    displayJobs(data.jobs);
  }

  async function mail() {
    const title   = document.getElementById('title').value;
    const company = document.getElementById('company').value;
    const res = await fetch('/mail', {
      method:  'POST',
      headers: {'Content-Type':'application/json'},
      body:    JSON.stringify({ title, company })
    });
    const data = await res.json();
    if (!res.ok) {
      out.innerHTML = `<p>Email Error: ${data.error||res.status}</p>`;
      return;
    }
    out.innerHTML = `<p>${data.status}</p>`;
  }

  function displayJobs(jobs) {
    out.innerHTML = '';
    if (!jobs.length) {
      out.innerHTML = '<p>No jobs found.</p>';
      return;
    }
    const table = document.createElement('table');
    table.innerHTML = `
      <thead>
        <tr><th>Title</th><th>Company</th><th>Source</th><th>Link</th></tr>
      </thead>`;
    const tbody = document.createElement('tbody');
    jobs.forEach(j => {
      tbody.innerHTML += `
        <tr>
          <td>${j.title}</td>
          <td>${j.company}</td>
          <td>${j.source}</td>
          <td>${j.link ? `<a href="${j.link}" target="_blank">View</a>` : 'N/A'}</td>
        </tr>`;
    });
    table.appendChild(tbody);
    out.appendChild(table);
  }

  scrapeForm.addEventListener('submit', e => {
    e.preventDefault();
    scrape();
  });
  mailBtn.addEventListener('click', mail);
  logoutBtn.addEventListener('click', async () => {
    await fetch('/logout');
    window.location.href = '/login';
  });
});
