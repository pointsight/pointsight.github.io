document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Store in localStorage for demo purposes
            const contactMessage = {
                name,
                email,
                subject,
                message,
                date: new Date().toLocaleString('tr-TR')
            };
            
            const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
            messages.push(contactMessage);
            localStorage.setItem('contactMessages', JSON.stringify(messages));
            
            // Show success message
            alert('Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.');
            
            // Reset form
            contactForm.reset();
        });
    }
});
