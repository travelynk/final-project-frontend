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

export const Route = createLazyFileRoute("/flights/booking/")({
  component: Booking,
});

export default function Booking() {
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);
  const [bookingCode, setBookingCode] = useState(null);
  const [bookingId, setBookingId] = useState(null); // Tambahkan state untuk bookingId
  const [status, setStatus] = useState(null); // Tambahkan state untuk status
  const navigate = useNavigate();

  const [showToast, setShowToast] = useState(false); // State untuk toast
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      setShowToast(true); // Tampilkan toast
      setTimeout(() => {
        navigate({ to: "/auth/login" }); // Arahkan ke /auth/login setelah 1 detik
      }, 1000); // 1000ms = 1 detik
    }
  }, [navigate, token]);

  const handleFormSubmit = ({ bookingResult }) => {
    if (bookingResult?.data?.bookingCode) {
      setSuccessMessageVisible(true);
      setBookingCode(bookingResult.data.bookingCode);
      setBookingId(bookingResult.data.id); // Simpan bookingId
      setStatus(bookingResult.data.status); // Simpan status
    } else {
      console.error("Booking code tidak ditemukan");
    }
  };

  const handlePaymentRedirect = () => {
    console.log("Status:", status);
    console.log("Booking ID:", bookingId);

    if (status?.toLowerCase() === "unpaid" && bookingId) {
      navigate({ to: `/payment?bookingId=${bookingId}` });
    } else {
      console.error(
        "Tidak bisa redirect, status bukan unpaid atau bookingId tidak tersedia."
      );
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
