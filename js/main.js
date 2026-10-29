/**
 * Senior Software Engineer Portfolio
 * Interactive Functionality: AI Terminal, Project Showcase, Blog Reader, Theme Manager
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initScrollEffects();
  initHeroInteractive3D();
  initCounterAnimations();
  initSkillTabs();
  initProjectFilters();
  initProjectModals();
  initAiTerminal();
  initBlogFilters();
  initBlogModals();
  initContactForm();
  initCopyEmail();
});

/* ==========================================================================
   0. HERO 3D PERSPECTIVE PARALLAX & LIVING INTERACTION
   ========================================================================== */
function initHeroInteractive3D() {
  const visual = document.getElementById('heroVisual');
  const img = document.getElementById('heroDevImg');
  if (!visual || !img) return;

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let isHovered = false;

  visual.addEventListener('mousemove', (e) => {
    isHovered = true;
    const rect = visual.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    targetX = x * 18; // rotation around Y axis in degrees
    targetY = -y * 14; // rotation around X axis in degrees
  });

  visual.addEventListener('mouseleave', () => {
    isHovered = false;
    targetX = 0;
    targetY = 0;
  });

  function updateParallax() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    if (isHovered || Math.abs(currentX) > 0.05 || Math.abs(currentY) > 0.05) {
      img.style.transform = `perspective(1000px) rotateY(${currentX.toFixed(2)}deg) rotateX(${currentY.toFixed(2)}deg) translateY(-8px) scale(1.02)`;
    } else {
      img.style.transform = '';
    }
    requestAnimationFrame(updateParallax);
  }
  updateParallax();
}

/* ==========================================================================
   1. THEME SWITCHER (DARK / LIGHT)
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  
  // Check persisted theme or default to light
  const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
  html.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', nextTheme);
      localStorage.setItem('portfolio-theme', nextTheme);
    });
  }
}

/* ==========================================================================
   2. NAVIGATION & MOBILE HAMBURGER
   ========================================================================== */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActiveNavLink();
  });

  // Mobile menu toggle
  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }
}

function highlightActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.pageYOffset;

  sections.forEach(sec => {
    const sectionHeight = sec.offsetHeight;
    const sectionTop = sec.offsetTop - 120;
    const sectionId = sec.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (link) {
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
}

/* ==========================================================================
   3. SCROLL PROGRESS
   ========================================================================== */
function initScrollEffects() {
  const scrollProgress = document.getElementById('scrollProgress');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }
  });

  // Set current year in footer
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ==========================================================================
   4. ANIMATED METRIC COUNTERS
   ========================================================================== */
function initCounterAnimations() {
  const metrics = document.querySelectorAll('.metric-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        metrics.forEach(metric => {
          const target = parseInt(metric.getAttribute('data-target'), 10);
          const suffix = metric.textContent.includes('k') ? 'k+' : '+';
          let count = 0;
          const speed = Math.max(15, Math.floor(1500 / target));

          const timer = setInterval(() => {
            count += Math.ceil(target / 40);
            if (count >= target) {
              count = target;
              metric.textContent = `${count}${suffix}`;
              clearInterval(timer);
            } else {
              metric.textContent = `${count}${suffix}`;
            }
          }, speed);
        });
      }
    });
  }, { threshold: 0.5 });

  const heroMetrics = document.querySelector('.hero-metrics');
  if (heroMetrics) {
    observer.observe(heroMetrics);
  }
}

/* ==========================================================================
   5. SKILLS FILTER TABS
   ========================================================================== */
