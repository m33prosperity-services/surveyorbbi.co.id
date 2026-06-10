import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";

const brandLogoUrl = "/assets/brand/bbi-logo-dark.png";
const navToggle = document.querySelector(".nav-toggle");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    document.body.classList.toggle("nav-open", !expanded);
  });
}

const canvas = document.querySelector("#precision-field");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function createShipModel() {
  const ship = new THREE.Group();

  const hullMaterial = new THREE.MeshBasicMaterial({
    color: "#101010",
    wireframe: true,
    transparent: true,
    opacity: 0.88
  });
  const deckMaterial = new THREE.MeshBasicMaterial({
    color: "#dfe6ec",
    wireframe: true,
    transparent: true,
    opacity: 0.72
  });
  const accentMaterial = new THREE.MeshBasicMaterial({
    color: "#2b63ff",
    wireframe: true,
    transparent: true,
    opacity: 0.72
  });

  const hull = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.38, 0.72), hullMaterial);
  hull.position.y = -0.18;
  ship.add(hull);

  const bow = new THREE.Mesh(new THREE.ConeGeometry(0.43, 0.82, 4), hullMaterial.clone());
  bow.rotation.z = -Math.PI / 2;
  bow.position.set(1.95, -0.18, 0);
  ship.add(bow);

  const stern = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.52, 0.82), hullMaterial.clone());
  stern.position.set(-1.78, -0.08, 0);
  ship.add(stern);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.72, 0.62), deckMaterial);
  cabin.position.set(-0.78, 0.42, 0);
  ship.add(cabin);

  for (let i = 0; i < 7; i += 1) {
    const container = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.25, 0.52), i % 2 ? accentMaterial.clone() : deckMaterial.clone());
    container.position.set(-0.2 + i * 0.34, 0.26 + (i % 2) * 0.18, 0);
    container.rotation.y = i * 0.04;
    ship.add(container);
  }

  return ship;
}

function initOneTimeSplash() {
  const storageKey = "bbi-splash-seen-v1";
  let alreadySeen = false;

  try {
    alreadySeen = window.localStorage.getItem(storageKey) === "true";
  } catch {
    alreadySeen = true;
  }

  if (alreadySeen || reduceMotion) return;

  try {
    window.localStorage.setItem(storageKey, "true");
  } catch {}

  document.body.classList.add("splash-active");
  window.__bbiClearLoading?.();

  const splash = document.createElement("section");
  splash.className = "splash-screen";
  splash.setAttribute("aria-label", "Buana Bahtera Inspectindo opening animation");
  splash.innerHTML = `
    <canvas class="splash-screen__canvas" aria-hidden="true"></canvas>
    <div class="splash-screen__brand">
      <img src="${brandLogoUrl}" alt="Buana Bahtera Inspectindo logo">
      <p>Buana Bahtera Inspectindo</p>
      <strong>We Born to Provide Solution.</strong>
      <span>Independent Surveyor Indonesia</span>
    </div>
    <div class="splash-screen__wake" aria-hidden="true"></div>
  `;
  document.body.prepend(splash);

  const splashCanvas = splash.querySelector(".splash-screen__canvas");
  const renderer = new THREE.WebGLRenderer({ canvas: splashCanvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 1.15, 7.2);

  const ship = createShipModel();
  ship.position.set(-4.2, -0.1, 0);
  ship.rotation.set(-0.1, -0.34, 0.02);
  scene.add(ship);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.5, 0.018, 10, 128),
    new THREE.MeshBasicMaterial({ color: "#2b63ff", wireframe: true, transparent: true, opacity: 0.45 })
  );
  ring.rotation.x = Math.PI / 2.4;
  ring.position.y = -0.45;
  scene.add(ring);

  const wakeMaterial = new THREE.LineBasicMaterial({ color: "#dfe6ec", transparent: true, opacity: 0.22 });
  const wakeGroup = new THREE.Group();
  for (let i = 0; i < 7; i += 1) {
    const points = [
      new THREE.Vector3(-2.2 - i * 0.18, -0.45, -0.38 - i * 0.08),
      new THREE.Vector3(-3.5 - i * 0.42, -0.5, -0.74 - i * 0.09)
    ];
    wakeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), wakeMaterial.clone()));
    const mirrored = points.map((point) => new THREE.Vector3(point.x, point.y, -point.z));
    wakeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(mirrored), wakeMaterial.clone()));
  }
  scene.add(wakeGroup);

  function resizeSplash() {
    const rect = splashCanvas.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / Math.max(rect.height, 1);
    camera.updateProjectionMatrix();
    ship.scale.setScalar(rect.width < 640 ? 0.82 : 1);
  }

  window.addEventListener("resize", resizeSplash);
  resizeSplash();

  const started = performance.now();
  const duration = 4200;

  function animateSplash(now) {
    const elapsed = now - started;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    ship.position.x = -4.2 + eased * 6.6;
    ship.position.y = -0.12 + Math.sin(now * 0.004) * 0.05;
    ship.rotation.y = -0.34 + Math.sin(now * 0.0018) * 0.08;
    ring.rotation.z = now * 0.00035;
    wakeGroup.position.x = ship.position.x - 0.2;

    renderer.render(scene, camera);

    if (progress < 1) {
      requestAnimationFrame(animateSplash);
      return;
    }

    splash.classList.add("is-leaving");
    window.setTimeout(() => {
      window.removeEventListener("resize", resizeSplash);
      renderer.dispose();
      splash.remove();
      document.body.classList.remove("splash-active");
    }, 720);
  }

  requestAnimationFrame(animateSplash);
}

