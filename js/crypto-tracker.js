// Kripto Para Takip Aracı
document.addEventListener('DOMContentLoaded', function() {
    // Kripto para widget'ı için container kontrolü
    const cryptoContainer = document.getElementById('crypto-widget');
    if (!cryptoContainer) return;

    // Kripto para listesi
    const cryptoList = [
        { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
        { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
        { id: 'binancecoin', symbol: 'BNB', name: 'Binance Coin' },
        { id: 'ripple', symbol: 'XRP', name: 'Ripple' },
        { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
        { id: 'solana', symbol: 'SOL', name: 'Solana' }
    ];
    
    // CSS simgeleri için stil ekle
    if (!document.getElementById('crypto-icons-css')) {
        const link = document.createElement('link');
        link.id = 'crypto-icons-css';
        link.rel = 'stylesheet';
        link.href = 'css/crypto-icons.css';
        document.head.appendChild(link);
    }

    // Widget'ı başlat
    initCryptoWidget();
    
    // Gerçek zamanlı API entegrasyonu (varsa)
    if (window.realTimeAPI) {
        // Otomatik veri yenileme başlat
        window.realTimeAPI.startAutoRefresh(function(data) {
            if (data.crypto) {
                renderCryptoData(data.crypto);
            }
        });
    }

    // Kripto para widget'ını başlat
    function initCryptoWidget() {
        // Widget başlığı
        const header = document.createElement('div');
        header.className = 'crypto-widget-header';
        header.innerHTML = `
            <h3>Kripto Para Piyasası</h3>
            <div class="crypto-controls">
                <button id="refresh-crypto" class="refresh-btn">
                    <i class="fas fa-sync-alt"></i>
                </button>
                <select id="currency-selector">
                    <option value="usd">USD</option>
                    <option value="try" selected>TRY</option>
                    <option value="eur">EUR</option>
                </select>
            </div>
        `;
        cryptoContainer.appendChild(header);

        // Kripto para listesi container'ı
        const listContainer = document.createElement('div');
        listContainer.className = 'crypto-list';
        cryptoContainer.appendChild(listContainer);

        // Yükleniyor göstergesi
        const loader = document.createElement('div');
        loader.className = 'crypto-loader';
        loader.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Veriler yükleniyor...';
        listContainer.appendChild(loader);

        // Verileri yükle
        fetchCryptoData();

        // Yenile butonu
        document.getElementById('refresh-crypto').addEventListener('click', function() {
            this.classList.add('rotating');
            listContainer.innerHTML = '<div class="crypto-loader"><i class="fas fa-spinner fa-spin"></i> Veriler yükleniyor...</div>';
            fetchCryptoData().then(() => {
                this.classList.remove('rotating');
            });
        });

        // Para birimi değişikliği
        document.getElementById('currency-selector').addEventListener('change', function() {
            listContainer.innerHTML = '<div class="crypto-loader"><i class="fas fa-spinner fa-spin"></i> Veriler yükleniyor...</div>';
            fetchCryptoData();
        });
    }

    // Kripto para verilerini çek
    async function fetchCryptoData() {
        try {
            const currency = document.getElementById('currency-selector').value;
            
            // Gerçek zamanlı API'yi kullan (varsa)
            if (window.realTimeAPI) {
                const data = await window.realTimeAPI.getCryptoData(currency);
                renderCryptoData(data);
                return data;
            }
            
            // CoinGecko API'ye bağlan
            try {
                const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${cryptoList.map(c => c.id).join(',')}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`);
                
                if (response.ok) {
                    const data = await response.json();
                    renderCryptoData(data);
                    return data;
                } else {
                    throw new Error(`API yanıt hatası: ${response.status}`);
                }
            } catch (apiError) {
                console.warn('CoinGecko API hatası, demo veriler kullanılıyor:', apiError);
                // Demo veriler
                const data = generateDemoCryptoData(currency);
                renderCryptoData(data);
                return data;
            }
        } catch (error) {
            console.error('Kripto para verileri çekilirken hata oluştu:', error);
            document.querySelector('.crypto-list').innerHTML = `
                <div class="crypto-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Veriler yüklenirken bir hata oluştu.</p>
                </div>
            `;
            return null;
        }
    }

    // Demo kripto para verileri oluştur
    function generateDemoCryptoData(currency) {
        const currencySymbol = currency === 'try' ? '₺' : currency === 'eur' ? '€' : '$';
        const multiplier = currency === 'try' ? 37.8 : currency === 'eur' ? 0.92 : 1;
        
        return cryptoList.map(crypto => {
            const basePrice = crypto.id === 'bitcoin' ? 65000 : 
                             crypto.id === 'ethereum' ? 3200 : 
                             crypto.id === 'binancecoin' ? 580 : 
                             crypto.id === 'ripple' ? 0.55 : 
                             crypto.id === 'cardano' ? 0.45 : 
                             crypto.id === 'solana' ? 140 : 10;
            
            const randomFactor = 0.95 + (Math.random() * 0.1); // %5 rastgele değişim
            const price = basePrice * randomFactor * multiplier;
            const priceChange = (Math.random() * 10) - 5; // -5% ile +5% arası değişim
            
            return {
                id: crypto.id,
                symbol: crypto.symbol,
                name: crypto.name,
                image: `https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579`.replace('1/small/bitcoin', crypto.id),
                current_price: price,
                price_change_percentage_24h: priceChange,
                market_cap: price * (crypto.id === 'bitcoin' ? 19000000 : 
                                    crypto.id === 'ethereum' ? 120000000 : 
                                    crypto.id === 'binancecoin' ? 155000000 : 
                                    crypto.id === 'ripple' ? 45000000000 : 
                                    crypto.id === 'cardano' ? 35000000000 : 
                                    crypto.id === 'solana' ? 400000000 : 1000000000),
                currency: currency,
                currency_symbol: currencySymbol
            };
        });
    }

    // Kripto para verilerini görüntüle
    function renderCryptoData(data) {
        const listContainer = document.querySelector('.crypto-list');
        listContainer.innerHTML = '';
        
        data.forEach(crypto => {
            const cryptoCard = document.createElement('div');
            cryptoCard.className = `crypto-card ${crypto.price_change_percentage_24h >= 0 ? 'up' : 'down'}`;
            
            const currency = document.getElementById('currency-selector').value;
            const currencySymbol = currency === 'try' ? '₺' : currency === 'eur' ? '€' : '$';
            
            const priceFormatted = formatCurrency(crypto.current_price, currency);
            const marketCapFormatted = formatMarketCap(crypto.market_cap, currency);
            
            // Kripto para simgesi (gerçek resim veya CSS simgesi)
            let cryptoIconHtml = '';
            if (crypto.image && crypto.image.includes('http')) {
                // Gerçek resim varsa kullan
                cryptoIconHtml = `<img src="${crypto.image}" alt="${crypto.name}">`;
            } else {
                // CSS simgesi kullan
                cryptoIconHtml = `<div class="crypto-icon ${crypto.symbol.toLowerCase()}">${crypto.symbol.substring(0, 2)}</div>`;
            }
            
            cryptoCard.innerHTML = `
                <div class="crypto-icon-container">
                    ${cryptoIconHtml}
                </div>
                <div class="crypto-info">
                    <div class="crypto-name">
                        <h4>${crypto.name}</h4>
                        <span class="crypto-symbol">${crypto.symbol.toUpperCase()}</span>
                    </div>
                    <div class="crypto-price">
                        <p>${priceFormatted}</p>
                        <span class="price-change ${crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">
                            <i class="fas fa-caret-${crypto.price_change_percentage_24h >= 0 ? 'up' : 'down'}"></i>
                            ${Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                        </span>
                    </div>
                </div>
                <div class="crypto-details">
                    <div class="market-cap">
                        <span class="detail-label">Piyasa Değeri</span>
                        <span class="detail-value">${marketCapFormatted}</span>
                    </div>
                </div>
            `;
            
            listContainer.appendChild(cryptoCard);
        });
        
        // Son güncelleme zamanı
        const timestamp = document.createElement('div');
        timestamp.className = 'crypto-timestamp';
        timestamp.innerHTML = `<i class="fas fa-clock"></i> Son güncelleme: ${new Date().toLocaleTimeString('tr-TR')}`;
        listContainer.appendChild(timestamp);
    }

    // Para birimini formatla
    function formatCurrency(value, currency) {
        return new Intl.NumberFormat('tr-TR', { 
            style: 'currency', 
            currency: currency.toUpperCase(),
            maximumFractionDigits: value > 100 ? 0 : value > 1 ? 2 : 6
        }).format(value);
    }

    // Piyasa değerini formatla
    function formatMarketCap(value, currency) {
        const symbol = currency === 'try' ? '₺' : currency === 'eur' ? '€' : '$';
        
        if (value >= 1000000000000) {
            return `${symbol}${(value / 1000000000000).toFixed(2)} T`;
        } else if (value >= 1000000000) {
            return `${symbol}${(value / 1000000000).toFixed(2)} Milyar`;
        } else if (value >= 1000000) {
            return `${symbol}${(value / 1000000).toFixed(2)} Milyon`;
        } else {
            return formatCurrency(value, currency);
        }
    }
});
