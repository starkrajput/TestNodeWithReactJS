import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const ArticleCard = ({ title, excerpt, date, color, className, image }) => {
    const cardRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    // Motion values (keep existing code)
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [15, -15]);
    const rotateY = useTransform(x, [-100, 100], [-15, 15]);
    const scale = useTransform([x, y], ([latestX, latestY]) =>
        1 + Math.sqrt(latestX * latestX + latestY * latestY) / 2000
    );
    const shadowX = useTransform(x, [-100, 100], [-20, 20]);
    const shadowY = useTransform(y, [-100, 100], [-20, 20]);

    // Event handlers (keep existing code)
    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = (e.clientX - centerX) * 0.5;
        const mouseY = (e.clientY - centerY) * 0.5;
        x.set(mouseX);
        y.set(mouseY);
    };

    return (
        <CardContainer
            ref={cardRef}
            className={className}
            style={{
                rotateX,
                rotateY,
                scale,
                boxShadow: useTransform(
                    [shadowX, shadowY, x, y],
                    ([latestShadowX, latestShadowY, latestX, latestY]) => {
                        const intensity = Math.sqrt(latestX * latestX + latestY * latestY) / 100;
                        return `${latestShadowX}px ${latestShadowY}px ${30 + intensity * 20}px rgba(0, 0, 0, ${0.3 + intensity * 0.2}), 
                                0 0 ${20 + intensity * 30}px rgba(${color ? hexToRgb(color).join(',') : '58, 134, 255'}, ${0.1 + intensity * 0.3})`;
                    }
                )
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {/* Image Container - Added this new section */}
            {image && (
                <ImageContainer>
                    <CardImage
                        src={image}
                        alt={title}
                        animate={{
                            scale: isHovered ? 1.05 : 1
                        }}
                        transition={{ duration: 0.4 }}
                    />
                    <ImageOverlay
                        color={color}
                        animate={{
                            opacity: isHovered ? 0.2 : 0
                        }}
                    />
                </ImageContainer>
            )}

            {/* Background effects (keep existing) */}
            <BackgroundLayer color={color} />
            <GlowLayer
                color={color}
                animate={{
                    opacity: isHovered ? 0.6 : 0,
                    scale: isHovered ? 1.1 : 0.9
                }}
            />

            {/* Card content with adjusted spacing */}
            <CardContent hasImage={!!image}>
                <CardHeader>
                    <CardDate
                        color={color}
                        animate={{
                            scale: isHovered ? 1.05 : 1,
                            color: isHovered ? '#ffffff' : (color || '#3A86FF')
                        }}
                    >
                        {date}
                    </CardDate>
                    <StatusIndicator color={color} />
                </CardHeader>

                <CardTitle>{title}</CardTitle>
                <CardExcerpt>{excerpt}</CardExcerpt>

                <ReadMoreButton
                    color={color}
                    whileHover={{ x: 8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <ButtonText>Read More</ButtonText>
                    <ArrowIcon
                        animate={{
                            x: isHovered ? 5 : 0,
                            rotate: isHovered ? 360 : 0
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </ArrowIcon>
                </ReadMoreButton>
            </CardContent>

            {/* Accent and decoration (keep existing) */}
            <CardAccent color={color} />
            <CornerDecoration color={color} />
        </CardContainer>
    );
};

// Helper function to convert hex to rgb
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : [58, 134, 255];
};

// Enhanced Styled Components
const CardContainer = styled(motion.div)`
    position: relative;
    background: rgba(15, 15, 15, 0.95);
    border-radius: 16px;
    overflow: hidden;
    padding: 2rem;
    
    min-height: 320px;
    display: flex;
    flex-direction: column;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transform-style: preserve-3d;
    perspective: 1000px;
    cursor: pointer;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 25%,
            transparent 50%,
            rgba(0, 0, 0, 0.05) 75%,
            rgba(0, 0, 0, 0.1) 100%
        );
        pointer-events: none;
        z-index: 1;
    }
`;

const BackgroundLayer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
        135deg, 
        transparent 0%, 
        ${props => props.color || '#3A86FF'}08 50%, 
        transparent 100%
    );
    opacity: 0.6;
    z-index: 0;
`;

const GlowLayer = styled(motion.div)`
    position: absolute;
    top: -20px;
    left: -20px;
    right: -20px;
    bottom: -20px;
    background: radial-gradient(
        circle at center,
        ${props => props.color || '#3A86FF'}30 0%,
        ${props => props.color || '#3A86FF'}15 40%,
        transparent 70%
    );
    border-radius: 20px;
    pointer-events: none;
    z-index: -1;
`;

const ShimmerOverlay = styled(motion.div)`
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.1) 50%,
        transparent 100%
    );
    pointer-events: none;
    z-index: 3;
    transform: skewX(-15deg);
`;
/*
const CardContent = styled.div`
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    height: 100%;
`;*/

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
`;

const CardDate = styled(motion.span)`
    font-size: 0.85rem;
    font-weight: 600;
    padding: 0.4rem 0.8rem;
    border-radius: 20px;
    background: ${props => props.color || '#3A86FF'}20;
    border: 1px solid ${props => props.color || '#3A86FF'}40;
    backdrop-filter: blur(10px);
`;

const StatusIndicator = styled(motion.div)`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.color || '#3A86FF'};
    box-shadow: 0 0 10px ${props => props.color || '#3A86FF'}80;
`;

const CardTitle = styled(motion.h3)`
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #ffffff;
    line-height: 1.3;
    
    background: linear-gradient(
        135deg,
        #ffffff 0%,
        #f0f0f0 100%
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const CardExcerpt = styled(motion.p)`
    font-size: 0.95rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 1.5rem;
    flex-grow: 1;
`;

const ReadMoreButton = styled(motion.button)`
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: linear-gradient(
        135deg,
        ${props => props.color || '#3A86FF'}15,
        ${props => props.color || '#3A86FF'}25
    );
    border: 1px solid ${props => props.color || '#3A86FF'}40;
    color: ${props => props.color || '#3A86FF'};
    font-weight: 600;
    font-size: 0.9rem;
    padding: 0.8rem 1.2rem;
    border-radius: 25px;
    cursor: pointer;
    align-self: flex-start;
    backdrop-filter: blur(10px);
    position: relative;
    overflow: hidden;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent 0%,
            ${props => props.color || '#3A86FF'}30 50%,
            transparent 100%
        );
        transition: left 0.5s ease;
    }
    
    &:hover::before {
        left: 100%;
    }
`;

const ButtonText = styled.span`
    position: relative;
    z-index: 1;
`;

const ArrowIcon = styled(motion.span)`
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
`;

const CardAccent = styled(motion.div)`
    position: absolute;
    top: 0;
    right: 0;
    background: linear-gradient(
        90deg,
        ${props => props.color || '#3A86FF'},
        ${props => props.color || '#3A86FF'}80
    );
    border-radius: 0 16px 0 8px;
    box-shadow: 0 0 20px ${props => props.color || '#3A86FF'}40;
`;

const CornerDecoration = styled(motion.div)`
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    width: 12px;
    height: 12px;
    background: ${props => props.color || '#3A86FF'};
    border-radius: 2px;
    box-shadow: 0 0 15px ${props => props.color || '#3A86FF'}60;
`;
const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
`;

const CardImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const ImageOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.color || '#3A86FF'};
  mix-blend-mode: overlay;
`;

// Modified CardContent to account for image
const CardContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  height: ${props => props.hasImage ? 'calc(100% - 180px)' : '100%'};
  padding: ${props => props.hasImage ? '1.5rem' : '2rem'};
`;

export default ArticleCard;