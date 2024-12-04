import { createLazyFileRoute } from "@tanstack/react-router";
import BookingForm from "../../pages/bookingform";
import FlightDetail from "../../pages/flightdetails";
import NavigationBreadCr from "../../pages/navigationBreadCr";

export const Route = createLazyFileRoute("/seat/")({
  component: Seat,
});

export default function Seat() {
  return (
    <>
      <NavigationBreadCr
        initialTime={5}
        label="Selesaikan Dalam"
        expirationMessage="Maaf, Waktu pemesanan habis. Silahkan ulangi lagi!"
        redirectPath="/"
      />
      <div className="flex flex-col md:flex-row gap-4 p-4 max-w-[936px] mx-auto ">
        <BookingForm />
        <FlightDetail />
      </div>
    </>
  );
}
