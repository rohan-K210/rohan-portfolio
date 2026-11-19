import * as THREE from 'three';

const canvas = document.querySelector('#hero-canvas');
const visual = document.querySelector('.hero-visual');
let renderer, scene, camera, group, animationId;
let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;

function initScene() {
  if (!canvas || !visual) return;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(38, visual.clientWidth / visual.clientHeight, 0.1, 100);
  camera.position.z = 7.8;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) {
    visual.classList.add('no-webgl');
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(visual.clientWidth, visual.clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  group = new THREE.Group();
  scene.add(group);

  const geometry = new THREE.IcosahedronGeometry(1.65, 2);
  const wire = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
    color: 0xa9a2ff, wireframe: true, transparent: true, opacity: 0.62
  }));
  group.add(wire);

  const inner = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.05, 1),
    new THREE.MeshBasicMaterial({ color: 0x8bd9dc, wireframe: true, transparent: true, opacity: 0.22 })
  );
  inner.rotation.set(0.3, 0.2, 0.1);
  group.add(inner);

  const points = new THREE.Points(
    new THREE.IcosahedronGeometry(1.68, 3),
    new THREE.PointsMaterial({ color: 0xc4bfff, size: 0.025, transparent: true, opacity: 0.9 })
  );
  group.add(points);

  const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x8bd9dc, wireframe: true, transparent: true, opacity: 0.18 });
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.25, 0.006, 8, 180), ringMaterial);
  ring1.rotation.set(1.05, 0.45, 0.25);
  group.add(ring1);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.004, 8, 180), new THREE.MeshBasicMaterial({ color: 0xa9a2ff, transparent: true, opacity: 0.25 }));
  ring2.rotation.set(0.2, 1.0, 0.8);
  group.add(ring2);

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0xd7d2ff })
  );
  group.add(core);

  const starGeometry = new THREE.BufferGeometry();
  const starPositions = [];
  for (let i = 0; i < 250; i++) {
    starPositions.push((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5);
  }
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
  scene.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0x777b9a, size: 0.012, transparent: true, opacity: 0.65 })));

  const resize = () => {
    if (!renderer) return;
    const w = visual.clientWidth, h = visual.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  window.addEventListener('resize', resize);
  visual.addEventListener('pointermove', (event) => {
    const rect = visual.getBoundingClientRect();
    targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.7;
    targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.5;
  });
  visual.addEventListener('pointerleave', () => { targetX = 0; targetY = 0; });

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animate = () => {
    animationId = requestAnimationFrame(animate);
    pointerX += (targetX - pointerX) * 0.035;
    pointerY += (targetY - pointerY) * 0.035;
    if (!reduced) {
      group.rotation.y += 0.0028;
      group.rotation.x += 0.0008;
    }
    group.rotation.y += pointerX * 0.012;
    group.rotation.x += pointerY * 0.009;
    renderer.render(scene, camera);
  };
  animate();
}
initScene();

document.querySelector('#year').textContent = new Date().getFullYear();

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.content-section, .project-card, .stack-group, .education-inner, .contact-content').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

const glow = document.querySelector('.cursor-glow');
if (glow && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', e => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  }, { passive: true });
}
window.addEventListener('pagehide', () => cancelAnimationFrame(animationId));
