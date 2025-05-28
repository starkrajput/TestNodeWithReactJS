import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';

const NewsFeature3D = () => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const newsCardsRef = useRef([]);
    const particlesRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const raycasterRef = useRef(new THREE.Raycaster());
    const [selectedNews, setSelectedNews] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const animationFrameRef = useRef(null);

    const newsData = [
        {
            id: 1,
            title: "AI-Powered Cyber Attacks Surge by 300%",
            subtitle: "Breaking: Security Alert",
            description: "Artificial Intelligence is being weaponized for sophisticated cyber attacks, creating unprecedented threats to global digital infrastructure.",
            category: "CYBER SECURITY",
            date: "2025.05.27",
            color: "#FF6B6B",
            gradient: ["#FF6B6B", "#4ECDC4"]
        },
        {
            id: 2,
            title: "Quantum Computing Breaks Encryption",
            subtitle: "Tech Revolution",
            description: "Breakthrough in quantum computing threatens current encryption methods, forcing a complete reimagining of digital security protocols.",
            category: "TECHNOLOGY",
            date: "2025.05.26",
            color: "#4ECDC4",
            gradient: ["#4ECDC4", "#45B7D1"]
        },
        {
            id: 3,
            title: "Global Privacy Laws Transform Tech",
            subtitle: "Legal Framework",
            description: "New international privacy regulations are reshaping how technology companies handle user data and implement security measures.",
            category: "LEGAL TECH",
            date: "2025.05.25",
            color: "#96CEB4",
            gradient: ["#96CEB4", "#FFEAA7"]
        }
    ];

    const createParticleSystem = useCallback(() => {
        const geometry = new THREE.BufferGeometry();
        const particleCount = 1000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

            const color = new THREE.Color();
            color.setHSL(Math.random() * 0.2 + 0.5, 0.7, Math.random() * 0.5 + 0.5);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = Math.random() * 3 + 1;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
            transparent: true,
            vertexColors: true,
            vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z) * (1.0 + sin(time + position.x) * 0.1);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
            fragmentShader: `
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          float distance = length(gl_PointCoord - vec2(0.5));
          if (distance > 0.5) discard;
          
          float alpha = 1.0 - distance * 2.0;
          alpha *= (sin(time * 2.0) * 0.1 + 0.9);
          
          gl_FragColor = vec4(vColor, alpha * 0.6);
        }
      `,
            uniforms: {
                time: { value: 0 }
            }
        });

        return new THREE.Points(geometry, material);
    }, []);

    const createNewsCard = useCallback((newsItem, index) => {
        const group = new THREE.Group();

        // Main card geometry with rounded corners effect
        const cardGeometry = new THREE.BoxGeometry(4, 6, 0.2);
        const cardMaterial = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(newsItem.color),
            metalness: 0.1,
            roughness: 0.2,
            transparent: true,
            opacity: 0.9,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        });

        const cardMesh = new THREE.Mesh(cardGeometry, cardMaterial);
        group.add(cardMesh);

        // Holographic border effect
        const borderGeometry = new THREE.BoxGeometry(4.1, 6.1, 0.1);
        const borderMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.3,
            side: THREE.BackSide
        });
        const borderMesh = new THREE.Mesh(borderGeometry, borderMaterial);
        group.add(borderMesh);

        // Glowing edge effect
        const edgeGeometry = new THREE.EdgesGeometry(cardGeometry);
        const edgeMaterial = new THREE.LineBasicMaterial({
            color: new THREE.Color(newsItem.color),
            transparent: true,
            opacity: 0.8
        });
        const edgeLines = new THREE.LineSegments(edgeGeometry, edgeMaterial);
        group.add(edgeLines);

        // Position cards in a curved arrangement
        const angle = (index - 1) * 0.8;
        const radius = 8;
        group.position.x = Math.sin(angle) * radius;
        group.position.z = Math.cos(angle) * radius - 5;
        group.position.y = Math.sin(index * 0.5) * 2;
        group.rotation.y = -angle;

        // Add floating animation
        group.userData = {
            originalPosition: group.position.clone(),
            originalRotation: group.rotation.clone(),
            index: index,
            newsItem: newsItem
        };

        return group;
    }, []);

    const handleMouseMove = useCallback((event) => {
        if (!mountRef.current) return;

        const rect = mountRef.current.getBoundingClientRect();
        mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }, []);

    const handleClick = useCallback((event) => {
        if (!cameraRef.current || !sceneRef.current) return;

        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
        const intersects = raycasterRef.current.intersectObjects(newsCardsRef.current, true);

        if (intersects.length > 0) {
            const clickedCard = intersects[0].object.parent;
            if (clickedCard.userData.index !== undefined) {
                setSelectedNews(clickedCard.userData.index);

                // Animate camera to focus on selected card
                const targetPosition = clickedCard.position.clone();
                targetPosition.add(new THREE.Vector3(0, 0, 5));

                // Smooth camera transition
                const startPosition = cameraRef.current.position.clone();
                const startTime = Date.now();
                const duration = 1000;

                const animateCamera = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeProgress = 1 - Math.pow(1 - progress, 3);

                    cameraRef.current.position.lerpVectors(startPosition, targetPosition, easeProgress);
                    cameraRef.current.lookAt(clickedCard.position);

                    if (progress < 1) {
                        requestAnimationFrame(animateCamera);
                    }
                };

                animateCamera();
            }
        }
    }, []);

    const animate = useCallback(() => {
        if (!sceneRef.current || !rendererRef.current || !cameraRef.current) return;

        const time = Date.now() * 0.001;

        // Update particles
        if (particlesRef.current) {
            particlesRef.current.material.uniforms.time.value = time;
            particlesRef.current.rotation.y = time * 0.1;
        }

        // Animate news cards
        newsCardsRef.current.forEach((card, index) => {
            if (card.userData.originalPosition) {
                // Floating animation
                card.position.y = card.userData.originalPosition.y + Math.sin(time * 2 + index) * 0.3;

                // Subtle rotation
                card.rotation.z = Math.sin(time + index) * 0.05;

                // Hover effect
                if (isHovered && selectedNews === index) {
                    card.scale.setScalar(1.1 + Math.sin(time * 4) * 0.05);
                    card.children[1].material.opacity = 0.6 + Math.sin(time * 3) * 0.2;
                } else {
                    card.scale.setScalar(1.0);
                    card.children[1].material.opacity = 0.3;
                }
            }
        });

        // Mouse interaction for camera
        if (cameraRef.current) {
            cameraRef.current.position.x += (mouseRef.current.x * 2 - cameraRef.current.position.x) * 0.02;
            cameraRef.current.position.y += (-mouseRef.current.y * 2 - cameraRef.current.position.y) * 0.02;
            cameraRef.current.lookAt(0, 0, 0);
        }

        rendererRef.current.render(sceneRef.current, cameraRef.current);
        animationFrameRef.current = requestAnimationFrame(animate);
    }, [isHovered, selectedNews]);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        sceneRef.current = new THREE.Scene();
        sceneRef.current.background = new THREE.Color(0x0a0a0a);

        // Camera setup
        cameraRef.current = new THREE.PerspectiveCamera(
            75,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            1000
        );
        cameraRef.current.position.set(0, 0, 10);

        // Renderer setup
        rendererRef.current = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        rendererRef.current.shadowMap.enabled = true;
        rendererRef.current.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererRef.current.toneMapping = THREE.ACESFilmicToneMapping;
        rendererRef.current.toneMappingExposure = 1.2;

        mountRef.current.appendChild(rendererRef.current.domElement);

        // Lighting setup
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        sceneRef.current.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        sceneRef.current.add(directionalLight);

        const pointLight1 = new THREE.PointLight(0x00ffff, 1, 20);
        pointLight1.position.set(-10, 5, 5);
        sceneRef.current.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xff6b6b, 1, 20);
        pointLight2.position.set(10, -5, 5);
        sceneRef.current.add(pointLight2);

        // Create particle system
        particlesRef.current = createParticleSystem();
        sceneRef.current.add(particlesRef.current);

        // Create news cards
        newsCardsRef.current = newsData.map((newsItem, index) => {
            const card = createNewsCard(newsItem, index);
            sceneRef.current.add(card);
            return card;
        });

        // Event listeners
        mountRef.current.addEventListener('mousemove', handleMouseMove);
        mountRef.current.addEventListener('click', handleClick);
        mountRef.current.addEventListener('mouseenter', () => setIsHovered(true));
        mountRef.current.addEventListener('mouseleave', () => setIsHovered(false));

        // Handle resize
        const handleResize = () => {
            if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;

            cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        };

        window.addEventListener('resize', handleResize);

        // Start animation
        animate();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (mountRef.current && rendererRef.current) {
                mountRef.current.removeChild(rendererRef.current.domElement);
                mountRef.current.removeEventListener('mousemove', handleMouseMove);
                mountRef.current.removeEventListener('click', handleClick);
            }
            window.removeEventListener('resize', handleResize);

            // Cleanup Three.js resources
            if (rendererRef.current) {
                rendererRef.current.dispose();
            }
            newsCardsRef.current.forEach(card => {
                card.traverse(child => {
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) {
                        if (child.material.map) child.material.map.dispose();
                        child.material.dispose();
                    }
                });
            });
        };
    }, [animate, createNewsCard, createParticleSystem, handleClick, handleMouseMove]);

    return (
        <div className="w-full relative overflow-hidden bg-gradient-to-b from-gray-900 via-black to-gray-900">
            {/* Header */}
            <div className="relative z-10 text-center pt-16 pb-8">
                <div className="inline-block px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-black font-bold text-sm tracking-wider mb-4">
                    FEATURED NEWS
                </div>
                <h2 className="text-6xl font-black text-white mb-4 tracking-tight">
                    <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                        CYBER
                    </span>{' '}
                    <span className="text-white">HORIZON</span>
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    Immerse yourself in the latest cybersecurity news with our interactive 3D experience
                </p>
            </div>

            {/* 3D Scene Container */}
            <div
                ref={mountRef}
                className="w-full h-[600px] relative cursor-pointer"
                style={{ background: 'radial-gradient(circle at center, rgba(0,255,255,0.1) 0%, transparent 70%)' }}
            />

            {/* News Details Panel */}
            <div className="relative z-10 -mt-20 pb-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="bg-gradient-to-r from-gray-900/90 via-black/90 to-gray-900/90 backdrop-blur-xl rounded-3xl border border-cyan-500/20 p-8 shadow-2xl">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-xs font-bold text-white">
                                        {newsData[selectedNews]?.category}
                                    </span>
                                    <span className="text-gray-400 text-sm">
                                        {newsData[selectedNews]?.date}
                                    </span>
                                </div>

                                <h3 className="text-3xl font-bold text-white mb-2">
                                    {newsData[selectedNews]?.title}
                                </h3>

                                <h4 className="text-xl text-cyan-400 mb-4 font-semibold">
                                    {newsData[selectedNews]?.subtitle}
                                </h4>

                                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                                    {newsData[selectedNews]?.description}
                                </p>

                                <div className="flex gap-4">
                                    <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                                        Read Full Article
                                    </button>
                                    <button className="px-6 py-3 border-2 border-cyan-400 text-cyan-400 font-bold rounded-full hover:bg-cyan-400 hover:text-black transition-all duration-300">
                                        Share Story
                                    </button>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-cyan-500/30">
                                    <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-400 text-sm">Interactive 3D News Visualization</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation dots */}
                        <div className="flex justify-center gap-3 mt-8">
                            {newsData.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedNews(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${selectedNews === index
                                            ? 'bg-cyan-400 w-8'
                                            : 'bg-gray-600 hover:bg-gray-500'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-8 right-8 z-20">
                <button className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full shadow-2xl hover:shadow-cyan-500/25 hover:scale-110 transition-all duration-300 flex items-center justify-center group">
                    <svg className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default NewsFeature3D;