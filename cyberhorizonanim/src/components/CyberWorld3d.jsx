import React, { useState, useEffect, useRef } from 'react';

const CyberHorizon3D = () => {
    const [activeCard, setActiveCard] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    const newsCards = [
        {
            title: "AI-Powered Threat Detection",
            description: "Revolutionary machine learning algorithms identifying cyber threats in real-time",
            category: "CYBERSECURITY",
            color: "#3A86FF",
            icon: "🛡️"
        },
        {
            title: "Quantum Encryption Breakthrough",
            description: "Next-generation quantum cryptography securing digital communications",
            category: "TECHNOLOGY",
            color: "#FF5A5F",
            icon: "⚡"
        },
        {
            title: "Zero-Trust Architecture",
            description: "Modern security framework revolutionizing enterprise protection",
            category: "SECURITY",
            color: "#8338EC",
            icon: "🔐"
        },
        {
            title: "Blockchain Security",
            description: "Decentralized security protocols transforming digital transactions",
            category: "BLOCKCHAIN",
            color: "#06D6A0",
            icon: "⛓️"
        }
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                setMousePosition({ x: x - 0.5, y: y - 0.5 });
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
            return () => container.removeEventListener('mousemove', handleMouseMove);
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveCard((prev) => (prev + 1) % newsCards.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [newsCards.length]);

    return (
        <div
            ref={containerRef}
            className={`cyber-horizon-container ${isVisible ? 'visible' : ''}`}
            style={{
                '--mouse-x': mousePosition.x,
                '--mouse-y': mousePosition.y
            }}
        >
            {/* Background Elements */}
            <div className="cyber-background">
                <div className="grid-overlay"></div>
                <div className="particle-field">
                    {[...Array(50)].map((_, i) => (
                        <div key={i} className="particle" style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 4}s`
                        }}></div>
                    ))}
                </div>
                <div className="neural-network">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="neural-line" style={{
                            transform: `rotate(${i * 18}deg)`,
                            animationDelay: `${i * 0.1}s`
                        }}></div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="cyber-content">
                <div className="cyber-header">
                    <div className="status-indicator">
                        <span className="status-dot"></span>
                        <span className="status-text">SYSTEM ACTIVE</span>
                    </div>
                    <h1 className="cyber-title">
                        <span className="title-main">CYBER</span>
                        <span className="title-accent">HORIZON</span>
                        <span className="title-sub">3.0</span>
                    </h1>
                    <p className="cyber-subtitle">
                        Next-Generation Cybersecurity Intelligence Platform
                    </p>
                </div>

                <div className="news-showcase">
                    <div className="showcase-header">
                        <h2>LIVE THREAT INTELLIGENCE</h2>
                        <div className="data-stream">
                            <span>DATA STREAMING...</span>
                            <div className="stream-bars">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="stream-bar" style={{ animationDelay: `${i * 0.1}s` }}></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="cards-container">
                        {newsCards.map((card, index) => (
                            <div
                                key={index}
                                className={`news-card ${index === activeCard ? 'active' : ''}`}
                                style={{ '--card-color': card.color }}
                                onClick={() => setActiveCard(index)}
                            >
                                <div className="card-inner">
                                    <div className="card-header">
                                        <span className="card-icon">{card.icon}</span>
                                        <span className="card-category">{card.category}</span>
                                    </div>
                                    <h3 className="card-title">{card.title}</h3>
                                    <p className="card-description">{card.description}</p>
                                    <div className="card-footer">
                                        <span className="card-status">ACTIVE</span>
                                        <div className="card-progress">
                                            <div className="progress-bar"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-glow"></div>
                            </div>
                        ))}
                    </div>

                    <div className="control-panel">
                        <div className="panel-stats">
                            <div className="stat-item">
                                <span className="stat-value">24/7</span>
                                <span className="stat-label">MONITORING</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">99.9%</span>
                                <span className="stat-label">UPTIME</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">∞</span>
                                <span className="stat-label">PROTECTION</span>
                            </div>
                        </div>
                        <button className="access-button">
                            <span>ACCESS SYSTEM</span>
                            <div className="button-glow"></div>
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .cyber-horizon-container {
          position: relative;
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 2000px;
          transform-style: preserve-3d;
          opacity: 0;
          transform: translateY(100px);
          transition: all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .cyber-horizon-container.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .cyber-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .grid-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(58, 134, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(58, 134, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: grid-move 20s linear infinite;
          transform: 
            rotateX(calc(var(--mouse-y) * 10deg))
            rotateY(calc(var(--mouse-x) * 10deg));
        }

        .particle-field {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: radial-gradient(circle, rgba(58, 134, 255, 1) 0%, transparent 70%);
          border-radius: 50%;
          animation: particle-float infinite linear;
        }

        .neural-network {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 800px;
          height: 800px;
          transform: translate(-50%, -50%);
        }

        .neural-line {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 400px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(131, 56, 236, 0.3), transparent);
          transform-origin: 0 50%;
          animation: neural-pulse 8s ease-in-out infinite;
        }

        .cyber-content {
          position: relative;
          z-index: 10;
          max-width: 1400px;
          width: 100%;
          padding: 2rem;
          transform: 
            rotateX(calc(var(--mouse-y) * -5deg))
            rotateY(calc(var(--mouse-x) * 5deg));
          transition: transform 0.1s ease-out;
        }

        .cyber-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .status-dot {
          width: 12px;
          height: 12px;
          background: #06D6A0;
          border-radius: 50%;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        .status-text {
          font-size: 0.9rem;
          color: #06D6A0;
          font-weight: 600;
          letter-spacing: 2px;
        }

        .cyber-title {
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 900;
          line-height: 1;
          margin-bottom: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .title-main {
          background: linear-gradient(135deg, #3A86FF, #8338EC);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 30px rgba(58, 134, 255, 0.5);
          animation: title-glow 3s ease-in-out infinite alternate;
        }

        .title-accent {
          background: linear-gradient(135deg, #FF5A5F, #FB5607);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 30px rgba(255, 90, 95, 0.5);
          animation: title-glow 3s ease-in-out infinite alternate-reverse;
        }

        .title-sub {
          font-size: 2rem;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 300;
        }

        .cyber-subtitle {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 300;
          letter-spacing: 1px;
        }

        .news-showcase {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 3rem;
          backdrop-filter: blur(20px);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .showcase-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .showcase-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 2px;
        }

        .data-stream {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .stream-bars {
          display: flex;
          gap: 2px;
        }

        .stream-bar {
          width: 3px;
          height: 20px;
          background: linear-gradient(to top, #3A86FF, #8338EC);
          border-radius: 2px;
          animation: stream-pulse 1s ease-in-out infinite;
        }

        .cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .news-card {
          position: relative;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2rem;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform-style: preserve-3d;
          overflow: hidden;
        }

        .news-card:hover {
          transform: translateY(-10px) rotateX(5deg);
          border-color: var(--card-color);
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.4),
            0 0 0 1px var(--card-color);
        }

        .news-card.active {
          transform: translateY(-15px) scale(1.02);
          border-color: var(--card-color);
          box-shadow: 
            0 30px 60px rgba(0, 0, 0, 0.5),
            0 0 30px color-mix(in srgb, var(--card-color) 30%, transparent);
        }

        .card-inner {
          position: relative;
          z-index: 2;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .card-icon {
          font-size: 2rem;
          filter: drop-shadow(0 0 10px var(--card-color));
        }

        .card-category {
          background: color-mix(in srgb, var(--card-color) 20%, transparent);
          color: var(--card-color);
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 1px;
          border: 1px solid color-mix(in srgb, var(--card-color) 30%, transparent);
        }

        .card-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        .card-description {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-status {
          color: var(--card-color);
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .card-progress {
          width: 60px;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-bar {
          width: 70%;
          height: 100%;
          background: linear-gradient(90deg, var(--card-color), color-mix(in srgb, var(--card-color) 50%, white));
          border-radius: 2px;
          animation: progress-flow 2s ease-in-out infinite;
        }

        .card-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--card-color) 10%, transparent), transparent);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .news-card.active .card-glow {
          opacity: 1;
        }

        .control-panel {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .panel-stats {
          display: flex;
          gap: 3rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #3A86FF, #8338EC);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-label {
          display: block;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
          letter-spacing: 1px;
          margin-top: 0.5rem;
        }

        .access-button {
          position: relative;
          background: linear-gradient(135deg, #3A86FF, #8338EC);
          border: none;
          padding: 1rem 2.5rem;
          border-radius: 50px;
          color: white;
          font-weight: 600;
          font-size: 1rem;
          letter-spacing: 1px;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .access-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(58, 134, 255, 0.4);
        }

        .button-glow {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .access-button:hover .button-glow {
          left: 100%;
        }

        /* Animations */
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        @keyframes particle-float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }

        @keyframes neural-pulse {
          0%, 100% { opacity: 0.2; transform: scaleX(0.5); }
          50% { opacity: 1; transform: scaleX(1); }
        }

        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }

        @keyframes title-glow {
          0% { text-shadow: 0 0 20px currentColor; }
          100% { text-shadow: 0 0 40px currentColor, 0 0 60px currentColor; }
        }

        @keyframes stream-pulse {
          0%, 100% { transform: scaleY(0.5); opacity: 0.5; }
          50% { transform: scaleY(1); opacity: 1; }
        }

        @keyframes progress-flow {
          0% { transform: translateX(-20px); }
          100% { transform: translateX(20px); }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .cyber-content {
            padding: 1.5rem;
          }
          
          .news-showcase {
            padding: 2rem;
          }
          
          .panel-stats {
            gap: 2rem;
          }
        }

        @media (max-width: 768px) {
          .cyber-horizon-container {
            min-height: auto;
            padding: 2rem 0;
          }
          
          .showcase-header {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }
          
          .cards-container {
            grid-template-columns: 1fr;
          }
          
          .control-panel {
            flex-direction: column;
            text-align: center;
          }
          
          .panel-stats {
            flex-wrap: wrap;
            justify-content: center;
            gap: 1.5rem;
          }
        }
      `}</style>
        </div>
    );
};

export default CyberHorizon3D;