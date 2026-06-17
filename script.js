const bestScoreKey = 'hulk_page_best_score';
const fortuneButton = document.querySelector('#fortuneButton');
const fortuneResult = document.querySelector('#fortuneResult');
const lunchButton = document.querySelector('#lunchButton');
const lunchResult = document.querySelector('#lunchResult');
const lunchNote = document.querySelector('#lunchNote');
const petBoy = document.querySelector('#petBoy');
const petBubble = document.querySelector('#petBubble');
const easterScreen = document.querySelector('#easterScreen');
const moonDate = document.querySelector('#moonDate');
const moonVisual = document.querySelector('#moonVisual');
const moonPhaseName = document.querySelector('#moonPhaseName');
const moonSummary = document.querySelector('#moonSummary');
const moonIllumination = document.querySelector('#moonIllumination');
const moonRiseTime = document.querySelector('#moonRiseTime');
const moonDirection = document.querySelector('#moonDirection');
const fortunes = [
  '민지는 오늘 생각보다 더 많은 응원을 받는 날이야.',
  '민지는 오늘 작은 선택 하나로 기분 좋은 흐름을 만들 수 있어.',
  '민지는 오늘 맛있는 걸 먹으면 행운이 두 배로 커질 거야.',
  '민지는 오늘 웃는 순간마다 좋은 일이 가까워지는 운세야.',
  '민지는 오늘 무리하지 않을수록 더 예쁘게 빛나는 날이야.',
  '민지는 오늘 기다리던 소식이나 다정한 말에 마음이 풀릴 수 있어.',
  '민지는 오늘 하고 싶은 일을 하나만 해도 충분히 잘 보낸 하루가 될 거야.',
  '민지는 오늘 주변 사람에게 따뜻한 인상을 남기는 운세야.'
];
const lunchMenus = [
  { name: '스파이시 이탈리안', note: '민지의 점심에 매콤한 기분 전환이 필요한 날이야.' },
  { name: '짜장면', note: '민지에게 달콤짭짤한 행복이 착 붙는 메뉴야.' },
  { name: '돈까스', note: '바삭한 한 입으로 민지의 오후 에너지를 채워줄 거야.' },
  { name: '딸기 팬케이크', note: '민지의 하루를 폭신하고 달콤하게 만들어줄 점심이야.' },
  { name: '크림 파스타', note: '부드럽고 고소한 맛이 민지 마음까지 말랑하게 해줄 거야.' },
  { name: '허니버터 치킨', note: '달콤짭짤해서 민지가 웃으면서 먹기 좋은 메뉴야.' },
  { name: '망고 샐러드와 샌드위치', note: '상큼하고 든든해서 민지의 오후가 가벼워질 거야.' },
  { name: '초코 와플 브런치', note: '오늘 민지에게는 점심도 디저트처럼 달콤해도 괜찮아.' },
  { name: '카라멜 프렌치토스트', note: '민지의 점심시간을 포근한 카페처럼 바꿔줄 메뉴야.' },
  { name: '떡볶이와 튀김', note: '매콤달콤한 조합이 민지의 기분을 확 살려줄 거야.' },
  { name: '연어 덮밥', note: '든든하고 산뜻해서 민지에게 잘 어울리는 점심이야.' },
  { name: '고구마 피자', note: '달콤한 고구마와 치즈가 민지의 행복 버튼을 눌러줄 거야.' }
];

function showFortune() {
  const randomIndex = Math.floor(Math.random() * fortunes.length);
  fortuneResult.textContent = fortunes[randomIndex];
}

function showLunchMenu() {
  const randomIndex = Math.floor(Math.random() * lunchMenus.length);
  const menu = lunchMenus[randomIndex];
  lunchResult.textContent = menu.name;
  lunchNote.textContent = menu.note;
}

function normalizeDegrees(degrees) {
  return ((degrees % 360) + 360) % 360;
}

