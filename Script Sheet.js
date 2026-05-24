// ===== Config =====
const EMPLOYER_PASSKEY_HASH = 'ac10d4a58b7606146de9f8853021934f43de3f52f432a5fc62638834b3595df5';
const FORMSPREE_APPLICATIONS = 'https://formspree.io/f/mbdbdjaw';
const FORMSPREE_POSTINGS = 'https://formspree.io/f/xaqkqydr';
const SHEETS_API = 'https://script.google.com/macros/s/AKfycbzP-jlIXRui2Um-tggHtpB5uZ6hNDaHncgChY0AmKC0B2-xToL3SUMyAcpS8vAEzIXGqQ/exec';
let isEmployerVerified = false;
let currentDetailJobId = null;

// ===== Sample Data =====
const sampleJobs = [
  {
    id: 1, title: 'Senior Frontend Engineer', company: 'Lumina Labs', logo: '#4338ca',
    location: 'San Francisco, CA', type: 'Full-time', category: 'Engineering',
    salary: '$140k – $180k', salaryNum: 180000,
    tags: ['React', 'TypeScript', 'GraphQL'],
    description: 'Build delightful user interfaces for our flagship analytics platform serving 10k+ enterprise customers.',
    requirements: ['5+ years of frontend experience', 'Expert in React and TypeScript', 'Strong eye for design and UX', 'Experience with GraphQL'],
    posted: 2
  },
  {
    id: 2, title: 'Product Designer', company: 'Northstream', logo: '#10b981',
    location: 'Remote', type: 'Remote', category: 'Design',
    salary: '$110k – $150k', salaryNum: 150000,
    tags: ['Figma', 'Design Systems', 'User Research'],
    description: 'Shape the future of our product through thoughtful design and rigorous user research.',
    requirements: ['4+ years in product design', 'Portfolio showcasing end-to-end work', 'Strong systems thinking', 'Comfort facilitating user research'],
    posted: 5
  },
  {
    id: 3, title: 'Backend Engineer (Go)', company: 'Vortex Systems', logo: '#ef4444',
    location: 'New York, NY', type: 'Full-time', category: 'Engineering',
    salary: '$130k – $170k', salaryNum: 170000,
    tags: ['Go', 'Kubernetes', 'PostgreSQL'],
    description: 'Design and build distributed systems that power real-time data pipelines at scale.',
    requirements: ['Strong Go experience', 'Distributed systems background', 'Kubernetes in production', 'Database design skills'],
    posted: 1
  },
  {
    id: 4, title: 'Growth Marketing Manager', company: 'Brightline', logo: '#f59e0b',
    location: 'Austin, TX', type: 'Full-time', category: 'Marketing',
    salary: '$95k – $130k', salaryNum: 130000,
    tags: ['SEO', 'Paid Ads', 'Analytics'],
    description: 'Own the full growth funnel from acquisition through retention for our B2B SaaS product.',
    requirements: ['4+ years growth marketing', 'Data-driven mindset', 'Experience with paid acquisition', 'Strong writing skills'],
    posted: 7
  },
  {
    id: 5, title: 'Data Scientist', company: 'Quantel AI', logo: '#8b5cf6',
    location: 'Remote', type: 'Remote', category: 'Data',
    salary: '$135k – $175k', salaryNum: 175000,
    tags: ['Python', 'ML', 'SQL'],
    description: 'Build predictive models and translate complex data into actionable business insights.',
    requirements: ['PhD or MS in quantitative field', 'Strong Python and SQL', 'Experience deploying ML models', 'Clear communication of findings'],
    posted: 3
  },
  {
    id: 6, title: 'Account Executive', company: 'Pinnacle Sales Co', logo: '#06b6d4',
    location: 'Chicago, IL', type: 'Full-time', category: 'Sales',
    salary: '$80k base + commission', salaryNum: 80000,
    tags: ['B2B', 'SaaS', 'Enterprise'],
    description: 'Drive new business across mid-market accounts in the financial services vertical.',
    requirements: ['3+ years enterprise sales', 'Track record of quota attainment', 'Strong discovery skills', 'CRM proficiency'],
    posted: 4
  },
  {
    id: 7, title: 'DevOps Engineer', company: 'Cloudpath', logo: '#3730a3',
    location: 'Seattle, WA', type: 'Full-time', category: 'Engineering',
    salary: '$125k – $160k', salaryNum: 160000,
    tags: ['AWS', 'Terraform', 'CI/CD'],
    description: 'Build and maintain the infrastructure that powers our developer platform.',
    requirements: ['AWS expertise', 'Infrastructure as code', 'CI/CD pipeline design', 'On-call experience'],
    posted: 6
  },
  {
    id: 8, title: 'UX Researcher', company: 'Northstream', logo: '#10b981',
    location: 'Remote', type: 'Contract', category: 'Design',
    salary: '$85/hr', salaryNum: 85000,
    tags: ['Qualitative Research', 'Usability Testing'],
    description: 'Conduct generative and evaluative research to inform product strategy.',
    requirements: ['3+ years UX research', 'Mixed methods experience', 'Strong synthesis skills', 'Stakeholder communication'],
    posted: 10
  },
  {
    id: 9, title: 'Product Manager — Platform', company: 'Lumina Labs', logo: '#4338ca',
    location: 'San Francisco, CA', type: 'Full-time', category: 'Product',
    salary: '$150k – $190k', salaryNum: 190000,
    tags: ['B2B', 'API', 'Strategy'],
    description: 'Lead product strategy for our platform APIs used by thousands of developers.',
    requirements: ['5+ years PM experience', 'Technical background', 'API/platform product experience', 'Strong written communication'],
    posted: 8
  },
  {
    id: 10, title: 'Customer Success Manager', company: 'Helix Software', logo: '#ec4899',
    location: 'Boston, MA', type: 'Full-time', category: 'Operations',
    salary: '$85k – $115k', salaryNum: 115000,
    tags: ['SaaS', 'Onboarding', 'Renewals'],
    description: 'Own renewals and expansion for a portfolio of mid-market customers.',
    requirements: ['3+ years CSM experience', 'SaaS background', 'Strong relationship skills', 'Comfort with data analysis'],
    posted: 9
  },
  {
    id: 11, title: 'Financial Analyst', company: 'Apex Capital', logo: '#0f766e',
    location: 'New York, NY', type: 'Full-time', category: 'Finance',
    salary: '$90k – $120k', salaryNum: 120000,
    tags: ['Modeling', 'Excel', 'SQL'],
    description: 'Support FP&A function with forecasting, modeling, and strategic analysis.',
    requirements: ['2+ years FP&A or banking', 'Strong Excel modeling', 'SQL is a plus', 'Bachelor\'s in finance/econ'],
    posted: 12
  },
  {
    id: 12, title: 'Mobile Engineer (iOS)', company: 'Tidepool', logo: '#0ea5e9',
    location: 'Remote', type: 'Remote', category: 'Engineering',
    salary: '$120k – $160k', salaryNum: 160000,
    tags: ['Swift', 'iOS', 'SwiftUI'],
    description: 'Build native iOS experiences for our consumer wellness app with 2M+ users.',
    requirements: ['4+ years iOS development', 'Swift and SwiftUI', 'App Store shipping experience', 'Performance optimization'],
    posted: 14
  }
];

