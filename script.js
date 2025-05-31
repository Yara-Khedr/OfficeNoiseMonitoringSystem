//Sensor simulation for the time being until actual functionality is added, also fix time and date updates
class ESP32SensorData {
    constructor() {
        this.temperature = 22; 
        this.humidity = 45; 
        this.light = 300; 
        this.noise = 40; 
        
        this.thresholds = {
            temperature: { min: 18, max: 26 },
            humidity: { min: 30, max: 70 },
            light: { min: 200, max: 800 },
            noise: { min: 0, max: 60 }
        };

        this.warnings = {
            temperature: {
                low: "Temperature too low! Consider turning on heating or wearing warmer clothes.",
                high: "Temperature too high! Turn on AC or open windows for ventilation."
            },
            humidity: {
                low: "Humidity too low! Use a humidifier or place water containers nearby.",
                high: "Humidity too high! Use a dehumidifier or improve ventilation."
            },
            light: {
                low: "Light level too low! Turn on more lights to reduce eye strain.",
                high: "Light level too high! Use blinds or reduce artificial lighting."
            },
            noise: {
                high: "Noise level too high! Consider noise-canceling measures or move to quieter area."
            }
        };
    }

    updateSensors() {
        this.temperature += (Math.random() - 0.5) * 2;
        this.humidity += (Math.random() - 0.5) * 5;
        this.light += (Math.random() - 0.5) * 50;
        this.noise += (Math.random() - 0.5) * 10;

        
        this.temperature = Math.max(10, Math.min(35, this.temperature));
        this.humidity = Math.max(10, Math.min(90, this.humidity));
        this.light = Math.max(0, Math.min(1000, this.light));
        this.noise = Math.max(20, Math.min(100, this.noise));
    }

    checkWarnings() {
        const warnings = [];
        
        if (this.temperature < this.thresholds.temperature.min) {
            warnings.push({ 
                type: 'Temperature Too Low', 
                message: this.warnings.temperature.low,
                sensor: 'temperature'
            });
        } else if (this.temperature > this.thresholds.temperature.max) {
            warnings.push({ 
                type: 'Temperature Too High', 
                message: this.warnings.temperature.high,
                sensor: 'temperature'
            });
        }

        if (this.humidity < this.thresholds.humidity.min) {
            warnings.push({ 
                type: 'Humidity Too Low', 
                message: this.warnings.humidity.low,
                sensor: 'humidity'
            });
        } else if (this.humidity > this.thresholds.humidity.max) {
            warnings.push({ 
                type: 'Humidity Too High', 
                message: this.warnings.humidity.high,
                sensor: 'humidity'
            });
        }

        if (this.light < this.thresholds.light.min) {
            warnings.push({ 
                type: 'Light Level Too Low', 
                message: this.warnings.light.low,
                sensor: 'light'
            });
        } else if (this.light > this.thresholds.light.max) {
            warnings.push({ 
                type: 'Light Level Too High', 
                message: this.warnings.light.high,
                sensor: 'light'
            });
        }

        if (this.noise > this.thresholds.noise.max) {
            warnings.push({ 
                type: 'Noise Level Too High', 
                message: this.warnings.noise.high,
                sensor: 'noise'
            });
        }

        return warnings;
    }

    getSensorData() {
        return {
            temperature: this.temperature.toFixed(1),
            humidity: this.humidity.toFixed(1),
            light: Math.round(this.light),
            noise: this.noise.toFixed(1)
        };
    }
}


const esp32 = new ESP32SensorData();

function updateDateTime() {
    const now = new Date();
    
    document.getElementById('datetime').textContent = 
        `Time: ${now.toLocaleTimeString()} | Date: ${now.toLocaleDateString()}`;
        
   
    document.getElementById('taskbarTimeDisplay').textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    document.getElementById('taskbarDateDisplay').textContent = now.toLocaleDateString();
}


