document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Floating Background Hearts --- */
    function createBackgroundHearts() {
        const bg = document.getElementById('hearts-bg');
        const heartCount = 25;

        for (let i = 0; i < heartCount; i++) {
            const heart = document.createElement('div');
            heart.classList.add('bg-heart');

            // Random properties
            const size = Math.random() * 20 + 10; // 10px to 30px
            const left = Math.random() * 100; // 0% to 100%
            const duration = Math.random() * 10 + 10; // 10s to 20s
            const delay = Math.random() * 15; // 0s to 15s

            heart.style.width = `${size}px`;
            heart.style.height = `${size}px`;
            heart.style.left = `${left}vw`;
            heart.style.animationDuration = `${duration}s`;
            heart.style.animationDelay = `${delay}s`;

            bg.appendChild(heart);
        }
    }
    createBackgroundHearts();

    /* --- 2. Scroll Animations (Intersection Observer) --- */
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-scale');

    // Set custom delays from data attributes
    animatedElements.forEach(el => {
        if (el.dataset.delay) {
            el.style.setProperty('--delay', el.dataset.delay);
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once animated in
                // observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    animatedElements.forEach(el => observer.observe(el));

    /* --- 3. Lightbox Gallery --- */
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.querySelector('.lightbox-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            lightboxImg.src = item.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    closeLightbox.addEventListener('click', closeLightboxHandler);
    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) {
            closeLightboxHandler();
        }
    });

    function closeLightboxHandler() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightboxHandler();
        }
    });

    /* --- 4. Interactive Heart (Click to spawn smaller hearts) --- */
    const mainHeart = document.getElementById('main-heart');
    const hiddenLoveMessage = document.getElementById('hidden-love-message');

    mainHeart.addEventListener('click', (e) => {
        const rect = mainHeart.getBoundingClientRect();
        // Spawning from center of the container
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        createMiniHearts(centerX, centerY);

        // Add a small extra bump animation to main heart
        mainHeart.style.transform = 'scale(1.2)';
        setTimeout(() => {
            mainHeart.style.transform = 'scale(1)';
        }, 200);

        // Show text 
        if (hiddenLoveMessage && !hiddenLoveMessage.classList.contains('show')) {
            hiddenLoveMessage.classList.add('show');
        }
    });

    function createMiniHearts(x, y) {
        const amount = 8;
        for (let i = 0; i < amount; i++) {
            const heart = document.createElement('div');
            heart.classList.add('mini-heart');
            document.body.appendChild(heart);

            // Random translations and rotations
            const tx = (Math.random() - 0.5) * 300; // -150px to 150px
            const ty = (Math.random() - 1) * 300;   // -300px to 0px
            const rot = (Math.random() - 0.5) * 180; // random rotation addition

            heart.style.left = `${x}px`;
            heart.style.top = `${y}px`;

            heart.style.setProperty('--tx', `${tx}px`);
            heart.style.setProperty('--ty', `${ty}px`);
            heart.style.setProperty('--rot', `${rot}deg`);

            heart.style.animation = `miniFloat 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`;

            setTimeout(() => {
                heart.remove();
            }, 1000);
        }
    }

    /* --- 5. Final Surprise Confetti --- */
    const celebrateBtn = document.getElementById('celebrate-btn');
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');

    let isCelebrating = false;
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * 10 + 10; // slightly larger
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 + 2;
            this.color = ['#ffffff', '#ff8fa3', '#ff4b72', '#ffeef2'][Math.floor(Math.random() * 4)];
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 5 - 2.5;
            this.type = Math.random() > 0.4 ? 'heart' : 'kiss'; // 60% hearts, 40% kiss emojis
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;
            if (this.y > canvas.height) {
                this.y = -this.size * 2;
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);

            if (this.type === 'heart') {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(-this.size / 2, 0, this.size / 2, Math.PI, 0, false);
                ctx.arc(this.size / 2, 0, this.size / 2, Math.PI, 0, false);
                ctx.lineTo(0, this.size);
                ctx.closePath();
                ctx.fill();
            } else {
                ctx.font = `${this.size * 2}px sans-serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText('😘', 0, 0);
            }

            ctx.restore();
        }
    }

    function startConfetti() {
        for (let i = 0; i < 150; i++) {
            particles.push(new Particle());
        }
        animateConfetti();
    }

    function animateConfetti() {
        if (!isCelebrating) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animateConfetti);
    }

    celebrateBtn.addEventListener('click', () => {
        if (!isCelebrating) {
            isCelebrating = true;
            celebrateBtn.textContent = "You're My Everything 💖";
            startConfetti();

            // Optional: Generate a massive burst of mini hearts from the button
            const rect = celebrateBtn.getBoundingClientRect();
            createMiniHearts(rect.left + rect.width / 2, rect.top + rect.height / 2);
            createMiniHearts(rect.left + rect.width / 2, rect.top + rect.height / 2);
            createMiniHearts(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
    });
});
