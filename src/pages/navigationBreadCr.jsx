import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
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
import { Link } from "@tanstack/react-router";

function NavigationBreadCr({
  initialTime,
  label,
  expirationMessage,
  successMessage,
  redirectPath,
  showSuccess,
}) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [showToast, setShowToast] = useState(false);
  const [expired, setExpired] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation for current path detection

  useEffect(() => {
    if (success) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowToast(true);
          setExpired(true);
          // console.log("Timer expired, navigating to:", redirectPath);

          setTimeout(() => {
            navigate({ to: redirectPath });
          }, 3000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, redirectPath, success]);

  useEffect(() => {
    if (showSuccess) {
      setSuccess(true);
      setShowToast(false);
    }
  }, [showSuccess]);

  // useEffect(() => {
  //   console.log("Location changed:", location.pathname);
  //   if (
  //     location.pathname === "/success" ||
  //     location.pathname === "/flights/booking"
  //   ) {
  //     console.log("Setting showToast to true");
  //     setShowToast(true);
  //   }
  // }, [location.pathname]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Helper function to check if a path matches the current location
  // Helper function to check active breadcrumbs
  const isActive = (path) => {
    const currentPath = location.pathname;
    if (path === "/flights/booking")
      return ["/flights/booking", "/payment", "/success"].includes(currentPath);
    if (path === "/payment")
      return ["/payment", "/success"].includes(currentPath);
    if (path === "/success") return currentPath === "/success";
    return false;
  };

  // Helper function to determine the toast content
  const getToastContent = () => {
    if (location.pathname === "/flights/booking") {
      return {
        variant: "success",
        title: "Booking Berhasil Disimpan",
        description: "Silahkan Lanjutkan Pembayaran",
      };
    }
    if (location.pathname === "/success") {
      return {
        variant: "success",
        title: "Pembayaran Berhasil",
        description: "Selamat Menikmati Perjalanan Anda",
      };
    }
    return null;
  };

  const toastContent = getToastContent();

  return (
    <ToastProvider>
      <div className="dark:text-darkblue05 border-b h-[154px] p-3 shadow-md">
        <div className="flex flex-col justify-end h-full max-w-[936px] mx-auto">
          <div className="mb-4">
            <Breadcrumb>
              <BreadcrumbList className="flex gap-2">
                <BreadcrumbItem>
                  <span
                    className={
                      isActive("/flights/booking")
                        ? "dark:text-darkblue05 text-[20px] font-bold"
                        : "text-gray-400 text-[20px] font-bold"
                    }
                  >
                    Isi Data Diri
                  </span>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="!font-bold" />
                <BreadcrumbItem>
                  <span
                    className={
                      isActive("/payment")
                        ? "dark:text-darkblue05 text-[20px] font-bold"
                        : "text-gray-400 text-[20px] font-bold"
                    }
                  >
                    Bayar
                  </span>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="!font-bold" />
                <BreadcrumbItem>
                  <span
                    className={
                      isActive("/success")
                        ? "dark:text-darkblue05 text-[20px] font-bold"
                        : "text-gray-400 text-[20px] font-bold"
                    }
                  >
                    Selesai
                  </span>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="p-3">
            {success ? (
              <div className="text-center text-white font-medium py-2 rounded-md bg-green-500">
                {successMessage}
              </div>
            ) : expired ? (
              <div className="text-center text-white font-medium py-2 rounded-md bg-red-500">
                {expirationMessage}
              </div>
            ) : (
              <div className="text-center text-white font-medium py-2 rounded-md bg-allertdanger">
                {label} {formatTime(timeLeft)}
              </div>
            )}
          </div>
        </div>
        {showToast && (
          <Toast variant="destructive">
            <ToastTitle>Peringatan!</ToastTitle>
            <ToastDescription>{expirationMessage}</ToastDescription>
          </Toast>
        )}
        {showSuccess && toastContent && (
          <Toast variant={toastContent.variant}>
            <ToastTitle>{toastContent.title}</ToastTitle>
            <ToastDescription>{toastContent.description}</ToastDescription>
          </Toast>
        )}
        <ToastViewport />
      </div>
    </ToastProvider>
  );
}

NavigationBreadCr.propTypes = {
  initialTime: PropTypes.number,
  label: PropTypes.string,
  expirationMessage: PropTypes.string,
  successMessage: PropTypes.string,
  showSuccess: PropTypes.bool,
  redirectPath: PropTypes.string,
};

export default NavigationBreadCr;
