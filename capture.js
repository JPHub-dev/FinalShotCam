// Photobooth flow: layout selection, camera countdown capture, then edit mode
(function(){
  const formatMap = { '1x1': 1, '1x2': 2, '1x3': 3, '1x4': 4 };
  const stickersPool = ['🎉','🌟','💖','👓','🎩','✨','💫','🥳'];

  let currentFormat = '1x3';
  let currentFilter = 'none';
  let currentFrame = 'classic';
  let currentShape = 'square';
  let currentLogo = 'ENG';
  let timestampEnabled = false;
  let stream = null;
  let captures = [];
  let activeStickers = [];
  let countdownTimer = null;

  const layoutStage = document.getElementById('layoutStage');
  const cameraStage = document.getElementById('cameraStage');
  const editStage = document.getElementById('editStage');
  const layoutButtons = document.querySelectorAll('.layout-card');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const frameButtons = document.querySelectorAll('.card-btn[data-frame]');
  const shapeButtons = document.querySelectorAll('.card-btn[data-shape]');
  const logoButtons = document.querySelectorAll('.card-btn[data-logo]');
  const timestampToggle = document.getElementById('timestampToggle');
  const stickerBtn = document.getElementById('stickerBtn');
  const captureBtn = document.getElementById('captureBtn');
  const finishBtn = document.getElementById('finishBtn');
  const retakeBtn = document.getElementById('retakeBtn');
  const printBtn = document.getElementById('printBtn');
  const shareBtn = document.getElementById('shareBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const captureCount = document.getElementById('captureCount');
  const targetCount = document.getElementById('targetCount');
  const previewFrame = document.getElementById('previewFrame');
  const finalPreview = document.getElementById('finalPreview');
  const video = document.getElementById('captureVideo');
  const countdownOverlay = document.getElementById('countdownOverlay');
  const selectedLayoutLabel = document.getElementById('selectedLayoutLabel');

  function showSection(section) {
    layoutStage.classList.toggle('hidden', section !== 'layout');
    cameraStage.classList.toggle('hidden', section !== 'camera');
    editStage.classList.toggle('hidden', section !== 'edit');
  }

  function selectFormat(format) {
    currentFormat = format;
    layoutButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.format === format));
    targetCount.textContent = formatMap[format];
    captureCount.textContent = captures.length;
    selectedLayoutLabel.textContent = format;
    previewFrame.className = `preview-frame layout-${format}`;
    finalPreview.className = `final-preview layout-${format} shape-${currentShape} style-${currentFrame}`;
  }

  function selectFilter(filter) {
    currentFilter = filter;
    filterButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === filter));
    video.style.filter = getFilterValue(filter);
  }

  function selectFrameStyle(frame) {
    currentFrame = frame;
    frameButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.frame === frame));
    finalPreview.className = `final-preview layout-${currentFormat} shape-${currentShape} style-${frame}`;
    buildEditPreview();
  }

  function selectShape(shape) {
    currentShape = shape;
    shapeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.shape === shape));
    finalPreview.className = `final-preview layout-${currentFormat} shape-${shape} style-${currentFrame}`;
    buildEditPreview();
  }

  function selectLogo(logo) {
    currentLogo = logo;
    logoButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.logo === logo));
    buildEditPreview();
  }

  function toggleTimestamp() {
    timestampEnabled = timestampToggle.checked;
    buildEditPreview();
  }

  function addSticker() {
    const next = stickersPool[Math.floor(Math.random() * stickersPool.length)];
    const sticker = {
      icon: next,
      left: Math.random() * 65 + 10,
      top: Math.random() * 65 + 10,
      size: Math.random() * 22 + 18
    };
    activeStickers.push(sticker);
    buildEditPreview();
  }

  function getFilterValue(filter) {
    switch (filter) {
      case 'retro': return 'contrast(1.1) sepia(0.42) saturate(1.3) hue-rotate(-10deg)';
      case 'mono': return 'grayscale(1) contrast(1.2)';
      case 'glow': return 'brightness(1.08) saturate(1.2) drop-shadow(0 0 12px rgba(255,255,255,0.25))';
      case 'sepia': return 'sepia(0.6) contrast(1.1)';
      default: return 'none';
    }
  }

  function updateCaptureStatus() {
    captureCount.textContent = captures.length;
    targetCount.textContent = formatMap[currentFormat];
  }

  function buildPreview() {
    previewFrame.innerHTML = '';
    const total = formatMap[currentFormat];
    for (let i = 0; i < total; i++) {
      const slot = document.createElement('div');
      slot.className = 'preview-slot';
      if (captures[i]) {
        const img = document.createElement('img');
        img.src = captures[i];
        img.alt = `Capture ${i + 1}`;
        img.className = currentShape;
        slot.appendChild(img);
      } else {
        slot.classList.add('empty');
        slot.innerHTML = '<span>Waiting...</span>';
      }
      previewFrame.appendChild(slot);
    }
  }

  function buildEditPreview() {
    finalPreview.innerHTML = '';
    finalPreview.className = `final-preview layout-${currentFormat} shape-${currentShape} style-${currentFrame}`;

    const total = formatMap[currentFormat];
    for (let i = 0; i < total; i++) {
      const slot = document.createElement('div');
      slot.className = 'preview-slot';
      if (captures[i]) {
        const img = document.createElement('img');
        img.src = captures[i];
        img.alt = `Capture ${i + 1}`;
        img.className = currentShape;
        img.style.filter = getFilterValue(currentFilter);
        slot.appendChild(img);
      } else {
        slot.classList.add('empty');
        slot.innerHTML = '<span>Empty frame</span>';
      }
      finalPreview.appendChild(slot);
    }

    const logo = document.createElement('div');
    logo.className = 'logo-badge';
    logo.textContent = `FINALSHOOT ${currentLogo}`;
    finalPreview.appendChild(logo);

    if (timestampEnabled) {
      const stamp = document.createElement('div');
      stamp.className = 'timestamp-badge';
      stamp.textContent = new Date().toLocaleString();
      finalPreview.appendChild(stamp);
    }

    activeStickers.forEach(sticker => {
      const badge = document.createElement('div');
      badge.className = 'sticker-badge';
      badge.textContent = sticker.icon;
      badge.style.left = `${sticker.left}%`;
      badge.style.top = `${sticker.top}%`;
      badge.style.fontSize = `${sticker.size}px`;
      finalPreview.appendChild(badge);
    });
  }

  function startCamera() {
    if (stream) return;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Camera access is not supported by your browser.');
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } })
      .then(mediaStream => {
        stream = mediaStream;
        video.srcObject = stream;
      })
      .catch(() => {
        alert('Please allow camera access to continue.');
      });
  }

  function runCountdown(onFinish) {
    let count = 3;
    countdownOverlay.textContent = count;
    countdownOverlay.classList.remove('hidden');
    captureBtn.disabled = true;
    countdownTimer = setInterval(() => {
      count -= 1;
      if (count === 0) {
        clearInterval(countdownTimer);
        countdownOverlay.classList.add('hidden');
        captureBtn.disabled = false;
        onFinish();
      } else {
        countdownOverlay.textContent = count;
      }
    }, 1000);
  }

  function captureFrame() {
    if (!video.videoWidth || !video.videoHeight) return;
    if (captures.length >= formatMap[currentFormat]) {
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.filter = getFilterValue(currentFilter);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    captures.push(canvas.toDataURL('image/png'));
    updateCaptureStatus();
    buildPreview();
    buildEditPreview();

    if (captures.length >= formatMap[currentFormat]) {
      setTimeout(() => {
        showSection('edit');
        buildEditPreview();
      }, 300);
    }
  }

  function finishEarly() {
    if (captures.length === 0) {
      alert('Please capture at least one photo first.');
      return;
    }
    showSection('edit');
    buildEditPreview();
  }

  function retakeSession() {
    captures = [];
    activeStickers = [];
    timestampToggle.checked = false;
    timestampEnabled = false;
    currentFilter = 'none';
    selectFilter(currentFilter);
    updateCaptureStatus();
    buildPreview();
    buildEditPreview();
    showSection('camera');
  }

  function printResult() {
    window.print();
  }

  function shareResult() {
    if (navigator.share) {
      navigator.share({
        title: 'FinalShoot Photo',
        text: 'Check out my FinalShoot photo strip!',
      }).catch(() => {
        alert('Unable to share from this browser.');
      });
    } else {
      alert('Share is not supported in this browser.');
    }
  }

  function downloadResult() {
    if (captures.length === 0) {
      alert('No image to download.');
      return;
    }

    const width = 900;
    const height = 900 * captures.length;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height + 120;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    captures.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const y = index * 900;
        ctx.drawImage(img, 0, y, width, 900);
        if (index === captures.length - 1) {
          ctx.fillStyle = 'rgba(255,255,255,0.85)';
          ctx.fillRect(0, height - 120, width, 120);
          ctx.fillStyle = '#3c3160';
          ctx.font = '28px Poppins';
          ctx.fillText(`FINALSHOOT ${currentLogo}`, 24, height - 72);
          if (timestampEnabled) {
            ctx.font = '18px Poppins';
            ctx.fillText(new Date().toLocaleString(), 24, height - 32);
          }
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png');
          link.download = 'finalshoot-strip.png';
          link.click();
        }
      };
    });
  }

  function attachListeners() {
    layoutButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const format = btn.dataset.format;
        selectFormat(format);
        showSection('camera');
        startCamera();
      });
    });

    filterButtons.forEach(btn => btn.addEventListener('click', () => selectFilter(btn.dataset.filter)));
    frameButtons.forEach(btn => btn.addEventListener('click', () => selectFrameStyle(btn.dataset.frame)));
    shapeButtons.forEach(btn => btn.addEventListener('click', () => selectShape(btn.dataset.shape)));
    logoButtons.forEach(btn => btn.addEventListener('click', () => selectLogo(btn.dataset.logo)));
    timestampToggle.addEventListener('change', toggleTimestamp);
    stickerBtn.addEventListener('click', addSticker);
    captureBtn.addEventListener('click', () => runCountdown(captureFrame));
    finishBtn.addEventListener('click', finishEarly);
    retakeBtn.addEventListener('click', retakeSession);
    printBtn.addEventListener('click', printResult);
    shareBtn.addEventListener('click', shareResult);
    downloadBtn.addEventListener('click', downloadResult);
  }

  function init() {
    selectFormat(currentFormat);
    selectFilter(currentFilter);
    selectFrameStyle(currentFrame);
    selectShape(currentShape);
    selectLogo(currentLogo);
    attachListeners();
    updateCaptureStatus();
    buildPreview();
    buildEditPreview();
    showSection('layout');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
