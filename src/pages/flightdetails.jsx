import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getVouchers, getVoucherByCode } from "../services/vouchers";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/ui/popover";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
} from "../components/ui/toast";

export default function FlightDetail({ isSubmitted }) {
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0); // Base total price
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState("default");
  const [toastTitle, setToastTitle] = useState("");
  const [toastDescription, setToastDescription] = useState("");
  const [localData, setLocalData] = useState(null);

  const [flightData, setFlightData] = useState(null);
  // Tambahkan state baru untuk passengerCount dan seatClass
  const [passengerCount, setPassengerCount] = useState(null);
  const [seatClass, setSeatClass] = useState(null);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("selectedFlights");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log("Data berhasil diambil:", parsedData);

        if (Array.isArray(parsedData) && parsedData.length > 0) {
          const flight = parsedData[0]?.flights?.[0];
          const passengerCount = parsedData[0]?.passengerCount;
          const seatClass = parsedData[0]?.seatClass;

          if (flight) {
            // Jika facility berupa string yang dipisahkan oleh koma, ubah menjadi array
            if (flight.facility && typeof flight.facility === "string") {
              flight.facility = flight.facility.split(",").map((f) => f.trim());
            }
            setFlightData(flight);
          }
          if (passengerCount) {
            setPassengerCount(passengerCount);
          }
          if (seatClass) {
            setSeatClass(seatClass);
          }

          setLocalData(parsedData);
        } else {
          console.warn("Data flights tidak valid atau kosong.");
        }
      } else {
        console.warn("Data tidak ditemukan di localStorage.");
      }
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
    }
  }, []);

  //price calculation
  const calculatePassengerPrice = (price, count, discount = 1) => {
    const parsedPrice = parsePrice(price); // Pastikan price diproses dengan aman
    return parsedPrice * count * discount;
  };
  function parsePrice(price) {
    if (typeof price === "string") {
      return parseInt(price.replace(/[^\d]/g, ""), 10); // Hilangkan karakter non-digit
    } else if (typeof price === "number") {
      return price; // Jika sudah berupa angka, langsung gunakan
    }
    return 0; // Jika tidak valid, kembalikan 0 sebagai fallback
  }
  useEffect(() => {
    if (localData && passengerCount && flightData?.price) {
      const basePrice = parsePrice(flightData.price); // Konversi price ke angka
      const adultCount = parseInt(passengerCount.adult || "0", 10);
      const childCount = parseInt(passengerCount.child || "0", 10);
      const infantCount = parseInt(passengerCount.infant || "0", 10);

      // Harga per kategori penumpang
      const adultPrice = basePrice * adultCount;
      const childPrice = basePrice * childCount; // Diskon anak-anak (contoh 75%)
      const infantPrice = basePrice * infantCount; // Diskon bayi (contoh 50%)

      const tax = 300000; // Pajak tetap
      const total = adultPrice + childPrice + infantPrice + tax;

      setTotalPrice(total); // Update state totalPrice
    }
  }, [localData, passengerCount, flightData?.price]);

  // Fetch vouchers
  const { data: vouchers = [], isLoading: isFetchingVouchers } = useQuery({
    queryKey: ["vouchers"],
    queryFn: getVouchers,
    staleTime: 1000 * 60 * 5, // Cache data 5 minutes
  });

  // Apply voucher mutation
  const applyVoucherMutation = useMutation({
    mutationFn: ({ code }) => getVoucherByCode(code, totalPrice),
    onSuccess: (data) => {
      console.log("Voucher applied successfully:", data); // Log data yang berhasil diterima

      setSelectedVoucher(data);
      setTotalPrice(data.updatedTotalPrice);

      setToastVariant("success");
      setToastTitle("Voucher Applied");
      setToastDescription(`New total: IDR ${data.updatedTotalPrice}`);
      setShowToast(true);
    },
    onError: (error) => {
      console.error("Error applying voucher:", error); // Log error

      setToastVariant("error");
      setToastTitle("Error");
      setToastDescription(error.message);
      setShowToast(true);
    },
  });

  const handleVoucherSelect = (voucher) => {
    console.log("Voucher selected:", voucher); // Log voucher yang dipilih

    applyVoucherMutation.mutate({ code: voucher.code });
  };

  return (
    <ToastProvider>
      <div className="bg-white rounded-lg p-4">
        <h2 className="text-lg font-bold">
          Booking Code: <span className="text-purple-600">6723y2GHK</span>
        </h2>
        {/*data penerbangan */}
        <div className="mt-4 text-sm">
          <p>
            <strong>{flightData?.departure?.time}</strong>
            <span className="float-right text-purple-500">Keberangkatan</span>
          </p>
          <p>{flightData?.departure?.date}</p>
          <p>
            {flightData?.departure?.airport || "Bandara tidak tersedia"} -
            {flightData?.departure?.terminal || "Terminal tidak tersedia"}
          </p>
          <hr className="my-4" />
          <p>
            <strong>
              {flightData?.airline?.name || "Air line tidak tersedia"} -{" "}
              {seatClass || "Kelas penumpang tidak tersedia"}
            </strong>
          </p>
          <p className="mb-4">
            <strong>{flightData?.flightNum}</strong>
          </p>
          <div>
            <strong>Informasi:</strong>
            <br />
            {Array.isArray(flightData?.facility) ? (
              <ul>
                {flightData.facility.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              flightData?.facility || "Fasilitas tidak tersedia"
            )}
          </div>
          <hr className="my-4" />
          <p>
            <strong>{flightData?.arrival?.time}</strong>
            <span className="float-right text-purple-500">Kedatangan</span>
          </p>
          <p>{flightData?.arrival?.date}</p>
          <p>
            {flightData?.arrival?.airport} - {flightData?.arrival?.terminal}
          </p>
          <hr className="my-4" />

          {/* Voucher Section */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <span className="font-bold">Voucher:</span>
              <span className="text-purple-600">
                {selectedVoucher ? selectedVoucher.code : "Tidak ada"}
              </span>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <button className="bg-purple-500 text-white px-4 py-1 rounded">
                  {isFetchingVouchers ? "Loading..." : "Cek"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="bg-white shadow-md rounded-lg p-4 w-64">
                <h3 className="font-bold text-lg mb-2">Daftar Voucher</h3>
                <ul className="space-y-2">
                  {vouchers.map((voucher) => (
                    <li
                      key={voucher.id}
                      onClick={() => handleVoucherSelect(voucher)}
                      className="p-2 border rounded-lg hover:bg-purple-100 cursor-pointer"
                    >
                      <div className="font-semibold">{voucher.code}</div>
                      <div className="text-sm text-gray-600">
                        {voucher.description}
                      </div>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
          </div>

          {/* Pricing Section berdasarkan flight id*/}
          <p>
            {passengerCount?.adult || "Penumpang dewasa tidak ada"} Adult
            <span className="float-right">
              IDR{" "}
              {calculatePassengerPrice(
                flightData?.price,
                passengerCount?.adult || 0
              ).toLocaleString()}
            </span>
          </p>
          <p>
            {passengerCount?.child || "Penumpang anak tidak ada"} Children
            <span className="float-right">
              IDR{" "}
              {calculatePassengerPrice(
                flightData?.price,
                passengerCount?.child || 0
              ).toLocaleString()}
            </span>
          </p>
          <p>
            {passengerCount?.infant || "Penumpang bayi tidak ada"} Baby
            <span className="float-right">
              IDR{" "}
              {calculatePassengerPrice(
                flightData?.price,
                passengerCount?.infant || 0
              ).toLocaleString()}
            </span>
          </p>
          <p>
            Tax<span className="float-right">IDR 300.000</span>
          </p>
          <hr className="my-4" />
          <p className="font-bold">
            Total
            <span className="float-right text-purple-600">
              IDR {totalPrice.toLocaleString()}
            </span>
          </p>
        </div>

        {isSubmitted && (
          <button className="mt-6 bg-[#FF0000] text-white px-6 py-3 rounded-lg w-full shadow-[0px_4px_4px_0px_#00000040]">
            Lanjut Bayar
          </button>
        )}
        {showToast && (
          <Toast variant={toastVariant}>
            <ToastTitle>{toastTitle}</ToastTitle>
            <ToastDescription>{toastDescription}</ToastDescription>
          </Toast>
        )}
        <ToastViewport />
      </div>
    </ToastProvider>
  );
}

FlightDetail.propTypes = {
  isSubmitted: PropTypes.bool.isRequired,
};
