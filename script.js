// ============================================
// 3D BACKGROUND — THREE.JS
// ============================================

const canvas = document.getElementById('bg');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,        // transparent background
  antialias: true     // smooth edges
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// ----- GLOWING SPHERE -----
const sphereGeo = new THREE.SphereGeometry(1.5, 64, 64);
const sphereMat = new THREE.MeshStandardMaterial({
  color: 0x915EFF,
  roughness: 0.1,
  metalness: 0.9,
});
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
scene.add(sphere);

// ----- RING AROUND SPHERE -----
const ringGeo = new THREE.TorusGeometry(2.2, 0.05, 16, 100);
const ringMat = new THREE.MeshStandardMaterial({
  color: 0x00d4ff,
  roughness: 0.2,
});
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.rotation.x = Math.PI / 2.5;
scene.add(ring);

// ----- FLOATING PARTICLES -----
const particlesGeo = new THREE.BufferGeometry();
const count = 1500;
const positions = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 25;
}
particlesGeo.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3)
);
const particlesMat = new THREE.PointsMaterial({
  size: 0.025,
  color: 0x915EFF,
  transparent: true,
  opacity: 0.8
});
const particles = new THREE.Points(particlesGeo, particlesMat);
scene.add(particles);

// ----- LIGHTING -----
const purpleLight = new THREE.PointLight(0x915EFF, 3, 20);
purpleLight.position.set(5, 5, 5);
scene.add(purpleLight);

const blueLight = new THREE.PointLight(0x00d4ff, 2, 20);
blueLight.position.set(-5, -5, -5);
scene.add(blueLight);

const ambient = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambient);

// ----- ANIMATION LOOP -----
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const elapsed = clock.getElapsedTime();

  // Sphere rotation
  sphere.rotation.y = elapsed * 0.3;
  sphere.rotation.x = elapsed * 0.1;

  // Ring rotation
  ring.rotation.z = elapsed * 0.2;
  ring.rotation.x = elapsed * 0.1 + Math.PI / 2.5;

  // Particles slow drift
  particles.rotation.y = elapsed * 0.03;

  // Sphere breathing effect
  sphere.scale.setScalar(1 + Math.sin(elapsed * 1.5) * 0.05);

  renderer.render(scene, camera);
}
animate();

// ----- SCROLL EFFECT -----
// Sphere moves as you scroll
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total = document.body.scrollHeight - window.innerHeight;
  const progress = scrolled / total;

  sphere.position.x = progress * 4 - 2;
  sphere.position.y = -progress * 3;
  camera.position.z = 5 + progress * 2;
});

// ----- MOUSE MOVE EFFECT -----
// Sphere follows your finger slightly
window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = -(e.clientY / window.innerHeight - 0.5) * 2;
  sphere.rotation.y += x * 0.01;
  sphere.rotation.x += y * 0.01;
});

// ----- RESIZE HANDLER -----
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============================================
// SCROLL ANIMATIONS — GSAP
// ============================================

gsap.registerPlugin(ScrollTrigger);

// Animate all cards on scroll
gsap.utils.toArray('.animate-card').forEach((el, i) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 1,
    delay: i * 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
    }
  });
});

// Animate skill bars when in view
gsap.utils.toArray('.skill-fill').forEach(bar => {
  const targetWidth = bar.style.width;
  bar.style.width = '0%';

  ScrollTrigger.create({
    trigger: bar,
    start: 'top 90%',
    onEnter: () => {
      bar.style.width = targetWidth;
    }
  });
});

// Navbar hide/show on scroll
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (current > lastScroll && current > 100) {
    navbar.style.transform = 'translateY(-100%)';
    navbar.style.transition = 'transform 0.3s ease';
  } else {
    navbar.style.transform = 'translateY(0)';
  }
  lastScroll = current;
});
