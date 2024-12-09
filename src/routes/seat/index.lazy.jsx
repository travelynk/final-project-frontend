import { createLazyFileRoute } from "@tanstack/react-router";
import BookingForm from "../../pages/bookingform";
import FlightDetail from "../../pages/flightdetails";
import NavigationBreadCr from "../../pages/navigationBreadCr";
import { useState } from "react";

export const Route = createLazyFileRoute("/seat/")({
  component: Seat,
});

export default function Seat() {
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);

  const handleFormSubmit = () => {
    setSuccessMessageVisible(true);
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
        <FlightDetail isSubmitted={successMessageVisible} />
      </div>
    </>
  );
}
