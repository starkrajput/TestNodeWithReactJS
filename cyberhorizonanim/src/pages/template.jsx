import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import ArticleCard from '../components/ArticleCard';
// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const TemplatePage = ({ title }) => {
    const headerRef = useRef(null); 
    const contentRef = useRef(null);

    useEffect(() => {
      

        return () => {
            // Clean up
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    // Sample articles for the template page
    const articles = [
        {
            id: 1,
            title: "Major Data Breach Affects Millions",
            excerpt: "A recent data breach has exposed personal information of millions of users...",
            date: "June 15, 2023",
            color: "#FF5A5F"
        },
        {
            id: 2,
            title: "New Ransomware Strain Targets Healthcare",
            excerpt: "Security researchers have identified a new ransomware variant specifically targeting healthcare institutions...",
            date: "June 12, 2023",
            color: "#3A86FF"
        },
        {
            id: 3,
            title: "Government Announces New Cybersecurity Initiative",
            excerpt: "The government has unveiled a comprehensive cybersecurity framework aimed at protecting critical infrastructure...",
            date: "June 10, 2023",
            color: "#8338EC"
        },
        {
            id: 4,
            title: "AI-Powered Phishing Attacks on the Rise",
            excerpt: "Cybersecurity experts warn of increasingly sophisticated phishing campaigns leveraging artificial intelligence...",
            date: "June 8, 2023",
            color: "#06D6A0"
        }
    ];

    return (
        <PageContainer>
            <Navbar />

            <PageHeader ref={headerRef}>
                <HeaderContent>
                    <PageTitle>{title}</PageTitle>
                    <PageDescription>
                        Explore the latest news, insights, and analysis in the world of cybersecurity,
                        digital threats, and technological advancements.
                    </PageDescription>
                </HeaderContent>
                <HeaderGradient />
            </PageHeader>

            <PageContent ref={contentRef}>
                <ContentSection className="animate-item">
                    <SectionTitle>Latest Articles</SectionTitle>
                    <ArticleGrid>
                        {articles.map((article) => (
                            <ArticleCard
                                key={article.id}
                                title={article.title}
                                excerpt={article.excerpt}
                                date={article.date}
                                color={article.color}
                                className="article-card animate-item"
                            />
                        ))}
                    </ArticleGrid>
                </ContentSection>

                <ContentSection className="animate-item">
                    <SectionTitle>Featured Content</SectionTitle>
                    <FeaturedContent>
                        <FeaturedImage src="https://via.placeholder.com/800x400" alt="Featured content" />
                        <FeaturedTextContent>
                            <FeaturedLabel>Spotlight</FeaturedLabel>
                            <FeaturedTitle>The Evolution of Cyber Threats in 2023</FeaturedTitle>
                            <FeaturedDescription>
                                As technology advances, so do the tactics of cybercriminals. This comprehensive
                                analysis explores the changing landscape of cyber threats and what organizations
                                can do to protect themselves.
                            </FeaturedDescription>
                            <FeaturedButton
                                as={motion.button}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Read Full Article
                            </FeaturedButton>
                        </FeaturedTextContent>
                    </FeaturedContent>
                </ContentSection>
            </PageContent>

            <Footer />
        </PageContainer>
    );
};

const PageContainer = styled.div`
  background-color: #0a0a0a;
  color: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const PageHeader = styled.header`
  position: relative;
  padding: 10rem 2rem 6rem;
  background: linear-gradient(135deg, #0a0a0a, #121218);
  overflow: hidden;
  width: 100%;
`;

const HeaderContent = styled.div`
  width: 100%;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
`;

const PageTitle = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(90deg, #FF5A5F, #3A86FF, #8338EC);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

const PageDescription = styled.p`
  font-size: 1.5rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  max-width: 800px;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const HeaderGradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at top right, rgba(58, 134, 255, 0.2), transparent 60%);
  pointer-events: none;
`;

const PageContent = styled.main`
  flex: 1;
  width: 100%;
  padding: 4rem 2rem;
`;

const ContentSection = styled.section`
  margin-bottom: 6rem;
  width: 100%;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ArticleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeaturedContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  background: rgba(20, 20, 20, 0.5);
  border-radius: 16px;
  overflow: hidden;
  margin: 0 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// Rest of the styled components remain the same
const FeaturedImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  
  @media (max-width: 1024px) {
    height: 300px;
  }
`;

const FeaturedTextContent = styled.div`
  padding: 3rem;
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const FeaturedLabel = styled.span`
  display: inline-block;
  background: linear-gradient(90deg, #FF5A5F, #FF8A8E);
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
`;

const FeaturedTitle = styled.h3`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const FeaturedDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
`;

const FeaturedButton = styled.button`
  background: linear-gradient(90deg, #3A86FF, #8338EC);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(58, 134, 255, 0.3);
  transition: all 0.3s ease;
`;

export default TemplatePage;