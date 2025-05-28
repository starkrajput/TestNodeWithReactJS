import React, {useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { motion, useAnimation } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Banner from '../components/Banner';
import CategoryCard from '../components/CategoryCard';
import ArticleCard from '../components/ArticleCard';
import NewsFeature3D from '../components/NewsFeature3D';
import NewsFeature3Ds from '../components/CyberWorld3d';
import HScroll from '../components/HScroll';
import { getLatestNews, getFeaturedNews, getNews } from '../tools/newsService';
// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const HomePage = () => {
    const categoriesSectionRef = useRef(null);
    const newsSectionRef = useRef(null);
    const titleRef = useRef(null);
    const categoryCardsRef = useRef([]);
    const newsCardsRef = useRef([]);
    const controls = useAnimation();
    const [latestNews, setLatestNews] = useState([]);
    const [featuredNews, setFeaturedNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
 
    useEffect(() => {
        fetchData();
        // Initialize animations when component mounts
        initAnimations();

        // Setup scroll trigger for various sections
        setupScrollTriggers();

        return () => {
            // Clean up all scroll triggers when component unmounts
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch latest news (limit to 6 for homepage)
            const newsData = await getLatestNews(6);
            setLatestNews(newsData || []);

            // Fetch featured news
            try {
                const featured = await getFeaturedNews();
                if (featured && featured.length > 0) {
                    setFeaturedNews(featured[0]);
                }
            } catch (featuredError) {
                console.log('No featured news available, using latest news');
                if (newsData && newsData.length > 0) {
                    setFeaturedNews(newsData[0]);
                }
            }

            setError(null);
        } catch (err) {
            console.error('Error fetching homepage data:', err);
            setError('Failed to load news data');

            // Set fallback data
            setLatestNews([]);
            setFeaturedNews(null);
        } finally {
            setLoading(false);
        }
    };

    const initAnimations = () => {
        // Animate the section title with a writing effect
        if (titleRef.current) {
            const text = titleRef.current;
            const textContent = text.textContent;
            text.innerHTML = '';

            // Create wrapper for text animation
            const wrapper = document.createElement('span');
            wrapper.className = 'text-wrapper';

            // Create cursor element
            const cursor = document.createElement('span');
            cursor.className = 'cursor';
            cursor.innerHTML = '|';

            text.appendChild(wrapper);
            text.appendChild(cursor);

            // Split text into characters
            Array.from(textContent).forEach((char, i) => {
                const span = document.createElement('span');
                span.className = 'letter';
                span.innerHTML = char === ' ' ? '&nbsp;' : char;
                span.style.opacity = '0';
                wrapper.appendChild(span);
            });

            // Animate cursor blinking
            gsap.to(cursor, {
                opacity: 0,
                repeat: -1,
                yoyo: true,
                duration: 0.8,
                ease: 'power2.inOut'
            });

            // Animate each letter typing effect
            gsap.to(wrapper.querySelectorAll('.letter'), {
                opacity: 1,
                stagger: 0.08,
                duration: 0.1,
                delay: 0.5,
                onComplete: () => {
                    // Hide cursor after typing is complete
                    gsap.to(cursor, {
                        opacity: 0,
                        duration: 0.3,
                        delay: 1
                    });
                }
            });
        }

        // Initial setup for category cards - make them invisible
        if (categoryCardsRef.current.length > 0) {
            gsap.set(categoryCardsRef.current, {
                y: 80,
                opacity: 0,
                scale: 0.9
            });
        }

        // Initial setup for news cards - make them invisible
        if (newsCardsRef.current.length > 0) {
            gsap.set(newsCardsRef.current, {
                x: -100,
                opacity: 0,
                rotationY: -15
            });
        }
    };

    const setupScrollTriggers = () => {
        // Animation for category cards with better timing
        if (categoriesSectionRef.current && categoryCardsRef.current.length > 0) {
            gsap.to(categoryCardsRef.current, {
                y: 0,
                opacity: 1,
                scale: 1,
                stagger: {
                    amount: 0.6,
                    from: "start"
                },
                duration: 0.8,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: categoriesSectionRef.current,
                    start: "top 75%",
                    end: "bottom 25%",
                    toggleActions: "play none none reverse",
                    onEnter: () => {
                        // Add extra bounce effect on enter
                        gsap.to(categoryCardsRef.current, {
                            scale: 1.02,
                            duration: 0.3,
                            yoyo: true,
                            repeat: 1,
                            ease: "power2.inOut",
                            stagger: 0.1
                        });
                    }
                }
            });
        }

        // Enhanced Animation for news cards
        if (newsSectionRef.current && newsCardsRef.current.length > 0) {
            gsap.to(newsCardsRef.current, {
                x: 0,
                opacity: 1,
                rotationY: 0,
                stagger: {
                    amount: 0.4,
                    from: "start"
                },
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: newsSectionRef.current,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse",
                    onEnter: () => {
                        // Add extra glow effect on enter
                        gsap.to(newsCardsRef.current, {
                            boxShadow: "0 20px 40px rgba(58, 134, 255, 0.3)",
                            duration: 0.5,
                            stagger: 0.1
                        });
                    }
                }
            });
        }
    };

    const categories = [
        {
            id: 1,
            title: "Breaking News",
            description: "Daily Top CyberCrime Breaking News from India and around the World",
            color: "#FF5A5F",
            path: "/breaking-news"
        },
        {
            id: 2,
            title: "Cyber Crime",
            description: "Explore cyber fraud, hacking, scams, and digital threats. Learn cybersecurity measures and legal actions to protect against online crime.",
            color: "#3A86FF",
            path: "/cyber-crime"
        },
        {
            id: 3,
            title: "Corruption",
            description: "Stay updated on corruption scandals, bribery cases, government fraud, and anti-corruption drives that impact governance, transparency, and accountability.",
            color: "#8338EC",
            path: "/corruption"
        },
        {
            id: 4,
            title: "Tech Talk",
            description: "Discover emerging technologies, AI innovations, cybersecurity trends, and digital advancements shaping the future.",
            color: "#06D6A0",
            path: "/tech-talk"
        },
        {
            id: 5,
            title: "Fact Check",
            description: "Debunk misinformation, fake news, and misleading narratives with verified facts, ensuring accurate and trustworthy information.",
            color: "#FB5607",
            path: "/fact-check"
        },
        {
            id: 6,
            title: "Podcast",
            description: "Listen to expert discussions on cybersecurity, technology trends, and digital awareness.",
            color: "#FFBE0B",
            path: "/podcast"
        }
    ];

   /* const latestNews = [
        {
            id: 1,
            title: "Major Data Breach Affects Millions",
            excerpt: "A recent data breach has exposed personal information of millions of users across multiple platforms. Security experts are investigating the incident and recommending immediate security measures.",
            date: "June 15, 2023",
            color: "#FF5A5F"
        },
        {
            id: 2,
            title: "New Ransomware Strain Targets Healthcare",
            excerpt: "Security researchers have identified a new ransomware variant specifically targeting healthcare institutions, causing widespread disruption to medical services.",
            date: "June 12, 2023",
            color: "#3A86FF"
        },
        {
            id: 3,
            title: "AI-Powered Cyber Defense Solutions",
            excerpt: "Revolutionary artificial intelligence systems are being deployed to combat sophisticated cyber threats, marking a new era in cybersecurity protection.",
            date: "June 10, 2023",
            color: "#06D6A0"
        }
    ];*/
    const getColorForCategory = (category) => {
        const categoryMap = {
            'breaking-news': '#FF5A5F',
            'cyber-crime': '#3A86FF',
            'corruption': '#8338EC',
            'tech-talk': '#06D6A0',
            'fact-check': '#FB5607',
            'podcast': '#FFBE0B'
        };
        return categoryMap[category?.toLowerCase()] || '#3A86FF';
    };

   /* if (loading) {
        return (
            <HomeContainer>
                <Navbar />
                <LoadingContainer>
                    <LoadingSpinner />
                    <LoadingText>Loading latest news...</LoadingText>
                </LoadingContainer>
                <Footer />
            </HomeContainer>
        );
    }*/
    return (
        <HomeContainer>
            <Navbar />
            <Banner />

            <MainContent>
                <CategoriesSection ref={categoriesSectionRef}>
                    <SectionTitle 
                       
                    >
                        Explore CyberHorizon
                    </SectionTitle>

                    <CategoryGrid>
                        {categories.map((category, index) => (
                            <CategoryCardWrapper
                                key={category.id}
                                ref={el => categoryCardsRef.current[index] = el}
                                className="category-card"
                                whileHover={{
                                    scale: 1.05,
                                    y: -10,
                                    transition: { duration: 0.3 }
                                }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <CategoryCard
                                    title={category.title}
                                    description={category.description}
                                    color={category.color}
                                    path={category.path}
                                />
                            </CategoryCardWrapper>
                        ))}
                    </CategoryGrid>
                </CategoriesSection>

                <NewsSection ref={newsSectionRef}>
                    <NewsSectionTitle>Latest News</NewsSectionTitle>
                    <NewsGrid>
                        {latestNews.map((article, index) => (
                            <NewsCardWrapper
                                key={article.id}
                                ref={el => newsCardsRef.current[index] = el}
                                className="news-card"
                                whileHover={{
                                    scale: 1.03,
                                    y: -8,
                                    transition: { duration: 0.3, ease: "easeOut" }
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <ArticleCard
                                    id={article.id}
                                    title={article.title}
                                    excerpt={article.content}
                                    content={article.content}
                                    date={article.published_date}
                                    author={article.author}
                                    category={article.category}
                                    image={article.image}
                                    color={getColorForCategory(article.category)}
                                />
                               {/* <NewsCard color={article.color}>
                                    <NewsCardGlow color={article.color} />
                                    <NewsCardContent>
                                        <NewsCardDate>{article.date}</NewsCardDate>
                                        <NewsCardTitle>{article.title}</NewsCardTitle>
                                        <NewsCardExcerpt>{article.excerpt}</NewsCardExcerpt>
                                        <ReadMoreButton
                                            whileHover={{ x: 5 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            Read More →
                                        </ReadMoreButton>
                                    </NewsCardContent>
                                </NewsCard>*/}
                            </NewsCardWrapper>
                        ))}
                    </NewsGrid>
                    <ViewAllButton
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 10px 30px rgba(58, 134, 255, 0.4)"
                        }}
                        whileTap={{ scale: 0.95 }}
                    >
                        View All News
                    </ViewAllButton>
                </NewsSection>
                <NewsFeature3Ds />
                <HScroll />
                {/*<HScroll />*/}
              {/*  <FeaturedSection>
                    <FeaturedContent>
                        <FeaturedTextContent>
                            <FeaturedLabel>Featured</FeaturedLabel>
                            <FeaturedTitle>Cybersecurity in the Age of AI</FeaturedTitle>
                            <FeaturedDescription>
                                Explore how artificial intelligence is transforming the cybersecurity landscape,
                                creating both new threats and innovative defense mechanisms.
                            </FeaturedDescription>
                            <FeaturedButton
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Read Full Article
                            </FeaturedButton>
                        </FeaturedTextContent>
                        <FeaturedImageWrapper>
                            <FeaturedImage src="https://via.placeholder.com/600x400" alt="Cybersecurity and AI" />
                            <FeaturedImageGlow />
                        </FeaturedImageWrapper>
                    </FeaturedContent>
                </FeaturedSection>*/}
                
                {featuredNews && (
                    <FeaturedSection>
                        <FeaturedContent>
                            <FeaturedTextContent>
                                <FeaturedLabel>Featured</FeaturedLabel>
                                <FeaturedTitle>{featuredNews.title}</FeaturedTitle>
                                <FeaturedDescription>
                                    {featuredNews.content ?
                                        featuredNews.content.substring(0, 200) + '...' :
                                        'Explore the latest developments in cybersecurity and technology.'
                                    }
                                </FeaturedDescription>
                                <FeaturedButton
                                    as={Link}
                                    to={`/article/${featuredNews.id}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Read Full Article
                                </FeaturedButton>
                            </FeaturedTextContent>
                            <FeaturedImageWrapper>
                                <FeaturedImage
                                    src={featuredNews.image ?
                                        (featuredNews.image.data ?
                                            `data:image/jpeg;base64,${btoa(new Uint8Array(featuredNews.image.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))}` :
                                            featuredNews.image
                                        ) :
                                        "https://via.placeholder.com/600x400/1a1a1a/ffffff?text=Featured+Article"
                                    }
                                    alt={featuredNews.title}
                                />
                                <FeaturedImageGlow />
                            </FeaturedImageWrapper>
                        </FeaturedContent>
                    </FeaturedSection>
                )}
            </MainContent>

            <Footer />
        </HomeContainer>
    );
};

const HomeContainer = styled.div`
  background-color: #0a0a0a;
  color: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  position: relative;
  z-index: 2;
`;

const CategoriesSection = styled.section`
  padding: 6rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  
  .text-wrapper {
    position: relative;
    display: inline-block;
  }
  
  .letter {
    display: inline-block;
    opacity: 0;
    transition: all 0.3s ease;
  }
  
  .cursor {
    display: inline-block;
    position: relative;
    margin-left: 0.1em;
    color: #3A86FF;
    font-weight: 700;
    animation: blink 1.5s infinite;
  }
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`;

const SectionTitle = styled(motion.h2)`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 4rem;
  text-align: center;
  background: linear-gradient(135deg, #ffffff, #3A86FF, #8338EC);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 200%;
  animation: gradientShift 3s ease-in-out infinite;
  position: relative;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(58, 134, 255, 0.1), rgba(131, 56, 236, 0.1));
    border-radius: 12px;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
    transform: scale(1.1);
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  &:hover {
    transform: translateY(-5px);
    transition: transform 0.3s ease;
    text-shadow: 0 10px 20px rgba(58, 134, 255, 0.3);
  }
  
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 3rem;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const CategoryCardWrapper = styled(motion.div)`
  position: relative;
  cursor: pointer;
  transform-origin: center;
  will-change: transform;
  
  &:hover {
    z-index: 10;
  }
  
  /* Add a subtle glow effect on hover */
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, transparent, rgba(58, 134, 255, 0.3), transparent);
    border-radius: 16px;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const NewsSection = styled.section`
  padding: 6rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  background: linear-gradient(135deg, rgba(58, 134, 255, 0.05), rgba(131, 56, 236, 0.05));
  border-radius: 20px;
  margin: 2rem auto;
`;

const NewsSectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 3rem;
  text-align: center;
  background: linear-gradient(135deg, #ffffff, #3A86FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: linear-gradient(90deg, #3A86FF, #8338EC);
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const NewsCardWrapper = styled(motion.div)`
  position: relative;
  cursor: pointer;
  will-change: transform;
`;

const NewsCard = styled.div`
  background: linear-gradient(135deg, rgba(20, 20, 30, 0.8), rgba(40, 40, 50, 0.6));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  min-height: 280px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => `linear-gradient(90deg, ${props.color}, transparent)`};
  }
  
  &:hover {
    border-color: ${props => props.color};
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
`;

const NewsCardGlow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => `radial-gradient(circle at top left, ${props.color}20, transparent)`};
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${NewsCard}:hover & {
    opacity: 1;
  }
`;

const NewsCardContent = styled.div`
  padding: 2rem;
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const NewsCardDate = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const NewsCardTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.3;
  color: #ffffff;
`;

const NewsCardExcerpt = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

const ReadMoreButton = styled(motion.span)`
  color: #3A86FF;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  transition: color 0.3s ease;
  
  &:hover {
    color: #8338EC;
  }
`;

const ViewAllButton = styled(motion.button)`
  background: linear-gradient(90deg, #3A86FF, #8338EC);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const FeaturedSection = styled.section`
  padding: 6rem 0;
  background: linear-gradient(to right, #0a0a0a, #121218, #0a0a0a);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(58, 134, 255, 0.5), transparent);
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(58, 134, 255, 0.5), transparent);
  }
`;

const FeaturedContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const FeaturedTextContent = styled.div`
  @media (max-width: 1024px) {
    order: 2;
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

const FeaturedTitle = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const FeaturedDescription = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
`;

const FeaturedButton = styled(motion.button)`
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

const FeaturedImageWrapper = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  
  @media (max-width: 1024px) {
    order: 1;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const FeaturedImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  border-radius: 16px;
  transition: transform 0.5s ease;
  
  ${FeaturedImageWrapper}:hover & {
    transform: scale(1.05);
  }
`;

const FeaturedImageGlow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(58, 134, 255, 0.2), rgba(131, 56, 236, 0.2));
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s ease;
  
  ${FeaturedImageWrapper}:hover & {
    opacity: 1;
  }
`;

export default HomePage;