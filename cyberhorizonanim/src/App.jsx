import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import HomePage from './pages/index';
import TemplatePage from './pages/template';
import './global.css';
import Login from './components/login';
import Admin from './components/admin';

import ArticleDetail from './components/article-detail';
// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// AnimatePresence wrapper component
const AnimatedRoutes = () => {
    const location = useLocation();

    useEffect(() => {
        // Scroll to top on route change
        window.scrollTo(0, 0);

        // Page transition effect
        const tl = gsap.timeline();

       
            tl.to('.page-transition', {
                duration: 0.5,
                scaleY: 1,
                transformOrigin: 'bottom',
                ease: 'power4.inOut'
            })
                .to('.page-transition', {
                    duration: 0.5,
                    scaleY: 0,
                    transformOrigin: 'top',
                    ease: 'power4.inOut',
                    delay: 0.2
                });

            // Refresh ScrollTrigger on route change
            ScrollTrigger.refresh();
        }, [location]);

        return (
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<TemplatePage title="About" />} />
                    <Route path="/breaking-news" element={<TemplatePage title="Breaking News" />} />
                    <Route path="/cyber-crime" element={<TemplatePage title="Cyber Crime" />} />
                    <Route path="/corruption" element={<TemplatePage title="Corruption" />} />
                    <Route path="/tech-talk" element={<TemplatePage title="Tech Talk" />} />
                    <Route path="/fact-check" element={<TemplatePage title="Fact Check" />} />
                    <Route path="/podcast" element={<TemplatePage title="Podcast" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/article/:id" element={<ArticleDetail />} />
                </Routes>
            </AnimatePresence>
        );
    };

    function App() {
        useEffect(() => {
            // Add page transition element
            if (!document.querySelector('.page-transition')) {
                const transitionElement = document.createElement('div');
                transitionElement.className = 'page-transition';
                document.body.appendChild(transitionElement);
            }

            return () => {
                // Clean up
                const transitionElement = document.querySelector('.page-transition');
                if (transitionElement) {
                    document.body.removeChild(transitionElement);
                }
            };
        }, []);

        return (
            <Router>
                <AnimatedRoutes />
            </Router>
        );
    }

    export default App;