/**
 * ===================================================================
 * DHARMESH KUMAR - PORTFOLIO INTERACTIVITY ENGINE
 * Interactive BI Simulator, Dynamic Charts, Modals, Code Showcase
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundCanvas();
  initThemeToggle();
  initNavbarScroll();
  initMobileMenu();
  initHeroMiniChart();
  initAnalyticsSandbox();
  initProjectFiltering();
  initCodeTerminal();
  initProjectModals();
  initResumeModal();
  initContactActions();
});

/* ===================================================================
   1. ANIMATED DATA NODES CANVAS BACKGROUND
   =================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('data-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const nodeCount = Math.min(Math.floor((width * height) / 18000), 65);
  const nodes = [];

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? 'rgba(56, 189, 248, ' : 'rgba(99, 102, 241, '
    });
  }

  let mouseX = -1000;
  let mouseY = -1000;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.18;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw and update nodes
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      // Subtle mouse interaction
      const mdx = node.x - mouseX;
      const mdy = node.y - mouseY;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 100) {
        node.x += (mdx / mdist) * 1.2;
        node.y += (mdy / mdist) * 1.2;
      }

      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = node.color + '0.75)';
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ===================================================================
   2. THEME TOGGLER (DARK / LIGHT)
   =================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('dk-portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('dk-portfolio-theme', newTheme);
    updateThemeIcon(newTheme);

    // Refresh charts colors
    if (window.analyticsMainChart) window.analyticsMainChart.destroy();
    if (window.analyticsSubChart) window.analyticsSubChart.destroy();
    if (window.heroChart) window.heroChart.destroy();
    initHeroMiniChart();
    renderSandboxCharts(currentActiveDataset);
  });
}

function updateThemeIcon(theme) {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;
  if (theme === 'light') {
    toggleBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>`;
    toggleBtn.title = 'Switch to Dark Mode';
  } else {
    toggleBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>`;
    toggleBtn.title = 'Switch to Light Mode';
  }
}

/* ===================================================================
   3. NAVBAR STICKY & MOBILE DRAWER
   =================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (!toggle || !navMenu) return;

  toggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  // Close when clicking nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
    });
  });
}

/* ===================================================================
   4. HERO MINI KPI CHART
   =================================================================== */
function initHeroMiniChart() {
  const ctx = document.getElementById('hero-sparkline');
  if (!ctx || typeof Chart === 'undefined') return;

  const isLight = document.documentElement.getAttribute('data-theme') === 'light';

  window.heroChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['2022', '2023', '2024', '2025', '2026 (YTD)'],
      datasets: [
        {
          label: 'Data Points Processed (M)',
          data: [1.2, 4.8, 14.5, 32.0, 58.4],
          borderColor: '#38bdf8',
          borderWidth: 2.5,
          tension: 0.38,
          fill: true,
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return 'rgba(56, 189, 248, 0.1)';
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
            gradient.addColorStop(1, 'rgba(56, 189, 248, 0.01)');
            return gradient;
          },
          pointBackgroundColor: '#38bdf8',
          pointBorderColor: '#ffffff',
          pointHoverRadius: 6,
          pointRadius: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isLight ? '#0f172a' : '#1e293b',
          titleFont: { family: 'Inter', size: 12 },
          bodyFont: { family: 'Inter', size: 12 },
          padding: 10,
          cornerRadius: 6
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: isLight ? '#64748b' : '#94a3b8',
            font: { size: 10, family: 'Inter' }
          }
        },
        y: {
          grid: {
            color: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.06)'
          },
          ticks: {
            color: isLight ? '#64748b' : '#94a3b8',
            font: { size: 10, family: 'Inter' },
            callback: (val) => val + 'M'
          }
        }
      }
    }
  });
}

/* ===================================================================
   5. INTERACTIVE LIVE ANALYTICS SANDBOX (POWER BI SIMULATOR)
   =================================================================== */
let currentActiveDataset = 'retail';
let currentActiveQuarter = 'all';

