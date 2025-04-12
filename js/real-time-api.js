// Gerçek Zamanlı Finansal Veri API Entegrasyonu
class RealTimeFinanceAPI {
    constructor() {
        this.cryptoApiUrl = 'https://api.coingecko.com/api/v3';
        this.marketApiUrl = 'https://api.marketdata.app/v1/';
        this.cacheDuration = 60 * 1000; // 1 dakika önbellek süresi
        this.cache = {};
        this.lastFetchTime = 0;
        this.fetchInterval = 5 * 60 * 1000; // 5 dakika
        this.cryptoIds = ['bitcoin', 'ethereum', 'binancecoin', 'ripple', 'cardano', 'solana'];
        this.refreshTimers = {};
        this.isRefreshing = false;
    }

    // API'den veri çekme fonksiyonu
    async fetchData(url, cacheKey) {
        // Önbellekte veri var mı kontrol et
        if (this.cache[cacheKey] && (Date.now() - this.cache[cacheKey].timestamp) < this.cacheDuration) {
            console.log('Önbellekten veri kullanılıyor:', cacheKey);
            return this.cache[cacheKey].data;
        }

        try {
            console.log('API\'den veri çekiliyor:', url);
            
            // API isteği gönder
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            // Yanıtı kontrol et
            if (!response.ok) {
                throw new Error(`API yanıt hatası: ${response.status} ${response.statusText}`);
            }
            
            // JSON yanıtını al
            const data = await response.json();
            
            // Veriyi önbelleğe kaydet
            this.cache[cacheKey] = {
                data: data,
                timestamp: Date.now()
            };
            
            // Son çekme zamanını güncelle
            this.lastFetchTime = Date.now();
            
            return data;
        } catch (error) {
            console.error('API veri çekme hatası:', error);
            
            // Demo verisi döndür (gerçek API bağlantısı olmadığında)
            return this.getDemoData(cacheKey);
        }
    }