function toJulianDate(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

function directionFromAzimuth(azimuth) {
  if (azimuth < 67.5) return '북동쪽';
  if (azimuth < 112.5) return '동쪽';
  if (azimuth < 157.5) return '남동쪽';
  return '남쪽에 가까운 동남쪽';
}

function phaseName(age) {
  if (age < 1.85 || age >= 27.68) return '삭에 가까운 달';
  if (age < 5.54) return '초승달';
  if (age < 9.23) return '상현달';
  if (age < 12.92) return '차오르는 보름달';
  if (age < 16.61) return '보름달';
  if (age < 20.30) return '기우는 보름달';
  if (age < 23.99) return '하현달';
  return '그믐달';
}

function formatMoonTime(hour) {
  const normalized = ((hour % 24) + 24) % 24;
  const wholeHour = Math.floor(normalized);
  const minutes = Math.round((normalized - wholeHour) * 60);
  const displayHour = (wholeHour + Math.floor(minutes / 60)) % 24;
  const displayMinutes = minutes % 60;
  const dayLabel = hour >= 24 ? '내일 ' : '';
  return `${dayLabel}${String(displayHour).padStart(2, '0')}:${String(displayMinutes).padStart(2, '0')}`;
}

function renderMoonTracker() {
  const now = new Date();
  const synodicMonth = 29.530588853;
  const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14);
  const daysSinceNewMoon = (now.getTime() - knownNewMoon) / 86400000;
  const age = ((daysSinceNewMoon % synodicMonth) + synodicMonth) % synodicMonth;
  const phaseRatio = age / synodicMonth;
  const illumination = (1 - Math.cos(2 * Math.PI * phaseRatio)) / 2;

  const julianDays = toJulianDate(now) - 2451545;
  const sunLongitude = normalizeDegrees(280.46 + 0.9856474 * julianDays);
  const moonLongitude = normalizeDegrees(sunLongitude + phaseRatio * 360);
  const moonLatitude = 5.14 * Math.sin((julianDays * 13.176 + 93.3) * Math.PI / 180);
  const obliquity = 23.439 * Math.PI / 180;
  const lambda = moonLongitude * Math.PI / 180;
  const beta = moonLatitude * Math.PI / 180;
  const declination = Math.asin(Math.sin(beta) * Math.cos(obliquity) + Math.cos(beta) * Math.sin(obliquity) * Math.sin(lambda));
  const koreaLatitude = 37.5665 * Math.PI / 180;
  const azimuthInput = Math.max(-1, Math.min(1, Math.sin(declination) / Math.cos(koreaLatitude)));
  const riseAzimuth = Math.acos(azimuthInput) * 180 / Math.PI;
  const moonriseHour = 6.1 + age * 24.84 / synodicMonth;

  const isWaxing = age < synodicMonth / 2;
  const litPercent = Math.round(illumination * 100);
  const shadowPosition = isWaxing ? 100 - litPercent : litPercent;
  const lightSide = isWaxing ? 'right' : 'left';
  const moonGradient = lightSide === 'right'
    ? `linear-gradient(90deg, #2c2430 ${shadowPosition}%, #ffe9a6 ${shadowPosition}%)`
    : `linear-gradient(90deg, #ffe9a6 ${shadowPosition}%, #2c2430 ${shadowPosition}%)`;

  moonDate.textContent = new Intl.DateTimeFormat('ko-KR', { dateStyle: 'full' }).format(now);
  moonVisual.style.background = `radial-gradient(circle at 34% 30%, rgba(255,255,255,0.34), transparent 12%), ${moonGradient}`;
  moonPhaseName.textContent = phaseName(age);
  moonSummary.textContent = `오늘 달은 약 ${age.toFixed(1)}일 된 달이야. ${directionFromAzimuth(riseAzimuth)}에서 떠올라 밤하늘을 천천히 지나갈 거야.`;
  moonIllumination.textContent = `${litPercent}%`;
  moonRiseTime.textContent = formatMoonTime(moonriseHour);
  moonDirection.textContent = `${directionFromAzimuth(riseAzimuth)} (${Math.round(riseAzimuth)}°)`;
}

const canvas = document.querySelector('#heartGame');
const ctx = canvas.getContext('2d');
const scoreEl = document.querySelector('#score');
const timeEl = document.querySelector('#timeLeft');
const bestEl = document.querySelector('#bestScore');
const startBtn = document.querySelector('#startGame');
const rewardPop = document.querySelector('#rewardPop');
const rewardImage = document.querySelector('#rewardImage');
const rewardImages = ['assets/minji/na/1.jpg', 'assets/minji/na/2.jpg'];
const bgmAudio = document.querySelector('#bgmAudio');
const bgmToggle = document.querySelector('#bgmToggle');

