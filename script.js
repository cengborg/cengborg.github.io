const videos = [
  {
    title: "Conference Talk",
    note: "Paste a YouTube or Vimeo embed URL into the src field in script.js.",
    src: ""
  },
  {
    title: "Project Demo",
    note: "Add as many video objects as you like; empty src values render as placeholders.",
    src: ""
  }
];

const textPhrases = [
  "synaptic plasticity",
  "complex synapses",
  "recurrent neural networks",
  "learning dynamics",
  "neurons with memory"
];

const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

function setupVideos() {
  const grid = document.getElementById("videoGrid");
  if (!grid) {
    return;
  }

  grid.innerHTML = "";

  videos.forEach((video) => {
    const card = document.createElement("article");
    card.className = "video-card";

    if (video.src) {
      const iframe = document.createElement("iframe");
      iframe.className = "video-frame";
      iframe.src = video.src;
      iframe.title = video.title;
      iframe.loading = "lazy";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      card.append(iframe);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "video-frame video-placeholder";
      placeholder.innerHTML = "<span>&#9654;</span>";
      card.append(placeholder);
    }

    const body = document.createElement("div");
    body.className = "video-body";
    body.innerHTML = `<h3>${video.title}</h3><p>${video.note}</p>`;
    card.append(body);
    grid.append(card);
  });
}

function setupTextCanvas() {
  const canvas = document.getElementById("textCanvas");
  if (!canvas) {
    return;
  }

  const context = canvas.getContext("2d");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const colors = ["#f8fafc", "#c7dce9", "#f1d08a", "#e6a494", "#a9c5b8"];
  let particles = [];
  let frame = 0;

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const cssHeight = Math.max(240, rect.width * 0.34);

    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(cssHeight * ratio);
    canvas.style.height = `${cssHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    particles = Array.from({ length: 30 }, (_, index) => ({
      text: textPhrases[index % textPhrases.length],
      x: Math.random() * rect.width,
      y: 34 + Math.random() * (cssHeight - 68),
      speed: 0.22 + Math.random() * 0.48,
      size: 14 + Math.random() * 14,
      color: colors[index % colors.length],
      drift: Math.random() * Math.PI * 2
    }));
  }

  function draw() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    context.clearRect(0, 0, width, height);
    context.fillStyle = "#111111";
    context.fillRect(0, 0, width, height);

    particles.forEach((particle, index) => {
      const wave = Math.sin(frame * 0.012 + particle.drift) * 16;
      context.font = `${particle.size}px Georgia, serif`;
      context.fillStyle = particle.color;
      context.globalAlpha = 0.42 + (index % 5) * 0.1;
      context.fillText(particle.text, particle.x, particle.y + wave);

      if (!reducedMotion) {
        particle.x += particle.speed;
        if (particle.x > width + 220) {
          particle.x = -context.measureText(particle.text).width - 20;
          particle.y = 34 + Math.random() * (height - 68);
        }
      }
    });

    context.globalAlpha = 1;
    context.fillStyle = "rgba(248, 250, 252, 0.92)";
    context.font = "700 26px Georgia, serif";
    context.fillText("text as structure, motion, and interface", 28, height - 30);

    frame += 1;
    if (!reducedMotion) {
      window.requestAnimationFrame(draw);
    }
  }

  resize();
  draw();
  window.addEventListener("resize", resize);
}

setupVideos();
setupTextCanvas();
