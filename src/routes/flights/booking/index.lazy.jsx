import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import BookingForm from "../../../pages/bookingform";
import FlightDetail from "../../../pages/flightdetails";
import NavigationBreadCr from "../../../pages/navigationBreadCr";
import SocketioNotif from "../../../pages/socketioNotif";
import { useEffect, useState } from "react";
import {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";
import { useSelector } from "react-redux";
import { setToken } from "@/redux/slices/auth"; // Pastikan import ini sesuai dengan lokasi file Anda
import { useToast } from "@/hooks/use-toast.js";
import { useDispatch } from "react-redux";
import { ToastAction } from "@/components/ui/toast";

export const Route = createLazyFileRoute("/flights/booking/")({
  component: Booking,
});

export default function Booking() {
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);
  const [bookingCode, setBookingCode] = useState(null);
  const [bookingId, setBookingId] = useState(null); // Tambahkan state untuk bookingId
  const [status, setStatus] = useState(null); // Tambahkan state untuk status
  const navigate = useNavigate();
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const { toast } = useToast();

  const [showToast, setShowToast] = useState(false); // State untuk toast
  const { token } = useSelector((state) => state.auth);

  const dispatch = useDispatch(); // Tambahkan ini

  useEffect(() => {
    const checkToken = () => {
      // Cek token di localStorage dan Redux store
      const localToken = localStorage.getItem("token");

      if (!localToken || !token) {
        // Pastikan token dihapus dari keduanya
        dispatch(setToken(null));
        localStorage.removeItem("token");

        toast({
          variant: "warning",
          title: "Sesi Berakhir",
          description: "Mohon login kembali untuk melanjutkan pemesanan.",
          action: <ToastAction altText="OK">OK</ToastAction>,
        });

        // Redirect setelah toast muncul
        setTimeout(() => {
          navigate({ to: "/auth/login" });
        }, 2000);
        return;
      }

      // Tambahan: Cek apakah token sama antara localStorage dan Redux
      if (localToken !== token) {
        dispatch(setToken(null));
        localStorage.removeItem("token");

        toast({
          variant: "destructive",
          title: "Sesi Tidak Valid",
          description: "Mohon login kembali untuk keamanan.",
          action: <ToastAction altText="OK">OK</ToastAction>,
        });

        setTimeout(() => {
          navigate({ to: "/auth/login" });
        }, 2000);
        return;
      }

      // Cek token expiration
      try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          dispatch(setToken(null));
          localStorage.removeItem("token");

          toast({
            variant: "destructive",
            title: "Sesi Berakhir",
            description: "Sesi Anda telah berakhir. Mohon login kembali.",
            action: <ToastAction altText="OK">OK</ToastAction>,
          });

          setTimeout(() => {
            navigate({ to: "/auth/login" });
          }, 2000);
        }
      } catch (error) {
        console.error("Error checking token:", error);
        dispatch(setToken(null));
        localStorage.removeItem("token");

        toast({
          variant: "destructive",
          title: "Terjadi Kesalahan",
          description: "Mohon login kembali untuk melanjutkan.",
          action: <ToastAction altText="OK">OK</ToastAction>,
        });

        setTimeout(() => {
          navigate({ to: "/auth/login" });
        }, 2000);
      }
    };

    // Jalankan pengecekan saat komponen di-mount dan setiap perubahan token
    checkToken();

    // Tambahkan interval untuk cek token secara berkala (misalnya setiap 30 detik)
    const intervalId = setInterval(checkToken, 30000);

    // Cleanup interval saat komponen di-unmount
    return () => clearInterval(intervalId);
  }, [token, navigate, dispatch, toast]);

  const handleFormSubmit = ({ bookingResult }) => {
    if (bookingResult?.response?.data?.bookingCode) {
      setSuccessMessageVisible(true);
      setBookingCode(bookingResult.response.data.bookingCode);
      setBookingId(bookingResult.response.data.id); // Simpan bookingId
      setStatus(bookingResult.response.data.status); // Simpan status
    } else {
      console.error("Booking code tidak ditemukan");
    }
  };

  const handlePaymentRedirect = async () => {
    "Status:", status;
    "Booking ID:", bookingId;

    if (status?.toLowerCase() === "unpaid" && bookingId) {
      if (selectedVoucher) {
        // Jika ada voucher, panggil API untuk update total harga
        await updateTotalPrice();
      } else {
        // Jika tidak ada voucher, langsung navigasi
        ("Navigasi langsung tanpa voucher.");

        navigate({ to: `/payment?bookingId=${bookingId}` });
      }
    } else {
      console.error(
        "Tidak bisa redirect, status bukan unpaid atau bookingId tidak tersedia."
      );
    }
  };

  const updateTotalPrice = async () => {
    if (!bookingId || !totalPrice) {
      console.error("Booking ID atau Total Price tidak tersedia.");
      return;
    }

    try {
      const response = await fetch(
        `https://api-tiketku-travelynk-145227191319.asia-southeast1.run.app/api/v1/bookings/total/${bookingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Gunakan token untuk otentikasi
          },
          body: JSON.stringify({
            voucherCode: selectedVoucher?.code, // Sertakan voucherCode jika ada
            totalPrice: totalPrice, // Harga total
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal memperbarui total harga.");
      }

      const data = await response.json();
      "Berhasil memperbarui total harga:", data;

      // Arahkan ke halaman pembayaran
      navigate({ to: `/payment?bookingId=${bookingId}` });
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <>
      <NavigationBreadCr
        initialTime={15 * 60}
        label="Selesaikan Dalam"
        expirationMessage="Maaf, Waktu pemesanan habis. Silahkan ulangi lagi!"
        successMessage="Data Berhasil disimpan"
        redirectPath="/"
        showSuccess={successMessageVisible} // Pass the state
      />
      <div className="flex flex-col md:flex-row gap-4 p-4 max-w-[936px] mx-auto ">
        <BookingForm onFormSubmit={handleFormSubmit} />
        <FlightDetail
          isSubmitted={successMessageVisible}
          bookingCode={bookingCode}
          onPaymentRedirect={handlePaymentRedirect}
          selectedVoucher={selectedVoucher}
          totalPrice={totalPrice}
          setSelectedVoucher={setSelectedVoucher} // Pass the setter
          setTotalPrice={setTotalPrice} // Pass the setter
        />
      </div>
      <SocketioNotif />

      <ToastProvider>
        {showToast && (
          <Toast variant="warning">
            <ToastTitle>Anda Belum Login</ToastTitle>
            <ToastDescription>
              Anda akan diarahkan ke halaman login.
            </ToastDescription>
          </Toast>
        )}
        <ToastViewport className="!top-0 !right-0 !p-4" />
      </ToastProvider>
    </>
  );
}