let basket = { x: canvas.width / 2 - 42, y: canvas.height - 54, w: 84, h: 26, speed: 8 };
let hearts = [];
let keys = new Set();
let score = 0;
let bestScore = Number(localStorage.getItem(bestScoreKey) || 0);
let timeLeft = 30;
let playing = false;
let lastSpawn = 0;
let lastTick = 0;
let animationId = null;
let timerId = null;
let audioCtx = null;
let rewardShown = false;
let rewardTimerId = null;
let bgmStarted = false;
let petX = Math.min(90, window.innerWidth - 120);
let petY = Math.max(90, window.innerHeight - 180);
let petVx = 1.25;
let petVy = 0;
let petMode = '';
let petLastFrame = 0;
let petNextDecisionAt = 0;
let petNextTalkAt = Date.now() + 11000;
let petDrag = null;
let petTalkTimerId = null;
let petEasterTimerId = null;
let petClickTimes = [];
const petPhrases = [
  '민지씨 오늘도 귀여워!',
  '하트 모으러 가자!',
  '점심은 맛있는 걸로!',
  '나 잡아봐라~',
  '민지씨 웃으면 최고야!',
  '생일 축하 작전 중!',
  '선물은 어디 있을까?'
];

bestEl.textContent = bestScore;

function movePet(x, y) {
  const maxX = window.innerWidth - petBoy.offsetWidth - 8;
  const maxY = window.innerHeight - petBoy.offsetHeight - 8;
  petX = Math.max(8, Math.min(maxX, x));
  petY = Math.max(72, Math.min(maxY, y));
  petBoy.style.transform = `translate(${petX}px, ${petY}px)`;
}

function petFloorY() {
  return window.innerHeight - petBoy.offsetHeight - 8;
}

function setPetMode(mode) {
  if (petMode === mode) return;
  petMode = mode;
  petBoy.classList.toggle('walking', mode === 'walk');
  petBoy.classList.toggle('climbing', mode === 'climb');
}

function petSay(message) {
  petBubble.textContent = message;
  petBubble.classList.add('show');
  clearTimeout(petTalkTimerId);
  petTalkTimerId = setTimeout(() => petBubble.classList.remove('show'), 2200);
}

function choosePetAction(now) {
  if (now < petNextDecisionAt) return;
  petNextDecisionAt = now + 1400 + Math.random() * 2100;

  if (Math.random() < 0.54) petVx = (Math.random() > 0.5 ? 1 : -1) * (1.2 + Math.random() * 1.9);
  if (petMode === 'walk' && Math.random() < 0.28) petVy = -8.8 - Math.random() * 3.8;
  if (petMode === 'walk' && Math.random() < 0.34) {
    setPetMode('climb');
    petVy = -2.4 - Math.random() * 1.6;
    petVx = petX < window.innerWidth / 2 ? 1.1 : -1.1;
  }
}

function maybePetTalk(now) {
  if (now < petNextTalkAt || petDrag) return;
  petNextTalkAt = now + 13000 + Math.random() * 13000;
  if (Math.random() < 0.55) petSay(petPhrases[Math.floor(Math.random() * petPhrases.length)]);
}

function updatePet(now) {
  if (!petLastFrame) petLastFrame = now;
  const delta = Math.min(2.2, (now - petLastFrame) / 16.67);
  petLastFrame = now;

  if (!petDrag) {
    choosePetAction(now);
    const floorY = petFloorY();
    const maxX = window.innerWidth - petBoy.offsetWidth - 8;

    if (petMode === 'climb') {
      petVy -= 0.08 * delta;
      petX += petVx * delta;
      petY += petVy * delta;
      if (petY < 82 || Math.random() < 0.006) {
        setPetMode('walk');
        petVy = -1.2;
      }
    } else {
      setPetMode('walk');
      petVy += 0.48 * delta;
      petX += petVx * delta;
      petY += petVy * delta;
    }

    if (petX <= 8 || petX >= maxX) {
      petVx *= -1;
      petX = Math.max(8, Math.min(maxX, petX));
      if (petMode === 'walk' && Math.random() < 0.42) {
        setPetMode('climb');
        petVy = -3.2;
      }
    }

    if (petY >= floorY) {
      petY = floorY;
      petVy = 0;
      if (petMode === 'climb') setPetMode('walk');
    }

    petBoy.classList.toggle('facing-left', petVx < 0);
    movePet(petX, petY);
    maybePetTalk(now);
  }

  requestAnimationFrame(updatePet);
}

function showPetEasterEgg() {
  easterScreen.hidden = false;
  clearTimeout(petEasterTimerId);
  petEasterTimerId = setTimeout(() => {
    easterScreen.hidden = true;
  }, 3000);
}