let jobs = [];
let savedJobs = new Set();

// ===== Sheets API =====
async function loadJobsFromSheet() {
  try {
    const res = await fetch(`${SHEETS_API}?action=listJobs`);
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Failed to load jobs');
    if (Array.isArray(data.jobs) && data.jobs.length > 0) {
      jobs = data.jobs;
    } else {
      // Sheet is empty — fall back to sample data so the board isn't blank
      jobs = [...sampleJobs];
    }
  } catch (err) {
    console.warn('Could not reach sheet, using sample data:', err);
    jobs = [...sampleJobs];
    showToast('Using offline samples — sheet unreachable', 'error');
  }
  applyFilters();
}

// ===== Rendering =====
function getInitials(name) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function formatPosted(days) {
  if (days === 0) return 'Posted today';
  if (days === 1) return 'Posted 1 day ago';
  if (days < 7) return `Posted ${days} days ago`;
  if (days < 14) return 'Posted 1 week ago';
  if (days < 30) return `Posted ${Math.floor(days / 7)} weeks ago`;
  return `Posted ${Math.floor(days / 30)} month(s) ago`;
}

function renderJobs(list, container) {
  const grid = document.getElementById(container);
  if (list.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <h3>No jobs found</h3>
        <p>Try adjusting your filters or search terms.</p>
      </div>`;
    return;
  }
  grid.innerHTML = list.map(job => `
    <div class="job-card" onclick="openJobDetail(${job.id})">
      <div class="job-card-header">
        <div style="display:flex; gap:0.85rem; align-items:flex-start; flex:1">
          <div class="company-logo" style="background:${safeCssColor(job.logo)}">${getInitials(job.company)}</div>
          <div style="min-width:0">
            <div class="job-title">${escapeHtml(job.title)}</div>
            <div class="job-company">${escapeHtml(job.company)}</div>
          </div>
        </div>
        <button class="bookmark-btn ${savedJobs.has(job.id) ? 'saved' : ''}"
                onclick="event.stopPropagation(); toggleSave(${job.id})"
                title="Save job">
          ${savedJobs.has(job.id) ? '★' : '☆'}
        </button>
      </div>
      <div class="job-meta">
        <span class="job-meta-item">📍 ${escapeHtml(job.location)}</span>
      </div>
      <div class="job-tags">
        <span class="tag type">${escapeHtml(job.type)}</span>
        ${job.type === 'Remote' ? '' : ''}
        ${job.tags.slice(0, 3).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
      </div>
      <div class="job-salary">💰 ${escapeHtml(job.salary)}</div>
      <div class="job-posted">${formatPosted(job.posted)}</div>
    </div>
  `).join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function safeCssColor(value) {
  // Allow only hex colors (#abc or #aabbcc) and named colors (letters only)
  return /^(#[0-9a-fA-F]{3,6}|[a-zA-Z]+)$/.test(value) ? value : '#6c757d';
}

// ===== Filtering =====
function applyFilters() {
  const search = document.getElementById('search-input').value.toLowerCase().trim();
  const category = document.getElementById('filter-category').value;
  const type = document.getElementById('filter-type').value;
  const location = document.getElementById('filter-location').value.toLowerCase().trim();
  const sort = document.getElementById('filter-sort').value;

  let filtered = jobs.filter(j => {
    if (search && !(`${j.title} ${j.company} ${j.description} ${j.tags.join(' ')}`.toLowerCase().includes(search))) return false;
    if (category && j.category !== category) return false;
    if (type && j.type !== type) return false;
    if (location && !j.location.toLowerCase().includes(location)) return false;
    return true;
  });

  if (sort === 'newest') filtered.sort((a, b) => a.posted - b.posted);
  else if (sort === 'oldest') filtered.sort((a, b) => b.posted - a.posted);
  else if (sort === 'salary') filtered.sort((a, b) => b.salaryNum - a.salaryNum);

  document.getElementById('job-count').textContent = filtered.length;
  renderJobs(filtered, 'jobs-grid');
}

// ===== Save/Bookmark =====
function toggleSave(id) {
  if (savedJobs.has(id)) {
    savedJobs.delete(id);
    showToast('Removed from saved jobs');
  } else {
    savedJobs.add(id);
    showToast('Saved! Find it in your saved list.', 'success');
  }
  applyFilters();
  renderSaved();
  updateSavedCount();
}

function renderSaved() {
  const list = jobs.filter(j => savedJobs.has(j.id));
  if (list.length === 0) {
    document.getElementById('saved-grid').innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <h3>No saved jobs yet</h3>
        <p>Click the star icon on any job to save it for later.</p>
      </div>`;
    return;
  }
  renderJobs(list, 'saved-grid');
}

function updateSavedCount() {
  const el = document.getElementById('saved-count');
  el.textContent = savedJobs.size > 0 ? `(${savedJobs.size})` : '';
}

// ===== Views =====
function switchView(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  if (view === 'listings') {
    document.getElementById('view-listings').classList.add('active');
    document.getElementById('nav-listings').classList.add('active');
  } else {
    document.getElementById('view-saved').classList.add('active');
    document.getElementById('nav-saved').classList.add('active');
    renderSaved();
  }
}

// ===== Detail Modal =====
function openJobDetail(id) {
  const job = jobs.find(j => j.id === id);
  if (!job) return;
  currentDetailJobId = id;
  document.getElementById('detail-body').innerHTML = `
    <div class="detail-header">
      <div class="company-logo" style="background:${safeCssColor(job.logo)}; width:60px; height:60px; font-size:1.4rem">${getInitials(job.company)}</div>
      <div style="flex:1">
        <div class="detail-title">${escapeHtml(job.title)}</div>
        <div class="detail-company">${escapeHtml(job.company)}</div>
      </div>
      <button class="bookmark-btn ${savedJobs.has(job.id) ? 'saved' : ''}"
              onclick="toggleSave(${job.id}); openJobDetail(${job.id})"
              style="font-size:1.5rem">
        ${savedJobs.has(job.id) ? '★' : '☆'}
      </button>
    </div>
    <div class="detail-meta">
      <div><strong>Location</strong>${escapeHtml(job.location)}</div>
      <div><strong>Type</strong>${escapeHtml(job.type)}</div>
      <div><strong>Category</strong>${escapeHtml(job.category)}</div>
      <div><strong>Salary</strong>${escapeHtml(job.salary)}</div>
      <div><strong>Posted</strong>${formatPosted(job.posted)}</div>
    </div>
    <div class="detail-section">
      <h3>About the Role</h3>
      <p>${escapeHtml(job.description)}</p>
    </div>
    <div class="detail-section">
      <h3>Requirements</h3>
      <ul>${job.requirements.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
    </div>
    <div class="detail-section">
      <h3>Skills & Tags</h3>
      <div class="job-tags">
        ${job.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
      </div>
    </div>
  `;
  document.getElementById('detail-apply-btn').onclick = () => {
    closeModal('modal-detail');
    openApply(job);
  };
  openModal('modal-detail');
}

// ===== Apply =====
function openApply(job) {
  document.getElementById('apply-job-title').textContent = `Apply for ${job.title}`;
  document.getElementById('apply-name').value = '';
  document.getElementById('apply-email').value = '';
  document.getElementById('apply-resume').value = '';
  document.getElementById('apply-cover').value = '';
  openModal('modal-apply');
}

function submitApplication() {
  const name = document.getElementById('apply-name').value.trim();
  const email = document.getElementById('apply-email').value.trim();
  const resume = document.getElementById('apply-resume').value.trim();
  const cover = document.getElementById('apply-cover').value.trim();
  if (!name || !email) {
    showToast('Please fill in your name and email', 'error');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Please enter a valid email', 'error');
    return;
  }

  const job = jobs.find(j => j.id === currentDetailJobId);
  const application = {
    job_id: currentDetailJobId,
    job_title: job ? job.title : '',
    company: job ? job.company : '',
    applicant_name: name,
    applicant_email: email,
    resume_url: resume,
    cover_letter: cover
  };

  showToast('Submitting application…');

  // Primary: Google Sheet (Apps Script uses text/plain to avoid a CORS preflight)
  const sheetReq = fetch(SHEETS_API, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action: 'createApplication', application })
  }).then(r => r.json());

  // Backup: Formspree email
  const emailReq = fetch(FORMSPREE_APPLICATIONS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      _subject: `New application: ${application.job_title} @ ${application.company}`,
      ...application,
      submitted_at: new Date().toISOString()
    })
  });

  sheetReq
    .then(data => {
      if (!data.ok) throw new Error(data.error || 'Sheet write failed');
      closeModal('modal-apply');
      showToast('Application submitted! Good luck 🎉', 'success');
    })
    .catch(err => {
      console.error(err);
      showToast('Could not submit — please try again', 'error');
    });

  // Email backup is fire-and-forget; log failures but don't bother the user
  emailReq.catch(e => console.warn('Formspree backup failed:', e));
}