const SANDBOX_DATA = {
  retail: {
    title: 'Purchase Pattern & Basket Analytics (Quad AI)',
    badge: 'Retail Intelligence',
    kpis: {
      revenue: '$1.42M',
      orders: '24,850',
      aov: '$57.14',
      conversion: '4.82%'
    },
    insight: '<strong>Association Rule Mining:</strong> Cross-purchasing between Category A (Electronics) & Accessories spiked by <strong>+28.4%</strong> following basket-affinity shelf re-organization.',
    trendLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    trendData: [84, 92, 105, 118, 112, 130, 142, 138, 156, 168, 185, 210],
    subLabels: ['Accessories', 'Audio', 'Computing', 'Smart Wear', 'Peripherals'],
    subData: [34, 26, 21, 11, 8],
    subType: 'doughnut',
    subTitle: 'Basket Composition Breakdown (%)'
  },
  health: {
    title: 'Medical Cohorts & Admission Trends (Rubixe AI)',
    badge: 'Clinical Analytics',
    kpis: {
      revenue: '12,430',
      orders: '4.2 Days',
      aov: '89.4%',
      conversion: '7.8%'
    },
    kpiLabels: ['Total Patient Admissions', 'Avg Length of Stay (ALOS)', 'Bed Occupancy Rate', '30-Day Readmission Rate'],
    insight: '<strong>PostgreSQL Cohort Query:</strong> Demographics aged 60+ with BMI > 28.5 accounted for <strong>63% of prolonged stays (>7 days)</strong>, prompting proactive geriatric intake protocols.',
    trendLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    trendData: [920, 960, 1040, 1010, 1120, 1180, 1250, 1190, 1280, 1310, 1390, 1420],
    subLabels: ['Cardiology', 'Orthopedics', 'General Medicine', 'Neurology', 'Pulmonology'],
    subData: [32, 24, 20, 14, 10],
    subType: 'bar',
    subTitle: 'Admissions by Specialty (%)'
  },
  jobs: {
    title: 'Job Market & Compensation Analytics (Rubixe AI)',
    badge: 'Market Benchmarking',
    kpis: {
      revenue: '₹14.2 LPA',
      orders: '45,200',
      aov: '78.5%',
      conversion: '+22.4%'
    },
    kpiLabels: ['Avg Senior Analyst Package', 'Total Job Postings Tracked', 'SQL/Python Requirement', 'YoY BI Demand Surge'],
    insight: '<strong>Market Analysis:</strong> Roles requiring paired <strong>Power BI + PostgreSQL + Python</strong> commands a <strong>34% salary premium</strong> over pure spreadsheet reporting roles.',
    trendLabels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'],
    trendData: [8.5, 9.8, 10.5, 11.2, 12.0, 12.8, 13.5, 14.2],
    subLabels: ['Power BI', 'SQL / PostgreSQL', 'Python (Pandas)', 'Tableau', 'Excel/VBA'],
    subData: [38, 29, 18, 10, 5],
    subType: 'doughnut',
    subTitle: 'Skill Requirement Frequency (%)'
  },
  ml: {
    title: 'Customer Segmentation with K-Means (Machine Learning)',
    badge: 'Cluster Modeling',
    kpis: {
      revenue: '4 Clusters',
      orders: '0.68',
      aov: '3.4x',
      conversion: '91.2%'
    },
    kpiLabels: ['Behavioral Segments', 'Silhouette Coefficient', 'Top Cluster ROI Lift', 'PCA Variance Explained'],
    insight: '<strong>PCA & Clustering:</strong> Cluster 0 (High Recency, High Monetary) drove <strong>54% of annualized revenue</strong>; targeted VIP win-back strategies reduced churn by 18%.',
    trendLabels: ['Cluster 0 (Champions)', 'Cluster 1 (Loyal)', 'Cluster 2 (At-Risk)', 'Cluster 3 (Dormant)'],
    trendData: [3800, 5200, 2400, 1600],
    subLabels: ['Champions', 'Loyal Customers', 'At Risk', 'Dormant'],
    subData: [54, 28, 12, 6],
    subType: 'bar',
    subTitle: 'Revenue Contribution by Segment (%)'
  }
};

function initAnalyticsSandbox() {
  const datasetButtons = document.querySelectorAll('[data-dataset]');
  const quarterButtons = document.querySelectorAll('[data-quarter]');

  datasetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      datasetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentActiveDataset = btn.dataset.dataset;
      renderSandboxCharts(currentActiveDataset);
    });
  });

  quarterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      quarterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentActiveQuarter = btn.dataset.quarter;
      // In a real scenario, this filters the active dataset quarters
      renderSandboxCharts(currentActiveDataset, currentActiveQuarter);
    });
  });

  renderSandboxCharts('retail');
}

