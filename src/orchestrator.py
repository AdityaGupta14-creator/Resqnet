import time
import sys
import threading
from sensors import KinematicsFilter
from triage import VoiceTriageEngine

class Simulator:
    def __init__(self):
        self.kinematics = KinematicsFilter(sample_rate=50, window_ms=120)
        self.triage = VoiceTriageEngine()
        
    def simulate_telemetry(self, scenario_type):
        """
        Feeds synthetic data into the kinematics filter representing different scenarios.
        """
        print(f"\n--- Simulating Scenario: {scenario_type.upper()} ---")
        
        frames = []
        if scenario_type == "normal_driving":
            # Normal driving: Amag around 1G, small gyro
            for _ in range(6):
                frames.append((0.0, 1.0, 0.0, 2.0, 1.5, 0.5))
        elif scenario_type == "pothole":
            # Pothole: Amag spike to 2.1G, low gyro
            for _ in range(3): frames.append((0.0, 1.0, 0.0, 2.0, 1.5, 0.5))
            frames.append((0.0, 2.1, 0.0, 5.0, 2.0, 1.0))
            for _ in range(2): frames.append((0.0, 1.0, 0.0, 2.0, 1.5, 0.5))
        elif scenario_type == "phone_drop":
            # Drop inside cabin: Amag spike > 4.5G, but low gyro (no rollover)
            for _ in range(3): frames.append((0.0, 1.0, 0.0, 2.0, 1.5, 0.5))
            frames.append((0.0, 4.8, 0.0, 10.0, 5.0, 2.0))
            for _ in range(2): frames.append((0.0, 1.0, 0.0, 2.0, 1.5, 0.5))
        elif scenario_type == "severe_crash":
            # True collision: Amag > 4.5G AND Gyro > 60 deg/sec
            for _ in range(3): frames.append((0.0, 1.0, 0.0, 2.0, 1.5, 0.5))
            frames.append((2.0, 4.0, 0.5, 45.0, 40.0, 10.0)) # Amag = 4.5, Gmag = ~61
            for _ in range(2): frames.append((0.0, 1.0, 0.0, 2.0, 1.5, 0.5))
            
        # Feed frames at 50Hz (20ms interval)
        for i, (ax, ay, az, gx, gy, gz) in enumerate(frames):
            time.sleep(0.02)
            is_critical = self.kinematics.add_telemetry(ax, ay, az, gx, gy, gz)
            print(f"  Frame {i+1} | Accel: {ax},{ay},{az} | Gyro: {gx},{gy},{gz} | Critical: {is_critical}")
            
            if is_critical:
                print("\n[!] STAGE 1: KINEMATIC THRESHOLDS BREACHED.")
                print("[!] Launching Stage 2 Voice-First Validation...")
                
                state = self.triage.start_validation_window(duration_seconds=15)
                
                if state == "STATE_DISMISSED":
                    print("\n>> OUTCOME: Alarm Cancelled. Returning to Normal Monitoring.")
                elif state == "STATE_UNRESPONSIVE":
                    print("\n>> OUTCOME: DRIVER UNRESPONSIVE. Initiating Track 2 & 3 Autonomous Protocols!")
                    self._trigger_siren()
                return
                
        print("\n>> OUTCOME: Event discarded by Physics Filter. No crash detected.")

    def _trigger_siren(self):
        print("\n🔊🔊🔊 SIREN ACTIVATED: 10-Second High Volume Haptic Alert 🔊🔊🔊")
        print("Dispatching BLE Disaster Tokens and Querying DuckDB...")
        
    def start_interactive(self):
        print("="*50)
        print(" RESQNET AI - TRACK 1 SIMULATOR (KINEMATICS & TRIAGE) ")
        print("="*50)
        
        while True:
            print("\nSelect an event to simulate:")
            print("  1. Normal Highway Driving")
            print("  2. Deep Pothole / Heavy Braking")
            print("  3. Phone dropped inside cabin (High G, No Roll)")
            print("  4. Severe Vehicular Crash (High G + Rollover)")
            print("  5. Exit")
            
            choice = input("\nChoice: ").strip()
            
            if choice == "1":
                self.simulate_telemetry("normal_driving")
            elif choice == "2":
                self.simulate_telemetry("pothole")
            elif choice == "3":
                self.simulate_telemetry("phone_drop")
            elif choice == "4":
                self.simulate_telemetry("severe_crash")
            elif choice == "5" or choice.lower() == "exit":
                break
            else:
                print("Invalid choice.")

if __name__ == "__main__":
    sim = Simulator()
    sim.start_interactive()