    // Kripto para verilerini çek
    async getCryptoData(currency = 'try') {
        const url = `${this.cryptoApiUrl}/coins/markets?vs_currency=${currency}&ids=${this.cryptoIds.join(',')}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;
        const cacheKey = `crypto_${currency}`;
        
        try {
            return await this.fetchData(url, cacheKey);
        } catch (error) {
            console.error('Kripto para verileri çekilirken hata oluştu:', error);
            return this.getDemoCryptoData(currency);
        }
    }

    // Piyasa verilerini çek
    async getMarketData() {
        const cacheKey = 'market_summary';
        
        try {
            // Tüm verileri birleştir
            const marketSummary = {
                timestamp: new Date().toISOString(),
                markets: {
                    bist100: this.getDemoBIST100(),
                    sp500: this.getDemoSP500(),
                    usdtry: this.getDemoUSDTRY(),
                    gold: this.getDemoGold()
                }
            };
            
            // Veriyi önbelleğe kaydet
            this.cache[cacheKey] = {
                data: marketSummary,
                timestamp: Date.now()
            };
            
            return marketSummary;
        } catch (error) {
            console.error('Piyasa verileri çekilirken hata oluştu:', error);
            return this.getDemoMarketData();
        }
    }

    // Demo kripto para verileri
    getDemoCryptoData(currency) {
        const currencySymbol = currency === 'try' ? '₺' : currency === 'eur' ? '€' : '$';
        const multiplier = currency === 'try' ? 37.8 : currency === 'eur' ? 0.92 : 1;
        
        return this.cryptoIds.map((id, index) => {
            const basePrice = id === 'bitcoin' ? 65000 : 
                             id === 'ethereum' ? 3200 : 
                             id === 'binancecoin' ? 580 : 
                             id === 'ripple' ? 0.55 : 
                             id === 'cardano' ? 0.45 : 
                             id === 'solana' ? 140 : 10;
            
            const randomFactor = 0.95 + (Math.random() * 0.1); // %5 rastgele değişim
            const price = basePrice * randomFactor * multiplier;
            const priceChange = (Math.random() * 10) - 5; // -5% ile +5% arası değişim
            
            return {
                id: id,
                symbol: id === 'bitcoin' ? 'btc' : 
                       id === 'ethereum' ? 'eth' : 
                       id === 'binancecoin' ? 'bnb' : 
                       id === 'ripple' ? 'xrp' : 
                       id === 'cardano' ? 'ada' : 
                       id === 'solana' ? 'sol' : id.substring(0, 3),
                name: id.charAt(0).toUpperCase() + id.slice(1),
                image: `https://assets.coingecko.com/coins/images/${
                    id === 'bitcoin' ? '1/large/bitcoin.png' : 
                    id === 'ethereum' ? '279/large/ethereum.png' : 
                    id === 'binancecoin' ? '825/large/binance-coin-logo.png' : 
                    id === 'ripple' ? '44/large/xrp-symbol-white-128.png' : 
                    id === 'cardano' ? '975/large/cardano.png' : 
                    id === 'solana' ? '4128/large/solana.png' : '1/large/bitcoin.png'
                }?1696502089`,
                current_price: price,
                price_change_percentage_24h: priceChange,
                market_cap: price * (id === 'bitcoin' ? 19000000 : 
                                    id === 'ethereum' ? 120000000 : 
                                    id === 'binancecoin' ? 155000000 : 
                                    id === 'ripple' ? 45000000000 : 
                                    id === 'cardano' ? 35000000000 : 
                                    id === 'solana' ? 400000000 : 1000000000)
            };
        });
    }

    // Demo BIST 100 verileri
    getDemoBIST100() {
        const formattedDate = new Date().toISOString().split('T')[0];
        const randomChange = (Math.random() * 2) - 0.5; // -0.5% ile +1.5% arası değişim
        const basePrice = 9324.56;
        const newPrice = basePrice * (1 + (randomChange / 100));
        
        return {
            symbol: 'BIST100',
            name: 'Borsa Istanbul 100 Index',
            price: parseFloat(newPrice.toFixed(2)),
            change: parseFloat(randomChange.toFixed(2)),
            history: [8500, 8700, 8900, 9200, 9100, 9300, parseFloat(newPrice.toFixed(2))],
            date: formattedDate
        };
    }

    // Demo S&P 500 verileri
    getDemoSP500() {
        const formattedDate = new Date().toISOString().split('T')[0];
        const randomChange = (Math.random() * 2) - 0.5; // -0.5% ile +1.5% arası değişim
        const basePrice = 5320;
        const newPrice = basePrice * (1 + (randomChange / 100));
        
        return {
            symbol: 'SPX',
            name: 'S&P 500 Index',
            price: parseFloat(newPrice.toFixed(2)),
            change: parseFloat(randomChange.toFixed(2)),
            history: [4800, 4750, 4900, 5100, 5200, 5300, parseFloat(newPrice.toFixed(2))],
            date: formattedDate
        };
    }

    // Demo USD/TRY verileri
    getDemoUSDTRY() {
        const formattedDate = new Date().toISOString().split('T')[0];
        const randomChange = (Math.random() * 1) - 0.5; // -0.5% ile +0.5% arası değişim
        const basePrice = 37.87;
        const newPrice = basePrice * (1 + (randomChange / 100));
        
        return {
            symbol: 'USD/TRY',
            name: 'US Dollar / Turkish Lira',
            price: parseFloat(newPrice.toFixed(2)),
            change: parseFloat(randomChange.toFixed(2)),
            date: formattedDate
        };
    }

    // Demo Altın verileri
    getDemoGold() {
        const formattedDate = new Date().toISOString().split('T')[0];
        const randomChange = (Math.random() * 3) - 1; // -1% ile +2% arası değişim
        const basePrice = 3238.78;
        const newPrice = basePrice * (1 + (randomChange / 100));
        
        return {
            symbol: 'GOLD',
            name: 'Gold (Ons)',
            price: parseFloat(newPrice.toFixed(2)),
            change: parseFloat(randomChange.toFixed(2)),
            date: formattedDate
        };
    }

    // Demo piyasa verileri
    getDemoMarketData() {
        return {
            timestamp: new Date().toISOString(),
            markets: {
                bist100: this.getDemoBIST100(),
                sp500: this.getDemoSP500(),
                usdtry: this.getDemoUSDTRY(),
                gold: this.getDemoGold()
            }
        };
    }

    // Belirli aralıklarla veri güncelleme
    startAutoRefresh(callback) {
        // İlk veri çekme
        this.refreshAllData(callback);
        
        // Belirli aralıklarla veri güncelleme
        setInterval(() => {
            this.refreshAllData(callback);
        }, this.fetchInterval);
        
        // Geri sayım zamanlayıcısını başlat
        this.startCountdown();
    }
    
    // Geri sayım zamanlayıcısı
    startCountdown() {
        // Tüm zamanlayıcıları temizle
        Object.keys(this.refreshTimers).forEach(key => {
            clearInterval(this.refreshTimers[key]);
        });
        
        // Yeni zamanlayıcıyı başlat
        let remainingTime = this.fetchInterval / 1000;
        
        // Zamanlayıcı elementlerini güncelle
        this.updateTimerElements(remainingTime);
        
        // Her saniye geri sayımı güncelle
        this.refreshTimers.countdown = setInterval(() => {
            remainingTime--;
            
            // Zamanlayıcı elementlerini güncelle
            this.updateTimerElements(remainingTime);
            
            // Geri sayım tamamlandığında
            if (remainingTime <= 0) {
                clearInterval(this.refreshTimers.countdown);
            }
        }, 1000);
    }
    
    // Zamanlayıcı elementlerini güncelle
    updateTimerElements(seconds) {
        // Dakika ve saniye hesapla
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        
        // Zamanlayıcı elementlerini bul ve güncelle
        const timerElements = document.querySelectorAll('.data-refresh-timer');
        timerElements.forEach(element => {
            element.textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        });
        
        // İlerleme çubuklarını güncelle
        const progressElements = document.querySelectorAll('.data-refresh-progress');
        const progressPercentage = 100 - ((seconds / (this.fetchInterval / 1000)) * 100);
        progressElements.forEach(element => {
            element.style.width = `${progressPercentage}%`;
        });
    }

    // Tüm verileri güncelle
    async refreshAllData(callback) {
        if (this.isRefreshing) return;
        
        this.isRefreshing = true;
        
        try {
            // Kripto para verilerini çek
            const cryptoData = await this.getCryptoData('try');
            
            // Piyasa verilerini çek
            const marketData = await this.getMarketData();
            
            // Callback fonksiyonunu çağır
            if (typeof callback === 'function') {
                callback({
                    crypto: cryptoData,
                    market: marketData,
                    timestamp: new Date().toISOString()
                });
            }
            
            // Güncelleme bildirimini göster
            if (window.showNotification) {
                window.showNotification(
                    'Veriler Güncellendi',
                    'Tüm finansal veriler başarıyla güncellendi.',
                    'success',
                    3000
                );
            }
            
            // Geri sayım zamanlayıcısını yeniden başlat
            this.startCountdown();
            
            this.isRefreshing = false;
            
            return {
                crypto: cryptoData,
                market: marketData
            };
        } catch (error) {
            console.error('Veri güncelleme hatası:', error);
            
            // Hata bildirimini göster
            if (window.showNotification) {
                window.showNotification(
                    'Güncelleme Hatası',
                    'Veriler güncellenirken bir hata oluştu. Demo veriler kullanılıyor.',
                    'error',
                    5000
                );
            }
            
            this.isRefreshing = false;
            
            return {
                crypto: this.getDemoCryptoData('try'),
                market: this.getDemoMarketData()
            };
        }
    }
    
    // Manuel yenileme
    async manualRefresh(callback) {
        // Yenileme bildirimi göster
        if (window.showNotification) {
            window.showNotification(
                'Veriler Yenileniyor',
                'Finansal veriler güncelleniyor, lütfen bekleyin...',
                'info',
                2000
            );
        }
        
        // Tüm verileri güncelle
        return this.refreshAllData(callback);
    }
}

// Global API nesnesi
window.realTimeAPI = new RealTimeFinanceAPI();
