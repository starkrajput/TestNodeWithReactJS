import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export const useAnimations = () => {
    const animationRefs = useRef({
        textReveal: [],
        fadeIn: [],
        slideUp: [],
        stagger: []
    });

    useEffect(() => {
        // Text reveal animation
        animationRefs.current.textReveal.forEach(element => {
            const text = element.textContent;
            const splitText = text.split('');

            element.textContent = '';

            splitText.forEach(char => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.opacity = '0';
                span.style.display = 'inline-block';
                element.appendChild(span);
            });

            const chars = element.querySelectorAll('span');

            gsap.to(chars, {
                opacity: 1,
                stagger: 0.03,
                duration: 0.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // Fade in animation
        animationRefs.current.fadeIn.forEach(element => {
            gsap.fromTo(element,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        // Slide up animation
        animationRefs.current.slideUp.forEach(element => {
            gsap.fromTo(element,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        // Stagger animation
        animationRefs.current.stagger.forEach(group => {
            const elements = group.querySelectorAll('.stagger-item');

            gsap.fromTo(elements,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.1,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: group,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        return () => {
            // Clean up ScrollTrigger instances
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return {
        textRevealRef: (el) => {
            if (el && !animationRefs.current.textReveal.includes(el)) {
                animationRefs.current.textReveal.push(el);
            }
        },
        fadeInRef: (el) => {
            if (el && !animationRefs.current.fadeIn.includes(el)) {
                animationRefs.current.fadeIn.push(el);
            }
        },
        slideUpRef: (el) => {
            if (el && !animationRefs.current.slideUp.includes(el)) {
                animationRefs.current.slideUp.push(el);
            }
        },
        staggerRef: (el) => {
            if (el && !animationRefs.current.stagger.includes(el)) {
                animationRefs.current.stagger.push(el);
            }
        }
    };
};