initOneTimeSplash();

if (canvas && !reduceMotion) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.2, 8);

  const group = new THREE.Group();
  scene.add(group);

  const blue = new THREE.Color("#2b63ff");
  const amber = new THREE.Color("#f0a925");
  const steel = new THREE.Color("#d7dde2");

  const ringMaterial = new THREE.MeshBasicMaterial({
    color: blue,
    wireframe: true,
    transparent: true,
    opacity: 0.48
  });

  const outerRing = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.018, 10, 128), ringMaterial);
  const innerRing = new THREE.Mesh(new THREE.TorusGeometry(1.36, 0.012, 10, 96), ringMaterial.clone());
  innerRing.material.opacity = 0.32;
  group.add(outerRing, innerRing);

  const panelMaterial = new THREE.MeshBasicMaterial({
    color: steel,
    wireframe: true,
    transparent: true,
    opacity: 0.26
  });

  const panelGeometry = new THREE.BoxGeometry(0.9, 0.18, 0.9);
  for (let i = 0; i < 9; i += 1) {
    const panel = new THREE.Mesh(panelGeometry, panelMaterial.clone());
    const angle = (i / 9) * Math.PI * 2;
    panel.position.set(Math.cos(angle) * 2.8, Math.sin(angle) * 1.25, Math.sin(angle) * 0.9);
    panel.rotation.set(angle * 0.22, angle, angle * 0.12);
    panel.material.opacity = 0.12 + i * 0.018;
    group.add(panel);
  }

  const coreMaterial = new THREE.MeshBasicMaterial({
    color: amber,
    wireframe: true,
    transparent: true,
    opacity: 0.34
  });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.78, 1), coreMaterial);
  group.add(core);

  const lineMaterial = new THREE.LineBasicMaterial({
    color: blue,
    transparent: true,
    opacity: 0.28
  });
  const points = [];
  for (let i = 0; i < 80; i += 1) {
    const t = i / 8;
    points.push(new THREE.Vector3(Math.sin(t) * 2.7, Math.cos(t * 0.7) * 1.2, Math.sin(t * 0.45) * 1.2));
  }
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), lineMaterial);
  group.add(line);

  const pointer = { x: 0, y: 0 };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / Math.max(rect.height, 1);
    camera.updateProjectionMatrix();
    group.position.x = rect.width > 900 ? 2.1 : 0.6;
    group.position.y = rect.width > 900 ? 0.2 : -0.3;
    group.scale.setScalar(rect.width > 900 ? 1 : 0.72);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (event) => {
    pointer.x = (event.clientX / window.innerWidth - 0.5) * 0.6;
    pointer.y = (event.clientY / window.innerHeight - 0.5) * 0.4;
  });

  resize();

  function animate(time) {
    const tick = time * 0.001;
    group.rotation.y = tick * 0.16 + pointer.x;
    group.rotation.x = -0.18 + pointer.y;
    outerRing.rotation.z = tick * 0.24;
    innerRing.rotation.z = -tick * 0.38;
    core.rotation.x = tick * 0.34;
    core.rotation.y = tick * 0.24;
    line.rotation.z = -tick * 0.08;

    core.material.color.lerpColors(amber, blue, (Math.sin(tick) + 1) / 2);
    line.material.color.lerpColors(blue, steel, (Math.cos(tick * 0.7) + 1) / 2);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate(0);
}
