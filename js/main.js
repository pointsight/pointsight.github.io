// Mobile menu functionality
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    let isMenuOpen = false;

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            
            // Toggle menu visibility
            navLinks.style.display = isMenuOpen ? 'flex' : 'none';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.backgroundColor = 'var(--background)';
            navLinks.style.padding = '1rem';
            navLinks.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            
            // Animate hamburger
            const bars = hamburger.querySelectorAll('.bar');
            bars[0].style.transform = isMenuOpen ? 'rotate(-45deg) translate(-5px, 6px)' : 'none';
            bars[1].style.opacity = isMenuOpen ? '0' : '1';
            bars[2].style.transform = isMenuOpen ? 'rotate(45deg) translate(-5px, -6px)' : 'none';
        });
    }

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            // Here you would typically send this to your backend
            console.log('Newsletter subscription:', email);
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.textContent = 'Thank you for subscribing!';
            successMessage.style.color = 'var(--success-color)';
            successMessage.style.marginTop = '1rem';
            
            emailInput.value = '';
            newsletterForm.appendChild(successMessage);
            
            // Remove success message after 3 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add shadow to header on scroll
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 0) {
                header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            } else {
                header.style.boxShadow = 'none';
            }
        });
    }

    // Initialize current year in footer
    const yearSpan = document.querySelector('.footer-bottom .year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

// Lazy loading for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// Form validation
const validateForm = (form) => {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'var(--error-color)';
            
            // Add error message
            let errorMessage = input.nextElementSibling;
            if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                errorMessage = document.createElement('div');
                errorMessage.classList.add('error-message');
                errorMessage.style.color = 'var(--error-color)';
                errorMessage.style.fontSize = '0.875rem';
                errorMessage.style.marginTop = '0.25rem';
                input.parentNode.insertBefore(errorMessage, input.nextSibling);
            }
            errorMessage.textContent = `${input.name} is required`;
        } else {
            input.style.borderColor = 'var(--border-color)';
            const errorMessage = input.nextElementSibling;
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.remove();
            }
        }
    });

    return isValid;
};

// Comment form handling
const commentForm = document.querySelector('.comment-form form');
if (commentForm) {
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm(commentForm)) {
            const name = commentForm.querySelector('#name').value;
            const email = commentForm.querySelector('#email').value;
            const comment = commentForm.querySelector('#comment').value;
            
            // Create new comment element
            const newComment = document.createElement('div');
            newComment.className = 'comment';
            newComment.innerHTML = `
                <div class="comment-avatar">
                    <img src="../images/avatar1.jpg" alt="User Avatar">
                </div>
                <div class="comment-content">
                    <div class="comment-header">
                        <h4>${name}</h4>
                        <span class="comment-date">Just now</span>
                    </div>
                    <p>${comment}</p>
                    <button class="reply-btn">Reply</button>
                </div>
            `;
            
            // Add the new comment to the comments section
            const commentsSection = document.querySelector('.post-comments');
            const commentFormContainer = commentsSection.querySelector('.comment-form');
            commentsSection.insertBefore(newComment, commentFormContainer);
            
            // Update comment count
            const commentsTitle = commentsSection.querySelector('h3');
            const currentCount = parseInt(commentsTitle.textContent.match(/\d+/)[0]);
            commentsTitle.textContent = `Comments (${currentCount + 1})`;
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.textContent = 'Comment posted successfully!';
            successMessage.style.color = 'var(--success-color)';
            successMessage.style.marginTop = '1rem';
            
            commentForm.reset();
            commentForm.appendChild(successMessage);
            
            // Remove success message after 3 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        }
    });
}
