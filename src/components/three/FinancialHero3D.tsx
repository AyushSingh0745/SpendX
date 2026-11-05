'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function FinancialHero3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 1. Central Floating Financial Crystal (Icosahedron)
    const geometry = new THREE.IcosahedronGeometry(1.6, 0);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x3b82f6,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.35,
      roughness: 0.15,
      metalness: 0.85,
      transmission: 0.6,
      ior: 1.5,
      thickness: 1.2,
      wireframe: false,
    });
    const crystal = new THREE.Mesh(geometry, material);
    scene.add(crystal);

    // 2. Wireframe Overlay (Apple tech aesthetics)
    const wireGeo = new THREE.IcosahedronGeometry(1.61, 0);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireMesh);

    // 3. Orbiting Gold Particle Ring
    const particlesCount = 180;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      const angle = (i / particlesCount) * Math.PI * 2;
      const radius = 2.4 + (Math.random() - 0.5) * 0.6;
      posArray[i * 3] = Math.cos(angle) * radius;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 0.8;
      posArray[i * 3 + 2] = Math.sin(angle) * radius;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xf59e0b, // Amber gold
      transparent: true,
      opacity: 0.85,
    });
    const particleMesh = new THREE.Points(particleGeo, particleMat);
    scene.add(particleMesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x60a5fa, 3, 20);
    pointLight1.position.set(4, 4, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xec4899, 2.5, 20);
    pointLight2.position.set(-4, -3, 2);
    scene.add(pointLight2);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / container.clientWidth - 0.5) * 2;
      mouseY = -((e.clientY - rect.top) / container.clientHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      crystal.rotation.x = elapsedTime * 0.35 + targetY * 0.4;
      crystal.rotation.y = elapsedTime * 0.5 + targetX * 0.5;

      wireMesh.rotation.x = crystal.rotation.x;
      wireMesh.rotation.y = crystal.rotation.y;

      particleMesh.rotation.y = -elapsedTime * 0.25;
      particleMesh.rotation.z = Math.sin(elapsedTime * 0.4) * 0.15;

      // Gentle floating float
      crystal.position.y = Math.sin(elapsedTime * 1.5) * 0.12;
      wireMesh.position.y = crystal.position.y;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[360px] md:h-[480px] flex items-center justify-center pointer-events-auto"
      aria-label="Interactive 3D Financial Crystal"
    />
  );
}
