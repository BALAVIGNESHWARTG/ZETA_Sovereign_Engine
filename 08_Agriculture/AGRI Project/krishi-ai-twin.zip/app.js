// AgriTwin AI - Advanced Agricultural Digital Twin Application
// Ranchi District Farm Intelligence System

// Global state management
const appState = {
    currentFarm: null,
    currentSection: 'overview',
    language: 'en',
    theme: 'light',
    voiceActive: false,
    charts: {}
};

// Farm data from Ranchi district
const farmData = {
    "RAN001": {
        "farm_id": "RAN001",
        "name": "Kanke Valley Farm", 
        "lat": 23.2599,
        "lon": 85.2026,
        "area": 2.5,
        "soil_type": "Alfisols",
        "block": "Kanke",
        "ph": 5.9,
        "nitrogen": 245.2,
        "phosphorus": 28.7,
        "potassium": 165.3,
        "organic_matter": 0.89,
        "rainfall_30d": 142.3,
        "temp_avg": 31.2,
        "humidity": 78.4,
        "ndvi_current": 0.587,
        "ndvi_30d_ago": 0.456,
        "last_crop": "Paddy",
        "last_yield": 22.8,
        "irrigation": "Limited"
    },
    "RAN002": {
        "farm_id": "RAN002",
        "name": "Ratu Plateau Farm",
        "lat": 23.1895,
        "lon": 85.1563,  
        "area": 1.8,
        "soil_type": "Inceptisols",
        "block": "Ratu",
        "ph": 6.4,
        "nitrogen": 210.8,
        "phosphorus": 35.2,
        "potassium": 145.7,
        "organic_matter": 1.05,
        "rainfall_30d": 98.7,
        "temp_avg": 33.1,
        "humidity": 71.2,
        "ndvi_current": 0.423,
        "ndvi_30d_ago": 0.389,
        "last_crop": "Paddy",
        "last_yield": 19.5,
        "irrigation": "Limited"
    },
    "RAN003": {
        "farm_id": "RAN003",
        "name": "Silli River Farm",
        "lat": 23.0847,
        "lon": 85.4329,
        "area": 3.2,
        "soil_type": "Alfisols", 
        "block": "Silli",
        "ph": 6.1,
        "nitrogen": 268.1,
        "phosphorus": 41.3,
        "potassium": 187.9,
        "organic_matter": 1.12,
        "rainfall_30d": 156.8,
        "temp_avg": 29.8,
        "humidity": 82.1,
        "ndvi_current": 0.634,
        "ndvi_30d_ago": 0.512,
        "last_crop": "Paddy", 
        "last_yield": 25.1,
        "irrigation": "Moderate"
    },
    "RAN004": { 
        "farm_id": "RAN004",
        "name": "Ormanjhi Tech Farm",
        "lat": 23.1642,
        "lon": 85.0839,
        "area": 4.1,
        "soil_type": "Entisols",
        "block": "Ormanjhi",
        "ph": 5.2,
        "nitrogen": 195.6,
        "phosphorus": 22.1,
        "potassium": 132.4,
        "organic_matter": 0.73,
        "rainfall_30d": 118.4,
        "temp_avg": 32.7,
        "humidity": 75.6,
        "ndvi_current": 0.398,
        "ndvi_30d_ago": 0.287,
        "last_crop": "Maize",
        "last_yield": 18.3,
        "irrigation": "Moderate"
    },
    "RAN005": {
        "farm_id": "RAN005",
        "name": "Bundu Hills Farm", 
        "lat": 23.1569,
        "lon": 85.5894,
        "area": 1.5,
        "soil_type": "Alfisols",
        "block": "Bundu", 
        "ph": 5.7,
        "nitrogen": 223.9,
        "phosphorus": 31.8,
        "potassium": 158.2,
        "organic_matter": 0.96,
        "rainfall_30d": 134.5,
        "temp_avg": 30.4,
        "humidity": 79.8,
        "ndvi_current": 0.562,
        "ndvi_30d_ago": 0.445,
        "last_crop": "Vegetables",
        "last_yield": 142.7,
        "irrigation": "Good"
    }
};

