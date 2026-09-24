/* Interações da landing page do Sonari */
(function () {
  'use strict';

  /* ---------- Menu fixo: transparência ao rolar ---------- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');

  function onScroll() {
    const scrolled = window.scrollY > 40;
    navbar.classList.toggle('is-scrolled', scrolled);
    backToTop.classList.toggle('is-visible', window.scrollY > 500);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  function closeMenu() {
    mobileMenu.classList.add('hidden');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = 'Menu';
  }

  menuToggle.addEventListener('click', function () {
    const isOpen = !mobileMenu.classList.toggle('hidden');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.textContent = isOpen ? 'Fechar' : 'Menu';
  });

  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* ---------- Animação de entrada das seções ---------- */
  const revealItems = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add('is-visible');
    });
  }

  /* ---------- Link ativo conforme a seção visível ---------- */
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute('href'));
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
          });
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* ---------- Player de demonstração (mockup) ---------- */
  const playBtn = document.getElementById('play-btn');
  const playIcon = document.getElementById('play-icon');
  const equalizer = document.getElementById('equalizer');
  const progressBar = document.getElementById('progress-bar');
  const progressTrack = document.getElementById('progress-track') || progressBar.parentElement;
  const currentTime = document.getElementById('current-time');
  const audio = document.getElementById('demo-audio');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const totalTime = document.getElementById('total-time');
  const trackTitle = document.getElementById('track-title');
  const trackArtist = document.getElementById('track-artist');
  const volumeControl = document.getElementById('volume-control');
  const volumeIcon = document.getElementById('volume-icon');

  const playlist = [
    {
      src: 'assets/sound/fassounds-escape-your-love-upbeat-fashion-pop-dance-412230.mp3',
      title: 'Escape Your Love',
      artist: 'Fassounds'
    },
    {
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      title: 'Night Pulse',
      artist: 'SoundHelix'
    }
  ];
  let currentIndex = 0;
  let isDragging = false;

  function loadTrack(index) {
    const item = playlist[index];
    if (!item) return;
    audio.src = item.src;
    trackTitle.textContent = item.title;
    trackArtist.textContent = item.artist;
    audio.load();
  }

  function updateTotalTime() {
    if (isFinite(audio.duration) && audio.duration > 0) {
      totalTime.textContent = formatTime(Math.floor(audio.duration));
    } else {
      totalTime.textContent = '00:00';
    }
  }

  function setPlaybackUI(isPlaying) {
    playIcon.className = isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
    playBtn.setAttribute('aria-pressed', String(isPlaying));
    playBtn.setAttribute('aria-label', isPlaying ? 'Pausar música' : 'Reproduzir música');
    equalizer.classList.toggle('is-playing', isPlaying);
  }

  function playTrack(index) {
    if (playlist.length === 0) return;
    currentIndex = (index + playlist.length) % playlist.length;
    loadTrack(currentIndex);

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.catch(function () {
        // autoplay pode ser bloqueado até o usuário interagir; o botão continua funcional
      });
    }
  }

  prevBtn.addEventListener('click', function () {
    playTrack(currentIndex - 1);
  });

  nextBtn.addEventListener('click', function () {
    playTrack(currentIndex + 1);
  });

  audio.addEventListener('loadedmetadata', function () {
    renderProgress();
    updateTotalTime();
  });

  audio.addEventListener('ended', function () {
    nextBtn.click();
  });

  volumeControl.addEventListener('input', function () {
    audio.volume = Number(volumeControl.value);
    updateVolumeUI();
  });

  audio.volume = Number(volumeControl.value);
  updateVolumeUI();

  // load initial track
  loadTrack(currentIndex);

  function formatTime(totalSeconds) {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(Math.floor(totalSeconds % 60)).padStart(2, '0');
    return minutes + ':' + seconds;
  }

  function renderProgress() {
    const dur = isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0;
    const time = isFinite(audio.currentTime) ? audio.currentTime : 0;
    progressBar.style.width = dur > 0 ? (time / dur) * 100 + '%' : '0%';
    currentTime.textContent = formatTime(Math.floor(time));
    if (dur > 0) totalTime.textContent = formatTime(Math.floor(dur));
  }

  function updateVolumeUI() {
    const volume = Number(audio.volume || 0);
    volumeControl.title = volume === 0 ? 'Mudo' : volume < 0.5 ? 'Volume baixo' : 'Volume alto';
    if (volumeIcon) {
      volumeIcon.className = volume === 0
        ? 'fa-solid fa-volume-xmark text-sm'
        : volume < 0.5
          ? 'fa-solid fa-volume-low text-sm'
          : 'fa-solid fa-volume-high text-sm';
    }
  }

  function seekTrack(event) {
    if (!audio || !audio.duration) return;
    const rect = progressTrack.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const ratio = Math.min(Math.max(clickX / rect.width, 0), 1);
    audio.currentTime = ratio * audio.duration;
    renderProgress();
  }

  function togglePlayback() {
    if (!audio) return;

    if (audio.paused) {
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.catch(function () {
          // autoplay bloqueado até o usuário interagir
        });
      }
      return;
    }

    audio.pause();
  }

  playBtn.addEventListener('click', togglePlayback);

  progressTrack.addEventListener('pointerdown', function (event) {
    isDragging = true;
    seekTrack(event);
  });

  window.addEventListener('pointermove', function (event) {
    if (isDragging) seekTrack(event);
  });

  window.addEventListener('pointerup', function () {
    isDragging = false;
  });

  // Keep UI in sync with audio state
  audio.addEventListener('play', function () {
    setPlaybackUI(true);
  });

  audio.addEventListener('pause', function () {
    setPlaybackUI(false);
  });

  audio.addEventListener('timeupdate', renderProgress);
  audio.addEventListener('loadedmetadata', renderProgress);

  // initialize display if audio metadata is already available
  if (audio && audio.readyState >= 1) renderProgress();
  setPlaybackUI(audio.paused);

  /* ---------- Formulário de contato ---------- */
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setFieldError(field, hasError) {
    field.classList.toggle('is-invalid', hasError);
    const message = form.querySelector('[data-error-for="' + field.id + '"]');
    if (message) message.classList.toggle('hidden', !hasError);
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = form.elements.name;
    const email = form.elements.email;

    const nameInvalid = name.value.trim().length < 2;
    const emailInvalid = !EMAIL_PATTERN.test(email.value.trim());

    setFieldError(name, nameInvalid);
    setFieldError(email, emailInvalid);

    if (nameInvalid || emailInvalid) {
      success.classList.add('hidden');
      (nameInvalid ? name : email).focus();
      return;
    }

    success.classList.remove('hidden');
    form.reset();
  });

  form.querySelectorAll('input').forEach(function (field) {
    field.addEventListener('input', function () {
      if (field.classList.contains('is-invalid')) setFieldError(field, false);
    });
  });
})();