function initSkillTabs() {
  const tabButtons = document.querySelectorAll('.skills-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-skill-category');

      skillCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat.includes(category)) {
          card.style.display = 'block';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   6. PROJECTS FILTER
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const types = card.getAttribute('data-project-type') || '';
        if (filter === 'all' || types.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 40);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => { card.style.display = 'none'; }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   7. PROJECT MODAL DETAILS DATA & LOGIC
   ========================================================================== */
const projectsData = {
  'pulse-ai': {
    title: 'PulseAI: Autonomous Health & Vitals Assistant',
    badge: 'Mobile + AI Architecture',
    summary: 'A mission-critical Flutter application integrating BLE sensor streams with Gemini LLM models for immediate physiological anomaly detection and proactive wellness alerts.',
    metrics: [
      { num: '4.9★', label: 'App Store Rating' },
      { num: '120 FPS', label: 'Custom Skia/Impeller Charts' },
      { num: '99.4%', label: 'BLE Sensor Sync Reliability' }
    ],
    challenge: 'Handling erratic Bluetooth telemetry streams from multiple medical monitors without freezing the main Flutter UI thread, while performing rapid semantic summarization through localized and cloud AI models.',
    solution: 'Designed an asynchronous isolate-based Dart pipeline that parses raw hex payloads off the UI thread. Configured a caching layer with SQLite for offline data collection, streaming batched data into Gemini Flash for natural-language health insights.',
    stack: ['Flutter 3.x', 'Dart', 'Gemini Pro / Flash', 'BLE CoreBluetooth/AndroidBLE', 'SQLite', 'Bloc Pattern'],
    highlights: [
      'Zero UI frame drop during continuous 200Hz heart rate sensor telemetry streaming.',
      'HIPAA/GDPR-compliant local data encryption using Flutter Secure Storage & AES-256.',
      'Automated PDF health export generated directly on-device.'
    ]
  },
  'omnicommerce': {
    title: 'OmniCommerce: Scalable Multi-Tenant E-Commerce',
    badge: 'Full-Stack Web & Microservices',
    summary: 'High-throughput modern commerce engine built with Next.js 14 App Router, TypeScript, Node.js, and Redis caching supporting 50,000+ monthly active shoppers.',
    metrics: [
      { num: '50k+', label: 'Monthly Active Shoppers' },
      { num: '320ms', label: 'P99 Server Response Time' },
      { num: '99.98%', label: 'System Uptime' }
    ],
    challenge: 'Mitigating database race conditions and checkout contention during flash sale events with thousands of concurrent cart checkouts.',
    solution: 'Implemented distributed locking via Redis Redlock and optimistic concurrency control in PostgreSQL. Leveraged Next.js Server Components with ISR (Incremental Static Regeneration) for high-speed edge catalog delivery.',
    stack: ['Next.js 14', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'Stripe API'],
    highlights: [
      'Instantaneous checkout flow with automated payment idempotency keys.',
      'Unified admin panel for real-time inventory adjustments and analytics streaming.',
      'Headless API architecture allowing native Flutter mobile clients to share the same backend.'
    ]
  },
  'neurodocs': {
    title: 'NeuroDocs: Enterprise RAG Knowledge Engine',
    badge: 'Artificial Intelligence & Agents',
    summary: 'An autonomous technical documentation engine utilizing LangChain, Pinecone vector embeddings, and LLM reasoning to summarize repos and technical RFCs.',
    metrics: [
      { num: '10x', label: 'Query Speed Improvement' },
      { num: '98.2%', label: 'Vector Retrieval Precision' },
      { num: '15k+', label: 'Technical PDFs Ingested' }
    ],
    challenge: 'Standard LLMs suffered from hallucinations and context window overflow when queried about specialized legacy codebases and 500-page enterprise software manuals.',
    solution: 'Constructed a multi-stage chunking and hybrid dense-sparse vector indexing pipeline with Pinecone and BGE rerankers. Embedded citation verification agents to cross-examine output against raw source snippets.',
    stack: ['Python', 'FastAPI', 'LangChain', 'OpenAI GPT-4o', 'Gemini API', 'Pinecone', 'React'],
    highlights: [
      'Autonomous tool-calling agents that can execute code snippets in a sandboxed runtime to verify answers.',
      'Dynamic token budget optimization reducing API inference costs by 45%.',
      'Real-time streaming token response to browser clients via Server-Sent Events (SSE).'
    ]
  },
  'fleettrack': {
    title: 'FleetTrack: Real-Time Fleet & Logistics Telematics',
    badge: 'Mobile + IoT Systems',
    summary: 'Enterprise mobile client and dispatcher console for tracking 1,200+ commercial transport vehicles with continuous GPS and route recalculation.',
    metrics: [
      { num: '1,200+', label: 'Active Fleet Vehicles' },
      { num: '<150ms', label: 'WebSocket Latency' },
      { num: '18%', label: 'Fuel Cost Savings Achieved' }
    ],
    challenge: 'Mobile devices experienced severe battery drain from constant background GPS polling and socket reconnect overhead in dead network zones.',
    solution: 'Designed an adaptive location throttle in Dart/Kotlin that dynamically increases ping frequency based on accelerometer speed thresholds. Implemented offline event queuing with automatic replay.',
    stack: ['Flutter', 'Dart', 'Go (Golang)', 'WebSockets', 'Google Maps Platform', 'PostGIS'],
    highlights: [
      'Interactive multi-marker vehicle clustering rendering thousands of units smoothly.',
      'Geofencing alerts triggered within 1 second of perimeter breach.',
      'Offline turn-by-turn navigation backup.'
    ]
  },
  'devpulse': {
    title: 'DevPulse: Technical Knowledge Forum & Code Hub',
    badge: 'Modern Web Architecture',
    summary: 'Interactive developer portal supporting live markdown code previews, GraphQL queries, thread voting, and real-time collaboration.',
    metrics: [
      { num: '25k+', label: 'Active Developer Members' },
      { num: '100k+', label: 'Snippets Shared' },
      { num: '99 Score', label: 'Google Lighthouse Performance' }
    ],
    challenge: 'Maintaining instant UI rendering while parsing heavy Markdown with code syntax highlighting and mathematical formulas (KaTeX) in real time.',
    solution: 'Employed Web Workers to offload Markdown parsing and syntax highlighting from the main thread. Integrated GraphQL with Apollo Client caching to minimize network payload sizes.',
    stack: ['React', 'TypeScript', 'GraphQL', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    highlights: [
      'Real-time multiplayer cursor and snippet editing via WebSockets.',
      'Accessible keyboard-first navigation compliant with WCAG 2.1 AA.',
      'Automated spam detection filter powered by text classification models.'
    ]
  },
  'visioncraft': {
    title: 'VisionCraft: On-Device Computer Vision Studio',
    badge: 'Mobile + Edge Machine Learning',
    summary: 'Sub-30ms offline edge AI processing for instant object segmentation, document OCR scanning, and intelligent visual feature extraction on mobile devices.',
    metrics: [
      { num: '28ms', label: 'Average On-Device Inference' },
      { num: '100%', label: 'Offline Privacy Protection' },
      { num: '30MB', label: 'Quantized Neural Model Size' }
    ],
    challenge: 'Running deep learning segmentation models on budget mobile hardware without inducing thermal throttling or frame rate degradation.',
    solution: 'Quantized FP32 weights into 8-bit INT8 representations with TensorFlow Lite and CoreML delegates. Interfaced with the camera preview buffer directly via Dart FFI pointers.',
    stack: ['Flutter', 'TensorFlow Lite', 'CoreML', 'CameraX', 'Dart FFI', 'C++'],
    highlights: [
      'Complete data privacy with zero images ever uploaded to cloud servers.',
      'Instant OCR text extraction directly into searchable JSON.',
      'Adaptive camera exposure adjustment based on machine learning feedback.'
    ]
  }
};

function initProjectModals() {
  const modalBackdrop = document.getElementById('projectModalBackdrop');
  const modalContent = document.getElementById('projectModalContent');
  const closeBtn = document.getElementById('closeProjectModal');
  const openButtons = document.querySelectorAll('.open-modal-btn');

  function openModal(projectId) {
    const data = projectsData[projectId];
    if (!data) return;

    modalContent.innerHTML = `
      <div class="modal-header-tag">${data.badge}</div>
      <h2 class="modal-title">${data.title}</h2>
      <p style="font-size: 1.05rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 24px;">${data.summary}</p>

      <div class="modal-metrics-row">
        ${data.metrics.map(m => `
          <div class="modal-metric-card">
            <strong>${m.num}</strong>
            <span>${m.label}</span>
          </div>
        `).join('')}
      </div>

      <h3 class="modal-section-title">The Engineering Challenge</h3>
      <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.65;">${data.challenge}</p>

      <h3 class="modal-section-title">Architectural Solution</h3>
      <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.65;">${data.solution}</p>

      <h3 class="modal-section-title">Key Architectural Highlights</h3>
      <ul style="list-style: none; padding-left: 0; margin-top: 10px; display: flex; flex-direction: column; gap: 8px;">
        ${data.highlights.map(h => `
          <li style="color: var(--text-secondary); font-size: 0.92rem; position: relative; padding-left: 22px;">
            <span style="position: absolute; left: 0; color: var(--accent-cyan); font-weight: bold;">✔</span>
            ${h}
          </li>
        `).join('')}
      </ul>

      <h3 class="modal-section-title">Technologies &amp; Frameworks</h3>
      <div class="modal-tech-stack">
        ${data.stack.map(s => `<span class="tech-pill">${s}</span>`).join('')}
      </div>

      <div class="modal-actions">
        <a href="#contact" class="btn btn-primary" onclick="document.getElementById('projectModalBackdrop').classList.remove('open')">Discuss Similar Architecture</a>
        <button class="btn btn-glass" onclick="document.getElementById('projectModalBackdrop').classList.remove('open')">Close Details</button>
      </div>
    `;

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.getAttribute('data-project');
      openModal(pid);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   8. INTERACTIVE AI TERMINAL LAB
   ========================================================================== */
function initAiTerminal() {
  const terminalForm = document.getElementById('terminalForm');
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const quickChips = document.querySelectorAll('.quick-chip');

  const knowledgeBase = [
    {
      keywords: ['flutter', 'mobile', 'dart', 'cross-platform', 'ios', 'android'],
      reply: 'Flutter & Dart have been my core mobile engineering focus for over 6 years! I build 120 FPS apps using Clean Architecture, Bloc/Riverpod state management, custom platform channels for iOS/Android native APIs, and automated CI/CD stores publishing. My apps handle real-time BLE, offline synchronization, and complex interactive animations.'
    },
    {
      keywords: ['ai', 'llm', 'rag', 'langchain', 'agents', 'gemini', 'gpt', 'machine learning'],
      reply: 'I am deeply enthusiastic about AI systems! I architect autonomous LLM agents with LangChain & LangGraph, vector search with Pinecone/ChromaDB for enterprise RAG, and on-device inference using TensorFlow Lite and CoreML on mobile. I love turning static apps into proactive, intelligent companions.'
    },
    {
      keywords: ['experience', '7', 'journey', 'years', 'background', 'career', 'senior'],
      reply: 'I have 7+ years of hands-on software engineering experience. I evolved from building frontend web and native mobile UI prototypes into architecting high-concurrency cloud backends, enterprise Flutter applications, and leading technical teams as a Lead/Senior Software Engineer.'
    },
    {
      keywords: ['web', 'react', 'next', 'typescript', 'fullstack', 'backend', 'node'],
      reply: 'On the web and backend, I specialize in Next.js 14, React, TypeScript, Node.js, Express, and microservices architecture. I design high-throughput REST and GraphQL APIs, integrate Redis caching, manage PostgreSQL and MongoDB databases, and deploy with Docker on AWS and GCP.'
    },
    {
      keywords: ['hire', 'contact', 'email', 'available', 'job', 'project', 'freelance'],
      reply: 'I am currently open to senior/lead software engineering roles, high-impact consulting, and flagship mobile/AI project partnerships! You can reach me directly via the Contact section below or email at developer.engineer.contact@gmail.com.'
    },
    {
      keywords: ['projects', 'portfolio', 'apps', 'work'],
      reply: 'Some of my featured production work includes PulseAI (Healthcare BLE + Gemini AI), OmniCommerce (Next.js multi-tenant platform with 50k+ MAU), NeuroDocs (Enterprise RAG engine), FleetTrack (Real-time IoT telematics for 1,200+ vehicles), and VisionCraft (On-device Edge AI studio).'
    }
  ];

  function getAiResponse(query) {
    const q = query.toLowerCase();
    for (const item of knowledgeBase) {
      if (item.keywords.some(k => q.includes(k))) {
        return item.reply;
      }
    }
    return `That's a great question about "${query}". As a Senior Software Engineer with 7+ years of experience across Flutter mobile, full-stack web, and AI architectures, I always focus on performance, maintainable code, and high end-user impact. Feel free to explore my shipped projects above or reach out via the contact form!`;
  }

  function appendTerminalMessage(role, text) {
    const line = document.createElement('div');
    line.className = `term-line term-${role}`;

    const prefix = document.createElement('span');
    prefix.className = 'term-prefix';
    prefix.textContent = role === 'user' ? 'You:' : 'DevBot:';

    const content = document.createElement('span');
    line.appendChild(prefix);
    line.appendChild(content);
    terminalOutput.appendChild(line);

    if (role === 'assistant') {
      // Simulate fast streaming
      let index = 0;
      const speed = 12;
      const timer = setInterval(() => {
        content.textContent += text.charAt(index);
        index++;
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        if (index >= text.length) clearInterval(timer);
      }, speed);
    } else {
      content.textContent = text;
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
  }

  if (terminalForm && terminalInput) {
    terminalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = terminalInput.value.trim();
      if (!val) return;

      appendTerminalMessage('user', val);
      terminalInput.value = '';

      setTimeout(() => {
        const reply = getAiResponse(val);
        appendTerminalMessage('assistant', reply);
      }, 300);
    });
  }

  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      if (prompt) {
        terminalInput.value = prompt;
        terminalForm.dispatchEvent(new Event('submit'));
      }
    });
  });
}

