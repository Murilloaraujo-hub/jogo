(() => {
  'use strict';

  // Cinzas do Relógio — jogo de plataforma original, feito em Canvas 2D.
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const W = 960;
  const H = 540;
  const FLOOR = 460;
  const MAX_HP = 5;
  const SAVE_KEY = 'cinzas-do-relogio-progresso-v1';

  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let cssScale = 1;
  let cssOffsetX = 0;
  let cssOffsetY = 0;

  const STAGES = [
    {
      name: 'Bosque do Breu', subtitle: 'onde os sinos crescem nas árvores',
      colors: { sky1: '#17182b', sky2: '#3c2949', far: '#273247', mid: '#172a32', ground: '#17252a', dirt: '#273a38', edge: '#a6bb75', glow: '#f6c879', accent: '#cf8e73' },
      length: 5650, bossStart: 4380, arenaLeft: 4240, arenaRight: 5550, checkpoint: 2470,
      pits: [[680, 785], [1430, 1545], [2260, 2380], [3170, 3295], [3900, 4010]],
      platforms: [[330, 390, 125], [535, 360, 112], [760, 398, 100], [1000, 382, 145], [1260, 348, 120], [1500, 395, 100], [1710, 368, 145], [1990, 345, 135], [2310, 398, 110], [2500, 375, 145], [2780, 336, 140], [3030, 389, 110], [3340, 360, 145], [3620, 392, 112], [3890, 398, 100], [4080, 355, 145], [4460, 382, 110], [5200, 375, 125]],
      spikes: [[1060, 76], [1870, 92], [2710, 76], [3500, 82], [4140, 70]],
      enemies: [
        { type: 'crawler', x: 480, min: 410, max: 600 }, { type: 'moth', x: 900, y: 280, min: 820, max: 1050 },
        { type: 'spitter', x: 1190 }, { type: 'crawler', x: 1640, min: 1580, max: 1790 },
        { type: 'moth', x: 2130, y: 295, min: 2020, max: 2220 }, { type: 'crawler', x: 2640, min: 2550, max: 2750 },
        { type: 'spitter', x: 2930 }, { type: 'moth', x: 3450, y: 275, min: 3350, max: 3570 },
        { type: 'crawler', x: 3740, min: 3660, max: 3850 }, { type: 'spitter', x: 4165 }
      ],
      crystals: [[1080, 335], [1900, 315], [2820, 300], [3570, 326], [4185, 318]],
      boss: { name: 'O Barão Catraca', kind: 'stag', attacks: ['wave', 'slam'] }
    },
    {
      name: 'Forja Rubra', subtitle: 'o coração quente da montanha',
      colors: { sky1: '#251923', sky2: '#703b3b', far: '#50313b', mid: '#35272f', ground: '#322326', dirt: '#503330', edge: '#f0a268', glow: '#ffd078', accent: '#e37c68' },
      length: 5750, bossStart: 4480, arenaLeft: 4320, arenaRight: 5650, checkpoint: 2600,
      pits: [[610, 720], [1370, 1490], [2220, 2340], [3050, 3170], [3870, 3985]],
      platforms: [[275, 388, 132], [495, 350, 125], [720, 395, 100], [920, 368, 145], [1180, 338, 138], [1430, 394, 105], [1630, 365, 140], [1900, 330, 150], [2210, 396, 118], [2415, 366, 130], [2705, 340, 150], [2960, 390, 105], [3190, 360, 145], [3490, 332, 150], [3800, 392, 120], [4040, 357, 155], [4380, 390, 100], [5100, 370, 150]],
      spikes: [[1000, 86], [1800, 78], [2600, 86], [3390, 88], [4160, 76]],
      enemies: [
        { type: 'crawler', x: 400, min: 340, max: 555 }, { type: 'spitter', x: 850 }, { type: 'moth', x: 1080, y: 270, min: 980, max: 1190 },
        { type: 'crawler', x: 1575, min: 1510, max: 1710 }, { type: 'spitter', x: 2080 }, { type: 'moth', x: 2510, y: 280, min: 2430, max: 2670 },
        { type: 'crawler', x: 2860, min: 2780, max: 2990 }, { type: 'spitter', x: 3320 }, { type: 'moth', x: 3710, y: 260, min: 3590, max: 3790 },
        { type: 'crawler', x: 4100, min: 4020, max: 4270 }
      ],
      crystals: [[960, 320], [1850, 290], [2740, 300], [3540, 290], [4210, 320]],
      boss: { name: 'Madame Fornalha', kind: 'witch', attacks: ['rain', 'burst'] }
    },
    {
      name: 'Abismo de Sal', subtitle: 'a maré guarda o último segredo',
      colors: { sky1: '#101c30', sky2: '#284e65', far: '#1b344a', mid: '#17313a', ground: '#10252b', dirt: '#1d4143', edge: '#82d6c8', glow: '#95f0df', accent: '#b1a3e8' },
      length: 5850, bossStart: 4570, arenaLeft: 4400, arenaRight: 5780, checkpoint: 2710,
      pits: [[720, 830], [1510, 1630], [2390, 2510], [3290, 3410], [4060, 4180]],
      platforms: [[320, 385, 125], [545, 350, 125], [800, 395, 95], [1040, 372, 145], [1300, 337, 135], [1530, 397, 100], [1780, 363, 145], [2070, 330, 145], [2390, 392, 120], [2600, 365, 130], [2900, 333, 145], [3160, 392, 105], [3430, 360, 140], [3730, 330, 155], [4010, 392, 110], [4230, 358, 150], [4490, 385, 110], [5330, 365, 145]],
      spikes: [[1110, 82], [1960, 90], [2820, 82], [3650, 90], [4310, 72]],
      enemies: [
        { type: 'moth', x: 450, y: 270, min: 360, max: 590 }, { type: 'crawler', x: 940, min: 870, max: 1020 }, { type: 'spitter', x: 1200 },
        { type: 'crawler', x: 1710, min: 1650, max: 1880 }, { type: 'moth', x: 2180, y: 265, min: 2090, max: 2320 }, { type: 'spitter', x: 2580 },
        { type: 'crawler', x: 3020, min: 2950, max: 3150 }, { type: 'moth', x: 3530, y: 260, min: 3450, max: 3690 }, { type: 'spitter', x: 3900 },
        { type: 'crawler', x: 4260, min: 4200, max: 4400 }
      ],
      crystals: [[1060, 320], [1990, 290], [2890, 295], [3760, 290], [4320, 315]],
      boss: { name: 'O Leviatã de Vidro', kind: 'leviathan', attacks: ['spread', 'sweep'] }
    }
  ];

  const held = new Set();
  const justPressed = new Set();
  let unlockedStage = loadProgress();
  let selectedStage = 0;
  let screen = 'menu';
  let levelIndex = 0;
  let level = null;
  let player = null;
  let cameraX = 0;
  let playerShots = [];
  let enemyShots = [];
  let particles = [];
  let activeBoss = null;
  let bossTriggered = false;
  let bossIntroTimer = 0;
  let bannerText = '';
  let bannerTimer = 0;
  let lastCheckpointX = 90;
  let time = 0;
  let shake = 0;
  let menuTime = 0;
  let pointerDown = false;

  function loadProgress() {
    try {
      const value = Number(localStorage.getItem(SAVE_KEY));
      return Number.isFinite(value) ? Math.max(0, Math.min(STAGES.length - 1, value)) : 0;
    } catch (_) { return 0; }
  }
  function saveProgress() {
    try { localStorage.setItem(SAVE_KEY, String(unlockedStage)); } catch (_) { /* armazenamento opcional */ }
  }

  function resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    scale = Math.min(canvas.width / W, canvas.height / H);
    offsetX = (canvas.width - W * scale) / 2;
    offsetY = (canvas.height - H * scale) / 2;
    cssScale = Math.min(rect.width / W, rect.height / H);
    cssOffsetX = (rect.width - W * cssScale) / 2;
    cssOffsetY = (rect.height - H * cssScale) / 2;
  }
  window.addEventListener('resize', resize);
  resize();

  function logicalPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left - cssOffsetX) / cssScale,
      y: (event.clientY - rect.top - cssOffsetY) / cssScale
    };
  }
  function setKey(code, down, repeat = false) {
    if (down) {
      if (!held.has(code) && !repeat) justPressed.add(code);
      held.add(code);
    } else held.delete(code);
  }
  window.addEventListener('keydown', (event) => {
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) event.preventDefault();
    setKey(event.code, true, event.repeat);
    if (event.code === 'Escape' && !event.repeat) {
      if (screen === 'playing') screen = 'paused';
      else if (screen === 'paused') screen = 'playing';
    }
  });
  window.addEventListener('keyup', (event) => setKey(event.code, false));
  window.addEventListener('blur', () => held.clear());

  canvas.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const point = logicalPoint(event);
    if (screen === 'menu') {
      const cardY = 292;
      for (let i = 0; i < STAGES.length; i++) {
        const x = 197 + i * 190;
        if (point.x >= x && point.x <= x + 174 && point.y >= cardY && point.y <= cardY + 72 && i <= unlockedStage) {
          selectedStage = i;
          return;
        }
      }
      if (point.x >= 365 && point.x <= 595 && point.y >= 393 && point.y <= 455) startStage(selectedStage);
    } else if (screen === 'playing') {
      pointerDown = true;
      held.add('MouseShoot');
      try { canvas.setPointerCapture(event.pointerId); } catch (_) { /* sem captura em alguns browsers */ }
    } else if (screen === 'stageclear') {
      startStage(Math.min(levelIndex + 1, STAGES.length - 1));
    } else if (screen === 'dead') {
      restartFromCheckpoint();
    } else if (screen === 'victory') {
      screen = 'menu';
    }
  });
  canvas.addEventListener('pointerup', () => { pointerDown = false; held.delete('MouseShoot'); });
  canvas.addEventListener('pointercancel', () => { pointerDown = false; held.delete('MouseShoot'); });

  document.querySelectorAll('.touch-button').forEach((button) => {
    const code = button.dataset.key;
    button.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      button.classList.add('is-held');
      setKey(code, true);
      try { button.setPointerCapture(event.pointerId); } catch (_) { /* noop */ }
    });
    const release = (event) => {
      event.preventDefault();
      button.classList.remove('is-held');
      setKey(code, false);
    };
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('lostpointercapture', release);
  });

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function approach(value, target, amount) {
    return value < target ? Math.min(target, value + amount) : Math.max(target, value - amount);
  }
  function isDown(...codes) { return codes.some((code) => held.has(code)); }
  function wasPressed(...codes) { return codes.some((code) => justPressed.has(code)); }
  function rand(min, max) { return min + Math.random() * (max - min); }
  function seeded(n) {
    const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return v - Math.floor(v);
  }
  function roundedRect(x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }
  function ellipse(x, y, rx, ry) {
    ctx.beginPath();
    ctx.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, Math.PI * 2);
  }
  function rectsOverlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }
  function actorRect(actor) {
    return { x: actor.x - actor.w / 2, y: actor.y, w: actor.w, h: actor.h };
  }

  function makeLevel(index) {
    const def = STAGES[index];
    const solids = [];
    let left = 0;
    for (const [pitStart, pitEnd] of def.pits) {
      if (pitStart > left) solids.push({ x: left, y: FLOOR, w: pitStart - left, h: H - FLOOR + 100, kind: 'ground' });
      left = pitEnd;
    }
    if (left < def.length) solids.push({ x: left, y: FLOOR, w: def.length - left, h: H - FLOOR + 100, kind: 'ground' });
    for (const [x, y, w] of def.platforms) solids.push({ x, y, w, h: 17, kind: 'ledge' });

    const enemies = def.enemies.map((d, i) => {
      const sizes = { crawler: [38, 29], moth: [38, 30], spitter: [40, 42] };
      const [w, h] = sizes[d.type];
      return {
        type: d.type, x: d.x, y: d.y !== undefined ? d.y : FLOOR - h, w, h,
        baseY: d.y !== undefined ? d.y : FLOOR - h, min: d.min ?? d.x - 75, max: d.max ?? d.x + 75,
        dir: i % 2 ? -1 : 1, hp: d.type === 'spitter' ? 3 : 2, t: i * 1.7,
        shotTimer: 1.1 + (i % 3) * 0.4, flash: 0, dead: false
      };
    });
    const crystals = def.crystals.map(([x, y], i) => ({ x, y, taken: false, phase: i * 1.9 }));
    return { def, solids, enemies, crystals, spikes: def.spikes.map(([x, w]) => ({ x, w, y: FLOOR - 17 })) };
  }
  function makePlayer(x = 90) {
    return {
      x, y: FLOOR - 48, w: 28, h: 48, vx: 0, vy: 0, face: 1, hp: MAX_HP,
      grounded: false, coyote: 0, jumpBuffer: 0, fireTimer: 0, dashTimer: 0,
      dashCooldown: 0, dashDir: 1, invuln: 0, checkpointX: x, shotAnim: 0,
      footstep: 0, lastGround: FLOOR
    };
  }
  function createBoss() {
    const def = level.def;
    return {
      name: def.boss.name, kind: def.boss.kind, attacks: def.boss.attacks,
      x: def.arenaLeft + (def.arenaRight - def.arenaLeft) * 0.65,
      y: FLOOR - 126, w: 112, h: 126, hp: 18, maxHp: 18,
      state: 'idle', timer: 0.8, attackIndex: 0, attackType: '', flash: 0,
      phase: 1, defeated: false, facing: -1, bob: rand(0, 6)
    };
  }
  function startStage(index, spawnX = 90) {
    levelIndex = clamp(index, 0, STAGES.length - 1);
    selectedStage = levelIndex;
    level = makeLevel(levelIndex);
    player = makePlayer(spawnX);
    player.checkpointX = spawnX;
    lastCheckpointX = spawnX;
    cameraX = clamp(player.x - W * 0.4, 0, level.def.length - W);
    playerShots = [];
    enemyShots = [];
    particles = [];
    activeBoss = null;
    bossTriggered = false;
    bossIntroTimer = 0;
    bannerText = '';
    bannerTimer = 0;
    shake = 0;
    screen = 'playing';
  }
  function restartFromCheckpoint() {
    const checkpoint = lastCheckpointX || 90;
    startStage(levelIndex, checkpoint);
  }

  function addParticles(x, y, color, count = 8, speed = 140) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = rand(speed * 0.25, speed);
      particles.push({ x, y, vx: Math.cos(angle) * velocity, vy: Math.sin(angle) * velocity, life: rand(0.25, 0.65), maxLife: 0.65, r: rand(1.5, 4.2), color, gravity: 180 });
    }
  }
  function showBanner(text, duration = 2.2) { bannerText = text; bannerTimer = duration; }
  function createPlayerShot() {
    if (!player || player.fireTimer > 0) return;
    const x = player.x + player.face * 22;
    const y = player.y + 21;
    playerShots.push({ x, y, vx: player.face * 590, life: 1.25, r: 6, damage: 1 });
    player.fireTimer = 0.23;
    player.shotAnim = 0.14;
    addParticles(x, y, '#ffe3a0', 3, 55);
  }
  function createEnemyShot(x, y, vx, vy, kind = 'ember', radius = 9, life = 4) {
    enemyShots.push({ x, y, vx, vy, kind, r: radius, life, born: time });
  }
  function hurtPlayer(sourceX, amount = 1) {
    if (!player || player.invuln > 0 || player.dashTimer > 0 || screen !== 'playing') return;
    player.hp -= amount;
    player.invuln = 1.15;
    player.vx = (player.x >= sourceX ? 1 : -1) * 255;
    player.vy = -300;
    shake = 0.18;
    addParticles(player.x, player.y + 24, '#ff9c88', 12, 190);
    if (player.hp <= 0) {
      player.hp = 0;
      screen = 'dead';
    }
  }
  function collectCrystal(crystal) {
    crystal.taken = true;
    player.hp = Math.min(MAX_HP, player.hp + 1);
    addParticles(crystal.x, crystal.y, '#f9d486', 18, 170);
    showBanner(player.hp === MAX_HP ? 'FRAGMENTO DE LUZ' : 'VIDA RESTAURADA', 1.25);
  }

  function updatePlayer(dt) {
    const p = player;
    p.fireTimer = Math.max(0, p.fireTimer - dt);
    p.invuln = Math.max(0, p.invuln - dt);
    p.dashCooldown = Math.max(0, p.dashCooldown - dt);
    p.shotAnim = Math.max(0, p.shotAnim - dt);
    p.jumpBuffer = Math.max(0, p.jumpBuffer - dt);
    if (wasPressed('Space', 'ArrowUp', 'KeyW')) p.jumpBuffer = 0.15;

    const input = (isDown('ArrowRight', 'KeyD') ? 1 : 0) - (isDown('ArrowLeft', 'KeyA') ? 1 : 0);
    if (input) {
      p.face = input;
      p.vx = approach(p.vx, input * 255, 1500 * dt);
    } else if (p.dashTimer <= 0) {
      p.vx = approach(p.vx, 0, 1850 * dt);
    }

    if (wasPressed('ShiftLeft', 'ShiftRight', 'KeyK') && p.dashCooldown <= 0) {
      p.dashDir = input || p.face;
      p.face = p.dashDir;
      p.dashTimer = 0.19;
      p.dashCooldown = 0.82;
      p.invuln = Math.max(p.invuln, 0.27);
      p.vx = p.dashDir * 545;
      p.vy = 0;
      addParticles(p.x - p.dashDir * 15, p.y + 28, '#c3d9d0', 8, 115);
    }
    if (p.dashTimer > 0) {
      p.dashTimer = Math.max(0, p.dashTimer - dt);
      p.vx = p.dashDir * 545;
      p.vy = 0;
      if (Math.random() < 0.7) particles.push({ x: p.x - p.dashDir * 15, y: p.y + rand(15, 40), vx: rand(-35, 35), vy: rand(-35, 35), life: 0.22, maxLife: 0.22, r: rand(2, 5), color: '#b8d7ce', gravity: 0 });
    } else {
      p.vy = Math.min(900, p.vy + 1650 * dt);
    }

    if (p.jumpBuffer > 0 && (p.grounded || p.coyote > 0)) {
      p.vy = -610;
      p.grounded = false;
      p.coyote = 0;
      p.jumpBuffer = 0;
      addParticles(p.x, p.y + p.h, '#d4c9a9', 5, 75);
    }
    if (!isDown('Space', 'ArrowUp', 'KeyW') && p.vy < -210) p.vy += 980 * dt;

    p.x += p.vx * dt;
    const leftBound = bossTriggered ? level.def.arenaLeft + 22 : 15;
    p.x = clamp(p.x, leftBound, level.def.length - p.w / 2 - 14);

    const previousBottom = p.y + p.h;
    p.y += p.vy * dt;
    p.grounded = false;
    if (p.vy >= 0) {
      for (const solid of level.solids) {
        const overlapsX = p.x + p.w / 2 > solid.x && p.x - p.w / 2 < solid.x + solid.w;
        const currentBottom = p.y + p.h;
        if (overlapsX && previousBottom <= solid.y + 3 && currentBottom >= solid.y) {
          p.y = solid.y - p.h;
          p.vy = 0;
          p.grounded = true;
          p.lastGround = solid.y;
          break;
        }
      }
    }
    if (p.grounded) p.coyote = 0.12;
    else p.coyote = Math.max(0, p.coyote - dt);

    if (isDown('KeyJ', 'KeyX', 'MouseShoot')) createPlayerShot();
    if (p.y > H + 80) {
      p.hp = 0;
      screen = 'dead';
      return;
    }

    const pRect = actorRect(p);
    for (const spike of level.spikes) {
      const spikeRect = { x: spike.x, y: spike.y + 4, w: spike.w, h: 16 };
      if (rectsOverlap(pRect, spikeRect)) hurtPlayer(spike.x + spike.w / 2, 1);
    }
    for (const crystal of level.crystals) {
      if (crystal.taken) continue;
      if (Math.abs(p.x - crystal.x) < 26 && Math.abs(p.y + p.h * 0.5 - crystal.y) < 34) collectCrystal(crystal);
    }

    if (!bossTriggered && p.x > level.def.bossStart) {
      bossTriggered = true;
      activeBoss = createBoss();
      bossIntroTimer = 2.5;
      showBanner(level.def.boss.name, 2.5);
      shake = 0.32;
      addParticles(activeBoss.x, FLOOR - 70, level.def.colors.glow, 28, 230);
    }
    if (player.x > level.def.checkpoint && player.checkpointX < level.def.checkpoint) {
      player.checkpointX = level.def.checkpoint;
      lastCheckpointX = level.def.checkpoint;
      player.hp = MAX_HP;
      showBanner('PONTO DE RETORNO ATIVADO', 2.2);
      addParticles(level.def.checkpoint, FLOOR - 45, level.def.colors.glow, 22, 145);
    }
  }

  function updateEnemies(dt) {
    const pRect = actorRect(player);
    for (const enemy of level.enemies) {
      if (enemy.dead) continue;
      enemy.t += dt;
      enemy.flash = Math.max(0, enemy.flash - dt);
      if (enemy.type === 'crawler') {
        enemy.x += enemy.dir * 65 * dt;
        if (enemy.x > enemy.max || enemy.x < enemy.min) enemy.dir *= -1;
        enemy.x = clamp(enemy.x, enemy.min, enemy.max);
      } else if (enemy.type === 'moth') {
        enemy.x += enemy.dir * 37 * dt;
        if (enemy.x > enemy.max || enemy.x < enemy.min) enemy.dir *= -1;
        enemy.x = clamp(enemy.x, enemy.min, enemy.max);
        enemy.y = enemy.baseY + Math.sin(enemy.t * 2.4) * 13;
      } else if (enemy.type === 'spitter') {
        enemy.shotTimer -= dt;
        const distance = Math.abs(player.x - enemy.x);
        if (distance < 480 && enemy.shotTimer <= 0) {
          const sx = enemy.x;
          const sy = enemy.y + 15;
          const angle = Math.atan2(player.y + 21 - sy, player.x - sx);
          createEnemyShot(sx, sy, Math.cos(angle) * 225, Math.sin(angle) * 225, 'seed', 8, 3.2);
          enemy.shotTimer = 2.4 + Math.random() * 0.5;
        }
      }
      const eRect = { x: enemy.x - enemy.w / 2, y: enemy.y, w: enemy.w, h: enemy.h };
      if (rectsOverlap(pRect, eRect)) hurtPlayer(enemy.x, 1);
    }
  }

  function fireBossAttack(boss) {
    const aimX = player.x;
    const aimY = player.y + player.h * 0.5;
    const cx = boss.x;
    const cy = boss.y + 58;
    const direction = aimX >= cx ? 1 : -1;
    const attack = boss.attackType;
    if (attack === 'wave') {
      createEnemyShot(cx, FLOOR - 20, direction * 335, 0, 'wave', 22, 5);
    } else if (attack === 'slam') {
      createEnemyShot(cx - 24, FLOOR - 21, -285, 0, 'wave', 18, 4);
      createEnemyShot(cx + 24, FLOOR - 21, 285, 0, 'wave', 18, 4);
      for (let i = 0; i < 6; i++) {
        const a = Math.PI + (Math.PI * i / 5);
        createEnemyShot(cx, cy, Math.cos(a) * 205, Math.sin(a) * 205, 'ember', 8, 2.7);
      }
    } else if (attack === 'rain') {
      for (const offset of [-135, -45, 45, 135]) {
        const x = clamp(aimX + offset, level.def.arenaLeft + 48, level.def.arenaRight - 48);
        createEnemyShot(x, 175 + (offset === 45 ? 35 : 0), (aimX - x) * 0.12, 315, 'ember', 13, 3.2);
      }
    } else if (attack === 'burst') {
      for (let i = -2; i <= 2; i++) {
        const angle = Math.atan2(aimY - cy, aimX - cx) + i * 0.24;
        createEnemyShot(cx, cy, Math.cos(angle) * 275, Math.sin(angle) * 275, 'ember', 9, 3.4);
      }
    } else if (attack === 'spread') {
      for (let i = -2; i <= 2; i++) {
        const angle = Math.atan2(aimY - cy, aimX - cx) + i * 0.3;
        createEnemyShot(cx, cy, Math.cos(angle) * 245, Math.sin(angle) * 245, 'bubble', 10, 3.5);
      }
    } else if (attack === 'sweep') {
      createEnemyShot(cx - 12, FLOOR - 20, -355, 0, 'wave', 24, 4.5);
      createEnemyShot(cx + 12, FLOOR - 20, 355, 0, 'wave', 24, 4.5);
    }
  }
  function updateBoss(dt) {
    if (!activeBoss || activeBoss.defeated) return;
    const boss = activeBoss;
    boss.flash = Math.max(0, boss.flash - dt);
    boss.phase = boss.hp <= 6 ? 3 : boss.hp <= 12 ? 2 : 1;
    boss.bob += dt * (boss.phase > 1 ? 2.2 : 1.4);
    boss.facing = player.x < boss.x ? -1 : 1;
    if (boss.state === 'idle') {
      const desired = clamp(player.x + boss.facing * -155, level.def.arenaLeft + 160, level.def.arenaRight - 150);
      boss.x += clamp(desired - boss.x, -64 * dt, 64 * dt);
      boss.timer -= dt;
      if (boss.timer <= 0) {
        boss.attackType = boss.attacks[boss.attackIndex % boss.attacks.length];
        boss.attackIndex++;
        boss.state = 'tell';
        boss.timer = boss.phase === 3 ? 0.62 : 0.82;
      }
    } else if (boss.state === 'tell') {
      boss.timer -= dt;
      if (boss.timer <= 0) {
        fireBossAttack(boss);
        boss.state = 'recover';
        boss.timer = boss.phase === 3 ? 0.56 : 0.78;
        shake = 0.13;
      }
    } else {
      boss.timer -= dt;
      if (boss.timer <= 0) {
        boss.state = 'idle';
        boss.timer = boss.phase === 3 ? 0.46 : boss.phase === 2 ? 0.7 : 0.95;
      }
    }
    const bRect = { x: boss.x - boss.w / 2, y: boss.y, w: boss.w, h: boss.h };
    if (rectsOverlap(actorRect(player), bRect)) hurtPlayer(boss.x, 1);
  }

  function updateProjectiles(dt) {
    for (let i = playerShots.length - 1; i >= 0; i--) {
      const shot = playerShots[i];
      shot.x += shot.vx * dt;
      shot.life -= dt;
      let hit = false;
      for (const enemy of level.enemies) {
        if (enemy.dead) continue;
        const r = { x: enemy.x - enemy.w / 2, y: enemy.y, w: enemy.w, h: enemy.h };
        if (shot.x + shot.r > r.x && shot.x - shot.r < r.x + r.w && shot.y + shot.r > r.y && shot.y - shot.r < r.y + r.h) {
          enemy.hp -= shot.damage;
          enemy.flash = 0.13;
          addParticles(shot.x, shot.y, '#ffe2a0', 5, 90);
          if (enemy.hp <= 0) {
            enemy.dead = true;
            addParticles(enemy.x, enemy.y + enemy.h / 2, '#dca37c', 13, 145);
          }
          hit = true;
          break;
        }
      }
      if (!hit && activeBoss && !activeBoss.defeated) {
        const b = activeBoss;
        const r = { x: b.x - b.w / 2, y: b.y, w: b.w, h: b.h };
        if (shot.x + shot.r > r.x && shot.x - shot.r < r.x + r.w && shot.y + shot.r > r.y && shot.y - shot.r < r.y + r.h) {
          b.hp -= shot.damage;
          b.flash = 0.12;
          addParticles(shot.x, shot.y, level.def.colors.glow, 7, 110);
          if (b.hp <= 0) {
            b.hp = 0;
            b.defeated = true;
            addParticles(b.x, b.y + b.h / 2, level.def.colors.glow, 46, 250);
            shake = 0.48;
            completeStage();
          }
          hit = true;
        }
      }
      if (hit || shot.life <= 0 || shot.x < cameraX - 100 || shot.x > cameraX + W + 100) playerShots.splice(i, 1);
    }

    for (let i = enemyShots.length - 1; i >= 0; i--) {
      const shot = enemyShots[i];
      shot.x += shot.vx * dt;
      shot.y += shot.vy * dt;
      shot.life -= dt;
      if (shot.kind === 'wave') shot.y = FLOOR - 19 + Math.sin(time * 12 + shot.born) * 2;
      if (shot.life <= 0 || shot.y > H + 45 || shot.x < cameraX - 150 || shot.x > cameraX + W + 150) {
        enemyShots.splice(i, 1);
        continue;
      }
      const px = player.x;
      const py = player.y + player.h * 0.53;
      const hitX = Math.abs(px - shot.x) < player.w / 2 + shot.r * 0.72;
      const hitY = Math.abs(py - shot.y) < player.h / 2 + shot.r * 0.75;
      const waveHit = shot.kind === 'wave' && hitX && player.y + player.h > FLOOR - 45;
      if ((waveHit || (hitX && hitY)) && player.invuln <= 0) {
        hurtPlayer(shot.x, 1);
        enemyShots.splice(i, 1);
      }
    }
  }

  function completeStage() {
    if (screen !== 'playing') return;
    unlockedStage = Math.max(unlockedStage, Math.min(STAGES.length - 1, levelIndex + 1));
    saveProgress();
    screen = levelIndex === STAGES.length - 1 ? 'victory' : 'stageclear';
  }

  function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const part = particles[i];
      part.life -= dt;
      part.x += part.vx * dt;
      part.y += part.vy * dt;
      part.vy += (part.gravity || 0) * dt;
      part.vx *= Math.max(0, 1 - dt * 1.7);
      if (part.life <= 0) particles.splice(i, 1);
    }
  }

  function update(dt) {
    time += dt;
    menuTime += dt;
    updateParticles(dt);
    shake = Math.max(0, shake - dt);
    bannerTimer = Math.max(0, bannerTimer - dt);

    if (screen === 'menu') {
      if (wasPressed('ArrowLeft', 'KeyA')) selectedStage = Math.max(0, selectedStage - 1);
      if (wasPressed('ArrowRight', 'KeyD')) selectedStage = Math.min(unlockedStage, selectedStage + 1);
      if (wasPressed('Digit1')) selectedStage = 0;
      if (wasPressed('Digit2') && unlockedStage >= 1) selectedStage = 1;
      if (wasPressed('Digit3') && unlockedStage >= 2) selectedStage = 2;
      if (wasPressed('Enter', 'Space')) startStage(selectedStage);
    } else if (screen === 'playing') {
      updatePlayer(dt);
      if (screen === 'playing') updateEnemies(dt);
      if (screen === 'playing' && activeBoss) updateBoss(dt);
      if (screen === 'playing') updateProjectiles(dt);
      bossIntroTimer = Math.max(0, bossIntroTimer - dt);
      if (screen === 'playing') {
        const target = clamp(player.x - W * 0.4, 0, level.def.length - W);
        cameraX += (target - cameraX) * Math.min(1, dt * 5.5);
      }
    } else if (screen === 'stageclear') {
      if (wasPressed('Enter', 'Space')) startStage(levelIndex + 1);
      if (wasPressed('KeyM')) screen = 'menu';
    } else if (screen === 'dead') {
      if (wasPressed('Enter', 'Space', 'KeyR')) restartFromCheckpoint();
      if (wasPressed('KeyM')) screen = 'menu';
    } else if (screen === 'paused') {
      if (wasPressed('KeyR')) restartFromCheckpoint();
      if (wasPressed('KeyM')) screen = 'menu';
    } else if (screen === 'victory') {
      if (wasPressed('Enter', 'Space', 'KeyM')) screen = 'menu';
    }
    justPressed.clear();
  }

  function drawBackdrop(stageIndex, cam = 0) {
    const palette = STAGES[stageIndex].colors;
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, palette.sky1);
    gradient.addColorStop(0.68, palette.sky2);
    gradient.addColorStop(1, palette.mid);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    const moonX = 745 - (cam * 0.07 % 1100);
    const moonY = 115;
    const moonGlow = ctx.createRadialGradient(moonX, moonY, 6, moonX, moonY, 145);
    moonGlow.addColorStop(0, stageIndex === 1 ? 'rgba(255,200,130,.20)' : 'rgba(226,221,199,.20)');
    moonGlow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = moonGlow;
    ctx.fillRect(moonX - 150, moonY - 150, 300, 300);
    ctx.fillStyle = stageIndex === 1 ? 'rgba(255,205,157,.84)' : 'rgba(226,232,215,.72)';
    ellipse(moonX, moonY, 36, 36); ctx.fill();
    ctx.fillStyle = 'rgba(49,45,63,.13)';
    ellipse(moonX + 12, moonY - 9, 10, 7); ctx.fill();
    ellipse(moonX - 11, moonY + 13, 6, 5); ctx.fill();

    // Estrelas e motas atmosféricas deslocam-se em planos de paralaxe.
    for (let i = 0; i < 62; i++) {
      const sx = (seeded(i + 40) * W * 1.4 - (cam * 0.12 % (W * 1.4)) + W * 1.4) % (W * 1.4) - 90;
      const sy = 24 + seeded(i + 130) * 225;
      ctx.globalAlpha = 0.22 + 0.56 * seeded(i + 230);
      ctx.fillStyle = i % 7 === 0 ? palette.glow : '#f5efd9';
      ellipse(sx, sy, 1 + seeded(i + 340) * 1.35, 1 + seeded(i + 440) * 1.35); ctx.fill();
    }
    ctx.globalAlpha = 1;

    for (let i = -2; i < 9; i++) {
      const x = i * 190 - (cam * 0.16 % 190);
      const h = 145 + seeded(i + stageIndex * 33 + 2) * 100;
      ctx.fillStyle = palette.far;
      ctx.beginPath();
      ctx.moveTo(x - 100, 380); ctx.lineTo(x + 30, 300 - h * 0.25); ctx.lineTo(x + 170, 380); ctx.closePath(); ctx.fill();
      if (stageIndex === 0) {
        // Copas de árvores em silhueta.
        for (let j = 0; j < 3; j++) {
          const tx = x + 20 + j * 70;
          const ty = 375 - seeded(i * 9 + j + 22) * 72;
          ctx.fillStyle = palette.far;
          ctx.fillRect(tx - 4, ty + 14, 8, 45);
          ellipse(tx, ty, 24 + j * 2, 28 + j * 2); ctx.fill();
        }
      } else if (stageIndex === 1) {
        ctx.fillStyle = palette.far;
        ctx.fillRect(x + 25, 270, 34, 110); ctx.fillRect(x + 37, 245, 10, 28);
        ctx.fillRect(x + 120, 310, 50, 70);
      } else {
        ctx.fillStyle = palette.far;
        ctx.beginPath(); ctx.moveTo(x + 18, 380); ctx.lineTo(x + 75, 240 + seeded(i + 4) * 55); ctx.lineTo(x + 126, 380); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(x + 128, 380); ctx.lineTo(x + 165, 292); ctx.lineTo(x + 205, 380); ctx.closePath(); ctx.fill();
      }
    }
    for (let i = -1; i < 8; i++) {
      const x = i * 250 - (cam * 0.34 % 250);
      ctx.fillStyle = palette.mid;
      if (stageIndex === 0) {
        ctx.fillRect(x + 44, 305, 17, 155);
        ellipse(x + 52, 310, 50, 65); ctx.fill();
        ellipse(x + 20, 343, 35, 44); ctx.fill();
      } else if (stageIndex === 1) {
        ctx.fillRect(x + 25, 340, 40, 120);
        ctx.fillRect(x + 35, 320, 22, 20);
        ellipse(x + 128, 382, 46, 15); ctx.fill();
      } else {
        ctx.fillRect(x + 50, 355, 12, 105);
        ctx.beginPath(); ctx.moveTo(x + 20, 400); ctx.quadraticCurveTo(x + 66, 298, x + 112, 400); ctx.lineTo(x + 112, 460); ctx.lineTo(x + 20, 460); ctx.fill();
        ellipse(x + 147, 390, 34, 54); ctx.fill();
      }
    }
    const mist = ctx.createLinearGradient(0, 360, 0, 500);
    mist.addColorStop(0, 'rgba(214,210,194,0)');
    mist.addColorStop(1, stageIndex === 2 ? 'rgba(107,202,194,.12)' : 'rgba(243,190,142,.10)');
    ctx.fillStyle = mist; ctx.fillRect(0, 350, W, 160);
  }

  function drawGround() {
    const palette = level.def.colors;
    for (const solid of level.solids) {
      if (solid.x + solid.w < cameraX - 40 || solid.x > cameraX + W + 40) continue;
      const grad = ctx.createLinearGradient(0, solid.y, 0, solid.y + solid.h);
      grad.addColorStop(0, palette.dirt);
      grad.addColorStop(1, palette.ground);
      ctx.fillStyle = grad;
      ctx.fillRect(solid.x, solid.y, solid.w, solid.h);
      ctx.fillStyle = palette.edge;
      ctx.fillRect(solid.x, solid.y, solid.w, solid.kind === 'ground' ? 5 : 3);
      if (solid.kind === 'ground') {
        ctx.globalAlpha = 0.17;
        ctx.strokeStyle = palette.glow; ctx.lineWidth = 1;
        for (let x = solid.x + 12; x < solid.x + solid.w; x += 36) {
          const yy = solid.y + 15 + seeded(Math.floor(x / 13) + levelIndex * 8) * 24;
          ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + 14, yy - 4); ctx.stroke();
          ellipse(x + 5, yy + 20, 1.4, 1.4); ctx.fillStyle = palette.edge; ctx.fill();
        }
        ctx.globalAlpha = 1;
      } else {
        ctx.fillStyle = 'rgba(12,18,24,.22)';
        ctx.fillRect(solid.x, solid.y + solid.h - 4, solid.w, 4);
      }
    }

    // Adereços próprios de cada bioma, distribuídos de modo determinístico.
    const first = Math.floor(cameraX / 270) - 1;
    for (let n = first; n < first + 7; n++) {
      const x = n * 270 + 70 + seeded(n + levelIndex * 71) * 105;
      if (x < 80 || x > level.def.length - 60) continue;
      if (levelIndex === 0) {
        ctx.fillStyle = '#314844';
        ctx.fillRect(x - 3, FLOOR - 24, 6, 24);
        ctx.fillStyle = '#b3ba79';
        ellipse(x, FLOOR - 23, 10, 8); ctx.fill();
        ctx.fillStyle = '#f5cd83'; ellipse(x, FLOOR - 28, 3, 3); ctx.fill();
        const glow = ctx.createRadialGradient(x, FLOOR - 26, 1, x, FLOOR - 26, 26);
        glow.addColorStop(0, 'rgba(246,200,121,.18)'); glow.addColorStop(1, 'rgba(246,200,121,0)');
        ctx.fillStyle = glow; ctx.fillRect(x - 28, FLOOR - 55, 56, 56);
      } else if (levelIndex === 1) {
        ctx.fillStyle = '#7b4640';
        ctx.fillRect(x - 8, FLOOR - 21, 16, 21);
        ctx.fillStyle = '#ffb46f';
        ctx.beginPath(); ctx.moveTo(x - 6, FLOOR - 21); ctx.quadraticCurveTo(x - 15, FLOOR - 39, x, FLOOR - 48); ctx.quadraticCurveTo(x + 14, FLOOR - 37, x + 6, FLOOR - 21); ctx.fill();
        ctx.fillStyle = '#ffe5a4'; ellipse(x, FLOOR - 28, 3, 8); ctx.fill();
      } else {
        ctx.strokeStyle = '#4f958f'; ctx.lineWidth = 5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x, FLOOR); ctx.quadraticCurveTo(x - 12, FLOOR - 27, x + 4, FLOOR - 39); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x + 2, FLOOR - 10); ctx.quadraticCurveTo(x + 20, FLOOR - 28, x + 24, FLOOR - 33); ctx.stroke();
        ctx.fillStyle = '#88d8c8'; ellipse(x + 4, FLOOR - 39, 4, 7); ctx.fill();
      }
    }

    for (const spike of level.spikes) {
      if (spike.x + spike.w < cameraX - 40 || spike.x > cameraX + W + 40) continue;
      ctx.fillStyle = level.def.colors.accent;
      const count = Math.floor(spike.w / 18);
      for (let i = 0; i < count; i++) {
        const x = spike.x + i * 18;
        ctx.beginPath(); ctx.moveTo(x, FLOOR); ctx.lineTo(x + 9, FLOOR - 19); ctx.lineTo(x + 18, FLOOR); ctx.closePath(); ctx.fill();
      }
      ctx.fillStyle = 'rgba(22,18,28,.45)'; ctx.fillRect(spike.x, FLOOR - 2, spike.w, 4);
    }

    // Portal e marco do ponto de retorno.
    const cp = level.def.checkpoint;
    if (cp > cameraX - 100 && cp < cameraX + W + 100) {
      ctx.save();
      ctx.translate(cp, FLOOR - 5);
      ctx.strokeStyle = level.def.colors.glow; ctx.lineWidth = 3;
      ctx.globalAlpha = player.checkpointX >= cp ? 0.95 : 0.48;
      ctx.beginPath(); ctx.moveTo(-24, 0); ctx.lineTo(-24, -68); ctx.quadraticCurveTo(0, -94, 24, -68); ctx.lineTo(24, 0); ctx.stroke();
      ctx.fillStyle = level.def.colors.glow;
      ellipse(0, -61 + Math.sin(time * 2) * 3, 5, 8); ctx.fill();
      ctx.restore();
      ctx.globalAlpha = 1;
    }
    drawBossArch();
  }

  function drawBossArch() {
    if (level.def.bossStart < cameraX - 250 || level.def.bossStart > cameraX + W + 250) return;
    const x = level.def.bossStart + 170;
    ctx.save();
    ctx.strokeStyle = level.def.colors.accent;
    ctx.lineWidth = 9;
    ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.moveTo(x - 80, FLOOR); ctx.lineTo(x - 80, FLOOR - 150); ctx.quadraticCurveTo(x, FLOOR - 230, x + 80, FLOOR - 150); ctx.lineTo(x + 80, FLOOR); ctx.stroke();
    ctx.globalAlpha = 0.26;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, FLOOR - 150, 48 + Math.sin(time * 2) * 3, Math.PI, 0); ctx.stroke();
    ctx.restore();
  }

  function drawCrystal(crystal) {
    if (crystal.taken) return;
    const bob = Math.sin(time * 2.4 + crystal.phase) * 6;
    const y = crystal.y + bob;
    const glow = ctx.createRadialGradient(crystal.x, y, 2, crystal.x, y, 32);
    glow.addColorStop(0, 'rgba(255,221,154,.40)'); glow.addColorStop(1, 'rgba(255,221,154,0)');
    ctx.fillStyle = glow; ctx.fillRect(crystal.x - 34, y - 34, 68, 68);
    ctx.save(); ctx.translate(crystal.x, y); ctx.rotate(time * 0.55 + crystal.phase);
    ctx.fillStyle = '#f9df9b';
    ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(8, 0); ctx.lineTo(0, 13); ctx.lineTo(-8, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff8d9';
    ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(3, 0); ctx.lineTo(0, 6); ctx.lineTo(-3, 0); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function drawEnemy(enemy) {
    if (enemy.dead) return;
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    const blink = enemy.flash > 0;
    if (blink) ctx.globalAlpha = 0.52 + Math.sin(time * 50) * 0.35;
    if (enemy.type === 'crawler') {
      ctx.fillStyle = '#171c27';
      ellipse(0, enemy.h - 8, 20, 12); ctx.fill();
      ctx.fillStyle = '#556a58'; ellipse(-2, enemy.h - 15, 15, 13); ctx.fill();
      ctx.fillStyle = '#a0b76e'; ellipse(7, enemy.h - 18, 6, 5); ctx.fill();
      ctx.fillStyle = '#231a24'; ellipse(9, enemy.h - 19, 2, 2); ctx.fill();
      ctx.strokeStyle = '#121a1d'; ctx.lineWidth = 3;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath(); ctx.moveTo(i * 8, enemy.h - 5); ctx.lineTo(i * 11 + 2, enemy.h + 1); ctx.stroke();
      }
      ctx.strokeStyle = '#a0b76e'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(6, enemy.h - 28); ctx.quadraticCurveTo(12, enemy.h - 38, 18, enemy.h - 31); ctx.stroke();
    } else if (enemy.type === 'moth') {
      const flap = Math.sin(enemy.t * 11) * 6;
      ctx.fillStyle = '#8c697b';
      ctx.beginPath(); ctx.ellipse(-13, 15, 11, 17 + flap * 0.3, -0.55, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(13, 15, 11, 17 - flap * 0.3, 0.55, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#242033'; ellipse(0, 17, 10, 14); ctx.fill();
      ctx.fillStyle = '#e7d9b6'; ellipse(0, 11, 8, 9); ctx.fill();
      ctx.fillStyle = '#302536'; ellipse(-3, 11, 1.5, 2); ctx.fill(); ellipse(3, 11, 1.5, 2); ctx.fill();
      ctx.strokeStyle = '#e7d9b6'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-3, 4); ctx.quadraticCurveTo(-9, -5, -11, 1); ctx.moveTo(3, 4); ctx.quadraticCurveTo(9, -5, 11, 1); ctx.stroke();
    } else {
      ctx.fillStyle = '#2b252e';
      ctx.beginPath(); ctx.moveTo(-18, enemy.h); ctx.lineTo(-15, 13); ctx.quadraticCurveTo(-10, 0, 0, 5); ctx.quadraticCurveTo(15, 0, 18, 16); ctx.lineTo(20, enemy.h); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#9a654c'; ellipse(0, 18, 13, 14); ctx.fill();
      ctx.fillStyle = '#f0c178'; ellipse(3, 17, 5, 7); ctx.fill();
      ctx.fillStyle = '#33242c'; ellipse(4, 17, 2, 3); ctx.fill();
      ctx.fillStyle = '#44333a';
      ctx.beginPath(); ctx.moveTo(-17, 10); ctx.quadraticCurveTo(-4, -4, 11, 9); ctx.lineTo(16, 13); ctx.lineTo(-13, 18); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  function drawPlayer() {
    if (!player) return;
    const p = player;
    if (p.invuln > 0 && Math.floor(time * 18) % 2 === 0 && p.dashTimer <= 0) return;
    const run = p.grounded && Math.abs(p.vx) > 28;
    const bob = p.grounded ? (run ? Math.abs(Math.sin(time * 15)) * 3 : Math.sin(time * 3.2) * 1.4) : -2;
    ctx.save();
    ctx.translate(p.x, p.y + bob);
    ctx.scale(p.face, 1);
    // sombra macia
    ctx.globalAlpha = 0.28;
    ctx.fillStyle = '#080d13'; ellipse(0, p.h + 3 - bob, 20, 5); ctx.fill();
    ctx.globalAlpha = 1;
    // cachecol ao vento
    ctx.fillStyle = '#d86d61';
    ctx.beginPath(); ctx.moveTo(-4, 20); ctx.quadraticCurveTo(-20, 14 + Math.sin(time * 9) * 3, -31, 19); ctx.lineTo(-25, 27); ctx.quadraticCurveTo(-17, 22, -5, 28); ctx.closePath(); ctx.fill();
    // capa
    ctx.fillStyle = '#202333';
    ctx.beginPath(); ctx.moveTo(-13, 20); ctx.quadraticCurveTo(-19, 34, -17, 46); ctx.quadraticCurveTo(0, 42, 17, 47); ctx.quadraticCurveTo(15, 31, 12, 20); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#34384a';
    ctx.beginPath(); ctx.moveTo(1, 25); ctx.quadraticCurveTo(9, 30, 10, 43); ctx.lineTo(-1, 43); ctx.closePath(); ctx.fill();
    // pernas e botas
    ctx.fillStyle = '#161923';
    roundedRect(-11, 40, 9, 8, 3); ctx.fill(); roundedRect(3, 40, 10, 8, 3); ctx.fill();
    ctx.fillStyle = '#b58d70';
    roundedRect(-13, 45, 12, 5, 2); ctx.fill(); roundedRect(2, 45, 13, 5, 2); ctx.fill();
    // capuz
    ctx.fillStyle = '#292c3e';
    ctx.beginPath(); ctx.moveTo(-14, 20); ctx.quadraticCurveTo(-18, 3, -8, -1); ctx.quadraticCurveTo(0, -10, 12, 0); ctx.quadraticCurveTo(20, 10, 14, 24); ctx.quadraticCurveTo(3, 31, -12, 25); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#41445a';
    ctx.beginPath(); ctx.moveTo(-10, 4); ctx.quadraticCurveTo(-6, -4, 1, -5); ctx.quadraticCurveTo(8, -5, 11, 2); ctx.quadraticCurveTo(1, -1, -10, 7); ctx.closePath(); ctx.fill();
    // máscara marfim
    ctx.fillStyle = '#eee3c8';
    ctx.beginPath(); ctx.ellipse(2, 12, 10, 12, -0.12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#272435';
    ellipse(0, 12, 1.8, 2.4); ctx.fill(); ellipse(7, 12, 1.6, 2.2); ctx.fill();
    // brilho da lâmina curta
    ctx.strokeStyle = '#f4d99f'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(10, 28); ctx.lineTo(18, 22); ctx.stroke();
    if (p.shotAnim > 0) {
      ctx.strokeStyle = 'rgba(255,232,176,.85)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(13, 23, 17, -0.8, 0.55); ctx.stroke();
    }
    ctx.restore();
  }

  function drawBoss() {
    const b = activeBoss;
    if (!b || b.defeated) return;
    const bob = Math.sin(b.bob) * (b.phase > 1 ? 4 : 2);
    ctx.save();
    ctx.translate(b.x, b.y + bob);
    if (b.flash > 0) ctx.globalAlpha = 0.5 + Math.sin(time * 50) * 0.4;
    const rage = b.phase > 1;
    if (b.kind === 'stag') {
      // Barão Catraca: cervo mecânico com chifres de galho e núcleo de cobre.
      ctx.fillStyle = '#211e2b';
      ellipse(0, 76, 48, 41); ctx.fill();
      ctx.fillStyle = rage ? '#b4644e' : '#80554b';
      ellipse(-2, 72, 35, 33); ctx.fill();
      ctx.fillStyle = '#db9b62'; ellipse(0, 68, 13, 15); ctx.fill();
      ctx.fillStyle = '#ffe19b'; ellipse(0, 68, 5, 7); ctx.fill();
      ctx.fillStyle = '#d8c3a0';
      ctx.beginPath(); ctx.moveTo(-22, 42); ctx.quadraticCurveTo(-42, 12, -31, -4); ctx.quadraticCurveTo(-29, 17, -14, 23); ctx.quadraticCurveTo(-5, 8, 0, -13); ctx.quadraticCurveTo(5, 11, 16, 24); ctx.quadraticCurveTo(34, 10, 31, -6); ctx.quadraticCurveTo(45, 12, 23, 43); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#342839'; ellipse(0, 35, 29, 26); ctx.fill();
      ctx.fillStyle = '#eee0c4'; ellipse(0, 39, 20, 17); ctx.fill();
      ctx.fillStyle = '#271e2a'; ellipse(-8, 38, 3, 4); ctx.fill(); ellipse(8, 38, 3, 4); ctx.fill();
      ctx.fillStyle = '#bb7958'; ctx.beginPath(); ctx.moveTo(-15, 13); ctx.lineTo(-6, 5); ctx.lineTo(-2, 24); ctx.lineTo(-12, 31); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#bb7958'; ctx.beginPath(); ctx.moveTo(14, 13); ctx.lineTo(6, 5); ctx.lineTo(2, 24); ctx.lineTo(12, 31); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#292332'; roundedRect(-37, 103, 20, 21, 5); ctx.fill(); roundedRect(17, 103, 20, 21, 5); ctx.fill();
      ctx.strokeStyle = '#dfa968'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 76, 21, 0.2, Math.PI - 0.2); ctx.stroke();
    } else if (b.kind === 'witch') {
      // Madame Fornalha: braseiro vivo sob um chapéu de ferro.
      ctx.fillStyle = rage ? '#e07c58' : '#a8524e';
      ctx.beginPath(); ctx.moveTo(-38, 38); ctx.quadraticCurveTo(-46, 64, -30, 104); ctx.quadraticCurveTo(0, 127, 31, 104); ctx.quadraticCurveTo(45, 62, 35, 38); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#302333';
      ctx.beginPath(); ctx.moveTo(-49, 37); ctx.quadraticCurveTo(-42, 8, 0, 8); ctx.quadraticCurveTo(42, 8, 49, 37); ctx.quadraticCurveTo(14, 52, -49, 37); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#55404a'; roundedRect(-14, -5, 28, 21, 5); ctx.fill();
      ctx.fillStyle = '#f0b875'; ellipse(0, 77, 23, 29); ctx.fill();
      ctx.fillStyle = '#fff0b0'; ellipse(1, 85, 10, 16); ctx.fill();
      ctx.fillStyle = '#39232e'; ellipse(-9, 49, 4, 6); ctx.fill(); ellipse(9, 49, 4, 6); ctx.fill();
      ctx.strokeStyle = '#2c202c'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(-31, 65); ctx.quadraticCurveTo(-59, 78, -52, 99); ctx.moveTo(31, 65); ctx.quadraticCurveTo(59, 78, 52, 99); ctx.stroke();
      ctx.fillStyle = '#d3a27a'; ellipse(-52, 101, 8, 7); ctx.fill(); ellipse(52, 101, 8, 7); ctx.fill();
      for (let i = 0; i < 3; i++) {
        const fx = -16 + i * 16;
        ctx.fillStyle = i === 1 ? '#ffe18d' : '#e9855b';
        ctx.beginPath(); ctx.moveTo(fx - 7, 14); ctx.quadraticCurveTo(fx - 13, -3 - Math.sin(time * 5 + i) * 4, fx, -13); ctx.quadraticCurveTo(fx + 11, 1, fx + 6, 15); ctx.fill();
      }
    } else {
      // Leviatã de Vidro: corpo serpentiforme e barbatanas translúcidas.
      ctx.fillStyle = 'rgba(68,143,151,.88)';
      ctx.beginPath(); ctx.moveTo(-49, 76); ctx.bezierCurveTo(-73, 26, -20, 20, 7, 49); ctx.bezierCurveTo(36, 82, 49, 103, 74, 90); ctx.bezierCurveTo(98, 77, 93, 49, 73, 39); ctx.bezierCurveTo(97, 34, 115, 57, 106, 82); ctx.bezierCurveTo(95, 119, 51, 126, 20, 97); ctx.bezierCurveTo(-8, 71, -20, 75, -49, 76); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(147,225,211,.55)';
      ctx.beginPath(); ctx.moveTo(-5, 47); ctx.lineTo(-29, 13); ctx.quadraticCurveTo(2, 20, 18, 50); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(41, 93); ctx.lineTo(59, 124); ctx.quadraticCurveTo(72, 105, 69, 90); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#a8ede0'; ellipse(80, 55, 5, 5); ctx.fill();
      ctx.fillStyle = '#15242e'; ellipse(82, 55, 2, 2); ctx.fill();
      ctx.strokeStyle = '#9ce7dc'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(91, 72); ctx.quadraticCurveTo(107, 84, 99, 97); ctx.stroke();
      ctx.globalAlpha *= 0.4;
      ctx.fillStyle = '#d0fff1'; ellipse(16, 68, 18, 4); ctx.fill();
    }
    // Partículas da aura do chefe.
    ctx.globalAlpha = 0.65;
    ctx.fillStyle = level.def.colors.glow;
    for (let i = 0; i < 4; i++) {
      const a = time * 1.2 + i * Math.PI / 2;
      ellipse(Math.cos(a) * 56, 70 + Math.sin(a) * 23, 2.1, 2.1); ctx.fill();
    }
    ctx.restore();

    if (b.state === 'tell') {
      ctx.save();
      ctx.globalAlpha = 0.32 + Math.sin(time * 24) * 0.2;
      ctx.strokeStyle = '#ffbe8b'; ctx.lineWidth = 4;
      if (b.attackType === 'rain') {
        for (const dx of [-135, -45, 45, 135]) {
          const x = clamp(player.x + dx, level.def.arenaLeft + 48, level.def.arenaRight - 48);
          ctx.beginPath(); ctx.moveTo(x, 205); ctx.lineTo(x, FLOOR - 8); ctx.stroke();
        }
      } else {
        ctx.beginPath(); ctx.ellipse(player.x, FLOOR - 13, 38 + Math.sin(time * 12) * 7, 8, 0, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.restore();
    }
  }

  function drawProjectiles() {
    for (const shot of playerShots) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255,220,151,.42)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(shot.x - Math.sign(shot.vx) * 15, shot.y); ctx.lineTo(shot.x, shot.y); ctx.stroke();
      const glow = ctx.createRadialGradient(shot.x, shot.y, 1, shot.x, shot.y, 15);
      glow.addColorStop(0, 'rgba(255,242,194,.8)'); glow.addColorStop(1, 'rgba(255,210,121,0)');
      ctx.fillStyle = glow; ctx.fillRect(shot.x - 16, shot.y - 16, 32, 32);
      ctx.fillStyle = '#fff2c2'; ellipse(shot.x, shot.y, shot.r, shot.r * 0.72); ctx.fill();
      ctx.restore();
    }
    for (const shot of enemyShots) {
      ctx.save();
      if (shot.kind === 'wave') {
        ctx.fillStyle = level.def.colors.accent;
        ctx.beginPath(); ctx.ellipse(shot.x, shot.y, shot.r * 1.75, shot.r * 0.7, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffe3a1'; ctx.beginPath(); ctx.ellipse(shot.x, shot.y - 3, shot.r, shot.r * 0.34, 0, 0, Math.PI * 2); ctx.fill();
      } else {
        const color = shot.kind === 'bubble' ? '#a7f3df' : shot.kind === 'seed' ? '#c3b878' : '#ff9a67';
        const glow = ctx.createRadialGradient(shot.x, shot.y, 1, shot.x, shot.y, shot.r * 2.5);
        glow.addColorStop(0, color); glow.addColorStop(1, 'rgba(255,150,90,0)');
        ctx.fillStyle = glow; ctx.fillRect(shot.x - shot.r * 2.5, shot.y - shot.r * 2.5, shot.r * 5, shot.r * 5);
        ctx.fillStyle = color; ellipse(shot.x, shot.y, shot.r, shot.r); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,230,.68)'; ellipse(shot.x - shot.r * 0.28, shot.y - shot.r * 0.28, shot.r * 0.25, shot.r * 0.25); ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawParticles() {
    for (const part of particles) {
      ctx.globalAlpha = clamp(part.life / part.maxLife, 0, 1);
      ctx.fillStyle = part.color;
      ellipse(part.x, part.y, part.r, part.r); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawWorld() {
    const sx = shake > 0 ? rand(-shake * 17, shake * 17) : 0;
    const sy = shake > 0 ? rand(-shake * 10, shake * 10) : 0;
    ctx.save();
    ctx.translate(-cameraX + sx, sy);
    drawGround();
    for (const crystal of level.crystals) drawCrystal(crystal);
    for (const enemy of level.enemies) drawEnemy(enemy);
    drawProjectiles();
    drawBoss();
    drawPlayer();
    drawParticles();
    ctx.restore();
  }

  function drawHeart(x, y, full) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = full ? '#e68c77' : 'rgba(238,223,198,.19)';
    ctx.strokeStyle = full ? '#ffd0a3' : 'rgba(238,223,198,.38)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, 7); ctx.bezierCurveTo(-2, 4, -10, -1, -8, -6); ctx.bezierCurveTo(-6, -11, -1, -9, 0, -5); ctx.bezierCurveTo(2, -10, 8, -10, 9, -5); ctx.bezierCurveTo(10, 0, 3, 5, 0, 7); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  function drawHUD() {
    if (!player || !level) return;
    ctx.save();
    ctx.fillStyle = 'rgba(14,16,26,.62)'; roundedRect(22, 18, 276, 76, 16); ctx.fill();
    ctx.strokeStyle = 'rgba(245,222,183,.16)'; ctx.lineWidth = 1; roundedRect(22.5, 18.5, 275, 75, 15); ctx.stroke();
    ctx.fillStyle = '#f4e6c7'; ctx.font = '600 15px Georgia, serif'; ctx.textAlign = 'left';
    ctx.fillText(level.def.name.toUpperCase(), 42, 43);
    ctx.fillStyle = 'rgba(239,229,211,.52)'; ctx.font = '10px system-ui, sans-serif';
    ctx.fillText('VIDA', 42, 68);
    for (let i = 0; i < MAX_HP; i++) drawHeart(92 + i * 23, 63, i < player.hp);
    const progress = clamp(player.x / level.def.bossStart, 0, 1);
    ctx.fillStyle = 'rgba(235,225,209,.12)'; roundedRect(172, 60, 100, 6, 3); ctx.fill();
    ctx.fillStyle = level.def.colors.glow; roundedRect(172, 60, 100 * progress, 6, 3); ctx.fill();

    if (activeBoss && !activeBoss.defeated) {
      const barW = 348;
      const x = (W - barW) / 2;
      ctx.fillStyle = 'rgba(13,14,23,.72)'; roundedRect(x, 22, barW, 48, 13); ctx.fill();
      ctx.fillStyle = '#f0e3cc'; ctx.textAlign = 'center'; ctx.font = '600 13px Georgia, serif';
      ctx.fillText(activeBoss.name.toUpperCase(), W / 2, 40);
      ctx.fillStyle = 'rgba(239,222,200,.15)'; roundedRect(x + 20, 49, barW - 40, 8, 4); ctx.fill();
      const ratio = activeBoss.hp / activeBoss.maxHp;
      ctx.fillStyle = activeBoss.phase === 3 ? '#ed806c' : level.def.colors.glow;
      roundedRect(x + 20, 49, (barW - 40) * ratio, 8, 4); ctx.fill();
    }
    if (bannerTimer > 0) {
      const alpha = Math.min(1, bannerTimer * 2.8);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = 'rgba(14,16,26,.76)'; roundedRect(310, 106, 340, 45, 13); ctx.fill();
      ctx.fillStyle = '#f3e2bf'; ctx.textAlign = 'center'; ctx.font = '600 16px Georgia, serif';
      ctx.fillText(bannerText.toUpperCase(), W / 2, 134);
      ctx.globalAlpha = 1;
    }
    if (activeBoss && bossIntroTimer > 0) {
      const alpha = Math.min(1, bossIntroTimer * 1.3);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = 'rgba(12,13,21,.70)'; ctx.fillRect(0, 210, W, 100);
      ctx.fillStyle = '#f4e6c7'; ctx.textAlign = 'center'; ctx.font = 'bold 32px Georgia, serif';
      ctx.fillText(activeBoss.name.toUpperCase(), W / 2, 260);
      ctx.fillStyle = level.def.colors.glow; ctx.font = '11px system-ui, sans-serif';
      ctx.fillText('UM DESAFIO SE ERGUE À SUA FRENTE', W / 2, 282);
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = 'rgba(246,236,216,.5)'; ctx.textAlign = 'right'; ctx.font = '10px system-ui, sans-serif';
    ctx.fillText('J ATACA   ·   SHIFT ESQUIVA   ·   ESC PAUSA', W - 25, H - 18);
    ctx.restore();
  }

  function drawButton(x, y, w, h, text, active = true) {
    const pulse = 1 + Math.sin(menuTime * 3) * 0.012;
    ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(pulse, pulse);
    ctx.fillStyle = active ? '#c47663' : '#65515b'; roundedRect(-w / 2, -h / 2, w, h, 13); ctx.fill();
    ctx.strokeStyle = active ? '#f1bf8e' : 'rgba(255,255,255,.2)'; ctx.lineWidth = 1.5; roundedRect(-w / 2 + 1, -h / 2 + 1, w - 2, h - 2, 12); ctx.stroke();
    ctx.fillStyle = '#fff2d9'; ctx.font = '700 16px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 1);
    ctx.restore(); ctx.textBaseline = 'alphabetic';
  }

  function drawMenu() {
    drawBackdrop(0, menuTime * 13);
    // plataformas e silhueta do herói na tela inicial.
    ctx.fillStyle = '#1b282d'; ctx.fillRect(0, 442, W, 98);
    ctx.fillStyle = '#a0ad70'; ctx.fillRect(0, 442, W, 4);
    for (let i = 0; i < 14; i++) {
      const x = i * 78 + seeded(i + 5) * 28;
      ctx.fillStyle = '#202d32'; ctx.fillRect(x, 385 + seeded(i + 8) * 30, 9, 58);
      ctx.fillStyle = '#273b3c'; ellipse(x + 4, 388 + seeded(i + 8) * 30, 28, 26); ctx.fill();
    }
    // personagem em destaque
    const heroY = 374 + Math.sin(menuTime * 2.1) * 3;
    const savedPlayer = player;
    player = makePlayer(W / 2);
    player.y = heroY; player.grounded = true;
    drawPlayer();
    player = savedPlayer;

    ctx.fillStyle = 'rgba(15,15,25,.68)'; roundedRect(143, 37, 674, 415, 25); ctx.fill();
    ctx.strokeStyle = 'rgba(247,221,183,.2)'; ctx.lineWidth = 1; roundedRect(144, 38, 672, 413, 24); ctx.stroke();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f2dcae'; ctx.font = '700 11px system-ui, sans-serif';
    ctx.fillText('UMA AVENTURA ORIGINAL DE PLATAFORMA', W / 2, 78);
    ctx.fillStyle = '#f7edd5'; ctx.font = 'bold 43px Georgia, "Times New Roman", serif';
    ctx.shadowColor = 'rgba(0,0,0,.42)'; ctx.shadowBlur = 14;
    ctx.fillText('CINZAS DO RELÓGIO', W / 2, 127);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#d8cbb5'; ctx.font = 'italic 15px Georgia, serif';
    ctx.fillText('tinta, aço e sombra', W / 2, 152);

    for (let i = 0; i < STAGES.length; i++) {
      const x = 197 + i * 190;
      const unlocked = i <= unlockedStage;
      const selected = selectedStage === i;
      ctx.fillStyle = selected ? 'rgba(213,151,110,.24)' : 'rgba(255,245,221,.055)';
      roundedRect(x, 292, 174, 72, 12); ctx.fill();
      ctx.strokeStyle = selected ? '#eeb480' : 'rgba(255,238,211,.16)'; ctx.lineWidth = selected ? 2 : 1;
      roundedRect(x + 0.5, 292.5, 173, 71, 11); ctx.stroke();
      ctx.textAlign = 'left';
      ctx.fillStyle = unlocked ? '#f0d7aa' : 'rgba(240,215,170,.45)'; ctx.font = '700 10px system-ui, sans-serif';
      ctx.fillText(`FASE 0${i + 1}`, x + 14, 313);
      ctx.fillStyle = unlocked ? '#f4e7d0' : 'rgba(244,231,208,.42)'; ctx.font = '600 12px Georgia, serif';
      ctx.fillText(unlocked ? STAGES[i].name : '🔒 Fase bloqueada', x + 14, 337);
      ctx.fillStyle = 'rgba(239,226,205,.52)'; ctx.font = '9px system-ui, sans-serif';
      ctx.fillText(unlocked ? STAGES[i].subtitle : 'Derrote o chefe anterior', x + 14, 352);
      if (unlocked && i < unlockedStage) {
        ctx.fillStyle = '#b4d49b'; ctx.font = '9px system-ui, sans-serif'; ctx.textAlign = 'right'; ctx.fillText('✓', x + 160, 312);
      }
    }
    drawButton(365, 393, 230, 50, 'ENTRAR NA AVENTURA', true);
    ctx.fillStyle = 'rgba(239,230,211,.67)'; ctx.textAlign = 'center'; ctx.font = '11px system-ui, sans-serif';
    ctx.fillText('A / D ou ← / → mover     ·     ESPAÇO pular     ·     J disparar     ·     SHIFT esquiva', W / 2, 476);
    ctx.fillStyle = 'rgba(239,230,211,.43)'; ctx.font = '10px system-ui, sans-serif';
    ctx.fillText('Três regiões • três chefes • arte desenhada em código • progresso salvo neste navegador', W / 2, 499);
    ctx.fillStyle = 'rgba(239,230,211,.37)'; ctx.font = '9px system-ui, sans-serif';
    ctx.fillText('SELECIONE UMA FASE COM ← → OU CLIQUE EM UM CARTÃO', W / 2, 519);
  }

  function drawOverlay(title, subtitle, footer, tint = 'rgba(12,13,22,.72)') {
    ctx.fillStyle = tint; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(19,19,30,.92)'; roundedRect(225, 145, 510, 250, 24); ctx.fill();
    ctx.strokeStyle = 'rgba(246,219,177,.25)'; ctx.lineWidth = 1; roundedRect(226, 146, 508, 248, 23); ctx.stroke();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f6e8ce'; ctx.font = 'bold 31px Georgia, serif'; ctx.fillText(title, W / 2, 220);
    ctx.fillStyle = '#d4c5ac'; ctx.font = '14px system-ui, sans-serif'; ctx.fillText(subtitle, W / 2, 256);
    ctx.fillStyle = '#e1b28b'; ctx.font = '700 13px system-ui, sans-serif'; ctx.fillText(footer, W / 2, 332);
  }

  function render() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#100f19'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
    if (screen === 'menu') {
      drawMenu();
      return;
    }
    drawBackdrop(levelIndex, cameraX);
    drawWorld();
    drawHUD();
    if (screen === 'paused') {
      drawOverlay('PAUSADO', 'Respire. A noite ainda espera.', 'ESC CONTINUA   ·   R RECOMEÇA NO MARCO   ·   M MENU');
    } else if (screen === 'dead') {
      drawOverlay('A chama se apagou', 'O último marco ainda guarda seu caminho.', 'ENTER / R TENTAR DE NOVO   ·   M MENU', 'rgba(20,10,17,.74)');
    } else if (screen === 'stageclear') {
      drawOverlay('Chefe derrotado', `${STAGES[levelIndex].name} foi libertada. A jornada continua.`, 'ENTER PRÓXIMA FASE   ·   M MENU', 'rgba(14,15,22,.74)');
    } else if (screen === 'victory') {
      drawOverlay('O relógio voltou a bater', 'Você atravessou as três regiões e venceu o Abismo.', 'ENTER VOLTA AO MENU   ·   PROGRESSO SALVO', 'rgba(10,18,26,.77)');
    }
  }

  let lastFrame = 0;
  function frame(timestamp) {
    const dt = Math.min(0.033, lastFrame ? (timestamp - lastFrame) / 1000 : 0.016);
    lastFrame = timestamp;
    update(dt);
    render();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
