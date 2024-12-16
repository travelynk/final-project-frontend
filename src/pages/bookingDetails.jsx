// BookingDetails.js
import { Button } from "../components/ui/button";

const BookingDetails = ({ selectedBooking }) => {
  console.log(selectedBooking);
  return (
    <div className="bg-white rounded-lg py-4 pr-4 ms-2">
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
        <span className="text-purple-600 font-bold">
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
        {selectedBooking.segments &&
          selectedBooking.segments.length > 0 &&
          selectedBooking.segments.map((segment, index) => (
            <div key={index} className="mb-4">
              <div className="mt-4 flex items-center">
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
                    {segment?.flight?.class || "N/A"}
                  </strong>

                  <div>
                    <strong>{segment?.flight?.number || "N/A"}</strong>
                  </div>
                </div>
              </div>

              <p>
                <strong>
                  {segment?.flight?.departure?.schedule?.split(" ")[1] || "N/A"}
                </strong>
                <span className="float-right font-bold text-purple-500">
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
                <span className="float-right font-bold text-purple-500">
                  Kedatangan
                </span>
              </p>
              <p>
                {segment?.flight?.arrival?.schedule?.split(" ")[0] || "N/A"}
              </p>
              <p>{segment?.flight?.arrival?.airport || "N/A"}</p>

              <hr className="my-4 border-t-2 border-gray-500" />
            </div>
          ))}

        <p>
          <strong>Informasi:</strong>
          <br />
          {selectedBooking?.segments?.[0]?.passenger ? (
            <>
              Penumpang 1:{" "}
              {selectedBooking.segments[0].passenger.fullName || "N/A"}
              <br />
              ID:{" "}
              {selectedBooking.segments[0].passenger.identityNumber || "N/A"}
            </>
          ) : (
            <span>No passenger information available.</span>
          )}
        </p>

        <hr className="my-4" />

        <p>
          {selectedBooking?.passengerCount?.adult || 0} Adults
          <span className="float-right">
            IDR{" "}
            {selectedBooking.totalPrice &&
            selectedBooking?.passengerCount?.adult
              ? (
                  selectedBooking.totalPrice /
                  (selectedBooking?.passengerCount?.adult +
                    selectedBooking?.passengerCount?.child)
                ).toLocaleString()
              : "0"}
          </span>
        </p>
        <p>
          {selectedBooking?.passengerCount?.infant || "0"} Infant
          <span className="float-right">IDR 0</span>
        </p>
        <p>
          Tax
          <span className="float-right">
            {" "}
            {selectedBooking.tax?.toLocaleString() || "0"}%
          </span>
        </p>

        <hr className="my-4" />

        <p className="font-bold">
          Total
          <span className="float-right text-purple-600">
            IDR {selectedBooking.totalPrice.toLocaleString() || "N/A"}
          </span>
        </p>
      </div>

      <div>
        {selectedBooking.status !== "Cancelled" && (
          <Button
            className={`w-full h-[42px] mt-4 py-3 text-white rounded-lg text-center ${
              selectedBooking.status === "Issued"
                ? "bg-[#A06ECE] hover:bg-[#8c5f99] active:bg-[#8c5f99]" // For Issued status
                : selectedBooking.status === "Unpaid"
                  ? "bg-[#FF0000] hover:bg-[#cc0000] active:bg-[#b30000]" // Darker red for Unpaid status
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