function countPetClick() {
  const now = Date.now();
  petClickTimes = petClickTimes.filter((time) => now - time <= 10000);
  petClickTimes.push(now);
  if (petClickTimes.length >= 25) {
    petClickTimes = [];
    showPetEasterEgg();
  } else if (petClickTimes.length % 6 === 0 || Math.random() < 0.12) {
    petSay(petPhrases[Math.floor(Math.random() * petPhrases.length)]);
  }
}

function startPetDrag(event) {
  event.preventDefault();
  petVy = 0;
  petDrag = {
    offsetX: event.clientX - petX,
    offsetY: event.clientY - petY,
    startX: event.clientX,
    startY: event.clientY,
    moved: false
  };
  petBoy.classList.add('dragging');
  petBoy.classList.remove('walking', 'climbing');
  petMode = 'drag';
  petBoy.setPointerCapture(event.pointerId);
}

function dragPet(event) {
  if (!petDrag) return;
  const deltaX = Math.abs(event.clientX - petDrag.startX);
  const deltaY = Math.abs(event.clientY - petDrag.startY);
  if (deltaX + deltaY > 6) petDrag.moved = true;
  movePet(event.clientX - petDrag.offsetX, event.clientY - petDrag.offsetY);
}

function dropPet(event) {
  if (!petDrag) return;
  const wasMoved = petDrag.moved;
  petDrag = null;
  petBoy.classList.remove('dragging');
  if (petBoy.hasPointerCapture(event.pointerId)) petBoy.releasePointerCapture(event.pointerId);
  petNextDecisionAt = 0;
  if (wasMoved) petSay('여기가 민지씨가 정해준 자리!');
  else countPetClick();
}

function updateBgmButton() {
  bgmToggle.textContent = bgmAudio.paused || bgmAudio.muted ? 'BGM 켜기' : 'BGM 끄기';
  bgmToggle.setAttribute('aria-pressed', String(bgmAudio.muted));
}

function startBgm() {
  if (bgmStarted) return;
  bgmStarted = true;
  bgmAudio.volume = 0.42;
  bgmAudio.play().then(updateBgmButton).catch(() => {
    bgmStarted = false;
    bgmToggle.textContent = 'BGM 켜기';
  });
}

function toggleBgm() {
  if (bgmAudio.paused) {
    bgmAudio.muted = false;
    startBgm();
    updateBgmButton();
    return;
  }
  bgmAudio.muted = !bgmAudio.muted;
  updateBgmButton();
}

function handleFirstBgmGesture(event) {
  if (event.target instanceof Element && event.target.closest('#bgmToggle')) return;
  startBgm();
  window.removeEventListener('pointerdown', handleFirstBgmGesture);
  window.removeEventListener('keydown', handleFirstBgmGesture);
}

function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) audioCtx = new AudioContextClass();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playCatchSound() {
  const sound = getAudioContext();
  if (!sound) return;
  const now = sound.currentTime;
  const gain = sound.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
  gain.connect(sound.destination);

  [880, 1174].forEach((frequency, index) => {
    const oscillator = sound.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, now + index * 0.055);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.18, now + 0.14 + index * 0.055);
    oscillator.connect(gain);
    oscillator.start(now + index * 0.055);
    oscillator.stop(now + 0.2 + index * 0.055);
  });
}

function hideReward() {
  rewardPop.hidden = true;
  rewardImage.removeAttribute('src');
  clearTimeout(rewardTimerId);
  rewardTimerId = null;
}

function showReward() {
  if (rewardShown) return;
  rewardShown = true;
  const randomImage = rewardImages[Math.floor(Math.random() * rewardImages.length)];
  rewardImage.src = randomImage;
  rewardPop.hidden = false;
  clearTimeout(rewardTimerId);
  rewardTimerId = setTimeout(hideReward, 10000);
}

function drawHeart(x, y, size, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 32, size / 32);
  ctx.beginPath();
  ctx.moveTo(0, 9);
  ctx.bezierCurveTo(-24, -8, -15, -28, 0, -15);
  ctx.bezierCurveTo(15, -28, 24, -8, 0, 9);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff8fb';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(115, 215, 196, 0.18)';
  for (let i = 0; i < 8; i++) ctx.fillRect(i * 95 - 20, 335 + Math.sin(i) * 8, 54, 120);

  hearts.forEach((heart) => drawHeart(heart.x, heart.y, heart.size, heart.color));

  ctx.fillStyle = '#2c2430';
  ctx.beginPath();
  ctx.roundRect(basket.x, basket.y, basket.w, basket.h, 12);
  ctx.fill();
  ctx.fillStyle = '#ffe07a';
  ctx.fillRect(basket.x + 14, basket.y + 7, basket.w - 28, 5);

  if (!playing && score === 0) {
    ctx.fillStyle = 'rgba(44, 36, 48, 0.72)';
    ctx.font = '24px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Start를 눌러 하트를 받아보세요', canvas.width / 2, canvas.height / 2);
  }
}