// ===== Passkey & Post Job =====
function openPostJob() {
  if (isEmployerVerified) {
    openModal('modal-post');
  } else {
    document.getElementById('passkey-input').value = '';
    document.getElementById('passkey-error').textContent = '';
    openModal('modal-passkey');
    setTimeout(() => document.getElementById('passkey-input').focus(), 100);
  }
}

async function verifyPasskey() {
  const input = document.getElementById('passkey-input');
  const error = document.getElementById('passkey-error');
  const modal = document.querySelector('#modal-passkey .modal');
  const encoded = new TextEncoder().encode(input.value);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  if (hashHex === EMPLOYER_PASSKEY_HASH) {
    isEmployerVerified = true;
    closeModal('modal-passkey');
    showToast('Access granted ✓', 'success');
    setTimeout(() => openModal('modal-post'), 250);
  } else {
    error.textContent = 'Incorrect passkey. Please try again.';
    modal.classList.add('shake');
    setTimeout(() => modal.classList.remove('shake'), 400);
    input.select();
  }
}

function submitJob() {
  const title = document.getElementById('post-title').value.trim();
  const company = document.getElementById('post-company').value.trim();
  const location = document.getElementById('post-location').value.trim();
  const type = document.getElementById('post-type').value;
  const category = document.getElementById('post-category').value;
  const salary = document.getElementById('post-salary').value.trim();
  const description = document.getElementById('post-description').value.trim();
  const requirements = document.getElementById('post-requirements').value.trim().split('\n').filter(Boolean);
  const tags = document.getElementById('post-tags').value.split(',').map(t => t.trim()).filter(Boolean);

  if (!title || !company || !location || !salary || !description) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  const salaryNum = parseInt(salary.replace(/[^0-9]/g, '').slice(0, 6)) || 50000;

  const jobPayload = {
    title, company, location, type, category, salary, salaryNum,
    description,
    requirements: requirements.length ? requirements : ['See description above'],
    tags: tags.length ? tags : [category]
  };

  showToast('Publishing job…');

  // Primary: Google Sheet
  const sheetReq = fetch(SHEETS_API, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      action: 'createJob',
      passkey: document.getElementById('passkey-input')?.value ?? '',
      job: jobPayload
    })
  }).then(r => r.json());

  // Backup: Formspree email
  const emailReq = fetch(FORMSPREE_POSTINGS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      _subject: `New job posted: ${title} @ ${company}`,
      title, company, location, type, category, salary,
      description,
      requirements: jobPayload.requirements.join('\n'),
      tags: jobPayload.tags.join(', '),
      submitted_at: new Date().toISOString()
    })
  });

  sheetReq
    .then(data => {
      if (!data.ok) throw new Error(data.error || 'Sheet write failed');
      // Add the newly-created job (with its real ID from the sheet) to the local list
      if (data.job) jobs.unshift(data.job);

      ['post-title','post-company','post-location','post-salary','post-description','post-requirements','post-tags']
        .forEach(id => document.getElementById(id).value = '');
      closeModal('modal-post');
      showToast('Job published successfully! 🎉', 'success');
      applyFilters();
    })
    .catch(err => {
      console.error(err);
      showToast('Could not publish — please try again', 'error');
    });

  emailReq.catch(e => console.warn('Formspree backup failed:', e));
}

// ===== Modal Helpers =====
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

// Close modal when clicking overlay
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
  });
});

// Passkey input — submit on Enter
document.getElementById('passkey-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') verifyPasskey();
});

// Search input — submit on Enter
document.getElementById('search-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') applyFilters();
});

// Filter changes
['filter-category','filter-type','filter-location','filter-sort'].forEach(id => {
  document.getElementById(id).addEventListener('change', applyFilters);
  if (id === 'filter-location') {
    document.getElementById(id).addEventListener('input', applyFilters);
  }
});

// ===== Toast =====
function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { toast.className = `toast ${type}`; }, 3000);
}

// ===== Initial Render =====
loadJobsFromSheet();
updateSavedCount();