// This is a simplified version of GSAP's ScrollSmoother for React
import gsap from 'gsap';

export class ScrollSmoother {
    static create(options = {}) {
        const defaults = {
            smooth: 1,
            effects: true,
            normalizeScroll: false,
            smoothTouch: 0.1
        };

        const settings = { ...defaults, ...options };

        // Create wrapper and content elements if they don't exist
        const body = document.body;
        let wrapper = document.querySelector('#smooth-wrapper');
        let content = document.querySelector('#smooth-content');

        if (!wrapper) {
            // Move all body children to a temporary fragment
            const fragment = document.createDocumentFragment();
            while (body.firstChild) {
                fragment.appendChild(body.firstChild);
            }

            // Create wrapper and content elements
            wrapper = document.createElement('div');
            wrapper.id = 'smooth-wrapper';
            wrapper.style.position = 'fixed';
            wrapper.style.top = '0';
            wrapper.style.left = '0';
            wrapper.style.width = '100%';
            wrapper.style.height = '100%';
            wrapper.style.overflow = 'hidden';

            content = document.createElement('div');
            content.id = 'smooth-content';
            content.style.transformOrigin = 'top center';

            // Append content to wrapper, and wrapper to body
            wrapper.appendChild(content);
            body.appendChild(wrapper);

            // Move all original body content to the content element
            content.appendChild(fragment);
        }

        // Set up smooth scrolling
        const smoother = {
            scrollTop: 0,
            setScrollTop: (value) => {
                smoother.scrollTop = value;
                gsap.to(window, {
                    scrollTo: { y: value, autoKill: false },
                    duration: settings.smooth,
                    overwrite: 'auto'
                });
            },
            refresh: () => {
                // Update content height to ensure proper scrolling
                const height = content.scrollHeight;
                body.style.height = height + 'px';
            },
            kill: () => {
                // Clean up
                window.removeEventListener('scroll', onScroll);
                window.removeEventListener('resize', onResize);

                // Move content back to body
                const fragment = document.createDocumentFragment();
                while (content.firstChild) {
                    fragment.appendChild(content.firstChild);
                }

                body.appendChild(fragment);
                body.removeChild(wrapper);
                body.style.height = '';

                gsap.ticker.remove(update);
            }
        };

        // Set initial height
        smoother.refresh();

        // Scroll handler
        const onScroll = () => {
            smoother.scrollTop = window.scrollY;
        };

        // Resize handler
        const onResize = () => {
            smoother.refresh();
        };

        // Update function for animation
        const update = () => {
            gsap.set(content, {
                y: -smoother.scrollTop * settings.smooth
            });
        };

        // Add event listeners
        window.addEventListener('scroll', onScroll);
        window.addEventListener('resize', onResize);

        // Add to GSAP ticker for smooth animation
        gsap.ticker.add(update);

        return smoother;
    }
}