function spawnHeart(now) {
  if (now - lastSpawn < 520) return;
  lastSpawn = now;
  hearts.push({
    x: 30 + Math.random() * (canvas.width - 60),
    y: -30,
    size: 22 + Math.random() * 18,
    speed: 2.3 + Math.random() * 2.4,
    color: ['#f26f91', '#ff8a6b', '#73d7c4', '#ffd45f'][Math.floor(Math.random() * 4)]
  });
}

function update(now) {
  if (!playing) return;
  if (!lastTick) lastTick = now;
  if (keys.has('ArrowLeft') || keys.has('a')) basket.x -= basket.speed;
  if (keys.has('ArrowRight') || keys.has('d')) basket.x += basket.speed;
  basket.x = Math.max(0, Math.min(canvas.width - basket.w, basket.x));

  spawnHeart(now);
  hearts.forEach((heart) => heart.y += heart.speed);
  hearts = hearts.filter((heart) => {
    const caught = heart.y + heart.size / 2 >= basket.y && heart.x >= basket.x && heart.x <= basket.x + basket.w;
    if (caught) {
      score += 10;
      scoreEl.textContent = score;
      playCatchSound();
      if (score >= 500) showReward();
      return false;
    }
    return heart.y < canvas.height + 40;
  });
  drawGame();
  animationId = requestAnimationFrame(update);
}

function endGame() {
  playing = false;
  clearInterval(timerId);
  cancelAnimationFrame(animationId);
  bestScore = Math.max(bestScore, score);
  localStorage.setItem(bestScoreKey, String(bestScore));
  bestEl.textContent = bestScore;
  startBtn.textContent = 'Restart';
  ctx.fillStyle = 'rgba(44, 36, 48, 0.78)';
  ctx.font = '28px Segoe UI, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`점수 ${score}점!`, canvas.width / 2, canvas.height / 2);
  if (score < 500) {
    ctx.font = '20px Segoe UI, sans-serif';
    ctx.fillText('500점을 노려봐! 그럼 좀 더 특별한 선물이 있을껄?', canvas.width / 2, canvas.height / 2 + 42);
  }
}

function startGame() {
  clearInterval(timerId);
  cancelAnimationFrame(animationId);
  hideReward();
  basket.x = canvas.width / 2 - basket.w / 2;
  hearts = [];
  score = 0;
  timeLeft = 30;
  lastSpawn = 0;
  lastTick = 0;
  rewardShown = false;
  playing = true;
  scoreEl.textContent = score;
  timeEl.textContent = timeLeft;
  startBtn.textContent = 'Playing';
  timerId = setInterval(() => {
    timeLeft -= 1;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
  animationId = requestAnimationFrame(update);
}

window.addEventListener('keydown', (event) => keys.add(event.key));
window.addEventListener('keyup', (event) => keys.delete(event.key));
window.addEventListener('pointerdown', handleFirstBgmGesture);
window.addEventListener('keydown', handleFirstBgmGesture);
canvas.addEventListener('pointermove', (event) => {
  const rect = canvas.getBoundingClientRect();
  const ratio = canvas.width / rect.width;
  basket.x = (event.clientX - rect.left) * ratio - basket.w / 2;
  basket.x = Math.max(0, Math.min(canvas.width - basket.w, basket.x));
  drawGame();
});
bgmToggle.addEventListener('click', toggleBgm);
updateBgmButton();
renderMoonTracker();
fortuneButton.addEventListener('click', showFortune);
lunchButton.addEventListener('click', showLunchMenu);
petBoy.addEventListener('pointerdown', startPetDrag);
petBoy.addEventListener('pointermove', dragPet);
petBoy.addEventListener('pointerup', dropPet);
petBoy.addEventListener('pointercancel', dropPet);
petBoy.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    countPetClick();
  }
});
window.addEventListener('resize', () => movePet(petX, petY));
movePet(petX, petY);
setPetMode('walk');
requestAnimationFrame(updatePet);
setTimeout(() => petSay('민지씨랑 놀러 왔어!'), 900);
startBtn.addEventListener('click', startGame);
drawGame();
