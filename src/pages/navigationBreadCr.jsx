import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useMatch } from "@tanstack/react-router";

function NavigationBreadCr({
  initialTime,
  label,
  expirationMessage,
  redirectPath,
}) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [showToast, setShowToast] = useState(false);

  const [expired, setExpired] = useState(false);
  const navigate = useNavigate(); // Use navigate hook for navigation

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowToast(true);

          setExpired(true);
          console.log("Timer expired, navigating to:", redirectPath);

          setTimeout(() => {
            navigate({ to: redirectPath }); // Navigate to the path after 3 seconds
          }, 3000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, redirectPath]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const matchSeat = useMatch("/seat");
  const matchPayment = useMatch("/payment");
  const matchCompleted = useMatch("/success");

  return (
    <ToastProvider>
      <div className="bg-white border-b h-[154px] p-3 shadow-md">
        <div className="flex flex-col justify-end h-full max-w-[936px] mx-auto">
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
                <BreadcrumbSeparator className="!font-bold" />
                <BreadcrumbItem>
                  <Link
                    className={
                      matchPayment || matchCompleted
                        ? "text-black text-[20px] font-bold"
                        : "text-gray-400 text-[20px] font-bold"
                    }
                    to="/payment"
                  >
                    Bayar
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="!font-bold" />
                <BreadcrumbItem>
                  <Link
                    className={
                      matchPayment || matchCompleted
                        ? "text-black text-[20px] font-bold"
                        : "text-gray-400 text-[20px] font-bold"
                    }
                    to="/success"
                  >
                    Selesai
                  </Link>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="p-3">
            <div className="text-center text-white font-medium py-2 rounded-md bg-allertdanger">
              {expired ? expirationMessage : `${label} ${formatTime(timeLeft)}`}
            </div>
          </div>
        </div>
        {showToast && (
          <Toast variant="destructive">
            <ToastTitle>Peringatan!</ToastTitle>
            <ToastDescription>{expirationMessage}</ToastDescription>
          </Toast>
        )}
        <ToastViewport className="!top-0 !right-0 !p-4" />
      </div>
    </ToastProvider>
  );
}

NavigationBreadCr.propTypes = {
  initialTime: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  expirationMessage: PropTypes.string.isRequired,
  redirectPath: PropTypes.string.isRequired,
};

export default NavigationBreadCr;
