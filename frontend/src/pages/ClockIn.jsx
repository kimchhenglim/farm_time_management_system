import React, { useEffect, useState } from "react";
import useAuthStore from "../stores/useAuthStore";
import Clock from "../components/Clock";
import { Link, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import useScanStore from "../stores/useScanStore";

function ClockIn() {
  const { authUser, setAuthUser } = useAuthStore();
  const [socket, setSocket] = useState(null);
  const { type, reason } = useParams();
  const navigate = useNavigate();

  const {
    clockIn,
    isScanning,
    clockOut,
    breakIn,
    breakOut,
    popupMessage,
    setPopupMessage,
  } = useScanStore();

  useEffect(() => {
    if (authUser) setAuthUser();

    const newSocket = io("http://localhost:5000", {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => console.log("🟢 Connected to backend"));
    newSocket.on("disconnect", () => console.log("🔴 Disconnected"));

    // 🧩 Handle incoming messages from backend
    const handleServerMessage = async (data) => {
      console.log("📨 Received:", data);

      try {
        if (type === "clockIn") {
          await clockIn(data.msg);
        } else if (type === "clockOut") {
          await clockOut(data.msg);
        } else if (type === "breakIn") {
          await breakIn(data.msg, reason);
        } else if (type === "breakOut") {
          await breakOut(data.msg);
        }

        // show popup for 2 s then navigate
        setTimeout(() => {
          setPopupMessage(null);
          navigate("/staff");
        }, 2000);
      } catch (err) {
        console.error("Error while clocking:", err);
        setPopupMessage("❌ Something went wrong!");
        setTimeout(() => {
          setPopupMessage(null);
          navigate("/staff");
        }, 2000);
      }
    };

    newSocket.on("server_message", handleServerMessage);

    return () => {
      newSocket.off("server_message", handleServerMessage);
      newSocket.disconnect();
    };
  }, []);

  return (
    <div className="w-full h-full p-10 flex flex-col gap-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="w-[250px] h-[60px] ">
          <Clock />
        </div>
        <div className="flex gap-10">
          <Link to={`/staff/manual/${type}${reason ? "/" + reason : ""}`}>
            <button className="w-[250px] h-[60px] border border-[#16A34A] rounded-sm font-semibold text-[#16A34A] text-xl cursor-pointer">
              Manual
            </button>
          </Link>
          <Link to="/staff">
            <button className="w-[250px] h-[60px] border border-[#16A34A] rounded-sm font-semibold text-[#16A34A] text-xl cursor-pointer">
              Cancel
            </button>
          </Link>
        </div>
      </div>

      {/* Center animation */}
      <div className="w-full h-full flex flex-col gap-10 items-center justify-center">
        <div className="relative flex items-center justify-center w-full h-full">
          <div className="absolute w-[500px] h-[500px] rounded-full border border-[#16A34A] animate-fade-circle"></div>
          <div className="absolute w-[400px] h-[400px] rounded-full border border-[#16A34A] animate-fade-circle delay-150"></div>
          <div className="absolute w-[300px] h-[300px] rounded-full border border-[#16A34A] animate-fade-circle delay-300"></div>

          <svg
            width="150"
            height="150"
            viewBox="0 0 154 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.1111 0C7.67326 0 0 7.6875 0 17.1429V102.857C0 112.312 7.67326 120 17.1111 120H136.889C146.327 120 154 112.312 154 102.857V17.1429C154 7.6875 146.327 0 136.889 0H17.1111ZM38.5 68.5714H55.6111C67.4285 68.5714 77 78.1607 77 90C77 92.3571 75.075 94.2857 72.7222 94.2857H21.3889C19.0361 94.2857 17.1111 92.3571 17.1111 90C17.1111 78.1607 26.6826 68.5714 38.5 68.5714ZM32.0833 42.8571C32.0833 34.5804 38.7941 27.8571 47.0556 27.8571C55.317 27.8571 62.0278 34.5804 62.0278 42.8571C62.0278 51.1339 55.317 57.8571 47.0556 57.8571C38.7941 57.8571 32.0833 51.1339 32.0833 42.8571ZM96.25 30H126.194C129.75 30 132.611 32.8661 132.611 36.4286C132.611 39.9911 129.75 42.8571 126.194 42.8571H96.25C92.6941 42.8571 89.8333 39.9911 89.8333 36.4286C89.8333 32.8661 92.6941 30 96.25 30ZM96.25 55.7143H126.194C129.75 55.7143 132.611 58.5804 132.611 62.1429C132.611 65.7054 129.75 68.5714 126.194 68.5714H96.25C92.6941 68.5714 89.8333 65.7054 89.8333 62.1429C89.8333 58.5804 92.6941 55.7143 96.25 55.7143Z"
              fill="#16A34A"
            />
          </svg>
        </div>

        {/* message */}
        {isScanning ? (
          <div className="font-semibold text-5xl text-[#16A34A] animate-fade-circle">
            Identifying
          </div>
        ) : (
          <div className="font-semibold text-5xl text-[#16A34A] animate-breathe">
            Please tap your card
          </div>
        )}
      </div>

      {/* ✅ Auto Popup Modal */}
      {popupMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-10 text-center w-1/2 max-w-[600px] transition-opacity duration-200">
            <h2 className="text-3xl font-bold text-[#16A34A] mb-6">Message</h2>
            <p className="text-2xl text-gray-700">{popupMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClockIn;
