// Ekonomik Takvim
document.addEventListener('DOMContentLoaded', function() {
    // Ekonomik takvim container kontrolü
    const calendarContainer = document.getElementById('economic-calendar');
    if (!calendarContainer) return;

    // Takvimi başlat
    initEconomicCalendar();

    // Ekonomik takvimi başlat
    function initEconomicCalendar() {
        // Takvim başlığı
        const header = document.createElement('div');
        header.className = 'calendar-header';
        header.innerHTML = `
            <h3>Ekonomik Takvim</h3>
            <div class="calendar-controls">
                <button id="prev-day" class="calendar-nav-btn">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <div id="current-date" class="current-date"></div>
                <button id="next-day" class="calendar-nav-btn">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;
        calendarContainer.appendChild(header);

        // Takvim içeriği
        const calendarContent = document.createElement('div');
        calendarContent.className = 'calendar-content';
        calendarContainer.appendChild(calendarContent);

        // Yükleniyor göstergesi
        const loader = document.createElement('div');
        loader.className = 'calendar-loader';
        loader.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Veriler yükleniyor...';
        calendarContent.appendChild(loader);

        // Bugünün tarihini ayarla
        const today = new Date();
        let currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        updateDateDisplay(currentDate);

        // Verileri yükle
        fetchCalendarData(currentDate);

        // Önceki gün butonu
        document.getElementById('prev-day').addEventListener('click', function() {
            currentDate.setDate(currentDate.getDate() - 1);
            updateDateDisplay(currentDate);
            calendarContent.innerHTML = '<div class="calendar-loader"><i class="fas fa-spinner fa-spin"></i> Veriler yükleniyor...</div>';
            fetchCalendarData(currentDate);
        });

        // Sonraki gün butonu
        document.getElementById('next-day').addEventListener('click', function() {
            currentDate.setDate(currentDate.getDate() + 1);
            updateDateDisplay(currentDate);
            calendarContent.innerHTML = '<div class="calendar-loader"><i class="fas fa-spinner fa-spin"></i> Veriler yükleniyor...</div>';
            fetchCalendarData(currentDate);
        });
    }

    // Tarih göstergesini güncelle
    function updateDateDisplay(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('current-date').textContent = date.toLocaleDateString('tr-TR', options);
    }

    // Ekonomik takvim verilerini çek
    async function fetchCalendarData(date) {
        try {
            // Gerçek API'ye bağlanmak için:
            // const formattedDate = date.toISOString().split('T')[0];
            // const response = await fetch(`https://api.economicdata.com/calendar?date=${formattedDate}&country=TR,US,EU`);
            // const data = await response.json();
            
            // Demo veriler
            const data = generateDemoCalendarData(date);
            
            // Verileri görüntüle
            renderCalendarData(data);
            
            return data;
        } catch (error) {
            console.error('Ekonomik takvim verileri çekilirken hata oluştu:', error);
            document.querySelector('.calendar-content').innerHTML = `
                <div class="calendar-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Veriler yüklenirken bir hata oluştu.</p>
                </div>
            `;
            return null;
        }
    }

    // Demo ekonomik takvim verileri oluştur
    function generateDemoCalendarData(date) {
        const formattedDate = date.toISOString().split('T')[0];
        const dayOfWeek = date.getDay(); // 0 = Pazar, 6 = Cumartesi
        
        // Hafta sonu için farklı veriler
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return {
                date: formattedDate,
                events: [
                    {
                        time: '00:00',
                        country: 'GLOBAL',
                        countryCode: 'GLOBAL',
                        event: 'Piyasalar Kapalı (Hafta Sonu)',
                        importance: 'low',
                        actual: '-',
                        forecast: '-',
                        previous: '-'
                    }
                ]
            };
        }
        
        // Günlere göre farklı ekonomik olaylar
        const events = [];
        
        // Pazartesi
        if (dayOfWeek === 1) {
            events.push(
                {
                    time: '10:00',
                    country: 'Türkiye',
                    countryCode: 'TR',
                    event: 'İşsizlik Oranı',
                    importance: 'high',
                    actual: '9.2%',
                    forecast: '9.4%',
                    previous: '9.5%'
                },
                {
                    time: '12:00',
                    country: 'Euro Bölgesi',
                    countryCode: 'EU',
                    event: 'Sanayi Üretimi (Aylık)',
                    importance: 'medium',
                    actual: '0.5%',
                    forecast: '0.3%',
                    previous: '0.2%'
                }
            );
        }
        
        // Salı
        else if (dayOfWeek === 2) {
            events.push(
                {
                    time: '11:00',
                    country: 'Türkiye',
                    countryCode: 'TR',
                    event: 'Cari İşlemler Dengesi',
                    importance: 'high',
                    actual: '-2.8B$',
                    forecast: '-3.2B$',
                    previous: '-3.5B$'
                },
                {
                    time: '15:30',
                    country: 'ABD',
                    countryCode: 'US',
                    event: 'Tüketici Fiyat Endeksi (Aylık)',
                    importance: 'high',
                    actual: '0.2%',
                    forecast: '0.3%',
                    previous: '0.4%'
                }
            );
        }
        
        // Çarşamba
        else if (dayOfWeek === 3) {
            events.push(
                {
                    time: '10:00',
                    country: 'Türkiye',
                    countryCode: 'TR',
                    event: 'Perakende Satışlar (Yıllık)',
                    importance: 'medium',
                    actual: '12.5%',
                    forecast: '11.8%',
                    previous: '10.9%'
                },
                {
                    time: '16:00',
                    country: 'ABD',
                    countryCode: 'US',
                    event: 'Fed Faiz Kararı',
                    importance: 'high',
                    actual: '5.50%',
                    forecast: '5.50%',
                    previous: '5.50%'
                }
            );
        }
        
        // Perşembe
        else if (dayOfWeek === 4) {
            events.push(
                {
                    time: '11:00',
                    country: 'Türkiye',
                    countryCode: 'TR',
                    event: 'TCMB Faiz Kararı',
                    importance: 'high',
                    actual: '50.00%',
                    forecast: '50.00%',
                    previous: '50.00%'
                },
                {
                    time: '14:30',
                    country: 'Euro Bölgesi',
                    countryCode: 'EU',
                    event: 'ECB Toplantı Tutanakları',
                    importance: 'medium',
                    actual: '-',
                    forecast: '-',
                    previous: '-'
                }
            );
        }
        
        // Cuma
        else if (dayOfWeek === 5) {
            events.push(
                {
                    time: '10:00',
                    country: 'Türkiye',
                    countryCode: 'TR',
                    event: 'Tüketici Güven Endeksi',
                    importance: 'medium',
                    actual: '79.2',
                    forecast: '78.5',
                    previous: '77.8'
                },
                {
                    time: '15:30',
                    country: 'ABD',
                    countryCode: 'US',
                    event: 'Tarım Dışı İstihdam',
                    importance: 'high',
                    actual: '175K',
                    forecast: '180K',
                    previous: '190K'
                },
                {
                    time: '17:00',
                    country: 'ABD',
                    countryCode: 'US',
                    event: 'Michigan Tüketici Güven Endeksi',
                    importance: 'medium',
                    actual: '68.2',
                    forecast: '67.5',
                    previous: '66.9'
                }
            );
        }
        
        return {
            date: formattedDate,
            events: events
        };
    }

    // Ekonomik takvim verilerini görüntüle
    function renderCalendarData(data) {
        const calendarContent = document.querySelector('.calendar-content');
        calendarContent.innerHTML = '';
        
        if (data.events.length === 0) {
            calendarContent.innerHTML = `
                <div class="no-events">
                    <i class="fas fa-calendar-day"></i>
                    <p>Bu tarih için ekonomik veri bulunmamaktadır.</p>
                </div>
            `;
            return;
        }
        
        // Tablo oluştur
        const table = document.createElement('table');
        table.className = 'calendar-table';
        
        // Tablo başlığı
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Saat</th>
                <th>Ülke</th>
                <th>Olay</th>
                <th>Önem</th>
                <th>Gerçekleşen</th>
                <th>Beklenti</th>
                <th>Önceki</th>
            </tr>
        `;
        table.appendChild(thead);
        
        // Tablo içeriği
        const tbody = document.createElement('tbody');
        
        data.events.forEach(event => {
            const row = document.createElement('tr');
            row.className = `importance-${event.importance}`;
            
            // Ülke bayrağı
            let flagEmoji = '';
            if (event.countryCode === 'TR') {
                flagEmoji = '🇹🇷';
            } else if (event.countryCode === 'US') {
                flagEmoji = '🇺🇸';
            } else if (event.countryCode === 'EU') {
                flagEmoji = '🇪🇺';
            } else if (event.countryCode === 'GLOBAL') {
                flagEmoji = '🌐';
            }
            
            row.innerHTML = `
                <td class="event-time">${event.time}</td>
                <td class="event-country">${flagEmoji} ${event.country}</td>
                <td class="event-name">${event.event}</td>
                <td class="event-importance">
                    <span class="importance-indicator ${event.importance}"></span>
                </td>
                <td class="event-actual">${event.actual}</td>
                <td class="event-forecast">${event.forecast}</td>
                <td class="event-previous">${event.previous}</td>
            `;
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        calendarContent.appendChild(table);
    }
});
