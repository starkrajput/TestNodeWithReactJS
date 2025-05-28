import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { SplitText } from '../tools/SplitText';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Logo text animation
        const logoText = new SplitText('.logo-text', { type: 'chars' });

        gsap.from(logoText.chars, {
            opacity: 0,
            y: 20,
            rotationX: -90,
            stagger: 0.02,
            duration: 1,
            ease: 'back.out(1.7)',
            onComplete: () => {
                // Add hover animation after initial animation
                gsap.set(logoText.chars, { clearProps: 'all' });
            }
        });

        // Scroll event listener
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Breaking News', path: '/breaking-news' },
        { name: 'Cyber Crime', path: '/cyber-crime' },
        { name: 'Corruption', path: '/corruption' },
        { name: 'Tech Talk', path: '/tech-talk' },
        { name: 'Fact Check', path: '/fact-check' },
        { name: 'Podcast', path: '/podcast' }
    ];

    return (
        <NavbarContainer $isScrolled={isScrolled}>
            <NavbarContent>
                <LogoContainer>
                    <Link to="/">
                        <LogoText className="logo-text">CyberHorizon</LogoText>
                    </Link>
                </LogoContainer>

                <DesktopMenu>
                    {navLinks.map((link, index) => (
                        <NavItem key={index}>
                            <NavLink to={link.path}>
                                {link.name}
                                <NavLinkHoverEffect />
                            </NavLink>
                        </NavItem>
                    ))}
                </DesktopMenu>

                <MobileMenuToggle
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <ToggleBar $open={isMobileMenuOpen} />
                    <ToggleBar $open={isMobileMenuOpen} />
                    <ToggleBar $open={isMobileMenuOpen} />
                </MobileMenuToggle>
            </NavbarContent>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <MobileMenu
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {navLinks.map((link, index) => (
                            <MobileNavItem
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <MobileNavLink
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </MobileNavLink>
                            </MobileNavItem>
                        ))}
                    </MobileMenu>
                )}
            </AnimatePresence>
        </NavbarContainer>
    );
};

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${props => props.$isScrolled ? 'rgba(10, 10, 10, 0.95)' : 'transparent'};
  backdrop-filter: ${props => props.$isScrolled ? 'blur(10px)' : 'none'};
  transition: all 0.3s ease;
  padding: ${props => props.$isScrolled ? '0.8rem 0' : '1.5rem 0'};
  box-shadow: ${props => props.$isScrolled ? '0 4px 30px rgba(0, 0, 0, 0.1)' : 'none'};
`;

const NavbarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const LogoContainer = styled.div`
  z-index: 1001;
`;

const LogoText = styled.h1`
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(90deg, #FF5A5F, #3A86FF, #8338EC);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const DesktopMenu = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const NavItem = styled.li`
  margin: 0 0.8rem;
`;

const NavLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem 0.8rem;
  position: relative;
  transition: color 0.3s ease;
  
  &:hover {
    color: #3A86FF;
  }
`;

const NavLinkHoverEffect = styled.span`
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #FF5A5F, #3A86FF);
  transition: width 0.3s ease;
  
  ${NavLink}:hover & {
    width: 100%;
  }
`;

const MobileMenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  width: 30px;
  height: 24px;
  position: relative;
  z-index: 1001;
  
  @media (max-width: 1024px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`;

const ToggleBar = styled.span`
  display: block;
  width: 100%;
  height: 2px;
  background-color: #ffffff;
  transition: all 0.3s ease;
  
  &:nth-child(1) {
    transform: ${props => props.$open ? 'rotate(45deg) translate(8px, 8px)' : 'none'};
  }
  
  &:nth-child(2) {
    opacity: ${props => props.$open ? 0 : 1};
  }
  
  &:nth-child(3) {
    transform: ${props => props.$open ? 'rotate(-45deg) translate(7px, -7px)' : 'none'};
  }
`;

const MobileMenu = styled(motion.ul)`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 10, 0.98);
  backdrop-filter: blur(10px);
  list-style: none;
  margin: 0;
  padding: 5rem 2rem 2rem;
  z-index: 1000;
  overflow-y: auto;
  
  @media (max-width: 1024px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const MobileNavItem = styled(motion.li)`
  margin: 1rem 0;
  width: 100%;
  text-align: center;
`;

const MobileNavLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 600;
  padding: 0.8rem;
  display: block;
  transition: all 0.3s ease;
  
  &:hover {
    color: #3A86FF;
    transform: translateY(-2px);
  }
`;

export default Navbar;