import numpy as np
import collections

class KinematicsFilter:
    def __init__(self, sample_rate=50, window_ms=120):
        self.sample_rate = sample_rate
        # Calculate number of frames for the rolling buffer
        # At 50Hz, each frame is 20ms. 120ms = 6 frames.
        self.buffer_size = int((window_ms / 1000.0) * sample_rate)
        if self.buffer_size < 1:
            self.buffer_size = 1
            
        # Buffers for acceleration (G) and gyro (degrees/sec)
        self.accel_buffer = collections.deque(maxlen=self.buffer_size)
        self.gyro_buffer = collections.deque(maxlen=self.buffer_size)
        
    def add_telemetry(self, ax, ay, az, gx, gy, gz):
        """
        Add a new sensor reading.
        Returns True if a CRITICAL_IMPACT is detected in the current rolling buffer.
        """
        # 1. Calculate Vector Magnitude Acceleration Amag = sqrt(Ax^2 + Ay^2 + Az^2)
        amag = np.sqrt(ax**2 + ay**2 + az**2)
        self.accel_buffer.append(amag)
        
        # 2. Calculate Gyro Angular Velocity magnitude (simplified total angular tilt speed)
        gmag = np.sqrt(gx**2 + gy**2 + gz**2)
        self.gyro_buffer.append(gmag)
        
        # 3. Evaluate the buffer against the physical gates
        return self._evaluate_gates()
        
    def _evaluate_gates(self):
        if len(self.accel_buffer) == 0:
            return False
            
        max_amag = max(self.accel_buffer)
        max_gmag = max(self.gyro_buffer)
        
        # GATE 1: Discard everyday noise (<= 2.2G)
        # GATE 2: Detect true collision impact (>= 4.5G)
        if max_amag < 4.5:
            return False
            
        # GATE 3: Rotational Tilt. A phone drop inside the cabin won't necessarily
        # cause the massive structural angular rotation seen in a vehicle impact/rollover.
        # Threshold > 60 degrees/sec concurrent with the impact.
        if max_gmag < 60.0:
            return False
            
        # If all gates pass, we have a critical impact!
        return True