// Market data
const marketData = [
    {"crop": "Paddy", "current_price": 2150, "forecast_3m": 2280, "forecast_6m": 2420, "trend": "Increasing"},
    {"crop": "Maize", "current_price": 1850, "forecast_3m": 1920, "forecast_6m": 2050, "trend": "Stable"}, 
    {"crop": "Wheat", "current_price": 2350, "forecast_3m": 2480, "forecast_6m": 2580, "trend": "Increasing"},
    {"crop": "Vegetables", "current_price": 1500, "forecast_3m": 1650, "forecast_6m": 1800, "trend": "Seasonal"}
];

// Crop predictions with AI explanations
const cropPredictions = {
    "RAN001": {
        "top_crops": [
            {"crop": "Paddy", "confidence": 0.85, "expected_yield": 26.5, "expected_income": 56975},
            {"crop": "Maize", "confidence": 0.79, "expected_yield": 20.8, "expected_income": 38480},
            {"crop": "Vegetables", "confidence": 0.73, "expected_yield": 145.0, "expected_income": 217500}
        ],
        "explanation": {
            "primary_factors": ["Soil pH: 5.9 (Neutral)", "Rainfall: 142.3mm (Adequate)", "Nitrogen: 245.2 kg/ha (High)", "Irrigation: Limited"],
            "counterfactual": "If soil pH was improved to 6.5, expected yield could increase by 15-20%",
            "recommendations": ["Maintain current pH levels", "Consider drip irrigation for water efficiency", "Apply organic matter to improve soil health"]
        }
    }
};

// Translations for multilingual support
const translations = {
    en: {
        'Farm Digital Twin': 'Farm Digital Twin',
        'Live Data': 'Live Data',
        'Current NDVI': 'Current NDVI',
        'Temperature': 'Temperature',
        'Humidity': 'Humidity',
        'Soil Health': 'Soil Health',
        'AI Recommendations': 'AI Recommendations',
        'Market Prices': 'Market Prices'
    },
    hi: {
        'Farm Digital Twin': 'फार्म डिजिटल ट्विन',
        'Live Data': 'लाइव डेटा',
        'Current NDVI': 'वर्तमान NDVI',
        'Temperature': 'तापमान',
        'Humidity': 'नमी',
        'Soil Health': 'मिट्टी का स्वास्थ्य',
        'AI Recommendations': 'AI सुझाव',
        'Market Prices': 'बाजार दर'
    }
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    startRealTimeUpdates();
});

function initializeApp() {
    console.log('🌾 AgriTwin AI - Initializing Ranchi District Farm Intelligence...');
    
    // Set initial theme
    applyTheme();
    
    // Setup farm markers with click handlers
    setupFarmMarkers();
    
    // Initialize charts
    setTimeout(() => {
        initializeCharts();
    }, 500);
    
    // Simulate real-time data updates
    simulateRealTimeData();
    
    console.log('✅ AgriTwin AI initialized successfully');
}

function setupEventListeners() {
    // Farm marker clicks
    document.querySelectorAll('.farm-marker').forEach(marker => {
        marker.addEventListener('click', function() {
            const farmId = this.dataset.farm;
            showFarmDashboard(farmId);
        });
    });

    // Navigation buttons
    const backBtns = document.querySelectorAll('.back-btn');
    backBtns.forEach(btn => {
        btn.addEventListener('click', showOverview);
    });

    // Theme toggle button
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Language toggle button
    const langToggle = document.querySelector('.lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }

    // Voice assistant button
    const voiceBtn = document.querySelector('.voice-btn');
    if (voiceBtn) {
        voiceBtn.addEventListener('click', toggleVoiceAssistant);
    }

    // Modal close functionality
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closeVoiceModal);
    }

    // Close modal when clicking outside
    const voiceModal = document.getElementById('voice-modal');
    if (voiceModal) {
        voiceModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeVoiceModal();
            }
        });
    }
}

function setupFarmMarkers() {
    const markers = document.querySelectorAll('.farm-marker');
    markers.forEach(marker => {
        marker.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2)';
        });
        
        marker.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Section Navigation
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('main > section');
    sections.forEach(section => section.classList.add('hidden'));
    
    // Show requested section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        appState.currentSection = sectionId;
        
        // Initialize section-specific features
        if (sectionId === 'market-hub') {
            initializePriceChart();
        } else if (sectionId === 'ai-recommendations') {
            loadAIRecommendations();
        }
    }
}

