// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initializeDisclaimerModal();
    initializeNavigation();
    initializeDownloadButtons();
    initializeFAQ();
    initializeAnimations();
});

// Disclaimer Modal functionality
function initializeDisclaimerModal() {
    const modal = document.getElementById('disclaimerModal');
    const checkbox = document.getElementById('understood');
    const continueBtn = document.getElementById('continueBtn');

    // Add modal-open class to body
    document.body.classList.add('modal-open');

    // Enable/disable continue button based on checkbox
    checkbox.addEventListener('change', function() {
        continueBtn.disabled = !this.checked;
        if (this.checked) {
            continueBtn.classList.remove('disabled');
        } else {
            continueBtn.classList.add('disabled');
        }
    });

    // Continue button click
    continueBtn.addEventListener('click', function() {
        if (checkbox.checked) {
            modal.classList.add('hidden');
            document.body.classList.remove('modal-open');

            // Store that user has seen disclaimer
            localStorage.setItem('xenoDisclaimerSeen', 'true');
        }
    });

    // Check if user has already seen disclaimer
    if (localStorage.getItem('xenoDisclaimerSeen') === 'true') {
        modal.classList.add('hidden');
        document.body.classList.remove('modal-open');
    }
}

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Update active nav link
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });

    // Update active nav on scroll
    window.addEventListener('scroll', updateActiveNav);
}

function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Download functionality
function initializeDownloadButtons() {
    // Add loading states and analytics
    const downloadButtons = document.querySelectorAll('.download-btn');

    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            // Add loading state
            const originalText = this.innerHTML;
            this.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin">
                    <path d="M3 12h18M12 3v18"/>
                </svg>
                Preparing Download...
            `;
            this.style.pointerEvents = 'none';

            // Simulate download preparation
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.pointerEvents = 'auto';

                // Show download notification
                showDownloadNotification();
            }, 2000);
        });
    });
}

function downloadFile(platform) {
    const downloads = {
        windows: {
            url: 'https://github.com/xeno-executor/releases/download/v3.2.0/Xeno-v3.2.0.exe',
            filename: 'Xeno-v3.2.0.exe'
        }
    };

    const download = downloads[platform];
    if (download) {
        // Create temporary download link
        const a = document.createElement('a');
        a.href = download.url;
        a.download = download.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Track download
        trackDownload(platform);
    }
}

function showDownloadNotification() {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">✓</span>
            <span class="notification-text">Download started successfully!</span>
        </div>
    `;

    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #6b967e, #2c554c);
        color: white;
        padding: 16px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function trackDownload(platform) {
    // Simulate analytics tracking
    console.log(`Download tracked: ${platform} - ${new Date().toISOString()}`);

    // Update download counter in localStorage
    const downloads = JSON.parse(localStorage.getItem('downloadStats') || '{}');
    downloads[platform] = (downloads[platform] || 0) + 1;
    downloads.total = Object.values(downloads).reduce((a, b) => a + b, 0);
    localStorage.setItem('downloadStats', JSON.stringify(downloads));
}

// FAQ functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => toggleFAQ(question));
    });
}

function toggleFAQ(element) {
    const faqItem = element.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');

    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });

    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Animation functionality
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.download-card, .faq-item, .stat');
    animateElements.forEach(el => observer.observe(el));

    // Add animation CSS
    const style = document.createElement('style');
    style.textContent = `
        .download-card, .faq-item, .stat {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }

        .download-card.animate-in, .faq-item.animate-in, .stat.animate-in {
            opacity: 1;
            transform: translateY(0);
        }

        .animate-spin {
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .notification-icon {
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
        }
    `;
    document.head.appendChild(style);
}

// Typing animation for code
function initializeCodeAnimation() {
    const codeLines = document.querySelectorAll('.code-line');
    let delay = 0;

    codeLines.forEach((line, index) => {
        setTimeout(() => {
            line.style.opacity = '0';
            line.style.animation = 'typewriter 1s ease forwards';
        }, delay);
        delay += 200;
    });

    // Add typewriter CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes typewriter {
            from {
                width: 0;
                opacity: 1;
            }
            to {
                width: 100%;
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// Parallax effect for hero section
function initializeParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');

        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Easter egg - Konami code
function initializeEasterEgg() {
    let konamiCode = [];
    const sequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.keyCode);

        if (konamiCode.length > sequence.length) {
            konamiCode.shift();
        }

        if (JSON.stringify(konamiCode) === JSON.stringify(sequence)) {
            activateEasterEgg();
        }
    });
}

function activateEasterEgg() {
    // Add party mode
    document.body.style.animation = 'rainbow 2s infinite';

    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // Show easter egg message
    const message = document.createElement('div');
    message.innerHTML = '🎉 Party mode activated! 🎉';
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
        color: white;
        padding: 20px 40px;
        border-radius: 20px;
        font-size: 24px;
        font-weight: bold;
        z-index: 10000;
        animation: bounce 1s infinite;
    `;

    document.body.appendChild(message);

    setTimeout(() => {
        document.body.style.animation = '';
        document.body.removeChild(message);
    }, 5000);
}

// Initialize easter egg
initializeEasterEgg();

// Performance monitoring
function monitorPerformance() {
    // Monitor page load time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    });

    // Monitor scroll performance
    let ticking = false;

    function updateScrollPosition() {
        // Update scroll-dependent animations
        updateActiveNav();
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollPosition);
            ticking = true;
        }
    });
}

// Initialize performance monitoring
monitorPerformance();
