import os
import queue
import time
import json
import threading

class VoiceTriageEngine:
    def __init__(self, model_path="vosk-model-small-en-us-0.15"):
        self.model_path = os.path.join(os.path.dirname(__file__), "..", model_path)
        self.q = queue.Queue()
        
        self.cancellation_tokens = [
            "cancel", "i am safe", "i am okay", "stop", "theek hu", "no emergency", 
            "safe", "ok", "sea", "say", "save", "save me", "sef", "sep", "top", "stomp"
        ]
        self.emergency_tokens = ["help", "emergency", "bachao", "hey", "hell", "hep", "heal", "hurt", "pain"]
        
        self.model = None
        self._load_model()
        
        # State tracking for the Web UI
        self.current_state = "IDLE"
        self.transcript = ""
        
    def _load_model(self):
        try:
            import vosk
            if os.path.exists(self.model_path):
                vosk.SetLogLevel(-1)
                self.model = vosk.Model(self.model_path)
                print("[INFO] Offline Vosk model loaded successfully.")
        except Exception as e:
            print(f"[WARN] Error loading Vosk model: {e}")
            
    def _audio_callback(self, indata, frames, time_info, status):
        import numpy as np
        # Boost volume by 5x to pick up weak accident voices
        data_np = np.frombuffer(indata, dtype=np.int16)
        data_np = np.clip(data_np * 5.0, -32768, 32767).astype(np.int16)
        self.q.put(data_np.tobytes())

    def _speak(self, text):
        try:
            import pyttsx3
            import sys
            if sys.platform == 'win32':
                import pythoncom
                pythoncom.CoInitialize()
            engine = pyttsx3.init()
            # Try to set a slightly faster, clearer voice if needed, but default is fine
            engine.setProperty('rate', 170)
            engine.say(text)
            engine.runAndWait()
        except Exception as e:
            print(f"TTS Error: {e}")

    def start_validation_window(self, duration_seconds=15):
        self.current_state = "SPEAKING"
        self.transcript = "System: 'Emergency detected. Are you safe?'"
        
        print("\n*** POTENTIAL COLLISION DETECTED ***")
        # Speak instantly!
        self._speak("Emergency detected. Are you safe? Please state your status.")
        
        if self.model is None:
            self.current_state = "ERROR_NO_MODEL"
            return "STATE_ERROR"
            
        import sounddevice as sd
        import vosk
        
        try:
            device_info = sd.query_devices(sd.default.device[0], 'input')
            samplerate = int(device_info['default_samplerate'])
            recognizer = vosk.KaldiRecognizer(self.model, samplerate)
            
            self.current_state = "LISTENING"
            self.transcript = "Listening for your response..."
            
            print("[LIVE AUDIO] Listening... Speak into your microphone.")
            start_time = time.time()
            
            # Flush queue to ignore any self-noise from TTS
            while not self.q.empty():
                self.q.get()
                
            with sd.RawInputStream(samplerate=samplerate, blocksize=4000, device=None,
                                   dtype='int16', channels=1, callback=self._audio_callback):
                while True:
                    elapsed = time.time() - start_time
                    if elapsed > duration_seconds:
                        self.current_state = "UNRESPONSIVE"
                        self.transcript = "Timeout: No response detected."
                        self._speak("Driver unresponsive. Initiating autonomous rescue protocol.")
                        return "STATE_UNRESPONSIVE"
                        
                    data = self.q.get()
                    if recognizer.AcceptWaveform(data):
                        res = json.loads(recognizer.Result())
                        text = res.get("text", "").lower()
                        if text:
                            print(f"  [ASR]: '{text}'")
                            self.transcript = f"Heard: '{text}'"
                            
                            # Check Cancellation
                            if any(t in text for t in self.cancellation_tokens):
                                self.current_state = "DISMISSED"
                                self.transcript = "Safe token detected. Alarm cancelled."
                                self._speak("Alarm cancelled. Glad you are safe.")
                                return "STATE_DISMISSED"
                                
                            # Check Explicit Emergency (Help)
                            if any(t in text for t in self.emergency_tokens):
                                self.current_state = "EMERGENCY_CONFIRMED"
                                self.transcript = "Emergency confirmed via voice."
                                self._speak("Emergency confirmed. Dispatching help immediately.")
                                return "STATE_EMERGENCY"
                                
                    else:
                        partial = json.loads(recognizer.PartialResult())
                        partial_text = partial.get("partial", "").lower()
                        if partial_text:
                            # Quick partial match for faster response
                            if any(t in partial_text for t in self.cancellation_tokens):
                                self.current_state = "DISMISSED"
                                self.transcript = "Safe token detected. Alarm cancelled."
                                self._speak("Alarm cancelled. Glad you are safe.")
                                return "STATE_DISMISSED"
                            if any(t in partial_text for t in self.emergency_tokens):
                                self.current_state = "EMERGENCY_CONFIRMED"
                                self.transcript = "Emergency confirmed via voice."
                                self._speak("Emergency confirmed. Dispatching help immediately.")
                                return "STATE_EMERGENCY"
                                
        except Exception as e:
            print(f"[ERROR] Audio Exception: {e}")
            self.current_state = "ERROR"
            return "STATE_ERROR"
