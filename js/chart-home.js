// Interactive chart for homepage with real-time data fetching
document.addEventListener('DOMContentLoaded', function() {
    // Check if the chart container exists
    const chartContainer = document.getElementById('home-chart');
    if (!chartContainer) return;

    // Initialize chart with loading state
    const ctx = chartContainer.getContext('2d');
    
    // Create initial empty chart
    let marketChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 6
                    }
                },
                title: {
                    display: true,
                    text: 'Borsa Endeksleri Karşılaştırması (2025)',
                    font: {
                        size: 16
                    }
                }
            }
        }
    });

    // Function to fetch market data
    async function fetchMarketData() {
        try {
            // Gerçek zamanlı API varsa kullan
            let marketSummary;
            if (window.realTimeAPI) {
                marketSummary = await window.realTimeAPI.getMarketData();
            } else {
                marketSummary = await window.marketAPI.getMarketSummary();
            }
            
            // API yanıtını işle
            const data = {
                bist100: {
                    history: marketSummary.markets.bist100.history || [8500, 8700, 8900, 9200, 9100, 9300, 9324.56],
                    current: marketSummary.markets.bist100.price,
                    change: marketSummary.markets.bist100.change
                },
                sp500: {
                    history: marketSummary.markets.sp500.history || [4800, 4750, 4900, 5100, 5200, 5300, 5320],
                    current: marketSummary.markets.sp500.price,
                    change: marketSummary.markets.sp500.change
                },
                usdtry: {
                    current: marketSummary.markets.usdtry.price,
                    change: marketSummary.markets.usdtry.change
                },
                gold: {
                    current: marketSummary.markets.gold.price,
                    change: marketSummary.markets.gold.change
                },
                timestamp: marketSummary.timestamp
            };
            
            // Update chart with new data
            updateChart(data);
            
            // Update market indicators
            updateMarketIndicators(data);
            
            // Update last updated timestamp
            document.querySelector('.data-disclaimer p').innerHTML = 
                `<i class="fas fa-info-circle"></i> Veriler gösterim amaçlıdır. Son güncelleme: ${new Date().toLocaleString('tr-TR')}`;
            
            return data;
        } catch (error) {
            console.error('Piyasa verileri çekilirken hata oluştu:', error);
            // Show error message in chart
            chartContainer.innerHTML = `<div class="chart-error"><i class="fas fa-exclamation-triangle"></i> Veri yüklenirken bir hata oluştu.</div>`;
            return null;
        }
    }
    
    // Function to update chart with new data
    function updateChart(data) {
        // Create labels for last 6 months
        const labels = getLastMonths(6);
        
        // Update chart data
        marketChart.data = {
            labels: labels,
            datasets: [
                {
                    label: 'BIST 100',
                    data: data.bist100.history,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'S&P 500',
                    data: data.sp500.history,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }
            ]
        };
        
        // Update chart options
        marketChart.options = {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 6
                    }
                },
                title: {
                    display: true,
                    text: 'Borsa Endeksleri Karşılaştırması (2025)',
                    font: {
                        size: 16
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            }
        };
        
        // Update chart
        marketChart.update();
    }
    
    // Function to update market indicators
    function updateMarketIndicators(data) {
        // Update BIST 100
        const bist100Value = document.querySelector('.indicator-card:nth-child(1) .value');
        const bist100Change = document.querySelector('.indicator-card:nth-child(1) .change');
        if (bist100Value && bist100Change) {
            bist100Value.textContent = data.bist100.current.toLocaleString('tr-TR');
            bist100Change.textContent = (data.bist100.change > 0 ? '+' : '') + data.bist100.change + '%';
        }
        
        // Update USD/TRY
        const usdtryValue = document.querySelector('.indicator-card:nth-child(2) .value');
        const usdtryChange = document.querySelector('.indicator-card:nth-child(2) .change');
        if (usdtryValue && usdtryChange) {
            usdtryValue.textContent = data.usdtry.current.toLocaleString('tr-TR');
            usdtryChange.textContent = (data.usdtry.change > 0 ? '+' : '') + data.usdtry.change + '%';
        }
        
        // Update Gold
        const goldValue = document.querySelector('.indicator-card:nth-child(3) .value');
        const goldChange = document.querySelector('.indicator-card:nth-child(3) .change');
        if (goldValue && goldChange) {
            goldValue.textContent = data.gold.current.toLocaleString('tr-TR');
            goldChange.textContent = (data.gold.change > 0 ? '+' : '') + data.gold.change + '%';
        }
    }
    
    // Helper function to get last N months
    function getLastMonths(count) {
        const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        const today = new Date();
        const result = [];
        
        for (let i = count - 1; i >= 0; i--) {
            const monthIndex = (today.getMonth() - i + 12) % 12;
            result.push(months[monthIndex]);
        }
        
        return result;
    }
    
    // Initial data fetch
    fetchMarketData();
    
    // Yenileme butonu ekle
    addRefreshButton();
    
    // Gerçek zamanlı API varsa, otomatik yenilemeyi kullan
    if (window.realTimeAPI) {
        window.realTimeAPI.startAutoRefresh(function(data) {
            if (data.market) {
                // API yanıtını işle
                const chartData = {
                    bist100: {
                        history: data.market.markets.bist100.history || [8500, 8700, 8900, 9200, 9100, 9300, 9324.56],
                        current: data.market.markets.bist100.price,
                        change: data.market.markets.bist100.change
                    },
                    sp500: {
                        history: data.market.markets.sp500.history || [4800, 4750, 4900, 5100, 5200, 5300, 5320],
                        current: data.market.markets.sp500.price,
                        change: data.market.markets.sp500.change
                    },
                    usdtry: {
                        current: data.market.markets.usdtry.price,
                        change: data.market.markets.usdtry.change
                    },
                    gold: {
                        current: data.market.markets.gold.price,
                        change: data.market.markets.gold.change
                    },
                    timestamp: data.market.timestamp
                };
                
                // Grafiği ve göstergeleri güncelle
                updateChart(chartData);
                updateMarketIndicators(chartData);
                
                // Yenileme zamanını güncelle
                addRefreshTimers();
            }
        });
    } else {
        // Gerçek zamanlı API yoksa, belirli aralıklarla verileri güncelle (5 dakikada bir)
        setInterval(fetchMarketData, 5 * 60 * 1000);
    }
    
    // Yenileme butonu ekle
    function addRefreshButton() {
        const chartContainer = document.getElementById('home-chart');
        if (!chartContainer) return;
        
        const chartParent = chartContainer.parentElement;
        if (!chartParent) return;
        
        // Zaten varsa ekleme
        if (chartParent.querySelector('.refresh-button')) return;
        
        // Stil dosyasını ekle
        if (!document.getElementById('market-data-css')) {
            const link = document.createElement('link');
            link.id = 'market-data-css';
            link.rel = 'stylesheet';
            link.href = 'css/market-data.css';
            document.head.appendChild(link);
        }
        
        // Header container oluştur
        const headerContainer = document.createElement('div');
        headerContainer.className = 'market-data-header';
        
        // Başlık ekle
        const title = document.createElement('h3');
        title.className = 'market-data-title';
        title.textContent = 'Güncel Piyasa Verileri';
        
        // Yenileme butonu ekle
        const refreshButton = document.createElement('button');
        refreshButton.className = 'refresh-button';
        refreshButton.innerHTML = '<i class="fas fa-sync-alt"></i>';
        refreshButton.title = 'Verileri Yenile';
        
        // Yenileme zamanını ekle
        const timerContainer = document.createElement('div');
        timerContainer.className = 'refresh-timer';
        timerContainer.innerHTML = `
            <span class="timer-label">Yenileme:</span>
            <span class="data-refresh-timer">5:00</span>
            <div class="progress-bar">
                <div class="data-refresh-progress"></div>
            </div>
        `;
        
        // Tıklama olayını ekle
        refreshButton.addEventListener('click', async () => {
            // Döndürme animasyonu ekle
            refreshButton.classList.add('rotating');
            
            // Gerçek zamanlı API varsa kullan
            if (window.realTimeAPI) {
                await window.realTimeAPI.manualRefresh();
            } else {
                // Yoksa normal veri çekme işlemini kullan
                await fetchMarketData();
            }
            
            // Döndürme animasyonunu kaldır
            setTimeout(() => {
                refreshButton.classList.remove('rotating');
            }, 1000);
        });
        
        // Header'a öğeleri ekle
        headerContainer.appendChild(title);
        headerContainer.appendChild(timerContainer);
        headerContainer.appendChild(refreshButton);
        
        // Chart container'ın önüne header'ı ekle
        chartParent.insertBefore(headerContainer, chartContainer);
    }
    
    // Yenileme zamanını güncelle
    function addRefreshTimers() {
        if (!window.realTimeAPI) return;
        
        // Zamanlayıcı elementlerini güncelle
        const timerElements = document.querySelectorAll('.data-refresh-timer');
        const progressElements = document.querySelectorAll('.data-refresh-progress');
        
        if (timerElements.length > 0 && window.realTimeAPI.updateTimerElements) {
            window.realTimeAPI.updateTimerElements(window.realTimeAPI.fetchInterval / 1000);
        }
    }
});


