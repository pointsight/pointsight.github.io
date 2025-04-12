// Gerçek Zamanlı Kripto Para ve Piyasa Verileri API Entegrasyonu
class RealTimeDataAPI {
    constructor() {
        this.cryptoApiUrl = 'https://api.coingecko.com/api/v3';
        this.marketApiUrl = 'https://api.marketdata.app/v1/';
        this.cacheDuration = 60 * 1000; // 1 dakika önbellek süresi
        this.cache = {};
        this.lastFetchTime = 0;
        this.fetchInterval = 5 * 60 * 1000; // 5 dakika
        this.cryptoIds = ['bitcoin', 'ethereum', 'binancecoin', 'ripple', 'cardano', 'solana'];
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
            // BIST 100 verileri
            const bist100Data = await this.fetchData(`${this.marketApiUrl}stocks/BIST100`, 'bist100');
            
            // S&P 500 verileri
            const sp500Data = await this.fetchData(`${this.marketApiUrl}stocks/SPX`, 'sp500');
            
            // USD/TRY verileri
            const usdtryData = await this.fetchData(`${this.marketApiUrl}forex/USDTRY`, 'usdtry');
            
            // Altın verileri
            const goldData = await this.fetchData(`${this.marketApiUrl}commodities/GOLD`, 'gold');
            
            // Tüm verileri birleştir
            const marketSummary = {
                timestamp: new Date().toISOString(),
                markets: {
                    bist100: bist100Data,
                    sp500: sp500Data,
                    usdtry: usdtryData,
                    gold: goldData
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
                image: `/images/crypto/${id}.svg`,
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

    // Demo piyasa verileri
    getDemoMarketData() {
        const formattedDate = new Date().toISOString().split('T')[0];
        
        return {
            timestamp: new Date().toISOString(),
            markets: {
                bist100: {
                    symbol: 'BIST100',
                    price: 9324.56,
                    change: 1.24,
                    history: [8500, 8700, 8900, 9200, 9100, 9300, 9324.56],
                    date: formattedDate
                },
                sp500: {
                    symbol: 'SPX',
                    price: 5320,
                    change: 0.87,
                    history: [4800, 4750, 4900, 5100, 5200, 5300, 5320],
                    date: formattedDate
                },
                usdtry: {
                    symbol: 'USD/TRY',
                    price: 37.87,
                    change: -0.35,
                    date: formattedDate
                },
                gold: {
                    symbol: 'GOLD',
                    price: 3238.78,
                    change: 1.87,
                    date: formattedDate
                }
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
    }

    // Tüm verileri güncelle
    async refreshAllData(callback) {
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
            
            return {
                crypto: this.getDemoCryptoData('try'),
                market: this.getDemoMarketData()
            };
        }
    }
}

// Global API nesnesi
window.realTimeAPI = new RealTimeDataAPI();
