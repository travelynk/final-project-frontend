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
      <div className="bg-white border-b h-[154px] p-3 shadow-md">
        <div className="flex flex-col justify-end h-full max-w-[936px] mx-auto">
          {/* Breadcrumb */}
          <div className="mb-4">
            <Breadcrumb>
              <BreadcrumbList className="flex gap-2">
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
          <div className="p-3 ">
            <div className="text-center text-white font-medium py-2 rounded-md bg-allertdanger ">
              Selesaikan dalam {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Toast Viewport */}
        <ToastViewport />
      </div>
    </ToastProvider>
  );
}