function showOverview() {
    showSection('overview-section');
    appState.currentSection = 'overview';
}

function showFarmDashboard(farmId) {
    const farm = farmData[farmId];
    if (!farm) return;
    
    appState.currentFarm = farmId;
    
    // Update dashboard header
    document.getElementById('farm-title').textContent = `${farm.name} - Digital Twin`;
    
    // Update farm data displays
    updateFarmDashboard(farm);
    
    // Show farm dashboard
    showSection('farm-dashboard');
    
    // Initialize weather chart for this farm
    setTimeout(() => {
        initializeWeatherChart(farm);
    }, 300);
}

function updateFarmDashboard(farm) {
    // Update NDVI display
    document.getElementById('current-ndvi').textContent = farm.ndvi_current.toFixed(3);
    
    const ndviChange = ((farm.ndvi_current - farm.ndvi_30d_ago) / farm.ndvi_30d_ago * 100);
    document.getElementById('ndvi-change').textContent = `${ndviChange > 0 ? '+' : ''}${ndviChange.toFixed(1)}%`;
    
    // Update soil health bars
    updateSoilHealth(farm);
    
    // Update sensor data
    updateSensorData(farm);
}

function updateSoilHealth(farm) {
    // pH level (0-14 scale, optimal 6-7)
    const phPercent = (farm.ph / 14) * 100;
    document.getElementById('ph-progress').style.width = `${phPercent}%`;
    document.getElementById('ph-value').textContent = farm.ph.toFixed(1);
    
    // Nitrogen (0-400 kg/ha scale)
    const nPercent = Math.min(farm.nitrogen / 400 * 100, 100);
    document.getElementById('n-progress').style.width = `${nPercent}%`;
    document.getElementById('n-value').textContent = `${farm.nitrogen} kg/ha`;
    
    // Phosphorus (0-60 kg/ha scale)
    const pPercent = Math.min(farm.phosphorus / 60 * 100, 100);
    document.getElementById('p-progress').style.width = `${pPercent}%`;
    document.getElementById('p-value').textContent = `${farm.phosphorus} kg/ha`;
    
    // Potassium (0-300 kg/ha scale)
    const kPercent = Math.min(farm.potassium / 300 * 100, 100);
    document.getElementById('k-progress').style.width = `${kPercent}%`;
    document.getElementById('k-value').textContent = `${farm.potassium} kg/ha`;
}

function updateSensorData(farm) {
    const sensorContainer = document.getElementById('sensor-data');
    sensorContainer.innerHTML = `
        <div class="sensor-item">
            <div class="sensor-value">${farm.temp_avg}°C</div>
            <div class="sensor-label">Temperature</div>
        </div>
        <div class="sensor-item">
            <div class="sensor-value">${farm.humidity}%</div>
            <div class="sensor-label">Humidity</div>
        </div>
        <div class="sensor-item">
            <div class="sensor-value">${farm.rainfall_30d}mm</div>
            <div class="sensor-label">30-Day Rainfall</div>
        </div>
        <div class="sensor-item">
            <div class="sensor-value">${farm.irrigation}</div>
            <div class="sensor-label">Irrigation Status</div>
        </div>
    `;
}

// Chart Initializations
function initializeCharts() {
    console.log('📊 Initializing charts...');
    // Charts will be initialized when sections are accessed
}

function initializeWeatherChart(farm) {
    const ctx = document.getElementById('weatherChart');
    if (!ctx || appState.charts.weather) return;
    
    // Generate sample weather data
    const weatherData = generateWeatherData(farm);
    
    appState.charts.weather = new Chart(ctx, {
        type: 'line',
        data: {
            labels: weatherData.labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: weatherData.temperature,
                borderColor: '#1FB8CD',
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                fill: true,
                tension: 0.4
            }, {
                label: 'Humidity (%)',
                data: weatherData.humidity,
                borderColor: '#FFC185',
                backgroundColor: 'rgba(255, 193, 133, 0.1)',
                fill: true,
                tension: 0.4,
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '7-Day Weather Trend'
                },
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Humidity (%)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        }
    });
}

