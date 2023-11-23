export const scrollToTop = () => {
    // Check if the scroll position is not at the top
    if (window.scrollY > 0) {
        // Scroll to the top with smooth behavior
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};