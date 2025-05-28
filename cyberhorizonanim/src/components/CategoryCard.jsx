import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import gsap from 'gsap';

const CategoryCard = ({ title, description, color, path, className }) => {
    const cardRef = useRef(null);
    const controls = useAnimation();

    useEffect(() => {
        // Card hover effect
        if (cardRef.current) {
            cardRef.current.addEventListener('mousemove', handleMouseMove);
            cardRef.current.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            if (cardRef.current) {
                cardRef.current.removeEventListener('mousemove', handleMouseMove);
                cardRef.current.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, []);

    const handleMouseMove = (e) => {
        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            duration: 0.5,
            ease: 'power2.out',
            transformPerspective: 1000,
            transformOrigin: 'center'
        });

        // Highlight effect
        const highlightX = (x / rect.width) * 100;
        const highlightY = (y / rect.height) * 100;

        gsap.to(card.querySelector('.card-highlight'), {
            background: `radial-gradient(circle at ${highlightX}% ${highlightY}%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 50%)`,
            duration: 0.3
        });
    };

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: 'power2.out'
        });

        gsap.to(cardRef.current.querySelector('.card-highlight'), {
            background: 'none',
            duration: 0.3
        });
    };

    return (
        <CardContainer
            ref={cardRef}
            className={className}
            color={color}
            whileHover={{ translateY: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <CardHighlight className="card-highlight" />
            <CardContent>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
                <CardLink to={path}>
                    <span>Explore</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </CardLink>
            </CardContent>
            <CardGlow color={color} />
        </CardContainer>
    );
};

const CardContainer = styled(motion.div)`
  position: relative;
  background: rgba(20, 20, 20, 0.8);
  border-radius: 16px;
  overflow: hidden;
  padding: 2rem;
  height: 100%;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transform-style: preserve-3d;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${props => props.color || '#3A86FF'};
  }
`;

const CardHighlight = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
`;

const CardContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const CardTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #ffffff;
`;

const CardDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
  flex-grow: 1;
`;

const CardLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  align-self: flex-start;
  padding: 0.5rem 0;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: #ffffff;
    transition: width 0.3s ease;
  }
  
  &:hover:after {
    width: 100%;
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(5px);
  }
`;

const CardGlow = styled.div`
  position: absolute;
  bottom: -50px;
  right: -50px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: ${props => props.color || '#3A86FF'};
  opacity: 0.2;
  filter: blur(40px);
  z-index: 0;
`;

export default CategoryCard;