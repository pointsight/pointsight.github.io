// Enhanced comment system with localStorage persistence
document.addEventListener('DOMContentLoaded', function() {
    const commentForm = document.querySelector('.comment-form');
    const commentsList = document.querySelector('.comments-list');
    const commentCount = document.querySelector('.comment-count');
    const postId = window.location.pathname;

    // Load existing comments from localStorage
    function loadComments() {
        const comments = JSON.parse(localStorage.getItem(`comments-${postId}`) || '[]');
        commentsList.innerHTML = '';
        updateCommentCount(comments.length);
        
        if (comments.length === 0) {
            commentsList.innerHTML = `
                <div class="no-comments">
                    <i class="fas fa-comments"></i>
                    <p>Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
                </div>`;
            return;
        }
        
        comments.forEach(comment => {
            const commentElement = createCommentElement(comment);
            commentsList.appendChild(commentElement);
        });
    }

    // Update comment count display
    function updateCommentCount(count) {
        if (commentCount) {
            commentCount.textContent = count === 1 ? '1 yorum' : `${count} yorum`;
        }
    }

    // Save comments to localStorage
    function saveComments(comments) {
        localStorage.setItem(`comments-${postId}`, JSON.stringify(comments));
        updateCommentCount(comments.length);
    }

    // Create comment HTML element
    function createCommentElement(comment) {
        const div = document.createElement('div');
        div.className = 'comment';
        div.dataset.commentId = comment.id;
        
        const header = document.createElement('div');
        header.className = 'comment-header';
        
        const author = document.createElement('span');
        author.className = 'comment-author';
        author.innerHTML = `<i class="fas fa-user"></i>${comment.author}`;
        
        const date = document.createElement('span');
        date.className = 'comment-date';
        date.innerHTML = `<i class="far fa-clock"></i>${formatDate(comment.date)}`;
        
        const content = document.createElement('div');
        content.className = 'comment-content';
        content.textContent = comment.content;

        const actions = document.createElement('div');
        actions.className = 'comment-actions';
        
        const likeButton = document.createElement('button');
        likeButton.className = `action-button like-button ${comment.liked ? 'liked' : ''}`;
        likeButton.innerHTML = `
            <i class="fas fa-heart"></i>
            <span>${comment.likes || 0}</span>
        `;
        likeButton.onclick = () => handleLike(comment.id);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'action-button delete-button';
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Sil';
        deleteButton.onclick = () => showDeleteConfirmation(comment.id);
        
        actions.appendChild(likeButton);
        actions.appendChild(deleteButton);
        
        header.appendChild(author);
        header.appendChild(date);
        div.appendChild(header);
        div.appendChild(content);
        div.appendChild(actions);
        
        return div;
    }

    // Format date in Turkish locale
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Handle like button click
    function handleLike(commentId) {
        const comments = JSON.parse(localStorage.getItem(`comments-${postId}`) || '[]');
        const commentIndex = comments.findIndex(c => c.id === commentId);
        
        if (commentIndex !== -1) {
            const comment = comments[commentIndex];
            comment.liked = !comment.liked;
            comment.likes = (comment.likes || 0) + (comment.liked ? 1 : -1);
            
            comments[commentIndex] = comment;
            saveComments(comments);
            loadComments();
        }
    }

    // Show delete confirmation dialog
    function showDeleteConfirmation(commentId) {
        const overlay = document.createElement('div');
        overlay.className = 'dialog-overlay';
        overlay.innerHTML = `
            <div class="dialog">
                <div class="dialog-header">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3 class="dialog-title">Yorumu Sil</h3>
                </div>
                <div class="dialog-content">
                    Bu yorumu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                </div>
                <div class="dialog-actions">
                    <button class="dialog-button cancel">İptal</button>
                    <button class="dialog-button confirm">Sil</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        setTimeout(() => overlay.classList.add('active'), 10);

        const cancelButton = overlay.querySelector('.cancel');
        const confirmButton = overlay.querySelector('.confirm');

        cancelButton.onclick = () => {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 300);
        };

        confirmButton.onclick = () => {
            deleteComment(commentId);
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 300);
        };
    }

    // Delete comment
    function deleteComment(commentId) {
        const comments = JSON.parse(localStorage.getItem(`comments-${postId}`) || '[]');
        const filteredComments = comments.filter(c => c.id !== commentId);
        saveComments(filteredComments);
        loadComments();
        showSuccess('Yorum başarıyla silindi!');
    }

    // Handle form submission with animation
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = this.querySelector('input[name="name"]');
            const commentInput = this.querySelector('textarea[name="comment"]');
            const submitButton = this.querySelector('button[type="submit"]');
            
            if (!nameInput.value.trim() || !commentInput.value.trim()) {
                showError('Lütfen tüm alanları doldurun.');
                return;
            }
            
            // Disable form during submission
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
            
            const newComment = {
                id: Date.now().toString(),
                author: nameInput.value.trim(),
                content: commentInput.value.trim(),
                date: new Date().toISOString(),
                likes: 0,
                liked: false
            };
            
            // Simulate network delay for better UX
            setTimeout(() => {
                const comments = JSON.parse(localStorage.getItem(`comments-${postId}`) || '[]');
                comments.unshift(newComment); // Add new comment to the beginning
                
                saveComments(comments);
                loadComments();
                
                // Reset form with success message
                nameInput.value = '';
                commentInput.value = '';
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Yorum Gönder';
                
                showSuccess('Yorumunuz başarıyla eklendi!');
            }, 500);
        });
    }

    // Show error message
    function showError(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-error';
        alert.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        insertAlert(alert);
    }

    // Show success message
    function showSuccess(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success';
        alert.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        insertAlert(alert);
    }

    // Insert alert message
    function insertAlert(alert) {
        const container = document.querySelector('.comment-form-container');
        const form = document.querySelector('.comment-form');
        container.insertBefore(alert, form);
        
        // Remove alert after 3 seconds
        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 300);
        }, 3000);
    }

    // Initial load of comments
    loadComments();
});
