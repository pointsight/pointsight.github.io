// Blog post recommendation system
document.addEventListener('DOMContentLoaded', function() {
    // Only run on blog post pages
    if (!document.querySelector('.post-body')) return;
    
    // Simple recommendation engine based on tags and categories
    const recommendationEngine = {
        // Sample post database - in a real implementation, this would come from a backend
        posts: [
            {
                id: 'samsung-mobile-analysis',
                title: 'Samsung Mobil Cihaz Satış Analizi',
                url: '/posts/samsung-mobile-analysis.html',
                image: '/images/samsung-analysis/samsung.jpg',
                tags: ['veri analizi', 'pazar araştırması', 'teknoloji'],
                category: 'Pazar Analizi'
            },
            {
                id: 'walmart-stock-analysis',
                title: 'Walmart Hisse Senedi Analizi',
                url: '/posts/walmart-stock-analysis.html',
                image: '/images/walmart.webp',
                tags: ['borsa', 'finans', 'hisse senedi'],
                category: 'Finans'
            },
            {
                id: 'reading-habits-analysis',
                title: 'Öğrencilerin Kitap Okuma Alışkanlıklarını Etkileyen Faktörlerin Analizi',
                url: '/posts/reading-habits-analysis.html',
                image: '/images/reading.jpg',
                tags: ['veri analizi', 'eğitim', 'araştırma'],
                category: 'Veri Analizi'
            },
            {
                id: 'stock-market-trends-2025',
                title: '2025 Borsa Trendleri',
                url: '/posts/stock-market-trends-2025.html',
                image: '/images/stock-market.jpg',
                tags: ['borsa', 'finans', 'tahmin'],
                category: 'Finans'
            }
        ],
        
        // Get current post ID from URL
        getCurrentPostId: function() {
            const path = window.location.pathname;
            const filename = path.substring(path.lastIndexOf('/') + 1);
            return filename.replace('.html', '');
        },
        
        // Get current post tags and category
        getCurrentPostMetadata: function() {
            const tags = [];
            document.querySelectorAll('.post-tags .tag').forEach(tag => {
                tags.push(tag.textContent.toLowerCase());
            });
            
            let category = '';
            const categoryElement = document.querySelector('.post-category');
            if (categoryElement) {
                category = categoryElement.textContent.trim().split(' ')[1]; // Remove emoji
            }
            
            return { tags, category };
        },
        
        // Calculate relevance score between current post and other posts
        calculateRelevance: function(currentPostId, currentMetadata) {
            const results = [];
            
            this.posts.forEach(post => {
                // Skip current post
                if (post.id === currentPostId) return;
                
                let score = 0;
                
                // Score based on matching tags
                currentMetadata.tags.forEach(tag => {
                    if (post.tags.includes(tag)) {
                        score += 2;
                    }
                });
                
                // Score based on matching category
                if (post.category === currentMetadata.category) {
                    score += 3;
                }
                
                results.push({
                    post: post,
                    score: score
                });
            });
            
            // Sort by relevance score (descending)
            return results.sort((a, b) => b.score - a.score);
        },
        
        // Get recommendations
        getRecommendations: function(count = 3) {
            const currentPostId = this.getCurrentPostId();
            const currentMetadata = this.getCurrentPostMetadata();
            
            const rankedPosts = this.calculateRelevance(currentPostId, currentMetadata);
            return rankedPosts.slice(0, count).map(item => item.post);
        },
        
        // Render recommendations
        renderRecommendations: function() {
            const recommendations = this.getRecommendations();
            if (recommendations.length === 0) return;
            
            // Create recommendations section
            const recommendationsSection = document.createElement('section');
            recommendationsSection.className = 'recommendations-section';
            
            const heading = document.createElement('h3');
            heading.textContent = 'Benzer İçerikler';
            heading.className = 'recommendations-heading';
            recommendationsSection.appendChild(heading);
            
            const recommendationsGrid = document.createElement('div');
            recommendationsGrid.className = 'recommendations-grid';
            
            // Create recommendation cards
            recommendations.forEach(post => {
                const card = document.createElement('div');
                card.className = 'recommendation-card';
                
                const imageLink = document.createElement('a');
                imageLink.href = post.url;
                
                const image = document.createElement('img');
                image.src = post.image;
                image.alt = post.title;
                imageLink.appendChild(image);
                
                const content = document.createElement('div');
                content.className = 'recommendation-content';
                
                const title = document.createElement('h4');
                const titleLink = document.createElement('a');
                titleLink.href = post.url;
                titleLink.textContent = post.title;
                title.appendChild(titleLink);
                
                const category = document.createElement('span');
                category.className = 'recommendation-category';
                category.textContent = post.category;
                
                content.appendChild(title);
                content.appendChild(category);
                
                card.appendChild(imageLink);
                card.appendChild(content);
                
                recommendationsGrid.appendChild(card);
            });
            
            recommendationsSection.appendChild(recommendationsGrid);
            
            // Add to page
            const postBody = document.querySelector('.post-body');
            if (postBody) {
                postBody.appendChild(recommendationsSection);
            }
        }
    };
    
    // Initialize recommendations
    recommendationEngine.renderRecommendations();
});
