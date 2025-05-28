import gsap from 'gsap';
import { ScrollTrigger as GsapScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(GsapScrollTrigger);

// Enhanced ScrollTrigger utility with additional functionality
export class ScrollTrigger {
    constructor() {
        this.triggers = [];
        this.initialized = false;
    }

    // Initialize ScrollTrigger with default settings
    init() {
        if (this.initialized) return;

        // Set defaults that apply to all ScrollTriggers
        GsapScrollTrigger.defaults({
            toggleActions: "play none none reverse",
            markers: false // Set to true for debugging
        });

        // Add a small delay to ensure DOM is fully loaded
        setTimeout(() => {
            this.refresh();
        }, 100);

        // Add event listeners for window resize
        window.addEventListener('resize', this.refresh.bind(this));

        this.initialized = true;
    }

    // Create a new scroll trigger animation
    create(params) {
        const trigger = GsapScrollTrigger.create(params);
        this.triggers.push(trigger);
        return trigger;
    }

    // Create a fade-in animation triggered by scroll
    fadeIn(element, options = {}) {
        if (!element) return null;

        const defaults = {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            start: "top 80%",
            end: "bottom 20%"
        };

        const config = { ...defaults, ...options };

        const animation = gsap.fromTo(element,
            { y: config.y, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: config.duration,
                ease: config.ease
            }
        );

        const trigger = this.create({
            trigger: element,
            start: config.start,
            end: config.end,
            animation: animation,
            toggleActions: config.toggleActions || "play none none reverse"
        });

        return trigger;
    }

    // Create a staggered animation for multiple elements
    stagger(elements, options = {}) {
        if (!elements || elements.length === 0) return null;

        const defaults = {
            y: 30,
            opacity: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "power2.out",
            start: "top 80%",
            end: "bottom 20%"
        };

        const config = { ...defaults, ...options };

        const animation = gsap.fromTo(elements,
            { y: config.y, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                stagger: config.stagger,
                duration: config.duration,
                ease: config.ease
            }
        );

        const trigger = this.create({
            trigger: elements[0].parentNode || elements[0],
            start: config.start,
            end: config.end,
            animation: animation,
            toggleActions: config.toggleActions || "play none none reverse"
        });

        return trigger;
    }

    // Create a parallax effect
    parallax(element, options = {}) {
        if (!element) return null;

        const defaults = {
            y: 100,
            ease: "none",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        };

        const config = { ...defaults, ...options };

        const animation = gsap.fromTo(element,
            { y: 0 },
            { y: -config.y, ease: config.ease }
        );

        const trigger = this.create({
            trigger: element,
            start: config.start,
            end: config.end,
            animation: animation,
            scrub: config.scrub
        });

        return trigger;
    }

    // Refresh all ScrollTrigger instances
    refresh() {
        GsapScrollTrigger.refresh();
    }

    // Kill all ScrollTrigger instances
    killAll() {
        GsapScrollTrigger.getAll().forEach(trigger => trigger.kill());
        this.triggers = [];
    }

    // Kill specific ScrollTrigger instance
    kill(trigger) {
        if (trigger) {
            trigger.kill();
            this.triggers = this.triggers.filter(t => t !== trigger);
        }
    }

    // Clean up all resources
    destroy() {
        this.killAll();
        window.removeEventListener('resize', this.refresh);
        this.initialized = false;
    }
}

// Export a singleton instance
const scrollTrigger = new ScrollTrigger();
export default scrollTrigger;