function renderSandboxCharts(datasetKey, quarter = 'all') {
  const data = SANDBOX_DATA[datasetKey];
  if (!data || typeof Chart === 'undefined') return;

  const isLight = document.documentElement.getAttribute('data-theme') === 'light';

  // 1. Update Header badge and Insight text
  const badgeEl = document.getElementById('sandbox-dataset-badge');
  const insightEl = document.getElementById('sandbox-insight-text');
  const mainTitleEl = document.getElementById('sandbox-main-title');
  const subTitleEl = document.getElementById('sandbox-sub-title');

  if (badgeEl) badgeEl.innerText = data.badge;
  if (insightEl) insightEl.innerHTML = data.insight;
  if (mainTitleEl) mainTitleEl.innerText = `${data.title} — Trend Analysis`;
  if (subTitleEl) subTitleEl.innerText = data.subTitle;

  // 2. Update KPI Cards
  const kpiLabels = data.kpiLabels || ['Total Revenue', 'Order Volume', 'Avg Basket Value', 'Conversion Rate'];
  const kpiKeys = ['kpi-rev', 'kpi-vol', 'kpi-aov', 'kpi-conv'];
  const kpiValues = [data.kpis.revenue, data.kpis.orders, data.kpis.aov, data.kpis.conversion];

  kpiKeys.forEach((id, idx) => {
    const valEl = document.getElementById(id);
    const lblEl = document.getElementById(`${id}-lbl`);
    if (valEl) valEl.innerText = kpiValues[idx];
    if (lblEl) lblEl.innerText = kpiLabels[idx];
  });

  // 3. Render / Update Main Chart
  const mainCtx = document.getElementById('sandbox-main-chart');
  if (mainCtx) {
    if (window.analyticsMainChart) window.analyticsMainChart.destroy();

    let displayLabels = [...data.trendLabels];
    let displayValues = [...data.trendData];

    // Filter by quarter if specified
    if (quarter === 'q1') {
      displayLabels = displayLabels.slice(0, 3);
      displayValues = displayValues.slice(0, 3);
    } else if (quarter === 'q2') {
      displayLabels = displayLabels.slice(3, 6);
      displayValues = displayValues.slice(3, 6);
    } else if (quarter === 'q3') {
      displayLabels = displayLabels.slice(6, 9);
      displayValues = displayValues.slice(6, 9);
    } else if (quarter === 'q4') {
      displayLabels = displayLabels.slice(9, 12);
      displayValues = displayValues.slice(9, 12);
    }

    window.analyticsMainChart = new Chart(mainCtx, {
      type: 'line',
      data: {
        labels: displayLabels,
        datasets: [
          {
            label: data.title,
            data: displayValues,
            borderColor: '#38bdf8',
            backgroundColor: (ctx) => {
              const chart = ctx.chart;
              const { ctx: c, chartArea } = chart;
              if (!chartArea) return 'rgba(56, 189, 248, 0.15)';
              const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
              g.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
              g.addColorStop(1, 'rgba(56, 189, 248, 0.02)');
              return g;
            },
            borderWidth: 3,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#38bdf8',
            pointBorderColor: '#ffffff',
            pointRadius: 4,
            pointHoverRadius: 7
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isLight ? '#0f172a' : '#1e293b',
            titleFont: { family: 'Inter', size: 12 },
            bodyFont: { family: 'Inter', size: 12 },
            padding: 12,
            cornerRadius: 8
          }
        },
        scales: {
          x: {
            grid: {
              color: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)'
            },
            ticks: {
              color: isLight ? '#64748b' : '#94a3b8',
              font: { family: 'Inter', size: 11 }
            }
          },
          y: {
            grid: {
              color: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.06)'
            },
            ticks: {
              color: isLight ? '#64748b' : '#94a3b8',
              font: { family: 'Inter', size: 11 }
            }
          }
        }
      }
    });
  }

  // 4. Render / Update Sub Chart (Donut / Bar)
  const subCtx = document.getElementById('sandbox-sub-chart');
  if (subCtx) {
    if (window.analyticsSubChart) window.analyticsSubChart.destroy();

    const chartColors = [
      '#38bdf8',
      '#6366f1',
      '#10b981',
      '#f59e0b',
      '#a855f7'
    ];

    window.analyticsSubChart = new Chart(subCtx, {
      type: data.subType,
      data: {
        labels: data.subLabels,
        datasets: [
          {
            data: data.subData,
            backgroundColor: chartColors.slice(0, data.subLabels.length),
            borderColor: isLight ? '#ffffff' : '#0f172a',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: isLight ? '#475569' : '#cbd5e1',
              font: { family: 'Inter', size: 11 },
              padding: 12,
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: isLight ? '#0f172a' : '#1e293b',
            titleFont: { family: 'Inter', size: 12 },
            bodyFont: { family: 'Inter', size: 12 },
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              label: (context) => ` ${context.label}: ${context.raw}%`
            }
          }
        },
        scales: data.subType === 'bar' ? {
          x: {
            grid: { display: false },
            ticks: { color: isLight ? '#64748b' : '#94a3b8', font: { size: 10 } }
          },
          y: {
            grid: { color: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.06)' },
            ticks: { color: isLight ? '#64748b' : '#94a3b8', font: { size: 10 } }
          }
        } : {}
      }
    });
  }
}