/* ==========================================================================
   9. BLOG FILTERS
   ========================================================================== */
function initBlogFilters() {
  const filterBtns = document.querySelectorAll('.blog-filter-btn');
  const blogCards = document.querySelectorAll('.blog-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-blog-filter');

      blogCards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; }, 30);
        } else {
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   10. BLOG ARTICLE READER MODAL
   ========================================================================== */
const blogPostsData = {
  'flutter-perf': {
    title: 'Mastering 120 FPS in Flutter: Eliminating UI Jank & Memory Leaks',
    badge: 'Mobile Engineering • 7 min read',
    date: 'March 2026',
    content: `
      <p>Building high-framerate, jank-free Flutter apps requires understanding Flutter's render pipeline: Widget, Element, and RenderObject. Over the past 6+ years of production Flutter development, here are the most critical architectural techniques for 120 FPS performance:</p>
      
      <h4>1. Relayout & Repaint Boundaries</h4>
      <p>Whenever an animated widget ticks (like a radar scanner or loading spinner), it can inadvertently trigger ancestor repaints if not properly isolated. Always wrap continuously animated subtrees in a <code>RepaintBoundary</code> to prevent the entire screen from re-rasterizing.</p>

      <pre><code>// Isolate animations to their own render layer
RepaintBoundary(
  child: AnimatedHeartbeatWidget(),
)</code></pre>

      <h4>2. Heavy Computations Belong in Isolates</h4>
      <p>Because Dart's main event loop handles UI layout, gesture input, and animation frames, parsing large JSON documents or processing sensor arrays on the main thread leads directly to dropped frames. Utilize <code>compute()</code> or long-lived background Isolates with <code>Isolate.spawn()</code>.</p>

      <h4>3. Avoid Allocations in Build Methods</h4>
      <p>Instantiating complex objects, formatters, or unmemoized lambdas inside <code>build()</code> pollutes the garbage collector. Use <code>const</code> constructors relentlessly and hoist stateful instances into state controllers or providers.</p>
    `
  },
  'ai-agents': {
    title: 'Building Autonomous LLM Agents: From RAG to Multi-Agent Workflows',
    badge: 'AI Development • 9 min read',
    date: 'January 2026',
    content: `
      <p>The progression of AI development has moved rapidly from simple zero-shot prompting to structured Retrieval-Augmented Generation (RAG), and now to autonomous multi-agent workflows. Here is how modern software engineers can build reliable AI systems:</p>

      <h4>1. The Limits of Naive RAG</h4>
      <p>Basic vector similarity search frequently retrieves irrelevant context when user queries contain ambiguities or temporal conditions. High-precision architectures employ query decomposition, parent-document retrieval, and cross-encoder reranking to ensure top-quality context.</p>

      <h4>2. Deterministic Tool Calling</h4>
      <p>Giving an LLM access to external tools (SQL databases, APIs, code runners) requires strict schema validation using tools like Pydantic or TypeScript Zod. Never let an LLM execute arbitrary unvalidated code without sandbox containment.</p>

      <h4>3. State Machines for Agent Control</h4>
      <p>Instead of infinite conversational loops, production agent architectures model tasks as explicit directed graphs (like LangGraph or statecharts), with checkpointing, human-in-the-loop approvals, and rollback capabilities.</p>
    `
  },
  'clean-arch': {
    title: 'Clean Architecture in Modern Web & Mobile: Domain-Driven Design',
    badge: 'System Architecture • 6 min read',
    date: 'December 2025',
    content: `
      <p>Frameworks come and go, but the domain logic of your business remains stable. Clean Architecture ensures that UI frameworks (Flutter, React, Next.js) and database engines (Postgres, Firebase) are easily swappable plugins rather than foundational anchors.</p>

      <h4>The Three Core Layers:</h4>
      <p><strong>1. Domain Layer:</strong> Pure Entities and Use Cases containing zero framework imports. This code is 100% unit-testable and timeless.</p>
      <p><strong>2. Data Layer:</strong> Concrete repository implementations, API clients, and local caches that satisfy abstract domain contracts.</p>
      <p><strong>3. Presentation Layer:</strong> Flutter widgets or React components that observe state changes and forward user intents.</p>
    `
  },
  'it-evolution': {
    title: '7 Years in Tech: What Survives Framework Hype and What Truly Matters',
    badge: 'IT & Career Insights • 8 min read',
    date: 'October 2025',
    content: `
      <p>Reflecting on 7 years in the software industry—witnessing the shift from jQuery and native Android/iOS silos to Flutter, Next.js, and now Generative AI—certain eternal lessons have crystalized:</p>

      <h4>1. Fundamentals Outlive Frameworks</h4>
      <p>Understanding memory models, HTTP caching headers, asynchronous event loops, and database indexing provides 10x more career durability than memorizing a transient UI library's syntax.</p>

      <h4>2. Software is a Team Sport</h4>
      <p>Clean code is written for the next engineer who has to debug it at 2 AM. Clear documentation, sensible naming conventions, and humble peer reviews separate great senior engineers from merely good coders.</p>

      <h4>3. Embrace Paradigms, Don't Fight Them</h4>
      <p>AI is not replacing software engineers; it is elevating us into systems architects. By mastering AI tools and orchestrating complex models, we can solve problems that were previously unthinkable for a single engineer to deliver.</p>
    `
  }
};

function initBlogModals() {
  const modalBackdrop = document.getElementById('blogModalBackdrop');
  const modalContent = document.getElementById('blogModalContent');
  const closeBtn = document.getElementById('closeBlogModal');
  const readButtons = document.querySelectorAll('.read-more-btn');

  function openBlogModal(blogId) {
    const post = blogPostsData[blogId];
    if (!post) return;

    modalContent.innerHTML = `
      <div class="modal-header-tag">${post.badge} • ${post.date}</div>
      <h2 class="modal-title">${post.title}</h2>
      <div class="blog-dialog-content">
        ${post.content}
      </div>
      <div class="modal-actions">
        <a href="#contact" class="btn btn-primary btn-sm" onclick="document.getElementById('blogModalBackdrop').classList.remove('open')">Discuss This Topic</a>
        <button class="btn btn-glass btn-sm" onclick="document.getElementById('blogModalBackdrop').classList.remove('open')">Close Article</button>
      </div>
    `;

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeBlogModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  readButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const bid = btn.getAttribute('data-blog');
      openBlogModal(bid);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeBlogModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeBlogModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeBlogModal();
    }
  });
}

