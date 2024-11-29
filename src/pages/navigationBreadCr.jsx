import { useEffect, useState } from "react";
import { Toast, ToastProvider, ToastViewport } from "@/components/ui/toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useMatch } from "@tanstack/react-router";

export default function NavigationBreadCr() {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          Toast({
            title: "Peringatan!",
            description: "Waktu telah habis! Selesaikan pemesanan Anda segera.",
            variant: "destructive",
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Matching routes
  const matchSeat = useMatch("/seat");
  const matchPayment = useMatch("/seat/payment");
  const matchCompleted = useMatch("/seat/payment/selesai");

  return (
    <ToastProvider>
      <div className="bg-white border-b h-[154px] flex flex-col justify-end p-4">
        {/* Konten */}
        <div className="flex flex-col md:flex-row items-center justify-between max-w-[936px] ml-64">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link
                  className={
                    matchSeat || matchPayment || matchCompleted
                      ? "text-black text-[20px] font-bold"
                      : "text-gray-400 text-[20px] font-bold"
                  }
                  to="/seat"
                >
                  Isi Data Diri
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="font-bold" />
              <BreadcrumbItem>
                <Link
                  className={
                    matchPayment || matchCompleted
                      ? "text-black text-[20px] font-bold"
                      : "text-gray-400 text-[20px] font-bold"
                  }
                  to="/seat/payment"
                >
                  Bayar
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="font-bold" />
              <BreadcrumbItem>
                <Link
                  className={
                    matchPayment || matchCompleted
                      ? "text-black text-[20px] font-bold"
                      : "text-gray-400 text-[20px] font-bold"
                  }
                  to="/seat/payment/selesai"
                >
                  Selesai
                </Link>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Timer */}
        <div className="mt-4">
          <div className="text-center text-white font-bold py-2 rounded-md bg-allertdanger max-w-[936px] mx-auto">
            Selesaikan dalam {formatTime(timeLeft)}
          </div>
        </div>

        {/* Toast Viewport */}
        <ToastViewport />
      </div>
    </ToastProvider>
  );
}
