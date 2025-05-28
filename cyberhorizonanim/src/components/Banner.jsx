import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import * as THREE from 'three';
import vedio from '../assets/vediobanner.mp4';
const Banner = () => {
    const bannerRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 300], [0, -50]);
    const y2 = useTransform(scrollY, [0, 300], [0, -100]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
    const x = useSpring(0, springConfig);
    const y = useSpring(0, springConfig);

    useEffect(() => {
        // Three.js 3D background setup
        let scene, camera, renderer, particles, particleSystem;

        const initThreeJS = () => {
            if (!canvasRef.current) return;

            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            renderer = new THREE.WebGLRenderer({
                canvas: canvasRef.current,
                alpha: true
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000000, 0);

            // Create floating particles
            const particleCount = 800;
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);

            for (let i = 0; i < particleCount * 3; i += 3) {
                positions[i] = (Math.random() - 0.5) * 100;
                positions[i + 1] = (Math.random() - 0.5) * 100;
                positions[i + 2] = (Math.random() - 0.5) * 100;

                // Color variations (blue, purple, red)
                const colorChoice = Math.random();
                if (colorChoice < 0.33) {
                    colors[i] = 0.23; colors[i + 1] = 0.53; colors[i + 2] = 1; // Blue
                } else if (colorChoice < 0.66) {
                    colors[i] = 0.51; colors[i + 1] = 0.22; colors[i + 2] = 0.93; // Purple
                } else {
                    colors[i] = 1; colors[i + 1] = 0.35; colors[i + 2] = 0.37; // Red
                }
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const material = new THREE.PointsMaterial({
                size: 2,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });

            particleSystem = new THREE.Points(geometry, material);
            scene.add(particleSystem);

            camera.position.z = 50;

            // Animation loop (removed mouse interaction)
            const animate = () => {
                if (!particleSystem) return;

                particleSystem.rotation.x += 0.001;
                particleSystem.rotation.y += 0.002;

                renderer.render(scene, camera);
                requestAnimationFrame(animate);
            };

            animate();
        };

        // Text animation with GSAP-like effects using Web Animations API
        const animateText = () => {
            if (titleRef.current) {
                const title = titleRef.current;
                const text = title.textContent;
                title.innerHTML = '';

                // Split text into words and characters
                const words = text.split(' ');
                words.forEach((word, wordIndex) => {
                    const wordSpan = document.createElement('span');
                    wordSpan.style.display = 'inline-block';
                    wordSpan.style.marginRight = '0.3em';

                    [...word].forEach((char, charIndex) => {
                        const charSpan = document.createElement('span');
                        charSpan.textContent = char;
                        charSpan.style.display = 'inline-block';
                        charSpan.style.transform = 'translateY(100px) rotateX(-90deg)';
                        charSpan.style.opacity = '0';
                        wordSpan.appendChild(charSpan);

                        // Animate each character
                        setTimeout(() => {
                            charSpan.animate([
                                {
                                    transform: 'translateY(100px) rotateX(-90deg)',
                                    opacity: '0'
                                },
                                {
                                    transform: 'translateY(0) rotateX(0deg)',
                                    opacity: '1'
                                }
                            ], {
                                duration: 800,
                                delay: (wordIndex * 100) + (charIndex * 50),
                                easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                                fill: 'forwards'
                            });
                        }, 500);
                    });

                    title.appendChild(wordSpan);
                });
            }

            // Subtitle animation
            if (subtitleRef.current) {
                setTimeout(() => {
                    subtitleRef.current.animate([
                        { transform: 'translateY(50px)', opacity: '0' },
                        { transform: 'translateY(0)', opacity: '1' }
                    ], {
                        duration: 1000,
                        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        fill: 'forwards'
                    });
                }, 1200);
            }
        };

        // Mouse tracking
        const handleMouseMove = (e) => {
            const rect = bannerRef.current?.getBoundingClientRect();
            if (rect) {
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                setMousePosition({
                    x: (e.clientX - centerX) / rect.width,
                    y: (e.clientY - centerY) / rect.height
                });

                x.set((e.clientX - centerX) * 0.1);
                y.set((e.clientY - centerY) * 0.1);
            }
        };

        initThreeJS();
        animateText();
        // Remove mouse move event listener since we're not using it anymore
        window.addEventListener('resize', () => {
            if (renderer && camera) {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }
        });

        return () => {
            //window.removeEventListener('mousemove', handleMouseMove);
            if (renderer) {
                renderer.dispose();
            }
        };
    }, [x, y, mousePosition]);

    const handleVideoLoad = () => {
        setIsVideoLoaded(true);
    };

    return (
        <BannerContainer ref={bannerRef}>
            <ThreeCanvas ref={canvasRef} />

            <BannerContent style={{ y: y1, opacity }}>
                <VideoSection>
                    <VideoContainer>
                        <StyledVideo
                            ref={videoRef}
                            autoPlay
                            muted
                            loop
                            playsInline
                            onLoadedData={handleVideoLoad}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: isVideoLoaded ? 1 : 0.8,
                                opacity: isVideoLoaded ? 1 : 0
                            }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        >
                            <source src={ vedio} type="video/mp4" />
                            <source src="assets/banner-video.webm" type="video/webm" />
                        </StyledVideo>
                        <VideoOverlay />
                        <VideoGlow style={{ x, y }} />
                    </VideoContainer>

                    <FloatingElements>
                        <FloatingElement
                            animate={{
                                y: [-20, 20, -20],
                                rotate: [0, 5, 0],
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            style={{ top: '20%', left: '10%' }}
                        />
                        <FloatingElement
                            animate={{
                                y: [20, -30, 20],
                                rotate: [0, -8, 0],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            style={{ bottom: '25%', right: '15%' }}
                        />
                        <FloatingElement
                            animate={{
                                y: [-15, 25, -15],
                                rotate: [0, 10, 0],
                            }}
                            transition={{
                                duration: 7,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            style={{ top: '60%', left: '20%' }}
                        />
                    </FloatingElements>
                </VideoSection>

                <ContentSection style={{ y: y2 }}>
                    <ContentWrapper>
                        <TextOverlay>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2, duration: 1 }}
                        >
                            <Badge
                                animate={{
                                    boxShadow: [
                                        "0 0 20px rgba(255, 90, 95, 0.5)",
                                        "0 0 40px rgba(255, 90, 95, 0.8)",
                                        "0 0 20px rgba(255, 90, 95, 0.5)"
                                    ]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                ✨ Welcome to the Future
                            </Badge>
                        </motion.div>

                        <BannerTitle ref={titleRef}>
                            Illuminating The Digital Landscape
                        </BannerTitle>

                        <BannerSubtitle ref={subtitleRef}>
                            Uncover the truth in a world of digital deception.
                            Stay informed, stay secure with cutting-edge insights.
                        </BannerSubtitle>

                        <ButtonContainer>
                            <ExploreButton
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 20px 40px rgba(255, 90, 95, 0.4)"
                                }}
                                whileTap={{ scale: 0.95 }}
                                animate={{
                                    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
                                }}
                                transition={{
                                    backgroundPosition: {
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }
                                }}
                            >
                                <ButtonIcon>🚀</ButtonIcon>
                                Explore Now
                                <ButtonGlow />
                            </ExploreButton>

                            <SubscribeButton
                                whileHover={{
                                    scale: 1.05,
                                    borderColor: "#3A86FF",
                                    boxShadow: "0 0 30px rgba(58, 134, 255, 0.5)"
                                }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ButtonIcon>📡</ButtonIcon>
                                Subscribe
                                <SubscribeGlow />
                            </SubscribeButton>
                        </ButtonContainer>

                        <StatsContainer
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 2.5, duration: 0.8 }}
                        >
                            <StatItem>
                                <StatNumber
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    10K+
                                </StatNumber>
                                <StatLabel>Active Users</StatLabel>
                            </StatItem>
                            <StatItem>
                                <StatNumber
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                >
                                    500+
                                </StatNumber>
                                <StatLabel>Articles</StatLabel>
                            </StatItem>
                            <StatItem>
                                <StatNumber
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                >
                                    24/7
                                </StatNumber>
                                <StatLabel>Monitoring</StatLabel>
                            </StatItem>
                            </StatsContainer>
                            </TextOverlay>
                    </ContentWrapper>
                </ContentSection>
            </BannerContent>

            <ScrollIndicator
                animate={{
                    y: [0, 10, 0],
                    opacity: [0.5, 1, 0.5]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <ScrollArrow>↓</ScrollArrow>
                <ScrollText>Scroll to explore</ScrollText>
            </ScrollIndicator>
        </BannerContainer>
    );
};

const BannerContainer = styled.section`
    position: relative;
    height: 100vh;
    width: 100vw; /* Changed from 100% to 100vw to ensure full viewport width */
    min-width: 100vw; /* Ensures it never shrinks below viewport width */
    max-width: 100vw; /* Ensures it never expands beyond viewport width */
    overflow: hidden;
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
    padding-top: 80px;
    margin: 0;
    left: 0;
    right: 0;
`;

const ThreeCanvas = styled.canvas`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw; /* Ensure canvas takes full viewport width */
    height: 100%;
    z-index: 1;
    pointer-events: none;
`;


const BannerContent = styled(motion.div)`
    position: relative;
    z-index: 5;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    align-items: center;

    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
        gap: 2rem;
        text-align: center;
    }
`;

const VideoSection = styled.div`
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: 1024px) {
        order: 2;
        height: 50vh;
    }
`;

const VideoContainer = styled.div`
    position: relative;
    width: 100%;
    max-width: 600px;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    transform-style: preserve-3d;
    perspective: 1000px;
`;

const StyledVideo = styled(motion.video)`
    width: 100%;
    height: auto;
    display: block;
    border-radius: 20px;
    filter: brightness(0.9) contrast(1.1) saturate(1.2);
`;

const VideoOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
        135deg,
        rgba(58, 134, 255, 0.1) 0%,
        rgba(131, 56, 236, 0.1) 50%,
        rgba(255, 90, 95, 0.1) 100%
    );
    mix-blend-mode: overlay;
    border-radius: 20px;
`;

const VideoGlow = styled(motion.div)`
    position: absolute;
    top: -20px;
    left: -20px;
    right: -20px;
    bottom: -20px;
    background: linear-gradient(
        45deg,
        rgba(58, 134, 255, 0.3),
        rgba(131, 56, 236, 0.3),
        rgba(255, 90, 95, 0.3)
    );
    border-radius: 30px;
    filter: blur(20px);
    z-index: -1;
    opacity: 0.7;
`;

const FloatingElements = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
`;

const FloatingElement = styled(motion.div)`
    position: absolute;
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, rgba(58, 134, 255, 0.3), rgba(131, 56, 236, 0.3));
    border-radius: 50%;
    filter: blur(1px);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ContentSection = styled(motion.div)`
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;

    @media (max-width: 1024px) {
        order: 1;
    }
`;

const ContentWrapper = styled.div`
  max-width: 600px;
  position: relative;
  padding: 2rem;
`;

const Badge = styled(motion.div)`
    display: inline-block;
    background: linear-gradient(90deg, rgba(255, 90, 95, 0.2), rgba(58, 134, 255, 0.2));
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0.8rem 1.5rem;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 2rem;
    color: #ffffff;
`;

const BannerTitle = styled.h1`
    font-size: 4rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    color: #ffffff;
    line-height: 1.1;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);

    @media (max-width: 768px) {
        font-size: 2.5rem;
    }
`;

const BannerSubtitle = styled.p`
    font-size: 1.3rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 3rem;
    opacity: 0;

    @media (max-width: 768px) {
        font-size: 1.1rem;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 1.5rem;
    margin-bottom: 3rem;

    @media (max-width: 480px) {
        flex-direction: column;
        gap: 1rem;
    }
`;

const ExploreButton = styled(motion.button)`
    position: relative;
    background: linear-gradient(45deg, #FF5A5F, #FF8A8E, #FF5A5F);
    background-size: 200% 200%;
    color: white;
    border: none;
    padding: 1.2rem 2.5rem;
    font-size: 1.1rem;
    font-weight: 700;
    border-radius: 50px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    overflow: hidden;
    box-shadow: 0 15px 35px rgba(255, 90, 95, 0.3);
`;

const SubscribeButton = styled(motion.button)`
    position: relative;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.2);
    padding: 1.2rem 2.5rem;
    font-size: 1.1rem;
    font-weight: 700;
    border-radius: 50px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    overflow: hidden;
`;

const ButtonIcon = styled.span`
    font-size: 1.2rem;
`;

const ButtonGlow = styled.div`
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transform: rotate(45deg);
    animation: shimmer 3s infinite;

    @keyframes shimmer {
        0% { transform: translateX(-100%) rotate(45deg); }
        100% { transform: translateX(100%) rotate(45deg); }
    }
`;

const SubscribeGlow = styled.div`
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(58, 134, 255, 0.1), transparent);
    transform: rotate(45deg);
    animation: shimmer 4s infinite;

    @keyframes shimmer {
        0% { transform: translateX(-100%) rotate(45deg); }
        100% { transform: translateX(100%) rotate(45deg); }
    }
`;

const StatsContainer = styled(motion.div)`
    display: flex;
    gap: 3rem;
    margin-top: 2rem;

    @media (max-width: 768px) {
        gap: 2rem;
        justify-content: center;
    }

    @media (max-width: 480px) {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
`;

const StatItem = styled.div`
    text-align: center;
`;

const StatNumber = styled(motion.div)`
    font-size: 2rem;
    font-weight: 800;
    color: #3A86FF;
    margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 500;
`;

const ScrollIndicator = styled(motion.div)`
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: rgba(255, 255, 255, 0.6);
    z-index: 10;
`;

const ScrollArrow = styled.div`
    font-size: 1.5rem;
`;

const ScrollText = styled.div`
    font-size: 0.8rem;
    font-weight: 500;
`;
const TextOverlay = styled.div`
  position: relative;
  z-index: 10;
  
  &::before {
    content: '';
    position: absolute;
    top: -20px;
    left: -20px;
    right: -20px;
    bottom: -20px;
    background: rgba(10, 10, 20, 0.7); /* Dark semi-transparent background */
    backdrop-filter: blur(5px); /* Subtle blur effect */
    border-radius: 12px;
    z-index: -1;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }
`;

export default Banner;