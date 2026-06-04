// Global state
let currentState = 'IDLE';
let countdownInterval = null;
let secondsLeft = 15;

// Web Audio API objects for siren
let audioCtx = null;
let oscillator = null;
let gainNode = null;
let buzzerInterval = null;

// Web Speech Recognition
let speechRec = null;
let silenceTimeout = null;

function playBuzzer() {
    if (audioCtx) return; // Already playing
    
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    oscillator = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();
    
    oscillator.type = 'square'; // Harsh buzzer sound
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); 
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    
    // Siren toggling effect
    let isHigh = false;
    buzzerInterval = setInterval(() => {
        if (isHigh) {
            oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        } else {
            oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime);
        }
        isHigh = !isHigh;
    }, 400); 
}

function stopBuzzer() {
    if (audioCtx) {
        clearInterval(buzzerInterval);
        oscillator.stop();
        audioCtx.close();
        audioCtx = null;
    }
}

function findNearestHospital() {
    updateUI('DISPATCHING', 'Locating nearest hospital...');
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                fetch('/api/nearest_hospital', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lat: lat, lon: lon })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        console.error('Hospital locator error:', data.error);
                        return;
                    }
                    
                    document.getElementById('hospitalInfo').classList.remove('hidden');
                    document.getElementById('hospName').innerText = data.name;
                    document.getElementById('hospDist').innerText = 'Distance: ' + data.distance_km + ' km';
                    document.getElementById('hospPhone').innerText = 'Phone: ' + (data.phone || 'N/A');
                })
                .catch(err => console.error('Fetch error:', err));
            },
            (error) => {
                console.error('Geolocation error:', error);
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}

function updateUI(state, transcript) {
    currentState = state;
    const card = document.getElementById('statusCard');
    const stateLabel = document.getElementById('stateLabel');
    const transcriptLabel = document.getElementById('transcriptLabel');
    const resetBtn = document.getElementById('resetBtn');
    const timerDisplay = document.getElementById('timerDisplay');

    card.setAttribute('data-state', state);
    
    if (state === 'IDLE') {
        stateLabel.innerText = 'System Idle';
        resetBtn.classList.add('hidden');
        timerDisplay.classList.add('hidden');
        document.getElementById('hospitalInfo').classList.add('hidden');
        clearInterval(countdownInterval);
        countdownInterval = null;
        stopBuzzer();
    } else if (state === 'SPEAKING') {
        stateLabel.innerText = '⚠️ Alerting Driver...';
        resetBtn.classList.add('hidden');
        timerDisplay.classList.add('hidden');
        secondsLeft = 15;
        timerDisplay.innerText = secondsLeft;
    } else if (state === 'LISTENING') {
        stateLabel.innerText = '🎙️ Listening...';
        resetBtn.classList.add('hidden');
        timerDisplay.classList.remove('hidden');
        
        if (!countdownInterval) {
            countdownInterval = setInterval(() => {
                secondsLeft--;
                if (secondsLeft <= 0) {
                    secondsLeft = 0;
                    clearInterval(countdownInterval);
                }
                timerDisplay.innerText = secondsLeft;
            }, 1000);
        }
    } else if (state === 'DISMISSED') {
        stateLabel.innerText = '✅ Safe. Resuming Monitoring...';
        resetBtn.classList.add('hidden'); // Auto-resumes, no button needed
        timerDisplay.classList.add('hidden');
        clearInterval(countdownInterval);
        countdownInterval = null;
        stopBuzzer();
    } else if (state === 'EMERGENCY_CONFIRMED') {
        stateLabel.innerText = '🚨 EMERGENCY DISPATCH SENT!';
        resetBtn.classList.remove('hidden');
        timerDisplay.classList.add('hidden');
        clearInterval(countdownInterval);
        countdownInterval = null;
        playBuzzer();
        findNearestHospital();
    } else if (state === 'UNRESPONSIVE') {
        stateLabel.innerText = '❌ UNRESPONSIVE - DISPATCH SENT!';
        resetBtn.classList.remove('hidden');
        timerDisplay.classList.add('hidden');
        clearInterval(countdownInterval);
        countdownInterval = null;
        playBuzzer();
        findNearestHospital();
    } else if (state === 'ERROR') {
        stateLabel.innerText = 'Error loading Mic/Model';
        resetBtn.classList.remove('hidden');
        timerDisplay.classList.add('hidden');
        clearInterval(countdownInterval);
        countdownInterval = null;
        stopBuzzer();
    }

    if (transcript) {
        transcriptLabel.innerText = transcript;
    }
}


// -------- BROWSER Triage Engine -------- //
function startBrowserTriage() {
    if (currentState === 'SPEAKING' || currentState === 'LISTENING') return;
    
    updateUI('SPEAKING', "System: 'Emergency detected. Are you safe?'");
    
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance("Emergency detected. Are you safe? Please state your status.");
    utterance.rate = 1.0;
    
    utterance.onend = function() {
        startBrowserListening();
    };
    
    synth.speak(utterance);
}

