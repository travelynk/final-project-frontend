import React, { useState, useEffect } from "react";

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(180);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="bg-red-500 text-white text-center py-2 my-4 rounded-lg">
      {timeLeft > 0 ? (
        <span>Selesaikan Pembayaran sebelum: {formatTime(timeLeft)}</span>
      ) : (
        <span>Waktu pembayaran telah habis!</span>
      )}
    </div>
  );
};

export default CountdownTimer;
