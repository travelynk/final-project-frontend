import { Button } from "../components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { IoIosInformationCircle } from "react-icons/io"; // Transit info icon

const BookingDetails = ({ selectedBooking }) => {
  const navigate = useNavigate();
  const [isReturnFlight, setIsReturnFlight] = useState(false);
  selectedBooking;

  // Get unique isReturn values (either true or false)
  const uniqueReturnTypes = [
    ...new Set(selectedBooking.segments.map((segment) => segment.isReturn)),
  ];

  // Function to check if two flights form a transit
  const isTransit = (currentSegment, nextSegment) => {
    return (
      currentSegment?.flight?.arrival?.city?.name ===
      nextSegment?.flight?.departure?.city?.name
    );
  };

  return (
    <div className="rounded-lg py-4 pr-4 ms-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Detail Pesanan</h2>
        <div
          className={`flex justify-center items-center text-white w-auto h-[28px] px-4 rounded-full ${
            selectedBooking.status === "Issued"
              ? "bg-[#73CA5C]"
              : selectedBooking.status === "Unpaid"
                ? "bg-[#FF0000]"
                : selectedBooking.status === "Cancelled"
                  ? "bg-[#B2BEB5]"
                  : "bg-[#FF0000]"
          }`}
        >
          {selectedBooking.status || "N/A"}
        </div>
      </div>

      <h2 className="text-lg">
        Booking Code:{" "}
        <span className="text-darkblue05 font-bold">
          {selectedBooking.bookingCode || "N/A"}
        </span>
      </h2>

      {/* Conditionally render QR code when status is "Issued" */}
      {selectedBooking.status === "Issued" && (
        <img
          className="ms-[75px] mt-2 h-[200px] w-[200px]"
          src={selectedBooking.urlQrcode || "/path/to/default-image.png"}
          alt="airline logo"
        />
      )}

      <div className="mt-4 text-sm">
        {/* Conditionally render buttons based on the uniqueReturnTypes */}
        {uniqueReturnTypes.length > 1 && (
          <div className="flex space-x-4 mb-4">
            <Button
              onClick={() => setIsReturnFlight(false)} // Show Flight 1 (Outbound)
              className={`px-4 py-2 w-full text-white rounded-[12px] ${!isReturnFlight ? "bg-darkblue05" : "bg-gray-300 dark:bg-slate-800"}`}
            >
              Keberangkatan
            </Button>

            <Button
              onClick={() => setIsReturnFlight(true)} // Show Flight 2 (Return)
              className={`px-4 py-2 w-full text-white rounded-[12px] ${isReturnFlight ? "bg-darkblue05" : "bg-gray-300 dark:bg-slate-800"}`}
            >
              Pulang
            </Button>
          </div>
        )}

        {/* Filter and display segments based on whether it's return or outbound flight */}
        {selectedBooking.segments
          .filter((segment) => segment.isReturn === isReturnFlight)
          .reduce((uniqueSegments, segment) => {
            // If the flight ID is not already in the uniqueSegments array, add it
            if (
              !uniqueSegments.some((s) => s.flight.id === segment.flight.id)
            ) {
              uniqueSegments.push(segment);
            }
            return uniqueSegments;
          }, [])
          .map((segment, index, array) => {
            const nextSegment = array[index + 1];
            const isTransitFlight = isTransit(segment, nextSegment);

            return (
              <div key={index} className="mb-4">
                <div className="mt-2 flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-[24px] w-[24px]"
                      src={
                        segment?.flight?.airline?.image ||
                        "/path/to/default-image.png"
                      }
                      alt="airline logo"
                    />
                  </div>

                  <div className="ml-2">
                    <strong>
                      {segment?.flight?.airline?.name || "N/A"} -{" "}
                      {segment?.flight?.seatClass || "N/A"}
                    </strong>

                    <div>
                      <strong>{segment?.flight?.flightNum || "N/A"}</strong>
                    </div>
                  </div>
                </div>

                <p>
                  <strong>
                    {segment?.flight?.departure?.schedule?.split(" ")[1] ||
                      "N/A"}
                  </strong>
                  <span className="float-right font-bold text-darkblue05">
                    Keberangkatan
                  </span>
                </p>
                <p>
                  {segment?.flight?.departure?.schedule?.split(" ")[0] || "N/A"}
                </p>
                <p>
                  {segment?.flight?.departure?.airport || "N/A"} -{" "}
                  {segment?.flight?.departure?.terminal?.name || "N/A"}
                </p>

                <hr className="my-4" />

                <p className="mt-4">
                  <strong>
                    {segment?.flight?.arrival?.schedule?.split(" ")[1] || "N/A"}
                  </strong>
                  <span className="float-right font-bold text-darkblue05">
                    Kedatangan
                  </span>
                </p>
                <p>
                  {segment?.flight?.arrival?.schedule?.split(" ")[0] || "N/A"}
                </p>
                <p>{segment?.flight?.arrival?.airport || "N/A"}</p>

                {/* Transit Information */}
                {isTransitFlight && (
                  <div className=" mt-4">
                    <hr className="w-full" />
                    <div className="flex items-center justify-center space-x-2">
                      <IoIosInformationCircle className="mr-2 text-2xl" />{" "}
                      {/* Increase only icon size */}
                      <span className="text-sm text-gray-600">
                        Berhenti untuk ganti pesawat di{" "}
                        {nextSegment?.flight?.departure?.city?.name}
                      </span>
                    </div>
                  </div>
                )}

                <hr className="my-4 border-t-2 border-gray-500" />
              </div>
            );
          })}

        <div>
          <strong>Informasi:</strong>
          <br />
          {selectedBooking?.segments?.length > 0 ? (
            selectedBooking.segments
              .reduce((uniquePassengers, segment) => {
                const passenger = segment?.passenger;

                if (
                  passenger &&
                  !uniquePassengers.some(
                    (p) => p.identityNumber === passenger.identityNumber
                  )
                ) {
                  uniquePassengers.push(passenger);
                }

                return uniquePassengers;
              }, [])
              .map((passenger, index) => (
                <div key={index}>
                  Penumpang {index + 1}: {passenger.fullName || "N/A"}
                  <br />
                  ID: {passenger.identityNumber || "N/A"}
                </div>
              ))
          ) : (
            <span>No passenger information available.</span>
          )}
        </div>

        <hr className="my-4" />

        <p>
          {selectedBooking?.passengerCount?.adult || 0} Adults
          <span className="float-right">
            IDR {selectedBooking.adultTotalPrice.toLocaleString() || "0"}
          </span>
        </p>

        <p>
          {selectedBooking?.passengerCount?.child || 0} Children
          <span className="float-right">
            IDR {selectedBooking.childTotalPrice.toLocaleString() || "0"}
          </span>
        </p>

        <p>
          {selectedBooking?.passengerCount?.infant || "0"} Infant
          <span className="float-right">IDR 0</span>
        </p>

        {selectedBooking?.voucherCode && (
          <p>
            Diskon
            <span className="float-right">
              IDR {selectedBooking.voucher?.value?.toLocaleString() || "0"}
            </span>
          </p>
        )}

        <p>
          Tax
          <span className="float-right">
            {selectedBooking.tax?.toLocaleString() || "0"}%
          </span>
        </p>

        <hr className="my-4" />

        <p className="font-bold">
          Total
          <span className="float-right text-darkblue05">
            IDR {selectedBooking.totalPrice.toLocaleString() || "N/A"}
          </span>
        </p>
      </div>

      <div>
        {selectedBooking.status !== "Cancelled" && (
          <Button
            onClick={() => {
              if (selectedBooking.status === "Unpaid") {
                navigate({ to: `/payment?bookingId=${selectedBooking.id}` });
              } else if (selectedBooking.status === "Issued") {
                window.location.href = selectedBooking.urlTicket;
              }
            }}
            className={`w-full h-[42px] mt-4 py-3 text-white rounded-lg text-center ${
              selectedBooking.status === "Issued"
                ? "bg-darkblue05 hover:bg-darkblue04 active:bg-darkblue05"
                : selectedBooking.status === "Unpaid"
                  ? "bg-[#FF0000] hover:bg-[#cc0000] active:bg-[#b30000]"
                  : "bg-gray-500 hover:bg-gray-600 active:bg-gray-700"
            }`}
          >
            {selectedBooking.status === "Issued"
              ? "Cetak Tiket"
              : selectedBooking.status === "Unpaid"
                ? "Lanjut Bayar"
                : "N/A"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default BookingDetails;