/* ===================================================================
   6. PROJECT CATEGORY FILTERING
   =================================================================== */
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.proj-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const categories = card.dataset.category || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ===================================================================
   7. INTERACTIVE CODE TERMINAL (SQL / PYTHON / ML)
   =================================================================== */
function initCodeTerminal() {
  const tabs = document.querySelectorAll('.terminal-tab');
  const panes = document.querySelectorAll('.code-pane');
  const copyBtn = document.getElementById('copy-terminal-code');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(tab.dataset.tab);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const activePane = document.querySelector('.code-pane.active code');
      if (!activePane) return;

      navigator.clipboard.writeText(activePane.innerText).then(() => {
        showToast('Code snippet copied to clipboard!');
      }).catch(() => {
        showToast('Code copied!');
      });
    });
  }
}

/* ===================================================================
   8. PROJECT DEEP-DIVE MODALS
   =================================================================== */
const PROJECT_MODAL_DETAILS = {
  'purchase-pattern': {
    title: 'Purchase Pattern Analytics | Quad AI',
    subtitle: 'Dec 2025 – Feb 2026 • Bangalore, India',
    tags: ['Python (Pandas, Seaborn)', 'SQL', 'Association Mining', 'EDA'],
    problem: 'Quad AI needed to unlock cross-selling opportunities and uncover hidden purchase sequence trends from multi-million record transactional datasets with high variance and sparse basket representations.',
    approach: [
      'Engineered end-to-end Python pipeline to ingest, clean, impute missing transactional attributes, and remove anomalous basket spikes.',
      'Constructed item-frequency affinity matrices and association rule metrics (Support, Confidence, and Lift).',
      'Synthesized SQL aggregate queries to segment high-propensity buying cohorts based on seasonality and time-of-day frequency.',
      'Designed executive visual storyboards in Seaborn and Matplotlib to present recommendations to merchandising and product leaders.'
    ],
    impact: 'Identified top 5 high-lift cross-sell product bundles, driving a simulated +18% basket value expansion and clarifying inventory placement across high-demand stock cycles.',
    codeSnippet: `-- Sample SQL: Frequency & Basket Co-Occurrence Query
WITH BasketPairs AS (
  SELECT 
    t1.transaction_id,
    t1.product_id AS item_a,
    t2.product_id AS item_b
  FROM order_items t1
  JOIN order_items t2 
    ON t1.transaction_id = t2.transaction_id 
    AND t1.product_id < t2.product_id
)
SELECT 
  p1.product_name AS item_a_name,
  p2.product_name AS item_b_name,
  COUNT(DISTINCT bp.transaction_id) AS co_occurrence_freq,
  DENSE_RANK() OVER (ORDER BY COUNT(DISTINCT bp.transaction_id) DESC) as affinity_rank
FROM BasketPairs bp
JOIN products p1 ON bp.item_a = p1.product_id
JOIN products p2 ON bp.item_b = p2.product_id
GROUP BY 1, 2
HAVING COUNT(DISTINCT bp.transaction_id) >= 50
ORDER BY co_occurrence_freq DESC
LIMIT 10;`
  },
  'medical-data': {
    title: 'Medical Data History Analysis | Rubixe AI Solutions',
    subtitle: 'Jul 2025 – Sep 2025 • Bangalore, India',
    tags: ['PostgreSQL', 'Advanced Excel', 'CTEs', 'Window Functions', 'Healthcare'],
    problem: 'Healthcare network required deep demographic and admission history analytics to understand factors driving prolonged patient length of stay (LOS), unplanned 30-day readmissions, and department bottlenecks.',
    approach: [
      'Wrote 30+ production-grade PostgreSQL queries joining across Patient, Admission, Doctor, and Diagnosis relational schemas.',
      'Implemented robust NULL handling, categorical normalizations, and dynamic BMI calculations via SQL CASE WHEN statements.',
      'Utilized Common Table Expressions (CTEs) and Window Functions (LAG, LEAD, DENSE_RANK) to calculate interval days between sequential hospital visits.',
      'Built multi-tab Advanced Excel analytical workbooks equipped with automated INDEX-MATCH lookups, Pivot Tables, and slicers for clinical directors.'
    ],
    impact: 'Uncovered that geriatric cohorts with elevated BMI exhibited a 42% higher probability of extended readmission, providing medical administration with actionable intervention criteria.',
    codeSnippet: `-- PostgreSQL CTE: 30-Day Readmission & Readmission Interval Analysis
WITH PatientVisits AS (
  SELECT 
    patient_id,
    admission_id,
    admission_date,
    discharge_date,
    department_id,
    LAG(discharge_date) OVER (
      PARTITION BY patient_id 
      ORDER BY admission_date
    ) AS prev_discharge_date,
    ROUND((weight_kg / POWER(height_cm / 100.0, 2))::numeric, 2) AS calculated_bmi
  FROM admissions
  WHERE status = 'Completed'
),
ReadmissionIntervals AS (
  SELECT 
    *,
    (admission_date - prev_discharge_date) AS days_between_visits,
    CASE 
      WHEN (admission_date - prev_discharge_date) <= 30 THEN 1 
      ELSE 0 
    END AS is_30day_readmission
  FROM PatientVisits
  WHERE prev_discharge_date IS NOT NULL
)
SELECT 
  department_id,
  COUNT(*) AS repeat_admissions,
  SUM(is_30day_readmission) AS total_30day_readmissions,
  ROUND(AVG(calculated_bmi), 2) AS avg_cohort_bmi,
  ROUND(SUM(is_30day_readmission)::numeric / COUNT(*) * 100, 2) AS readmission_rate_pct
FROM ReadmissionIntervals
GROUP BY department_id
ORDER BY total_30day_readmissions DESC;`
  },
  'job-market': {
    title: 'Job Market Analysis Dashboard | Rubixe AI Solutions',
    subtitle: 'Feb 2025 – Mar 2025 • Power BI & SQL',
    tags: ['Power BI', 'DAX', 'SQL', 'Python (Pandas, Matplotlib)', 'Excel'],
    problem: 'Tech recruitment and workforce strategy stakeholders lacked visibility into real-time skill demand shifts, salary trends across Indian tech hubs (Bangalore, Pune, Hyderabad), and compensation premiums.',
    approach: [
      'Extracted, merged, and cleaned multi-source job listing data with Python Pandas and SQL query pipelines.',
      'Built a dimensional star schema in Power BI with optimized relationships and DAX measures (YoY growth, median salary per tier, skill affinity indexing).',
      'Constructed dynamic interactive slicers for experience brackets (Entry, Mid, Senior), cities, remote vs onsite, and technical tools.',
      'Published interactive dashboards with drill-through navigation into city-specific compensation percentiles.'
    ],
    impact: 'Delivered executive visibility across 45,000+ tech job openings, showing a 34% compensation bump for analysts proficient in combined Power BI + SQL + Python compared to single-tool specialists.',
    codeSnippet: `// DAX Measure: Skill Premium Index vs Baseline Market
SkillSalaryPremiumIndex = 
VAR SelectedSkillAvg = 
    CALCULATE(
        AVERAGE(JobPostings[MaxSalaryLPA]),
        KEEPFILTERS(JobPostings[HasPythonSQL] = TRUE())
    )
VAR OverallAvg = 
    CALCULATE(
        AVERAGE(JobPostings[MaxSalaryLPA]),
        ALL(JobPostings)
    )
RETURN
    DIVIDE(SelectedSkillAvg - OverallAvg, OverallAvg, 0) * 100`
  },
  'customer-segmentation': {
    title: 'Customer Segmentation with Machine Learning',
    subtitle: 'Sep 2024 – Dec 2024 • Unsupervised ML & PCA',
    tags: ['Python', 'Scikit-learn', 'K-Means Clustering', 'PCA', 'Pandas'],
    problem: 'Generic marketing outreach resulted in high email unsubscribe rates and diminished campaign ROI due to lack of customer behavioral segmentation.',
    approach: [
      'Extracted RFM (Recency, Frequency, Monetary) metrics and transaction velocity from historical customer purchases.',
      'Conducted robust data cleaning, missing value imputation, and log transformations to address right-skewed revenue distributions.',
      'Applied StandardScaler and Principal Component Analysis (PCA) to reduce multi-collinear dimensions while capturing 91.2% total variance.',
      'Trained K-Means clustering across k=2 to 8, identifying optimal k=4 via Elbow Method and Silhouette Coefficient (0.68).',
      'Mapped business personas: "VIP Champions", "High-Volume Loyalists", "At-Risk Spenders", and "Hibernating Buyers".'
    ],
    impact: 'Enabled targeted retention and upsell campaigns; VIP customer re-engagement campaign increased repeat purchase rates by 22% in subsequent quarters.',
    codeSnippet: `# Python: K-Means & PCA Clustering Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import pandas as pd

# Standardize RFM Features
scaler = StandardScaler()
rfm_scaled = scaler.fit_transform(df[['Recency', 'Frequency', 'Monetary']])

# Principal Component Analysis
pca = PCA(n_components=2, random_state=42)
pca_features = pca.fit_transform(rfm_scaled)

# Optimal K-Means Model
kmeans = KMeans(n_clusters=4, init='k-means++', n_init=10, random_state=42)
df['Cluster'] = kmeans.fit_predict(pca_features)

sil_score = silhouette_score(pca_features, df['Cluster'])
print(f"Optimal Cluster Silhouette Score: {sil_score:.3f}")
print("Cluster Distribution:\n", df['Cluster'].value_counts())`
  },
  'deep-learning-churn': {
    title: 'Deep Learning Customer Churn Intelligence',
    subtitle: 'PyTorch & NumPy • Entity Embedding Tabular ResNet',
    tags: ['PyTorch', 'Python', 'Deep Learning', 'Tableau', 'Ensemble ML'],
    problem: 'Enterprise subscription platform experienced escalating customer churn without granular visibility into non-linear behavioral predictors.',
    approach: [
      'Built custom entity-embedding Tabular ResNet architecture from scratch in NumPy and PyTorch.',
      'Conducted 30-trial hyperparameter tuning and assembled a 5-model ensemble with calibrated probability outputs (0.753 PR-AUC).',
      'Extracted individualized feature attribution explaining exact churn risk factors per subscriber.',
      'Constructed a Tableau dashboard linked with a campaign ROI simulator to evaluate retention incentives.'
    ],
    impact: 'Achieved 0.753 PR-AUC calibration, powering automated retention workflows and protecting significant customer lifetime value.',
    codeSnippet: `# PyTorch Tabular ResNet Residual Block Snippet
import torch
import torch.nn as nn

class ResNetBlock(nn.Module):
    def __init__(self, dim, dropout=0.2):
        super().__init__()
        self.fc1 = nn.Linear(dim, dim)
        self.bn1 = nn.BatchNorm1d(dim)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(dropout)
        self.fc2 = nn.Linear(dim, dim)
        self.bn2 = nn.BatchNorm1d(dim)

    def forward(self, x):
        residual = x
        out = self.dropout(self.relu(self.bn1(self.fc1(x))))
        out = self.bn2(self.fc2(out))
        return self.relu(out + residual)`
  },
  'llm-datapilot': {
    title: 'LLM Advance Datapilot AI (Multi-Agent Analytics)',
    subtitle: 'Python • LangChain • Multi-Agent Sandboxed Analytics',
    tags: ['Python', 'LLM Agents', 'Pandas', 'SQL', 'Automated BI'],
    problem: 'Business non-technical users struggle to write complex SQL and Pandas queries to extract ad-hoc business answers quickly from spreadsheets.',
    approach: [
      'Architected a multi-agent analyst pipeline featuring Planner, Analyst, and Code Reviewer agents.',
      'Configured sandboxed Python/SQL code execution to compute statistical tests, anomaly checks, and trends on arbitrary CSVs.',
      'Implemented automated hallucination verification to cross-check computed numbers against raw tabular outputs.',
      'Generated structured interactive HTML reports with auto-embedded visualizations.'
    ],
    impact: 'Democratized data analysis across non-technical stakeholders, cutting exploratory query turnaround times from hours to seconds.',
    codeSnippet: `# Multi-Agent Task Routing Snippet
class DatapilotOrchestrator:
    def __init__(self, df, llm_engine):
        self.df = df
        self.engine = llm_engine
        
    def analyze_query(self, user_prompt: str) -> dict:
        plan = self.planner_agent(user_prompt, schema=self.df.dtypes)
        code = self.analyst_agent(plan)
        validated_code = self.reviewer_agent(code, self.df)
        execution_result = self.sandbox_exec(validated_code, self.df)
        return self.synthesize_report(user_prompt, execution_result)`
  },
  'blinkit-grocery': {
    title: 'Blinkit Grocery Store Sales Performance Dashboard',
    subtitle: 'Power BI • DAX • Retail FMCG Analytics',
    tags: ['Power BI', 'DAX', 'Excel', 'FMCG Retail', 'Data Modeling'],
    problem: 'Blinkit retail operations required centralized analytics to monitor store sales, fat-content preferences, outlet tier distribution, and category revenue across Indian markets.',
    approach: [
      'Ingested and preprocessed 8,523 product records across multi-tier retail outlet types.',
      'Engineered star schema model connecting outlet attributes, item categories, and transactional revenue.',
      'Created DAX KPIs for Total Sales ($1.20M), Average Transaction ($141), Average Item Rating (3.92), and Outlets Count.',
      'Built dynamic visual slicers for Outlet Location Type, Size, Item Type, and Establishment Year.'
    ],
    impact: 'Uncovered key revenue concentration in Tier 1 and Tier 3 supermarkets, optimizing product shelf allocation and inventory restocking.',
    codeSnippet: `// DAX: Outlet Revenue Contribution %
OutletSalesShare = 
DIVIDE(
    [Total Sales], 
    CALCULATE([Total Sales], ALL(BlinkitGrocery[Outlet_Type]))
)`
  },
  'foodservicedb': {
    title: 'FoodserviceDB Analytics & Relational Schema',
    subtitle: 'Microsoft SQL Server • T-SQL • Schema Optimization',
    tags: ['SQL Server', 'T-SQL', 'Stored Procedures', 'Indexing', 'Schema Design'],
    problem: 'Hospitality data required structured relational modeling, index optimization, and automated reporting procedures to evaluate consumer restaurant ratings and cuisines.',
    approach: [
      'Designed normalized 3NF relational database schema with rigorous primary, foreign key, and unique constraints.',
      'Authored parameterized T-SQL stored procedures and views for high-frequency analytical queries.',
      'Implemented non-clustered indexing across high-cardinality search fields to boost query execution performance.',
      'Executed data hygiene and integrity checks to handle NULL values and inconsistencies in user reviews.'
    ],
    impact: 'Reduced analytics query latency by 65% through targeted indexing and automated weekly rating aggregation procedures.',
    codeSnippet: `-- T-SQL: Top Rated Cuisines with Execution Indexing
CREATE OR ALTER PROCEDURE sp_GetTopCuisinePerformance
    @MinReviews INT = 25
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        c.CuisineName,
        COUNT(r.ReviewID) AS TotalReviews,
        ROUND(AVG(r.Rating * 1.0), 2) AS AvgRating,
        DENSE_RANK() OVER (ORDER BY AVG(r.Rating * 1.0) DESC) as RankOrder
    FROM Restaurants res
    INNER JOIN Cuisines c ON res.CuisineID = c.CuisineID
    INNER JOIN Reviews r ON res.RestaurantID = r.RestaurantID
    GROUP BY c.CuisineName
    HAVING COUNT(r.ReviewID) >= @MinReviews
    ORDER BY AvgRating DESC;
END;`
  }
};

