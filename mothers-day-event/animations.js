// Particle Animation
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('particles-container');
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-white/80', 'backdrop-blur-md', 'shadow-sm');
        } else {
            navbar.classList.remove('bg-white/80', 'backdrop-blur-md', 'shadow-sm');
        }
    });
});

function createParticle(container) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random size between 10px and 40px
    const size = Math.random() * 30 + 10;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random starting position
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    
    // Add particle to container
    container.appendChild(particle);
    
    // Animate particle using Web Animations API
    animateParticle(particle);
}

function animateParticle(particle) {
    const duration = Math.random() * 10000 + 10000; // 10s to 20s
    const xDistance = (Math.random() - 0.5) * 200;
    const yDistance = -Math.random() * 200 - 100; // Move upwards
    
    const animation = particle.animate([
        { transform: `translate(0, 0) scale(1)`, opacity: 0 },
        { transform: `translate(${xDistance * 0.2}px, ${yDistance * 0.2}px) scale(1.2)`, opacity: 0.6, offset: 0.2 },
        { transform: `translate(${xDistance * 0.8}px, ${yDistance * 0.8}px) scale(0.8)`, opacity: 0.6, offset: 0.8 },
        { transform: `translate(${xDistance}px, ${yDistance}px) scale(1)`, opacity: 0 }
    ], {
        duration: duration,
        easing: 'ease-in-out',
        iterations: 1
    });
    
    animation.onfinish = () => {
        // Reset position and animate again
        particle.style.left = `${Math.random() * window.innerWidth}px`;
        particle.style.top = `${Math.random() * window.innerHeight}px`;
        animateParticle(particle);
    };
}
