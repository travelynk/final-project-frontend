import { createLazyFileRoute } from "@tanstack/react-router";
import BookingForm from "../../pages/bookingform";
import FlightDetail from "../../pages/flightdetails";

export const Route = createLazyFileRoute("/seat/")({
  component: Seat,
});

export default function Seat() {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 max-w-[936px] mx-auto ">
      <BookingForm />
      <FlightDetail />
    </div>
  );
}