function initProjectModals() {
  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const triggerBtns = document.querySelectorAll('[data-project-trigger]');

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projKey = btn.dataset.projectTrigger;
      openProjectModal(projKey);
    });
  });

  if (modalCloseBtn && modalOverlay) {
    modalCloseBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      modalOverlay.classList.remove('active');
    }
  });
}

function openProjectModal(projKey) {
  const modalOverlay = document.getElementById('project-modal');
  const details = PROJECT_MODAL_DETAILS[projKey];
  if (!modalOverlay || !details) return;

  const contentEl = document.getElementById('modal-project-content');
  if (!contentEl) return;

  const tagsHtml = details.tags.map(t => `<span class="badge-tag">${t}</span>`).join(' ');
  const approachHtml = details.approach.map(a => `<li>${a}</li>`).join('');

  contentEl.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.35rem;">${details.title}</h2>
      <p style="color: var(--accent-cyan); font-size: 0.9rem; font-weight: 500; margin-bottom: 0.75rem;">${details.subtitle}</p>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">${tagsHtml}</div>
    </div>

    <div style="margin-bottom: 1.5rem;">
      <h4 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.04em;">Problem Statement</h4>
      <p style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.6;">${details.problem}</p>
    </div>

    <div style="margin-bottom: 1.5rem;">
      <h4 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.04em;">Analytics Approach & Pipeline</h4>
      <ul style="list-style: disc; padding-left: 1.25rem; color: var(--text-secondary); font-size: 0.92rem; display: flex; flex-direction: column; gap: 0.4rem;">
        ${approachHtml}
      </ul>
    </div>

    <div style="background: rgba(16, 185, 129, 0.08); border-left: 3px solid #10b981; padding: 1rem 1.25rem; border-radius: 0 8px 8px 0; margin-bottom: 1.5rem;">
      <h4 style="color: #34d399; font-size: 0.9rem; font-weight: 700; margin-bottom: 0.35rem; text-transform: uppercase;">Business Impact & Results</h4>
      <p style="color: var(--text-primary); font-size: 0.92rem; line-height: 1.6;">${details.impact}</p>
    </div>

    <div>
      <h4 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.04em;">Production Query / Code Blueprint</h4>
      <pre style="background: #0d1117; color: #e6edf3; padding: 1rem; border-radius: 8px; font-family: var(--font-mono); font-size: 0.8rem; overflow-x: auto; border: 1px solid rgba(255,255,255,0.1);"><code>${escapeHtml(details.codeSnippet)}</code></pre>
    </div>
  `;

  modalOverlay.classList.add('active');
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/* ===================================================================
   9. RESUME MODAL & PRINTING
   =================================================================== */
function initResumeModal() {
  const resumeModal = document.getElementById('resume-modal');
  const triggerBtns = document.querySelectorAll('[data-resume-trigger]');
  const closeBtn = document.getElementById('resume-modal-close');
  const printBtn = document.getElementById('print-resume-btn');

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (resumeModal) resumeModal.classList.add('active');
    });
  });

  if (closeBtn && resumeModal) {
    closeBtn.addEventListener('click', () => {
      resumeModal.classList.remove('active');
    });

    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        resumeModal.classList.remove('active');
      }
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* ===================================================================
   10. CONTACT ACTIONS & TOAST
   =================================================================== */
function initContactActions() {
  const copyEmailBtns = document.querySelectorAll('[data-copy-email]');
  const contactForm = document.getElementById('contact-form');

  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'dharmeshkumar2702@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email address copied to clipboard: ' + email);
      }).catch(() => {
        showToast(email);
      });
    });
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name')?.value || 'Guest';
      const email = document.getElementById('form-email')?.value;
      const message = document.getElementById('form-message')?.value;

      // Friendly simulated response
      showToast(`Thank you, ${name}! Your message has been prepared.`);

      // Also trigger pre-filled mailto
      const mailtoUrl = `mailto:dharmeshkumar2702@gmail.com?subject=${encodeURIComponent('Portfolio Inquiry from ' + name)}&body=${encodeURIComponent(message + '\n\nSender Email: ' + email)}`;
      window.location.href = mailtoUrl;

      contactForm.reset();
    });
  }
}

function showToast(message) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
