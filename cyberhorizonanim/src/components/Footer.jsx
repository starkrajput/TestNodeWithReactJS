import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <FooterContainer>
            <FooterContent>
                <FooterTop>
                    <FooterLogo>
                        <Link to="/">CyberHorizon</Link>
                    </FooterLogo>

                    <FooterNavigation>
                        <FooterNavColumn>
                            <FooterNavTitle>Categories</FooterNavTitle>
                            <FooterNavList>
                                <FooterNavItem>
                                    <FooterNavLink to="/breaking-news">Breaking News</FooterNavLink>
                                </FooterNavItem>
                                <FooterNavItem>
                                    <FooterNavLink to="/cyber-crime">Cyber Crime</FooterNavLink>
                                </FooterNavItem>
                                <FooterNavItem>
                                    <FooterNavLink to="/corruption">Corruption</FooterNavLink>
                                </FooterNavItem>
                            </FooterNavList>
                        </FooterNavColumn>

                        <FooterNavColumn>
                            <FooterNavTitle>More</FooterNavTitle>
                            <FooterNavList>
                                <FooterNavItem>
                                    <FooterNavLink to="/tech-talk">Tech Talk</FooterNavLink>
                                </FooterNavItem>
                                <FooterNavItem>
                                    <FooterNavLink to="/fact-check">Fact Check</FooterNavLink>
                                </FooterNavItem>
                                <FooterNavItem>
                                    <FooterNavLink to="/podcast">Podcast</FooterNavLink>
                                </FooterNavItem>
                            </FooterNavList>
                        </FooterNavColumn>

                        <FooterNavColumn>
                            <FooterNavTitle>Company</FooterNavTitle>
                            <FooterNavList>
                                <FooterNavItem>
                                    <FooterNavLink to="/about">About Us</FooterNavLink>
                                </FooterNavItem>
                                <FooterNavItem>
                                    <FooterNavLink to="/contact">Contact</FooterNavLink>
                                </FooterNavItem>
                                <FooterNavItem>
                                    <FooterNavLink to="/privacy">Privacy Policy</FooterNavLink>
                                </FooterNavItem>
                            </FooterNavList>
                        </FooterNavColumn>
                    </FooterNavigation>

                    <FooterSubscribe>
                        <FooterNavTitle>Stay Updated</FooterNavTitle>
                        <SubscribeText>
                            Subscribe to our newsletter for the latest cybersecurity news and updates.
                        </SubscribeText>
                        <SubscribeForm>
                            <SubscribeInput
                                type="email"
                                placeholder="Your email address"
                            />
                            <SubscribeButton
                                as={motion.button}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Subscribe
                            </SubscribeButton>
                        </SubscribeForm>
                    </FooterSubscribe>
                </FooterTop>

                <FooterDivider />

                <FooterBottom>
                    <FooterCopyright>
                        © {new Date().getFullYear()} CyberHorizon. All rights reserved.
                    </FooterCopyright>

                    <FooterSocial>
                        <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <Twitter size={20} />
                            <span>Twitter</span>
                        </SocialLink>
                        <SocialLink href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <Facebook size={20} />
                            <span>Facebook</span>
                        </SocialLink>
                        <SocialLink href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <Instagram size={20} />
                            <span>Instagram</span>
                        </SocialLink>
                        <SocialLink href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                            <Linkedin size={20} />
                            <span>LinkedIn</span>
                        </SocialLink>
                    </FooterSocial>
                </FooterBottom>
            </FooterContent>
        </FooterContainer>
    );
};

const FooterContainer = styled.footer`
  background-color: #0a0a0a;
  color: #ffffff;
  padding: 5rem 0 2rem;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent);
  }
`;

const FooterContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 4rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const FooterLogo = styled.div`
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(90deg, #FF5A5F, #3A86FF, #8338EC);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  
  a {
    text-decoration: none;
  }
`;

const FooterNavigation = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FooterNavColumn = styled.div``;

const FooterNavTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #ffffff;
`;

const FooterNavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterNavItem = styled.li`
  margin-bottom: 0.8rem;
`;

const FooterNavLink = styled(Link)`
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: #3A86FF;
  }
`;

const FooterSubscribe = styled.div``;

const SubscribeText = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const SubscribeForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SubscribeInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.8rem 1rem;
  color: #ffffff;
  font-size: 1rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: #3A86FF;
  }
`;

const SubscribeButton = styled.button`
  background: linear-gradient(90deg, #3A86FF, #8338EC);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 0 15px rgba(58, 134, 255, 0.5);
  }
`;

const FooterDivider = styled.hr`
  border: none;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 3rem 0;
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
`;

const FooterCopyright = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
`;

const FooterSocial = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const SocialLink = styled.a`
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: #3A86FF;
  }
  
  @media (max-width: 480px) {
    span {
      display: none;
    }
  }
`;

export default Footer;