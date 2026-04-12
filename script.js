// CURSOR
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    });
    function animRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animRing);
    }
    animRing();

//     // CARD TILT

//    const card = document.getElementById('card');     // outer container
// const inner = document.getElementById('inner');   // the part that tilts

// if (card && inner) {
//   card.addEventListener('mousemove', (e) => {
//     const rect = card.getBoundingClientRect();

//     // Mouse position relative to center (-1 to +1)
//     const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
//     const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

//     // Rotate inner element (adjust multiplier for stronger/weaker tilt)
//     const rotateY = x * 18;   // left-right tilt
//     const rotateX = -y * 18;  // up-down tilt

//     inner.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
//   });

//   card.addEventListener('mouseleave', () => {
//     inner.style.transform = 'rotateY(0deg) rotateX(0deg)';
//   });

//   // Optional: add a little "pop" on enter
//   card.addEventListener('mouseenter', () => {
//     inner.style.transition = 'transform 0.1s ease-out';
//   });
// }

    // NEURAL BACKGROUND CANVAS
    const bgCanvas = document.getElementById('neural-canvas');
    const bgCtx = bgCanvas.getContext('2d');
    let nodes = [];
    function resizeBg() {
      bgCanvas.width = window.innerWidth;
      bgCanvas.height = window.innerHeight;
    }
    resizeBg();
    window.addEventListener('resize', resizeBg);
    for (let i = 0; i < 60; i++) {
      nodes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1
      });
    }
    function drawBg() {
      bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      // connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 160) {
            bgCtx.beginPath();
            bgCtx.moveTo(nodes[i].x, nodes[i].y);
            bgCtx.lineTo(nodes[j].x, nodes[j].y);
            bgCtx.strokeStyle = `rgba(201,145,58,${0.15 * (1 - d / 160)})`;
            bgCtx.lineWidth = 0.5;
            bgCtx.stroke();
          }
        }
      }
      // nodes
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > bgCanvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > bgCanvas.height) n.vy *= -1;
        bgCtx.beginPath();
        bgCtx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        bgCtx.fillStyle = 'rgba(201,145,58,0.5)';
        bgCtx.fill();
      });
      requestAnimationFrame(drawBg);
    }
    drawBg();

    // ENTRY BUTTON
    document.getElementById('enter-btn').addEventListener('click', () => {
      document.getElementById('entry').classList.add('exit');
      setTimeout(() => {
        document.getElementById('entry').style.display = 'none';
        document.getElementById('main').classList.add('visible');
      }, 1200);
    });

    // NAV SCROLL
    window.addEventListener('scroll', () => {
      const nav = document.getElementById('nav');
      nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // REVEAL ON SCROLL
    const revealEls = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('revealed'), i * 80);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => observer.observe(el));

    // THOUGHT GRAPH
    const graphWrap = document.getElementById('graph-canvas');
    const tc = document.getElementById('thought-canvas');
    const tt = document.getElementById('thought-tooltip');

    function resizeThought() {
      tc.width = graphWrap.offsetWidth;
      tc.height = graphWrap.offsetHeight;
    }
    resizeThought();
    window.addEventListener('resize', resizeThought);

    const thoughts = [
      { id: 0, x: 0.5, y: 0.5, label: 'Systems Thinking', body: 'Every phenomenon is a system. Understanding the relationships is more important than understanding the parts.' },
      { id: 1, x: 0.2, y: 0.3, label: 'Cognitive Bias', body: '12 categories of investigative bias — we don\'t see reality, we construct it from expectations.' },
      { id: 2, x: 0.8, y: 0.3, label: 'Cryptographic Trust', body: 'Trust is not a feeling. It\'s a mathematical proof. AES-256-GCM is just formalized trust.' },
      { id: 3, x: 0.15, y: 0.7, label: 'Zettelkasten', body: '200+ interconnected notes. Ideas don\'t live in isolation — they live in relationships.' },
      { id: 4, x: 0.85, y: 0.7, label: 'Predictive Ethics', body: '82% accuracy means 18% wrongness. Who bears the cost of that 18%? This is why AI needs law.' },
      { id: 5, x: 0.35, y: 0.15, label: 'Game Theory', body: 'Every interaction is a game. Strategy, payoffs, equilibria — the math of human decisions.' },
      { id: 6, x: 0.65, y: 0.15, label: 'Visual Math', body: 'Manim teaches us that mathematics isn\'t symbolic — it\'s spatial, kinetic, alive.' },
      { id: 7, x: 0.3, y: 0.8, label: 'Digital Forensics', body: 'Evidence is only evidence if its chain of custody is unbroken. Cryptography is the new chain.' },
      { id: 8, x: 0.7, y: 0.8, label: 'Polarisation', body: 'Algorithms don\'t just reflect society — they amplify and manufacture division.' },
      { id: 9, x: 0.5, y: 0.25, label: 'Curiosity', body: 'The only unifying thread: asking "but why?" until the answer becomes a system.' },
    ];

    const edges = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9], [1, 7], [2, 7], [3, 9], [4, 2], [5, 9], [6, 9], [7, 4], [8, 4], [1, 3], [5, 6]];

    const tCtx = tc.getContext('2d');
    let hoveredNode = null;

    function getNodePos(n) {
      return { x: n.x * tc.width, y: n.y * tc.height };
    }

    function drawThought() {
      tCtx.clearRect(0, 0, tc.width, tc.height);
      // edges
      edges.forEach(([a, b]) => {
        const pa = getNodePos(thoughts[a]), pb = getNodePos(thoughts[b]);
        tCtx.beginPath();
        tCtx.moveTo(pa.x, pa.y);
        tCtx.lineTo(pb.x, pb.y);
        tCtx.strokeStyle = hoveredNode !== null && (hoveredNode === a || hoveredNode === b)
          ? 'rgba(201,145,58,0.6)' : 'rgba(201,145,58,0.12)';
        tCtx.lineWidth = hoveredNode !== null && (hoveredNode === a || hoveredNode === b) ? 1.5 : 0.8;
        tCtx.stroke();
      });
      // nodes
      thoughts.forEach((n, i) => {
        const p = getNodePos(n);
        const isHovered = hoveredNode === i;
        const r = isHovered ? 10 : 6;
        // glow
        if (isHovered) {
          tCtx.beginPath();
          tCtx.arc(p.x, p.y, 20, 0, Math.PI * 2);
          tCtx.fillStyle = 'rgba(201,145,58,0.1)';
          tCtx.fill();
        }
        tCtx.beginPath();
        tCtx.arc(p.x, p.y, r, 0, Math.PI * 2);
        tCtx.fillStyle = isHovered ? 'rgba(201,145,58,1)' : 'rgba(201,145,58,0.5)';
        tCtx.fill();
        tCtx.strokeStyle = 'rgba(201,145,58,0.3)';
        tCtx.lineWidth = 1;
        tCtx.stroke();
        // label
        tCtx.fillStyle = isHovered ? '#e8dfc8' : '#8a7d65';
        tCtx.font = `${isHovered ? 'bold ' : ''}10px "Space Mono"`;
        tCtx.textAlign = 'center';
        tCtx.fillText(n.label, p.x, p.y + 20);
      });
      requestAnimationFrame(drawThought);
    }
    drawThought();

    tc.addEventListener('mousemove', e => {
      const rect = tc.getBoundingClientRect();
      const mx2 = e.clientX - rect.left;
      const my2 = e.clientY - rect.top;
      let found = null;
      thoughts.forEach((n, i) => {
        const p = getNodePos(n);
        const d = Math.sqrt((mx2 - p.x) ** 2 + (my2 - p.y) ** 2);
        if (d < 20) found = i;
      });
      hoveredNode = found;
      if (found !== null) {
        const n = thoughts[found];
        const p = getNodePos(n);
        tt.style.display = 'block';
        tt.style.left = Math.min(p.x + 15, tc.width - 260) + 'px';
        tt.style.top = Math.max(p.y - 60, 10) + 'px';
        tt.innerHTML = `<strong>${n.label}</strong>${n.body}`;
      } else {
        tt.style.display = 'none';
      }
    });
    tc.addEventListener('mouseleave', () => { hoveredNode = null; tt.style.display = 'none'; });

    // PEN CANVAS (featured project visual)
    const pc = document.getElementById('pen-canvas');
    if (pc) {
      const pCtx = pc.getContext('2d');
      let t = 0;
      function drawPen() {
        pCtx.clearRect(0, 0, pc.width, pc.height);
        // supply chain nodes
        const chain = ['RAW\nMATERIALS', 'FACTORY', 'ASSEMBLY', 'QUALITY', 'RETAIL', 'PEN'];
        const n = chain.length;
        chain.forEach((label, i) => {
          const x = 30 + (i / (n - 1)) * (pc.width - 60);
          const y = pc.height / 2 + Math.sin(t * 0.02 + i * 0.5) * 15;
          // connection
          if (i > 0) {
            const px2 = 30 + ((i - 1) / (n - 1)) * (pc.width - 60);
            const py2 = pc.height / 2 + Math.sin(t * 0.02 + (i - 1) * 0.5) * 15;
            pCtx.beginPath(); pCtx.moveTo(px2, py2); pCtx.lineTo(x, y);
            pCtx.strokeStyle = 'rgba(201,145,58,0.4)';
            pCtx.lineWidth = 1; pCtx.stroke();
            // particle
            const prog = (t * 0.005 + i * 0.17) % 1;
            const px3 = px2 + (x - px2) * prog, py3 = py2 + (y - py2) * prog;
            pCtx.beginPath(); pCtx.arc(px3, py3, 2, 0, Math.PI * 2);
            pCtx.fillStyle = 'rgba(201,145,58,0.9)'; pCtx.fill();
          }
          pCtx.beginPath(); pCtx.arc(x, y, 8, 0, Math.PI * 2);
          pCtx.fillStyle = 'rgba(201,145,58,0.2)'; pCtx.fill();
          pCtx.strokeStyle = 'rgba(201,145,58,0.6)'; pCtx.lineWidth = 1; pCtx.stroke();
          pCtx.fillStyle = 'rgba(232,223,200,0.8)';
          pCtx.font = '8px "Space Mono"'; pCtx.textAlign = 'center';
          label.split('\n').forEach((l, li) => pCtx.fillText(l, x, y + 22 + li * 11));
        });
        t++;
        requestAnimationFrame(drawPen);
      }
      drawPen();
    }

    // EASTER EGG
    const ee = document.getElementById('easter');
    const eem = document.getElementById('easter-msg');
    let easterClicks = 0;
    ee.addEventListener('click', () => {
      easterClicks++;
      if (easterClicks === 1) eem.classList.add('show');
      else { eem.classList.remove('show'); easterClicks = 0; }
    });

    // FLOATING QUOTES
    const quotes = [
      '"Every system is perfectly designed to get the results it gets." — W. Edwards Deming',
      '"The map is not the territory." — Alfred Korzybski',
      '"To understand is to know what to do." — Ludwig Wittgenstein',
      '"Evidence doesn\'t speak. We speak for it. That\'s the weight." — KK',
      '"Chaos is just order we haven\'t understood yet." — KK',
      '"Every simulation is an argument about how the world works." — KK',
    ];
    let qi = 0;
    const fq = document.getElementById('floating-quote');
    function showQuote() {
      fq.style.opacity = 0;
      setTimeout(() => {
        fq.textContent = quotes[qi++ % quotes.length];
        fq.style.opacity = 1;
        setTimeout(showQuote, 7000);
      }, 500);
    }
    setTimeout(showQuote, 5000);

    // KONAMI CODE easter egg
    let konami = [], konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    document.addEventListener('keydown', e => {
      konami.push(e.keyCode);
      konami = konami.slice(-10);
      if (konami.join(',' === konamiCode.join(','))) {
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => document.body.style.filter = '', 2000);
      }
    });