function initializePriceChart() {
    const ctx = document.getElementById('priceChart');
    if (!ctx || appState.charts.price) return;
    
    const crops = marketData.map(item => item.crop);
    const currentPrices = marketData.map(item => item.current_price);
    const forecast6m = marketData.map(item => item.forecast_6m);
    
    appState.charts.price = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: crops,
            datasets: [{
                label: 'Current Price (₹/qtl)',
                data: currentPrices,
                backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5'],
                borderColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5'],
                borderWidth: 1
            }, {
                label: '6-Month Forecast (₹/qtl)',
                data: forecast6m,
                backgroundColor: ['rgba(31, 184, 205, 0.5)', 'rgba(255, 193, 133, 0.5)', 'rgba(180, 65, 60, 0.5)', 'rgba(236, 235, 213, 0.5)'],
                borderColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Market Price Analysis'
                },
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Price (₹/qtl)'
                    }
                }
            }
        }
    });
}

function generateWeatherData(farm) {
    const labels = [];
    const temperature = [];
    const humidity = [];
    
    const baseTemp = farm.temp_avg;
    const baseHumidity = farm.humidity;
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }));
        
        // Generate realistic variations
        const tempVariation = (Math.random() - 0.5) * 4; // ±2°C variation
        const humidityVariation = (Math.random() - 0.5) * 10; // ±5% variation
        
        temperature.push(Math.round((baseTemp + tempVariation) * 10) / 10);
        humidity.push(Math.round(Math.max(40, Math.min(90, baseHumidity + humidityVariation))));
    }
    
    return { labels, temperature, humidity };
}

// AI Recommendations
function loadAIRecommendations() {
    const farmId = appState.currentFarm || 'RAN001';
    const prediction = cropPredictions[farmId];
    
    if (prediction) {
        // Recommendations are already in HTML, but we can update them dynamically
        console.log(`🤖 Loading AI recommendations for ${farmId}`);
    }
}

// Real-time Data Simulation
function simulateRealTimeData() {
    setInterval(() => {
        if (appState.currentSection === 'farm-dashboard' && appState.currentFarm) {
            // Simulate small changes in sensor data
            const farm = farmData[appState.currentFarm];
            
            // Small random variations
            farm.temp_avg += (Math.random() - 0.5) * 0.2;
            farm.humidity += (Math.random() - 0.5) * 1;
            
            // Ensure realistic bounds
            farm.temp_avg = Math.max(25, Math.min(40, farm.temp_avg));
            farm.humidity = Math.max(40, Math.min(95, farm.humidity));
            
            // Update display
            updateSensorData(farm);
        }
    }, 5000); // Update every 5 seconds
}

function startRealTimeUpdates() {
    // Update NDVI values occasionally
    setInterval(() => {
        Object.values(farmData).forEach(farm => {
            const variation = (Math.random() - 0.5) * 0.002;
            farm.ndvi_current = Math.max(0.2, Math.min(0.8, farm.ndvi_current + variation));
        });
        
        // If viewing farm dashboard, update display
        if (appState.currentSection === 'farm-dashboard' && appState.currentFarm) {
            const farm = farmData[appState.currentFarm];
            document.getElementById('current-ndvi').textContent = farm.ndvi_current.toFixed(3);
        }
    }, 30000); // Update every 30 seconds
}

// Theme Toggle - Fixed Implementation
function toggleTheme() {
    console.log('🎨 Toggling theme from', appState.theme);
    
    // Toggle theme state
    appState.theme = appState.theme === 'light' ? 'dark' : 'light';
    
    // Apply the new theme
    applyTheme();
    
    console.log('🎨 Theme switched to', appState.theme);
}

