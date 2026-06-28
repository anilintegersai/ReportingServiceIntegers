"""
IoT Telemetry simulator — pushes fake sensor readings to Power BI streaming dataset.
Run: python push_telemetry.py
Stop: Ctrl+C
"""

import os
import requests
import random
import time
from datetime import datetime, timezone

# Set POWERBI_PUSH_URL in your environment or paste it here for local testing
PUSH_URL = os.environ.get("POWERBI_PUSH_URL", "")
if not PUSH_URL:
    raise RuntimeError(
        "Set the POWERBI_PUSH_URL environment variable to your Power BI streaming dataset push URL.\n"
        "Example: $env:POWERBI_PUSH_URL='https://api.powerbi.com/beta/.../rows?key=...'"
    )

MACHINES = ["Machine-A", "Machine-B", "Machine-C"]

# Baseline values per machine
BASELINES = {
    "Machine-A": {"temperature": 72, "vibration": 2.3, "pressure": 4.4},
    "Machine-B": {"temperature": 78, "vibration": 2.6, "pressure": 4.6},
    "Machine-C": {"temperature": 75, "vibration": 2.5, "pressure": 4.5},
}

# Track anomaly state per machine
anomaly_countdown = {m: 0 for m in MACHINES}


def get_status(temperature, vibration, pressure):
    if temperature > 95 or vibration > 5.0 or pressure > 6.0:
        return "Critical"
    if temperature > 85 or vibration > 3.8 or pressure > 5.2:
        return "Warning"
    return "Running"


def generate_reading(machine_id):
    base = BASELINES[machine_id]

    # Randomly trigger anomalies (~5% chance per machine per tick)
    if anomaly_countdown[machine_id] == 0 and random.random() < 0.05:
        anomaly_countdown[machine_id] = random.randint(3, 8)

    if anomaly_countdown[machine_id] > 0:
        anomaly_countdown[machine_id] -= 1
        temperature = base["temperature"] + random.uniform(15, 30)
        vibration   = base["vibration"]   + random.uniform(2.0, 4.0)
        pressure    = base["pressure"]    + random.uniform(0.8, 1.8)
    else:
        temperature = base["temperature"] + random.uniform(-3, 3)
        vibration   = base["vibration"]   + random.uniform(-0.3, 0.3)
        pressure    = base["pressure"]    + random.uniform(-0.2, 0.2)

    return {
        "timestamp":   datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "machine_id":  machine_id,
        "temperature": round(temperature, 2),
        "vibration":   round(vibration, 3),
        "pressure":    round(pressure, 3),
        "status":      get_status(temperature, vibration, pressure),
    }


def push(rows):
    resp = requests.post(PUSH_URL, json=rows, timeout=10)
    return resp.status_code


def main():
    print("IoT Telemetry pusher started — Ctrl+C to stop\n")
    tick = 0
    while True:
        tick += 1
        rows = [generate_reading(m) for m in MACHINES]

        try:
            status = push(rows)
            now = datetime.now().strftime("%H:%M:%S")
            for r in rows:
                flag = "⚠" if r["status"] == "Warning" else ("🔴" if r["status"] == "Critical" else " ")
                print(f"[{now}] {flag} {r['machine_id']:10s}  "
                      f"temp={r['temperature']:5.1f}°C  "
                      f"vib={r['vibration']:5.3f}  "
                      f"pres={r['pressure']:5.3f}  "
                      f"→ {r['status']}")
            print(f"           HTTP {status}\n" if status != 200 else "")
        except Exception as e:
            print(f"Push failed: {e}")

        time.sleep(3)


if __name__ == "__main__":
    main()
