import * as THREE from 'three';

// Generates procedural ocean heatmaps for the horizontal depth planes and vertical cross-sections
export function createOceanSurfaceTexture(
  variable: 'temperature' | 'salinity' | 'currents' | 'chlorophyll',
  depth: number,
  timeOffset: number = 0,
  colormap: 'thermal' | 'turbo' | 'viridis' | 'deep' = 'thermal'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background deep ocean
  ctx.fillStyle = '#031226';
  ctx.fillRect(0, 0, 1024, 1024);

  // Colormap color stops depending on variable & colormap choice
  const depthFactor = Math.max(0.2, 1 - depth / 1200); // deeper means colder/denser
  const t = timeOffset * 0.05;

  // Draw smooth multi-point thermal vortices and gradients simulating Arabian Sea currents
  const grad = ctx.createRadialGradient(
    580 + Math.sin(t) * 30,
    420 + Math.cos(t) * 20,
    30,
    512,
    512,
    650
  );

  if (variable === 'temperature') {
    if (colormap === 'thermal') {
      grad.addColorStop(0, `rgba(${Math.round(255 * depthFactor)}, ${Math.round(70 * depthFactor)}, 20, 0.95)`); // warm core
      grad.addColorStop(0.3, `rgba(${Math.round(245 * depthFactor)}, ${Math.round(180 * depthFactor)}, 30, 0.9)`);
      grad.addColorStop(0.6, `rgba(30, ${Math.round(200 * depthFactor)}, ${Math.round(210 * depthFactor)}, 0.85)`);
      grad.addColorStop(0.85, `rgba(15, 75, ${Math.round(180 * depthFactor)}, 0.9)`);
      grad.addColorStop(1, '#020d1c');
    } else if (colormap === 'turbo') {
      grad.addColorStop(0, '#e7298a');
      grad.addColorStop(0.25, '#d95f02');
      grad.addColorStop(0.5, '#7570b3');
      grad.addColorStop(0.75, '#1b9e77');
      grad.addColorStop(1, '#020b18');
    } else if (colormap === 'viridis') {
      grad.addColorStop(0, '#fde725');
      grad.addColorStop(0.35, '#35b779');
      grad.addColorStop(0.7, '#31688e');
      grad.addColorStop(1, '#440154');
    } else {
      // deep
      grad.addColorStop(0, '#00f2fe');
      grad.addColorStop(0.5, '#4facfe');
      grad.addColorStop(0.8, '#000851');
      grad.addColorStop(1, '#010510');
    }
  } else if (variable === 'salinity') {
    grad.addColorStop(0, '#f59e0b');
    grad.addColorStop(0.3, '#ec4899');
    grad.addColorStop(0.6, '#8b5cf6');
    grad.addColorStop(0.9, '#3b82f6');
    grad.addColorStop(1, '#050b1e');
  } else if (variable === 'currents') {
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.2, '#67e8f9');
    grad.addColorStop(0.5, '#06b6d4');
    grad.addColorStop(0.8, '#0891b2');
    grad.addColorStop(1, '#032030');
  } else {
    // Chlorophyll
    grad.addColorStop(0, '#bef264');
    grad.addColorStop(0.3, '#34d399');
    grad.addColorStop(0.6, '#059669');
    grad.addColorStop(0.85, '#064e3b');
    grad.addColorStop(1, '#021815');
  }

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Draw secondary coastal upwelling vortices (simulating Somali current & Southwest Monsoon upwelling off Indian west coast)
  const upwelling = ctx.createRadialGradient(720, 620, 10, 700, 600, 320);
  upwelling.addColorStop(0, variable === 'temperature' ? 'rgba(56, 189, 248, 0.7)' : 'rgba(190, 242, 100, 0.7)');
  upwelling.addColorStop(0.7, 'rgba(14, 116, 144, 0.3)');
  upwelling.addColorStop(1, 'transparent');
  ctx.fillStyle = upwelling;
  ctx.fillRect(0, 0, 1024, 1024);

  // Draw contour lines for depth/iso-thermal contours
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  for (let r = 80; r <= 550; r += 55) {
    ctx.beginPath();
    ctx.arc(580 + Math.sin(t) * 15, 420 + Math.cos(t) * 10, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Draw Indian Subcontinent landmass silhouette in top-right
  ctx.save();
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = 'rgba(74, 222, 128, 0.6)';
  ctx.lineWidth = 2.5;

  ctx.beginPath();
  // Coastline approximation matching the reference mockup
  ctx.moveTo(700, 0);
  ctx.lineTo(760, 120);
  ctx.lineTo(790, 240);
  ctx.lineTo(840, 360);
  ctx.lineTo(870, 480);
  ctx.lineTo(820, 620); // Peninsular tip (Kanyakumari)
  ctx.lineTo(880, 700);
  ctx.lineTo(950, 800);
  ctx.lineTo(1024, 850);
  ctx.lineTo(1024, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Subtle land texture / terrain contour
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('INDIA', 860, 260);
  ctx.font = '18px sans-serif';
  ctx.fillStyle = 'rgba(147, 197, 253, 0.6)';
  ctx.fillText('Arabian Sea', 280, 240);
  ctx.fillText('Bay of Bengal', 860, 680);
  ctx.restore();

  // Grid overlay
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
  ctx.lineWidth = 1;
  const step = 64;
  for (let x = 0; x < 1024; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();
  }
  for (let y = 0; y < 1024; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

// Generates the vertical cross-section vertical slice texture showing thermocline depth stratification
export function createOceanSideCrossSectionTexture(
  variable: 'temperature' | 'salinity' | 'currents' | 'chlorophyll',
  depthMax: number = 1000
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Vertical gradient from top (0m surface) to bottom (1000m deep water)
  const grad = ctx.createLinearGradient(0, 0, 0, 512);

  if (variable === 'temperature') {
    grad.addColorStop(0, '#f97316'); // 29°C surface warm layer
    grad.addColorStop(0.18, '#fbbf24'); // 26°C mixed layer
    grad.addColorStop(0.4, '#06b6d4'); // 18°C rapid thermocline drop
    grad.addColorStop(0.7, '#1d4ed8'); // 11°C deep intermediate
    grad.addColorStop(1, '#020617'); // 6°C abyssal floor
  } else if (variable === 'salinity') {
    grad.addColorStop(0, '#f59e0b');
    grad.addColorStop(0.3, '#ec4899');
    grad.addColorStop(0.7, '#6366f1');
    grad.addColorStop(1, '#0f172a');
  } else if (variable === 'currents') {
    grad.addColorStop(0, '#38bdf8');
    grad.addColorStop(0.25, '#0284c7');
    grad.addColorStop(0.6, '#0369a1');
    grad.addColorStop(1, '#082f49');
  } else {
    // chlorophyll (concentrated in upper euphotic zone 0-150m)
    grad.addColorStop(0, '#4ade80');
    grad.addColorStop(0.15, '#22c55e');
    grad.addColorStop(0.35, '#15803d');
    grad.addColorStop(0.6, '#064e3b');
    grad.addColorStop(1, '#022c22');
  }

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Depth contour markers and depth grid lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);

  const depthSteps = [0, 250, 500, 750, 1000];
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '14px monospace';

  depthSteps.forEach((d) => {
    const y = (d / depthMax) * 490 + 10;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
    ctx.fillText(`${d}m`, 10, y - 4);
  });

  ctx.setLineDash([]);

  // Add internal wave / thermocline ripples
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let x = 0; x < 512; x += 10) {
    const y = 140 + Math.sin(x * 0.04) * 16 + Math.cos(x * 0.08) * 6;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