function startBrowserListening() {
    updateUI('LISTENING', "Listening for your response...");
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        updateUI('ERROR', "Speech recognition not supported in this browser. Use Chrome/Safari.");
        return;
    }
    
    if (!speechRec) {
        speechRec = new SpeechRecognition();
        speechRec.continuous = true; // Keep listening continuously until we stop it
        speechRec.interimResults = true; // Crucial for catching very quiet/fast whispers instantly
        speechRec.maxAlternatives = 10; // Request up to 10 alternative guesses for noisy environments
        speechRec.lang = 'en-US';
    }
    
    let timerFired = false;
    
    // 15 second unresponsive timeout
    silenceTimeout = setTimeout(() => {
        if (currentState === 'LISTENING') {
            timerFired = true;
            speechRec.stop();
            updateUI('UNRESPONSIVE', "No response detected. Dispatching help.");
        }
    }, 15000);
    
    speechRec.onresult = function(event) {
        if (timerFired) return;
        
        // Loop through all results (interim and final)
        for (let i = event.resultIndex; i < event.results.length; i++) {
            // Loop through all alternative guesses (crucial for background noise / pocket muffling)
            for (let j = 0; j < event.results[i].length; j++) {
                let transcript = event.results[i][j].transcript.toLowerCase().trim();
                
                // Expanded tokens for low-voice/whisper misinterpretations
                const safeTokens = ["cancel", "safe", "okay", "stop", "theek", "no", "ok", "fine", "good", "top", "st", "stuff", "save", "sip", "sap"];
                const helpTokens = ["help", "emergency", "bachao", "hey", "hell", "hurt", "pain", "alp", "hal", "hop", "howp"];
                
                let isSafe = safeTokens.some(t => transcript.includes(t));
                let isHelp = helpTokens.some(t => transcript.includes(t));
                
                if (isSafe) {
                    clearTimeout(silenceTimeout);
                    speechRec.stop();
                    updateUI('DISMISSED', `Heard whisper/noise: "${transcript}" -> Safe`);
                    setTimeout(resetSystem, 3000); // Auto-resume monitoring after 3s
                    return;
                } else if (isHelp) {
                    clearTimeout(silenceTimeout);
                    speechRec.stop();
                    updateUI('EMERGENCY_CONFIRMED', `Heard whisper/noise: "${transcript}" -> Emergency`);
                    return;
                }
                
                // If it's the primary guess and no match, just show it on screen
                if (j === 0) {
                    updateUI('LISTENING', `Hearing: "${transcript}"...`);
                }
            }
        }
    };
    
    speechRec.onend = function() {
        // If it stopped automatically but we are still listening and didn't fire timer, restart it.
        if (currentState === 'LISTENING' && !timerFired) {
            try { speechRec.start(); } catch(e){}
        }
    };
    
    try {
        speechRec.start();
    } catch(e) {}
}

function resetSystem() {
    clearTimeout(silenceTimeout);
    if (speechRec) {
        speechRec.stop();
    }
    updateUI('IDLE', 'Monitoring telemetry arrays...');
}

// Map the old simulation button to the new native browser triage
function simulate(scenario) {
    if (scenario === 'severe_crash') {
        startBrowserTriage();
    }
}


// -------- Mobile Sensor Processing -------- //
let rollingAccels = [];
const windowSize = 6; // 120ms window at 50Hz

function enableMobileSensors() {
    const sensorBtn = document.getElementById('sensorBtn');
    
    // Request permission for iOS, handle naturally for Android
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    startSensorTracking();
                    sensorBtn.innerText = "Sensors Active 🟢";
                    sensorBtn.disabled = true;
                } else {
                    alert("Permission denied for sensors.");
                }
            })
            .catch(err => alert("Sensor Error: " + err));
    } else {
        startSensorTracking();
        sensorBtn.innerText = "Sensors Active 🟢";
        sensorBtn.disabled = true;
    }
}

function startSensorTracking() {
    window.addEventListener('devicemotion', (event) => {
        if (currentState !== 'IDLE') return; // Don't track if already crashed
        
        let ax = event.accelerationIncludingGravity.x || 0;
        let ay = event.accelerationIncludingGravity.y || 0;
        let az = event.accelerationIncludingGravity.z || 0;
        
        let gx = event.rotationRate ? (event.rotationRate.beta || 0) : 0;
        let gy = event.rotationRate ? (event.rotationRate.gamma || 0) : 0;
        let gz = event.rotationRate ? (event.rotationRate.alpha || 0) : 0;
        
        let a_mag = Math.sqrt(ax * ax + ay * ay + az * az) / 9.80665;
        
        rollingAccels.push(a_mag);
        if (rollingAccels.length > windowSize) {
            rollingAccels.shift();
        }
        
        let maxVal = Math.max(...rollingAccels);
        let minVal = Math.min(...rollingAccels);
        let delta = maxVal - minVal;
        
        let gyro_mag = Math.sqrt(gx * gx + gy * gy + gz * gz);
        
        document.getElementById('transcriptLabel').innerText = 
            `Real Telemetry: ${a_mag.toFixed(2)}G | Gyro: ${gyro_mag.toFixed(1)}°/s`;

        if (delta > 4.5 && gyro_mag > 60) {
            startBrowserTriage();
        }
    });
}
