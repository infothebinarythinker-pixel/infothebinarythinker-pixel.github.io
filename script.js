// Performance: Defer non-critical JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
    }, 500);
    
    // Animated counters
    const counters = document.querySelectorAll('.stat-number');
    const animateCounter = (counter) => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = current.toFixed(target % 1 !== 0 ? 2 : 0);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        updateCounter();
    };
    
    // Intersection Observer for counters
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
    
    // Load blog posts
    loadBlogPosts();
    
    // EmailJS Configuration
    // Replace with your actual EmailJS credentials
    if (typeof emailjs !== 'undefined') {
        emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your public key
    }
    
    // Contact form with spam protection
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Honeypot check
            if (this.website.value !== '') {
                console.log('Spam detected');
                return;
            }
            
            const submitBtn = this.querySelector('button');
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            emailjs.sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", this)
                .then(function() {
                    alert("Message sent successfully!");
                    contactForm.reset();
                    submitBtn.textContent = 'Send Message';
                    submitBtn.disabled = false;
                }, function(error) {
                    alert("Failed to send message. Please try again.");
                    console.error('EmailJS error:', error);
                    submitBtn.textContent = 'Send Message';
                    submitBtn.disabled = false;
                });
        });
    }
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Blog Posts Management
function loadBlogPosts() {
    const blogContainer = document.getElementById('blog-posts');
    if (!blogContainer) return;
    
    // Load posts from localStorage (in production, this would be from a JSON file or API)
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    
    if (posts.length === 0) {
        blogContainer.innerHTML = '<p style="color: #666;">No posts yet. Check back soon!</p>';
        return;
    }
    
    // Show only latest 3 posts on homepage
    const latestPosts = posts.slice(0, 3);
    
    blogContainer.innerHTML = latestPosts.map(post => `
        <div class="blog-card">
            <h3>${escapeHtml(post.title)}</h3>
            <div class="blog-meta">${formatDate(post.date)}</div>
            <p>${escapeHtml(post.excerpt || post.content.substring(0, 150))}...</p>
            <a href="post.html?id=${post.id}" class="btn" style="margin-top: 10px;">Read More</a>
        </div>
    `).join('');
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Service Worker for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('ServiceWorker registration failed:', err);
        });
    });
}
