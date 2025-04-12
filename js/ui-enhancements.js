// UI İyileştirmeleri ve Kullanıcı Etkileşimi Özellikleri
document.addEventListener('DOMContentLoaded', function() {
    // Sayfa yükleme animasyonu
    const body = document.body;
    body.classList.add('loaded');
    
    // Yukarı çık butonu
    addScrollToTopButton();
    
    // Koyu/açık tema geçişi için yumuşak animasyon
    addThemeTransition();
    
    // Mobil menü iyileştirmeleri
    enhanceMobileMenu();
    
    // Sayfa içi bağlantılar için yumuşak kaydırma
    enhanceSmoothScrolling();
    
    // Bildirim sistemi
    initNotificationSystem();
    
    // Veri yenileme zamanlayıcısı
    addDataRefreshTimer();
    
    // Sayfa içi ipuçları
    addTooltips();
    
    // Kullanıcı tercihleri yönetimi
    initUserPreferences();
});

// Yukarı çık butonu
function addScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Yukarı çık');
    scrollBtn.setAttribute('title', 'Yukarı çık');
    document.body.appendChild(scrollBtn);
    
    // Butonu göster/gizle
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    // Tıklama olayı
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Stil ekle
    const style = document.createElement('style');
    style.textContent = `
        .scroll-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            border: none;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s, transform 0.3s;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .scroll-to-top.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .scroll-to-top:hover {
            background-color: var(--secondary-color);
        }
        
        @media (max-width: 768px) {
            .scroll-to-top {
                bottom: 20px;
                right: 20px;
                width: 36px;
                height: 36px;
            }
        }
    `;
    document.head.appendChild(style);
}