/* ==========================================================================
   11. CONTACT FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitFormBtn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const projectType = document.getElementById('projectType').value;
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        alert('Please fill out all required fields.');
        return;
      }

      // Simulate sending state
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending inquiry...</span>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        feedback.className = 'form-feedback success';
        feedback.innerHTML = `<strong>Thank you, ${name}!</strong> Your inquiry regarding <em>${projectType}</em> has been recorded. I typically respond within 24 hours.`;
        form.reset();

        setTimeout(() => {
          feedback.style.display = 'none';
        }, 8000);
      }, 900);
    });
  }

  const downloadCvBtn = document.getElementById('downloadCvBtn');
  if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Generating and preparing Senior Software Engineer CV (PDF)... In a live deployment, this downloads the official resume file.');
    });
  }
}

/* ==========================================================================
   12. COPY EMAIL TO CLIPBOARD
   ========================================================================== */
function initCopyEmail() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailLink = document.getElementById('emailLink');

  if (copyBtn && emailLink) {
    copyBtn.addEventListener('click', () => {
      const email = emailLink.textContent.trim();
      navigator.clipboard.writeText(email).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.style.background = 'var(--accent-emerald)';
        copyBtn.style.color = '#ffffff';

        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.style.background = '';
          copyBtn.style.color = '';
        }, 2200);
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    });
  }
}

