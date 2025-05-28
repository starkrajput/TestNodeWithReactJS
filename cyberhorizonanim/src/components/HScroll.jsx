import React, { useState, useEffect } from 'react';

const NewsTickerComponent = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const newsData = [
        {
            id: 1,
            title: "Breaking: Revolutionary AI Technology Transforms Healthcare Industry",
            summary: "Scientists announce breakthrough in AI-powered medical diagnostics with 99% accuracy rate",
            image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
            category: "Technology",
            time: "2 hours ago"
        },
        {
            id: 2,
            title: "Global Climate Summit Reaches Historic Agreement",
            summary: "World leaders unite on ambitious carbon reduction targets for 2030",
            image: "https://images.unsplash.com/photo-1569163139394-de44cb4e4488?w=600&h=400&fit=crop",
            category: "Environment",
            time: "4 hours ago"
        },
        {
            id: 3,
            title: "Space Mission Discovers Water on Mars Surface",
            summary: "NASA rover finds evidence of liquid water beneath Martian ice caps",
            image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=600&h=400&fit=crop",
            category: "Space",
            time: "6 hours ago"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % newsData.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [newsData.length]);

    const getCategoryStyle = (category) => {
        const styles = {
            Technology: { backgroundColor: '#3B82F6' },
            Environment: { backgroundColor: '#10B981' },
            Space: { backgroundColor: '#8B5CF6' },
            Finance: { backgroundColor: '#F59E0B' },
            Energy: { backgroundColor: '#EF4444' }
        };
        return styles[category] || { backgroundColor: '#6B7280' };
    };

    const isMobile = windowWidth <= 768;

    return (
        <div style={{
            width: '100%',
            maxWidth: '100vw',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1e293b 0%, #7c3aed 50%, #1e293b 100%)',
            fontFamily: 'Arial, sans-serif',
            overflow: 'hidden',
            boxSizing: 'border-box',
            padding: '0',
            margin: '0'
        }}>

            {/* Header */}
            <div style={{
                textAlign: 'center',
                padding: isMobile ? '1.5rem 1rem' : '3rem 1rem',
                position: 'relative',
                zIndex: 10
            }}>
                <h1 style={{
                    fontSize: isMobile ? '2rem' : '3rem',
                    fontWeight: 'bold',
                    margin: '0 0 1rem 0',
                    background: 'linear-gradient(135deg, #60a5fa, #a855f7, #ec4899)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    Global News Network
                </h1>
                <div style={{
                    height: '4px',
                    width: isMobile ? '50vw' : '200px',
                    margin: '0 auto',
                    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                    borderRadius: '2px'
                }}></div>
            </div>

            {/* Main News Container */}
            <div style={{
                width: '100%',
                padding: isMobile ? '0 1rem 1.5rem' : '0 2rem 3rem',
                boxSizing: 'border-box'
            }}>
                <div style={{
                    width: '100%',
                    height: isMobile ? '350px' : '500px',
                    maxHeight: '60vh',
                    background: 'rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: isMobile ? '16px' : '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>

                    {/* News Items Container */}
                    <div style={{
                        position: 'relative',
                        width: `${newsData.length * 100}%`,
                        height: '100%',
                        display: 'flex',
                        transform: `translateX(-${currentIndex * (100 / newsData.length)}%)`,
                        transition: 'transform 1s cubic-bezier(0.4, 0.0, 0.2, 1)'
                    }}>
                        {newsData.map((news) => (
                            <div key={news.id} style={{
                                width: `${100 / newsData.length}%`,
                                height: '100%',
                                display: 'flex',
                                flexDirection: isMobile ? 'column' : 'row',
                                alignItems: 'center',
                                padding: isMobile ? '1rem' : '3rem',
                                gap: isMobile ? '1rem' : '3rem',
                                flexShrink: 0,
                                boxSizing: 'border-box'
                            }}>

                                {/* Image Section */}
                                <div style={{
                                    position: 'relative',
                                    flexShrink: 0,
                                    width: isMobile ? '90%' : '40%',
                                    maxWidth: isMobile ? '300px' : '400px',
                                    height: isMobile ? '40%' : '80%'
                                }}>
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: isMobile ? '12px' : '16px',
                                        overflow: 'hidden',
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                                        position: 'relative'
                                    }}>
                                        <img
                                            src={news.image}
                                            alt={news.title}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            height: '50%',
                                            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
                                        }}></div>
                                    </div>

                                    {/* Category Badge */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        right: '-8px',
                                        padding: isMobile ? '6px 12px' : '8px 16px',
                                        borderRadius: '20px',
                                        color: 'white',
                                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                                        fontWeight: 'bold',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        ...getCategoryStyle(news.category)
                                    }}>
                                        {news.category}
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div style={{
                                    flex: 1,
                                    color: 'white',
                                    textAlign: isMobile ? 'center' : 'left',
                                    width: isMobile ? '100%' : '60%',
                                    padding: isMobile ? '0' : '0 1rem'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: isMobile ? 'center' : 'flex-start',
                                        gap: isMobile ? '0.75rem' : '1.5rem',
                                        marginBottom: isMobile ? '0.75rem' : '1.5rem',
                                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                                        flexWrap: 'wrap'
                                    }}>
                                        <span style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            color: '#10b981'
                                        }}>
                                            <div style={{
                                                width: '8px',
                                                height: '8px',
                                                backgroundColor: '#10b981',
                                                borderRadius: '50%',
                                                animation: 'pulse 2s infinite'
                                            }}></div>
                                            LIVE
                                        </span>
                                        <span style={{ color: '#d1d5db' }}>{news.time}</span>
                                    </div>

                                    <h2 style={{
                                        fontSize: isMobile ? '1.25rem' : '2rem',
                                        fontWeight: 'bold',
                                        lineHeight: '1.2',
                                        marginBottom: isMobile ? '0.75rem' : '1.5rem'
                                    }}>
                                        {news.title}
                                    </h2>

                                    <p style={{
                                        fontSize: isMobile ? '0.875rem' : '1.25rem',
                                        color: '#d1d5db',
                                        lineHeight: '1.7',
                                        marginBottom: isMobile ? '1rem' : '2rem'
                                    }}>
                                        {news.summary}
                                    </p>

                                    <button style={{
                                        padding: isMobile ? '0.75rem 1.5rem' : '1rem 2rem',
                                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50px',
                                        fontSize: isMobile ? '0.875rem' : '1rem',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}>
                                        Read Full Story
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Progress Indicators */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: isMobile ? '0.5rem' : '1rem',
                marginBottom: isMobile ? '1.5rem' : '3rem',
                padding: '0 1rem'
            }}>
                {newsData.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        style={{
                            width: index === currentIndex ? (isMobile ? '32px' : '48px') : (isMobile ? '12px' : '16px'),
                            height: isMobile ? '12px' : '16px',
                            borderRadius: '8px',
                            border: 'none',
                            background: index === currentIndex
                                ? 'linear-gradient(90deg, #3b82f6, #8b5cf6)'
                                : 'rgba(255, 255, 255, 0.3)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    />
                ))}
            </div>

            {/* Bottom Ticker */}
            <div style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.5)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                overflow: 'hidden'
            }}>
                <div style={{
                    whiteSpace: 'nowrap',
                    padding: isMobile ? '0.75rem 0' : '1rem 0',
                    color: 'white',
                    fontSize: isMobile ? '0.875rem' : '1.125rem',
                    fontWeight: '500',
                    animation: 'scroll 30s linear infinite'
                }}>
                    <span style={{ padding: '0 2rem' }}>
                        🔴 BREAKING: Revolutionary discoveries changing the world •
                        🌍 Global markets reaching new heights •
                        🚀 Space exploration making history •
                    </span>
                </div>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes scroll {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
};

export default NewsTickerComponent;