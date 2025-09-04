# Prerequisites:
# => Close Serial Monitor in Arudino IDE, if opened
# => Install Libraries:
#           pip install pyserial 
#           pip install requests
import serial, serial.tools.list_ports
import json
import time
import requests

# Check Port
ports = serial.tools.list_ports.comports()
for port in ports:
    print(f"Device: {port.device}, Name: {port.description}")

PORT = "COM3"     # Check arudino IDE and change to your port
BAUD = 9600
API_URL = "https://postman-echo.com/post"

ser = serial.Serial(PORT, BAUD, timeout=1)
time.sleep(2)  # wait for Arduino reset

while True:
    line = ser.readline().decode(errors="ignore").strip()
    if not line:
        continue

    try:
        print(line)

        data = {
            "id": line
        }

        r = requests.post(API_URL, json=data, timeout=5)
        print("Response:", r.status_code, r.text)

    except json.JSONDecodeError:
        print("Bad JSON:", line)