// Koyu/açık tema geçişi için yumuşak animasyon
function addThemeTransition() {
    const style = document.createElement('style');
    style.textContent = `
        html {
            transition: background-color 0.3s ease, color 0.3s ease;
        }
        
        * {
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// Mobil menü iyileştirmeleri
function enhanceMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!menuToggle || !navLinks) return;
    
    // Menü açıldığında sayfanın kaydırılmasını engelle
    menuToggle.addEventListener('click', function() {
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = '';
        } else {
            document.body.style.overflow = 'hidden';
        }
    });
    
    // Dışarı tıklandığında menüyü kapat
    document.addEventListener('click', function(e) {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
    
    // Mobil menü animasyonu iyileştirme
    const style = document.createElement('style');
    style.textContent = `
        .nav-links {
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        @media (max-width: 768px) {
            .nav-links {
                transform: translateY(-10px);
                opacity: 0;
                pointer-events: none;
            }
            
            .nav-links.active {
                transform: translateY(0);
                opacity: 1;
                pointer-events: auto;
            }
        }
    `;
    document.head.appendChild(style);
}

// Sayfa içi bağlantılar için yumuşak kaydırma
function enhanceSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Mobil menüyü kapat
                const navLinks = document.querySelector('.nav-links');
                const menuToggle = document.querySelector('.menu-toggle');
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
                
                // Header yüksekliğini hesapla
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;
                
                // Hedef elemana kaydır
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Bildirim sistemi
function initNotificationSystem() {
    // Bildirim container'ı
    const notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);
    
    // Stil ekle
    const style = document.createElement('style');
    style.textContent = `
        .notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 300px;
        }
        
        .notification {
            background-color: var(--background);
            color: var(--text-color);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            padding: 15px;
            display: flex;
            align-items: flex-start;
            gap: 10px;
            transform: translateX(120%);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .notification.show {
            transform: translateX(0);
            opacity: 1;
        }
        
        .notification-icon {
            font-size: 1.2rem;
            flex-shrink: 0;
        }
        
        .notification-content {
            flex-grow: 1;
        }
        
        .notification-title {
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .notification-message {
            font-size: 0.875rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: var(--light-text);
            cursor: pointer;
            font-size: 0.875rem;
            padding: 0;
            margin-left: 10px;
            align-self: flex-start;
        }
        
        .notification.info .notification-icon {
            color: var(--primary-color);
        }
        
        .notification.success .notification-icon {
            color: var(--success-color);
        }
        
        .notification.warning .notification-icon {
            color: var(--warning-color);
        }
        
        .notification.error .notification-icon {
            color: var(--error-color);
        }
    `;
    document.head.appendChild(style);
    
    // Bildirim gösterme fonksiyonu
    window.showNotification = function(title, message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let iconClass = 'fa-info-circle';
        if (type === 'success') iconClass = 'fa-check-circle';
        else if (type === 'warning') iconClass = 'fa-exclamation-triangle';
        else if (type === 'error') iconClass = 'fa-times-circle';
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" aria-label="Kapat">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        notificationContainer.appendChild(notification);
        
        // Animasyon için gecikme
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Otomatik kapatma
        const timeout = setTimeout(() => {
            closeNotification(notification);
        }, duration);
        
        // Kapatma butonu
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            clearTimeout(timeout);
            closeNotification(notification);
        });
        
        function closeNotification(notification) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    };
    
    // Örnek bildirim göster (sayfa yüklendikten 3 saniye sonra)
    setTimeout(() => {
        window.showNotification(
            'Hoş Geldiniz!',
            'PointSight web sitesine hoş geldiniz. Yeni özelliklerimizi keşfedin.',
            'info',
            5000
        );
    }, 3000);
}

// Veri yenileme zamanlayıcısı
function addDataRefreshTimer() {
    const dataContainers = document.querySelectorAll('.data-insights-section, .crypto-section, .calendar-section');
    if (dataContainers.length === 0) return;
    
    dataContainers.forEach(container => {
        const refreshTimer = document.createElement('div');
        refreshTimer.className = 'refresh-timer';
        container.appendChild(refreshTimer);
        
        // Zamanlayıcı çubuğu
        const timerBar = document.createElement('div');
        timerBar.className = 'timer-bar';
        refreshTimer.appendChild(timerBar);
        
        // Zamanlayıcı metni
        const timerText = document.createElement('div');
        timerText.className = 'timer-text';
        timerText.textContent = 'Veri güncelleniyor...';
        refreshTimer.appendChild(timerText);
        
        // Stil ekle
        const style = document.createElement('style');
        style.textContent = `
            .refresh-timer {
                position: absolute;
                bottom: 10px;
                right: 10px;
                background-color: var(--background);
                border-radius: 20px;
                box-shadow: var(--shadow);
                padding: 5px 10px;
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 0.75rem;
                color: var(--light-text);
                z-index: 10;
                opacity: 0.8;
                transition: opacity 0.3s;
            }
            
            .refresh-timer:hover {
                opacity: 1;
            }
            
            .timer-bar {
                width: 50px;
                height: 4px;
                background-color: var(--border-color);
                border-radius: 2px;
                overflow: hidden;
                position: relative;
            }
            
            .timer-bar::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                background-color: var(--primary-color);
                transform: translateX(-100%);
                animation: timer-progress 300s linear forwards;
            }
            
            @keyframes timer-progress {
                to {
                    transform: translateX(0);
                }
            }
            
            .timer-text {
                white-space: nowrap;
            }
            
            @media (max-width: 768px) {
                .refresh-timer {
                    bottom: 5px;
                    right: 5px;
                    font-size: 0.7rem;
                    padding: 3px 8px;
                }
                
                .timer-bar {
                    width: 40px;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Zamanlayıcıyı konumlandır
        container.style.position = 'relative';
    });
}

// Sayfa içi ipuçları
function addTooltips() {
    // İpucu eklenecek elementler
    const tooltipElements = [
        { selector: '.theme-toggle', text: 'Koyu/Açık tema geçişi' },
        { selector: '.search-toggle', text: 'Site içinde arama yapın' },
        { selector: '#refresh-crypto', text: 'Kripto verilerini yenile' },
        { selector: '.calendar-nav-btn', text: 'Önceki/Sonraki gün' },
        { selector: '.hero-buttons .primary-btn', text: 'Bizimle iletişime geçin' },
        { selector: '.hero-buttons .secondary-btn', text: 'Güncel piyasa verilerine göz atın' }
    ];
    
    // İpucu stillerini ekle
    const style = document.createElement('style');
    style.textContent = `
        [data-tooltip] {
            position: relative;
        }
        
        [data-tooltip]::after {
            content: attr(data-tooltip);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(-5px);
            background-color: var(--text-color);
            color: var(--background);
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 0.75rem;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s, transform 0.2s, visibility 0.2s;
            z-index: 1000;
            pointer-events: none;
        }
        
        [data-tooltip]:hover::after {
            opacity: 0.9;
            visibility: visible;
            transform: translateX(-50%) translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    // İpuçlarını ekle
    tooltipElements.forEach(item => {
        const elements = document.querySelectorAll(item.selector);
        elements.forEach(el => {
            el.setAttribute('data-tooltip', item.text);
        });
    });
}

// Kullanıcı tercihleri yönetimi
function initUserPreferences() {
    // Kullanıcı tercihleri
    const userPreferences = {
        theme: localStorage.getItem('theme') || 'light',
        fontSize: localStorage.getItem('fontSize') || 'medium',
        notifications: localStorage.getItem('notifications') !== 'false'
    };
    
    // Font boyutu kontrolü
    if (userPreferences.fontSize) {
        document.documentElement.setAttribute('data-font-size', userPreferences.fontSize);
        
        // Font boyutu stilleri
        const style = document.createElement('style');
        style.textContent = `
            [data-font-size="small"] {
                font-size: 14px;
            }
            
            [data-font-size="medium"] {
                font-size: 16px;
            }
            
            [data-font-size="large"] {
                font-size: 18px;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Bildirim kontrolü
    if (!userPreferences.notifications) {
        // Bildirimleri devre dışı bırak
        window.showNotification = function() {};
    }
}