function updateSensorDisplay() {
    const data = esp32.getSensorData();
    const warnings = esp32.checkWarnings();

    
    const tempCard = document.getElementById('temperatureCard');
    const tempValue = document.getElementById('temperatureValue');
    const tempProgress = document.getElementById('temperatureProgress');
    
    tempValue.innerHTML = `${data.temperature}<span class="sensor-unit">°C</span>`;
    const tempWarning = warnings.find(w => w.sensor === 'temperature');
    if (tempWarning) {
        tempCard.className = 'sensor-card warning';
        tempValue.className = 'sensor-value warning';
        tempProgress.className = 'progress-fill warning';
    } else {
        tempCard.className = 'sensor-card normal';
        tempValue.className = 'sensor-value normal';
        tempProgress.className = 'progress-fill normal';
    }
    
    
    const tempPercent = Math.max(0, Math.min(100, ((parseFloat(data.temperature) - 18) / 8) * 100));
    tempProgress.style.width = tempPercent + '%';

    
    const humidityCard = document.getElementById('humidityCard');
    const humidityValue = document.getElementById('humidityValue');
    const humidityProgress = document.getElementById('humidityProgress');
    
    humidityValue.innerHTML = `${data.humidity}<span class="sensor-unit">%</span>`;
    const humidityWarning = warnings.find(w => w.sensor === 'humidity');
    if (humidityWarning) {
        humidityCard.className = 'sensor-card warning';
        humidityValue.className = 'sensor-value warning';
        humidityProgress.className = 'progress-fill warning';
    } else {
        humidityCard.className = 'sensor-card normal';
        humidityValue.className = 'sensor-value normal';
        humidityProgress.className = 'progress-fill normal';
    }
    
    
    const humidityPercent = Math.max(0, Math.min(100, ((parseFloat(data.humidity) - 30) / 40) * 100));
    humidityProgress.style.width = humidityPercent + '%';

    
    const lightCard = document.getElementById('lightCard');
    const lightValue = document.getElementById('lightValue');
    const lightProgress = document.getElementById('lightProgress');
    
    lightValue.innerHTML = `${data.light}<span class="sensor-unit">lux</span>`;
    const lightWarning = warnings.find(w => w.sensor === 'light');
    if (lightWarning) {
        lightCard.className = 'sensor-card warning';
        lightValue.className = 'sensor-value warning';
        lightProgress.className = 'progress-fill warning';
    } else {
        lightCard.className = 'sensor-card normal';
        lightValue.className = 'sensor-value normal';
        lightProgress.className = 'progress-fill normal';
    }
    
    
    const lightPercent = Math.max(0, Math.min(100, ((parseInt(data.light) - 200) / 600) * 100));
    lightProgress.style.width = lightPercent + '%';

    
    const noiseCard = document.getElementById('noiseCard');
    const noiseValue = document.getElementById('noiseValue');
    const noiseProgress = document.getElementById('noiseProgress');
    
    noiseValue.innerHTML = `${data.noise}<span class="sensor-unit">dB</span>`;
    const noiseWarning = warnings.find(w => w.sensor === 'noise');
    if (noiseWarning) {
        noiseCard.className = 'sensor-card warning';
        noiseValue.className = 'sensor-value warning';
        noiseProgress.className = 'progress-fill warning';
    } else {
        noiseCard.className = 'sensor-card normal';
        noiseValue.className = 'sensor-value normal';
        noiseProgress.className = 'progress-fill normal';
    }
    
    
    const noisePercent = Math.max(0, Math.min(100, (parseFloat(data.noise) / 60) * 100));
    noiseProgress.style.width = noisePercent + '%';

 
    const systemStatus = document.getElementById('systemStatus');
    const warningsSection = document.getElementById('warningsSection');
    const warningsList = document.getElementById('warningsList');

    if (warnings.length > 0) {
        systemStatus.className = 'status warning';
        systemStatus.innerHTML = '⚠️ System alerts detected';
        
        warningsSection.className = 'warnings-section active';
        warningsList.innerHTML = warnings.map(warning => `
            <div class="warning-item">
                <div class="warning-type">${warning.type}</div>
                <div class="warning-message">${warning.message}</div>
            </div>
        `).join('');
    } else {
        systemStatus.className = 'status normal';
        systemStatus.innerHTML = '✓ All systems normal';
        warningsSection.className = 'warnings-section';
    }

    document.getElementById('lastUpdate').textContent = 'Just now';
}


function init() {
    updateDateTime();
    updateSensorDisplay();    
    setInterval(() => {
        esp32.updateSensors();
        updateSensorDisplay();
        updateDateTime()
    }, 1000);
}

// Start the application
init();