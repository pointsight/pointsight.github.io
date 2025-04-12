// Market Data API Integration
class MarketDataAPI {
    constructor() {
        this.apiKey = null; // API anahtarınızı buraya ekleyin
        this.baseUrl = 'https://api.marketdata.app/v1/'; // Örnek API URL'i
        this.proxyEnabled = true; // CORS sorunlarını aşmak için proxy kullanımı
        this.proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        this.cacheDuration = 5 * 60 * 1000; // 5 dakika önbellek süresi
        this.cache = {};
    }

    // API anahtarını ayarla
    setApiKey(apiKey) {
        this.apiKey = apiKey;
    }

    // Veri çekme fonksiyonu
    async fetchData(endpoint, params = {}) {
        // Önbellekte veri var mı kontrol et
        const cacheKey = `${endpoint}:${JSON.stringify(params)}`;
        if (this.cache[cacheKey] && (Date.now() - this.cache[cacheKey].timestamp) < this.cacheDuration) {
            console.log('Önbellekten veri kullanılıyor:', endpoint);
            return this.cache[cacheKey].data;
        }

        try {
            // API URL'ini oluştur
            let url = this.baseUrl + endpoint;
            
            // Parametreleri URL'e ekle
            if (Object.keys(params).length > 0) {
                const queryParams = new URLSearchParams();
                for (const [key, value] of Object.entries(params)) {
                    queryParams.append(key, value);
                }
                url += '?' + queryParams.toString();
            }
            
            // API anahtarını ekle
            if (this.apiKey) {
                url += (url.includes('?') ? '&' : '?') + `apikey=${this.apiKey}`;
            }
            
            // CORS proxy kullan (gerekirse)
            const fetchUrl = this.proxyEnabled ? this.proxyUrl + url : url;
            
            // API isteği gönder
            const response = await fetch(fetchUrl, {
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
            
            return data;
        } catch (error) {
            console.error('API veri çekme hatası:', error);
            
            // Demo verisi döndür (gerçek API bağlantısı olmadığında)
            return this.getDemoData(endpoint);
        }
    }
    
    // Demo veri fonksiyonu (gerçek API olmadığında)
    getDemoData(endpoint) {
        // Bugünün tarihi
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        
        // Endpoint'e göre demo veri döndür
        if (endpoint.includes('stocks/BIST100')) {
            return {
                symbol: 'BIST100',
                name: 'Borsa Istanbul 100 Index',
                price: 9324.56,
                change: 1.24,
                history: [8500, 8700, 8900, 9200, 9100, 9300, 9324.56],
                date: formattedDate
            };
        } else if (endpoint.includes('stocks/SPX')) {
            return {
                symbol: 'SPX',
                name: 'S&P 500 Index',
                price: 5320,
                change: 0.87,
                history: [4800, 4750, 4900, 5100, 5200, 5300, 5320],
                date: formattedDate
            };
        } else if (endpoint.includes('forex/USDTRY')) {
            return {
                symbol: 'USD/TRY',
                name: 'US Dollar / Turkish Lira',
                price: 37.87,
                change: -0.35,
                date: formattedDate
            };
        } else if (endpoint.includes('commodities/GOLD')) {
            return {
                symbol: 'GOLD',
                name: 'Gold (Ons)',
                price: 3238.78,
                change: 1.87,
                date: formattedDate
            };
        } else if (endpoint.includes('market/summary')) {
            // Piyasa özeti
            return {
                timestamp: new Date().toISOString(),
                markets: {
                    bist100: {
                        symbol: 'BIST100',
                        price: 9324.56,
                        change: 1.24,
                        history: [8500, 8700, 8900, 9200, 9100, 9300, 9324.56]
                    },
                    sp500: {
                        symbol: 'SPX',
                        price: 5320,
                        change: 0.87,
                        history: [4800, 4750, 4900, 5100, 5200, 5300, 5320]
                    },
                    usdtry: {
                        symbol: 'USD/TRY',
                        price: 32.45,
                        change: -0.35
                    },
                    gold: {
                        symbol: 'GOLD',
                        price: 2345.78,
                        change: 0.87
                    }
                }
            };
        }
        
        // Varsayılan demo veri
        return {
            error: 'Demo veri bulunamadı',
            endpoint: endpoint
        };
    }
    
    // BIST 100 verilerini getir
    async getBIST100() {
        return this.fetchData('stocks/BIST100');
    }
    
    // S&P 500 verilerini getir
    async getSP500() {
        return this.fetchData('stocks/SPX');
    }
    
    // USD/TRY verilerini getir
    async getUSDTRY() {
        return this.fetchData('forex/USDTRY');
    }
    
    // Altın verilerini getir
    async getGold() {
        return this.fetchData('commodities/GOLD');
    }
    
    // Tüm piyasa verilerini getir
    async getMarketSummary() {
        return this.fetchData('market/summary');
    }
}

// Global API nesnesi
window.marketAPI = new MarketDataAPI();
