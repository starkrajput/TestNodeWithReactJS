import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { motion } from 'framer-motion';

const PageHeader = ({ title, description, color }) => {
    const headerRef = useRef(null);

    useEffect(() => {
        // Animate header elements
        const tl = gsap.timeline();

        tl.from(headerRef.current.querySelector('.header-title'), {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        })
            .from(headerRef.current.querySelector('.header-description'), {
                y: 30,
                opacity: 0,
                duration: 0.6,
                ease: "power3.out"
            }, "-=0.4")
            .from(headerRef.current.querySelector('.header-line'), {
                scaleX: 0,
                duration: 0.8,
                ease: "power3.inOut"
            }, "-=0.4");

        return () => {
            tl.kill();
        };
    }, [title, description]);

    return (
        <HeaderContainer ref={headerRef} color={color}>
            <HeaderContent>
                <HeaderTitle className="header-title" color={color}>{title}</HeaderTitle>
                <HeaderDescription className="header-description">{description}</HeaderDescription>
                <HeaderLine className="header-line" color={color} />
            </HeaderContent>
            <BackgroundGlow color={color} />
        </HeaderContainer>
    );
};

const HeaderContainer = styled.header`
  position: relative;
  padding: 10rem 2rem 6rem;
  background-color: #0a0a0a;
  overflow: hidden;
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeaderTitle = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: #ffffff;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 30%;
    height: 4px;
    background: ${props => props.color || '#3A86FF'};
  }
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

const HeaderDescription = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  max-width: 700px;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const HeaderLine = styled.div`
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, ${props => props.color || '#3A86FF'}, transparent);
  transform-origin: left;
`;

const BackgroundGlow = styled.div`
  position: absolute;
  top: -100px;
  right: -100px;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: ${props => props.color || '#3A86FF'};
  opacity: 0.1;
  filter: blur(100px);
  z-index: 1;
`;

export default PageHeader;