import { useState, useEffect } from "react";
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
import { FaTimes } from "react-icons/fa";

let SocketInstance;

const SocketioNotif = () => {
  const [notification, setNotification] = useState("");

  useEffect(() => {
    // Initialize socket connection
    SocketInstance = io(
      "https://api-tiketku-travelynk-145227191319.asia-southeast1.run.app"
    );

    // Event when connected
    SocketInstance.on("connect", () => {
      console.log("Connected to server");
    });

    // Event for payment status
    SocketInstance.on("Payment", (data) => {
      setNotification(data.message); // Set notification message
      console.log(data.message, data.createdAt);
    });

    // Event for booking success
    SocketInstance.on("BookingSuccess", (data) => {
      console.log("BookingSuccess data received:", data);

      setNotification(data.message); // Display booking success message
      console.log(data.message);
    });

    // Handle connection error
    SocketInstance.on("connect_error", (err) => {
      console.log("Connection error:", err.message);
    });

    // Cleanup on component unmount
    return () => {
      SocketInstance.disconnect();
    };
  }, []);

  // Function to dismiss notification
  const handleDismissNotification = () => {
    setNotification(""); // Clear the notification
  };

  // Return the UI
  return (
    <>
      {notification && (
        <div className="absolute right-28 top-18 max-w-sm border bg-white text-black py-4 rounded-lg shadow-lg">
          <div className="px-4">
            <p>Segera Selesaikan Pembayaran!</p>
          </div>
          <div className="flex items-start border-y border-gray-400">
            <div className="flex items-start px-4 py-2">
              <p>{notification}</p>
              <button
                onClick={handleDismissNotification}
                className="text-black"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Export socket instance
export { SocketInstance };
export default SocketioNotif;
