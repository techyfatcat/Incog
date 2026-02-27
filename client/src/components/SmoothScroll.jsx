import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';

export default function SmoothScroll({ children }) {
    const lenisRef = useRef(null);

    useEffect(() => {
        // Initialize Lenis
        const lenis = new Lenis({
            duration: 1.2, // Time in seconds for the scroll to complete
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Clean "out-expo" easing
            direction: 'vertical',
            gestureDirection: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1, // Adjust if scroll feels too fast/slow
            touchMultiplier: 2,
            infinite: false,
        });

        lenisRef.current = lenis;

        // The animation frame loop
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Handle Anchor Links (Internal page jumping)
        const handleAnchorClick = (e) => {
            const target = e.target.closest('a[href^="#"]');
            if (target) {
                e.preventDefault();
                const id = target.getAttribute('href');
                if (id === '#') return;
                const element = document.querySelector(id);
                if (element) {
                    lenis.scrollTo(element, { offset: -100 }); // Adjust offset for your fixed Navbar
                }
            }
        };

        document.addEventListener('click', handleAnchorClick);

        // Responsive update
        const resizeObserver = new ResizeObserver(() => {
            lenis.resize();
        });
        resizeObserver.observe(document.body);

        // Global exposure (optional: allows you to call lenis from other components)
        window.lenis = lenis;

        return () => {
            lenis.destroy();
            resizeObserver.disconnect();
            document.removeEventListener('click', handleAnchorClick);
            window.lenis = null;
        };
    }, []);

    return <>{children}</>;
}