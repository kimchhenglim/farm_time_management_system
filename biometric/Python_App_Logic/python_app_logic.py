# Prerequisites:
# => Install Libraries:
#           pip install pyserial 
#           pip install flask flask-socketio
# => Check Serial Port with Arudino IDE. You can close Arudino after the port is connected.
from flask import Flask
from flask_socketio import SocketIO, emit
import serial, serial.tools.list_ports
import threading
import time

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# ----- SERIAL SETUP -----
PORT = "COM3"  # Change to your Arduino port
BAUD = 9600

def get_serial_port():
    ports = serial.tools.list_ports.comports()
    for port in ports:
        print(f"Device: {port.device}, Name: {port.description}")
    return serial.Serial(PORT, BAUD, timeout=1)

# ----- SOCKET EVENTS -----
@app.route("/")
def home():
    return "✅ Python Socket.IO + Arduino server is running."

@socketio.on("connect")
def handle_connect():
    print("🌐 Client connected")
    emit("server_message", {"msg": "🌐 Client connected"})

# ----- BACKGROUND THREAD: SERIAL LISTENER -----
def serial_listener():
    try:
        ser = get_serial_port()
        time.sleep(2)  # give Arduino time to reset
        print("✅ Listening to Arduino on", PORT)

        while True:
            line = ser.readline().decode(errors="ignore").strip()
            if not line:
                continue

            print("🎫 Card ID from Arduino:", line)
            # Send to webpage
            socketio.emit("server_message", {"msg": f"{line}"})

    except Exception as e:
        print("❌ Serial Error:", e)
        time.sleep(3)
        serial_listener()  # retry automatically

# ----- START THREAD -----
threading.Thread(target=serial_listener, daemon=True).start()

# ---------------------------------------------------------
# Run the Flask-SocketIO server only if this file is executed directly.
# This prevents the server from starting automatically when the file
# is imported as a module. The app listens on all network interfaces
# (0.0.0.0) so it can be accessed from other devices on the same network,
# using port 5000 (http://<your-ip>:5000).
# ---------------------------------------------------------
if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000)