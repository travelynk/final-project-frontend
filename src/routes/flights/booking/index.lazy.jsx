import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import BookingForm from "../../../pages/bookingform";
import FlightDetail from "../../../pages/flightdetails";
import NavigationBreadCr from "../../../pages/navigationBreadCr";
import { useState } from "react";

export const Route = createLazyFileRoute("/flights/booking/")({
  component: Booking,
});

export default function Booking() {
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);
  const [bookingCode, setBookingCode] = useState(null);
  const [bookingId, setBookingId] = useState(null); // Tambahkan state untuk bookingId
  const [status, setStatus] = useState(null); // Tambahkan state untuk status
  const navigate = useNavigate();

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
    </>
  );
}