function applyTheme() {
    // Apply theme to document
    document.documentElement.setAttribute('data-color-scheme', appState.theme);
    
    // Update theme toggle icon
    const themeIcon = document.querySelector('.theme-toggle i');
    if (themeIcon) {
        themeIcon.className = appState.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
    
    // Force a repaint to ensure theme is applied
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
    
    console.log('🎨 Applied theme:', appState.theme);
}

// Language Toggle
function toggleLanguage() {
    appState.language = appState.language === 'en' ? 'hi' : 'en';
    
    const langBtn = document.getElementById('current-lang');
    if (langBtn) {
        langBtn.textContent = appState.language.toUpperCase();
    }
    
    // Update UI text (simplified implementation)
    updateUILanguage();
}

function updateUILanguage() {
    // This would update all translatable text in the UI
    console.log(`🌍 Language switched to: ${appState.language}`);
}

// Voice Assistant
function toggleVoiceAssistant() {
    const modal = document.getElementById('voice-modal');
    if (modal) {
        modal.classList.toggle('hidden');
        if (!modal.classList.contains('hidden')) {
            startVoiceAnimation();
        } else {
            stopVoiceAnimation();
        }
    }
}

function closeVoiceModal() {
    const modal = document.getElementById('voice-modal');
    if (modal) {
        modal.classList.add('hidden');
        stopVoiceAnimation();
    }
}

function startVoiceAnimation() {
    const waves = document.querySelectorAll('.voice-visualizer .wave');
    waves.forEach((wave, index) => {
        wave.style.animationDelay = `${index * 0.2}s`;
        wave.style.animationPlayState = 'running';
    });
}

function stopVoiceAnimation() {
    const waves = document.querySelectorAll('.voice-visualizer .wave');
    waves.forEach(wave => {
        wave.style.animationPlayState = 'paused';
    });
}

function simulateVoiceInput() {
    const inputElement = document.getElementById('voice-input');
    const responseElement = document.getElementById('voice-response');
    const selectedLang = document.querySelector('input[name="voice-lang"]:checked').value;
    
    // Sample voice commands and responses
    const commands = {
        en: [
            {
                input: "What's the weather like?",
                response: "Current temperature is 31.2°C with 78% humidity. Expect light rainfall in next 2 days."
            },
            {
                input: "Show crop recommendations",
                response: "Based on AI analysis, I recommend Paddy with 85% confidence for maximum yield of 26.5 tonnes per hectare."
            },
            {
                input: "What's my soil health?",
                response: "Soil pH is 5.9, nitrogen levels are high at 245.2 kg/ha. Consider adding lime to optimize pH."
            }
        ],
        hi: [
            {
                input: "मौसम कैसा है?",
                response: "वर्तमान तापमान 31.2°C है और 78% नमी है। अगले 2 दिनों में हल्की बारिश की संभावना है।"
            },
            {
                input: "फसल की सिफारिश दिखाएं",
                response: "AI विश्लेषण के आधार पर, मैं 85% विश्वास के साथ धान की सिफारिश करता हूं जो अधिकतम 26.5 टन प्रति हेक्टेयर उत्पादन देगी।"
            }
        ]
    };
    
    const langCommands = commands[selectedLang];
    const randomCommand = langCommands[Math.floor(Math.random() * langCommands.length)];
    
    // Simulate voice input
    inputElement.textContent = `"${randomCommand.input}"`;
    inputElement.style.color = 'var(--color-primary)';
    
    // Show response after delay
    setTimeout(() => {
        responseElement.textContent = randomCommand.response;
        responseElement.classList.remove('hidden');
        
        // Speak response (if supported)
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(randomCommand.response);
            utterance.lang = selectedLang === 'hi' ? 'hi-IN' : 'en-IN';
            speechSynthesis.speak(utterance);
        }
    }, 1500);
    
    // Reset after a few seconds
    setTimeout(() => {
        inputElement.textContent = 'Say something... (Try: "What\'s the weather?" or "Show crop recommendations")';
        inputElement.style.color = '';
        responseElement.classList.add('hidden');
    }, 8000);
}

// Utility Functions
function showLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.remove('hidden');
    }
}

function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

function formatNumber(number, decimals = 1) {
    return number.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        appState,
        farmData,
        showFarmDashboard,
        toggleTheme,
        toggleLanguage
    };
}

// Development helpers
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.agriTwinDebug = {
        appState,
        farmData,
        showSection,
        showFarmDashboard,
        simulateVoiceInput,
        toggleTheme
    };
    console.log('🔧 Debug mode enabled. Access window.agriTwinDebug for development tools.');
}