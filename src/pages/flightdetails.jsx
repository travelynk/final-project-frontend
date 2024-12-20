import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

import PropTypes from "prop-types";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getVouchers, getVoucherByCode } from "../services/vouchers";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/ui/popover";
import { ToastProvider, ToastViewport } from "../components/ui/toast";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/ui/accordion"; // ShadCN Accordion
import { useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast.js";
import { ToastAction } from "@/components/ui/toast";
import { IoIosInformationCircle } from "react-icons/io";

export default function FlightDetail({
  isSubmitted,
  bookingCode,
  onPaymentRedirect,
  selectedVoucher,
  totalPrice,
  setSelectedVoucher, // Terima setter dari props
  setTotalPrice, // Terima setter dari props
}) {
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState("default");
  const [toastTitle, setToastTitle] = useState("");
  const [toastDescription, setToastDescription] = useState("");
  const [localData, setLocalData] = useState(null);
  const { toast } = useToast();

  const [flightData, setFlightData] = useState(null);
  // Tambahkan state baru untuk passengerCount dan seatClass
  const [passengerCount, setPassengerCount] = useState(null);
  const [seatClass, setSeatClass] = useState(null);
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      navigate({ to: "/auth/login" });
    }
  }, [navigate, token]);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("cartTicket");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log("Parsed Data:", parsedData);

        if (parsedData && parsedData.flights && parsedData.flights.length > 0) {
          const flight = parsedData.flights[0]?.pergi?.flights;
          const passengerCount = parsedData.flights[0]?.pergi?.passengerCount;
          const seatClass = flight?.seatClass || "Economy";

          if (flight) {
            // Validasi fasilitas
            if (flight.facility && typeof flight.facility === "string") {
              flight.facility = flight.facility.split(",").map((f) => f.trim());
            }
            setFlightData(flight);
          }
          if (passengerCount) {
            setPassengerCount(passengerCount);
          }
          setSeatClass(seatClass);
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

  const [initialTotalPrice, setInitialTotalPrice] = useState(0);

  const calculatePassengerPrice = (pergiData, pulangData, count) => {
    if (count === 0) return 0; // Return 0 if no passengers in this category

    const pergiPrice = parsePrice(pergiData?.price || "0");
    const pulangPrice = parsePrice(pulangData?.price || "0");
    const totalPrice = pergiPrice + pulangPrice;

    return totalPrice * count; // Multiply by the number of passengers
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
    if (localData) {
      const calculateTotalPrice = (flightData, passengerCount) => {
        if (!flightData || !passengerCount) return 0;

        const basePrice = parsePrice(flightData.price); // Convert price to number
        const adultCount = parseInt(passengerCount.adult || "0", 10);
        const childCount = parseInt(passengerCount.child || "0", 10);
        const infantCount = parseInt(passengerCount.infant || "0", 10);

        // Calculate individual passenger categories
        const adultPrice = basePrice * adultCount;
        const childPrice = basePrice * childCount;
        const infantPrice = basePrice * infantCount;

        return adultPrice + childPrice + infantPrice;
      };

      // Calculate prices for pergi and pulang
      const pergiData = localData.flights[0]?.pergi;
      const pulangData = localData.flights[0]?.pulang;

      const pergiPrice = calculateTotalPrice(
        pergiData,
        pergiData?.passengerCount
      );
      const pulangPrice = calculateTotalPrice(
        pulangData,
        pulangData?.passengerCount
      );

      // Calculate total including tax
      const totalBeforeTax = pergiPrice + pulangPrice;
      const totalWithTax = totalBeforeTax * 1.11; // Add 11% tax

      const roundedTotal = Math.round(totalWithTax);

      setInitialTotalPrice(roundedTotal); // Simpan total awal
      setTotalPrice(roundedTotal); // Update total harga
    }
  }, [localData]);

  const handleCancelVoucher = () => {
    console.log("Voucher canceled"); // Log pembatalan voucher
    setSelectedVoucher(null); // Hapus voucher yang dipilih
    setTotalPrice(initialTotalPrice); // Kembalikan harga ke total awal
    setToastVariant("info");
    setToastTitle("Voucher Canceled");
    setToastDescription(
      "Voucher telah dibatalkan, total harga telah diperbarui."
    );
    setShowToast(true);
  };

  // Fetch vouchers
  const { data: vouchers = [], isLoading: isFetchingVouchers } = useQuery({
    queryKey: ["vouchers"],
    queryFn: getVouchers,
    staleTime: 1000 * 60 * 5, // Cache data 5 minutes
  });

  // Apply voucher mutation
  const applyVoucherMutation = useMutation({
    mutationFn: ({ code }) => getVoucherByCode(code, initialTotalPrice),
    onSuccess: (data) => {
      console.log("Voucher applied successfully:", data); // Log data yang berhasil diterima

      setSelectedVoucher(data);
      setTotalPrice(data.updatedTotalPrice); // Update total harga berdasarkan diskon dari initialTotalPrice

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

  useEffect(() => {
    if (showToast) {
      // Call toast when showToast is true
      toast({
        variant: toastVariant,
        title: toastTitle,
        description: toastDescription,
        action: <ToastAction altText="Try again">OK</ToastAction>,
      });

      // Reset showToast after displaying
      setShowToast(false);
    }
  }, [showToast, toastVariant, toastTitle, toastDescription, toast]);

  return (
    <ToastProvider>
      <div className="bg-white rounded-lg p-4 w-1/2 dark:text-black h-fit">
        <h2 className="text-lg font-bold">
          Booking Code: <span className="text-purple-600">{bookingCode}</span>
        </h2>
        {/*data penerbangan */}

        <Accordion type="single" collapsible className="mt-4  ">
          {/* Accordion untuk Pergi */}
          <AccordionItem value="pergi">
            <AccordionTrigger className="bg-[#3C3C3C] text-white rounded-lg px-4 py-2 mb-1 ">
              Penerbangan Pergi
            </AccordionTrigger>
            <AccordionContent>
              {localData?.flights?.[0]?.pergi ? (
                localData.flights[0].pergi.isTransit ? (
                  localData.flights[0].pergi.flights.map((flight, index) => (
                    <div
                      key={index}
                      className="mt-4 text-sm border-b pb-4 mb-4"
                    >
                      <p>
                        <strong>
                          {flight.departure.time || "Waktu tidak tersedia"}
                        </strong>
                        <span className="float-right text-purple-500">
                          Keberangkatan
                        </span>
                      </p>
                      <p>
                        {flight.departure.date || "Tanggal tidak tersedia"}
                        <span className="float-right">
                          {flight.departure.city.name}
                        </span>
                      </p>
                      <p>
                        {flight.departure.airport || "Bandara tidak tersedia"} -{" "}
                        {flight.departure.terminal || "Terminal tidak tersedia"}
                      </p>
                      <hr className="my-4" />
                      <div className="flex items-center">
                        <img
                          src={flight.airline.image}
                          alt=""
                          className="w-8 h-8 mr-2"
                        />
                        <div>
                          <p>
                            <strong>
                              {flight.airline.name || "Airline tidak tersedia"}{" "}
                              - {seatClass || "Kelas tidak tersedia"}
                            </strong>
                          </p>
                          <p className="mb-4">
                            <strong>
                              {flight.flightNum ||
                                "Nomor penerbangan tidak tersedia"}
                            </strong>
                          </p>
                          <div>
                            <strong>Fasilitas:</strong>
                            <br />
                            {Array.isArray(flight.facility) ? (
                              <ul>
                                {flight.facility.map((item, idx) => (
                                  <li key={idx}>{item}</li>
                                ))}
                              </ul>
                            ) : (
                              flight.facility || "Fasilitas tidak tersedia"
                            )}
                          </div>
                        </div>
                      </div>
                      <hr className="my-4" />
                      <p>
                        <strong>
                          {flight.arrival.time || "Waktu tidak tersedia"}
                        </strong>
                        <span className="float-right text-purple-500">
                          Kedatangan
                        </span>
                      </p>
                      <p>
                        {flight.arrival.date || "Tanggal tidak tersedia"}
                        <span className="float-right">
                          {flight.arrival.city.name}
                        </span>
                      </p>
                      <p>
                        {flight.arrival.airport || "Bandara tidak tersedia"} -{" "}
                        {flight.arrival.terminal || "Terminal tidak tersedia"}
                      </p>

                      {/* Transit Information */}
                      {index !==
                        localData.flights[0].pergi.flights.length - 1 && (
                        <div className="flex items-center justify-center mt-4 border-y-2">
                          <hr />
                          <div className="flex items-center ">
                            <IoIosInformationCircle className="mr-2" />
                            <span className="text-sm text-gray-600">
                              Berhenti untuk ganti pesawat di{" "}
                              {flight.arrival.city.name}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="mt-4 text-sm border-b pb-4 mb-4">
                    {/* Data Penerbangan Langsung */}
                    <p>
                      <strong>
                        {localData.flights[0].pergi.flights[0]?.departure
                          .time || "Waktu tidak tersedia"}
                      </strong>
                      <span className="float-right text-purple-500">
                        Keberangkatan
                      </span>
                    </p>
                    <p>
                      {localData.flights[0].pergi.flights[0]?.departure.date ||
                        "Tanggal tidak tersedia"}
                    </p>
                    <p>
                      {localData.flights[0].pergi.flights[0]?.departure
                        .airport || "Bandara tidak tersedia"}{" "}
                      -{" "}
                      {localData.flights[0].pergi.flights[0]?.departure
                        .terminal || "Terminal tidak tersedia"}
                    </p>
                    <hr className="my-4" />
                    <p>
                      <strong>
                        {localData.flights[0].pergi.flights[0]?.airline.name ||
                          "Airline tidak tersedia"}{" "}
                        - {seatClass || "Kelas tidak tersedia"}
                      </strong>
                    </p>
                    <p className="mb-4">
                      <strong>
                        {localData.flights[0].pergi.flights[0]?.flightNum ||
                          "Nomor penerbangan tidak tersedia"}
                      </strong>
                    </p>
                    <div>
                      <strong>Fasilitas:</strong>
                      <br />
                      {Array.isArray(
                        localData.flights[0].pergi.flights[0]?.facility
                      ) ? (
                        <ul>
                          {localData.flights[0].pergi.flights[0].facility.map(
                            (item, idx) => (
                              <li key={idx}>{item}</li>
                            )
                          )}
                        </ul>
                      ) : (
                        localData.flights[0].pergi.flights[0]?.facility ||
                        "Fasilitas tidak tersedia"
                      )}
                    </div>
                    <hr className="my-4" />
                    <p>
                      <strong>
                        {localData.flights[0].pergi.flights[0]?.arrival.time ||
                          "Waktu tidak tersedia"}
                      </strong>
                      <span className="float-right text-purple-500">
                        Kedatangan
                      </span>
                    </p>
                    <p>
                      {localData.flights[0].pergi.flights[0]?.arrival.date ||
                        "Tanggal tidak tersedia"}
                    </p>
                    <p>
                      {localData.flights[0].pergi.flights[0]?.arrival.airport ||
                        "Bandara tidak tersedia"}{" "}
                      -{" "}
                      {localData.flights[0].pergi.flights[0]?.arrival
                        .terminal || "Terminal tidak tersedia"}
                    </p>
                  </div>
                )
              ) : (
                <p>Data penerbangan tidak tersedia.</p>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Accordion untuk Pulang */}
          <AccordionItem value="pulang">
            <AccordionTrigger className="bg-[#3C3C3C] text-white rounded-lg px-4 py-2 mb-1">
              Penerbangan Pulang
            </AccordionTrigger>
            <AccordionContent>
              {localData?.flights?.[0]?.pulang ? (
                localData.flights[0].pulang.isTransit ? (
                  localData.flights[0].pulang.flights.map((flight, index) => (
                    <div
                      key={index}
                      className="mt-4 text-sm border-b pb-4 mb-4"
                    >
                      <p>
                        <strong>
                          {flight.departure.time || "Waktu tidak tersedia"}
                        </strong>
                        <span className="float-right text-purple-500">
                          Keberangkatan
                        </span>
                      </p>
                      <p>{flight.departure.date || "Tanggal tidak tersedia"}</p>
                      <p>
                        {flight.departure.airport || "Bandara tidak tersedia"} -{" "}
                        {flight.departure.terminal || "Terminal tidak tersedia"}
                      </p>
                      <hr className="my-4" />
                      <div>
                        <p>
                          <strong>
                            {flight.airline.name || "Airline tidak tersedia"} -{" "}
                            {seatClass || "Kelas tidak tersedia"}
                          </strong>
                        </p>
                        <p className="mb-4">
                          <strong>
                            {flight.flightNum ||
                              "Nomor penerbangan tidak tersedia"}
                          </strong>
                        </p>
                        <div>
                          <strong>Fasilitas:</strong>
                          <br />
                          {Array.isArray(flight.facility) ? (
                            <ul>
                              {flight.facility.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          ) : (
                            flight.facility || "Fasilitas tidak tersedia"
                          )}
                        </div>
                      </div>
                      <hr className="my-4" />
                      <p>
                        <strong>
                          {flight.arrival.time || "Waktu tidak tersedia"}
                        </strong>
                        <span className="float-right text-purple-500">
                          Kedatangan
                        </span>
                      </p>
                      <p>{flight.arrival.date || "Tanggal tidak tersedia"}</p>
                      <p>
                        {flight.arrival.airport || "Bandara tidak tersedia"} -{" "}
                        {flight.arrival.terminal || "Terminal tidak tersedia"}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="mt-4 text-sm border-b pb-4 mb-4">
                    {/* Data Penerbangan Langsung */}
                    <p>
                      <strong>
                        {localData.flights[0].pulang.flights[0]?.departure
                          .time || "Waktu tidak tersedia"}
                      </strong>
                      <span className="float-right text-purple-500">
                        Keberangkatan
                      </span>
                    </p>
                    <p>
                      {localData.flights[0].pulang.flights[0]?.departure.date ||
                        "Tanggal tidak tersedia"}
                    </p>
                    <p>
                      {localData.flights[0].pulang.flights[0]?.departure
                        .airport || "Bandara tidak tersedia"}{" "}
                      -{" "}
                      {localData.flights[0].pulang.flights[0]?.departure
                        .terminal || "Terminal tidak tersedia"}
                    </p>
                    <hr className="my-4" />
                    <p>
                      <strong>
                        {localData.flights[0].pulang.flights[0]?.airline.name ||
                          "Airline tidak tersedia"}{" "}
                        - {seatClass || "Kelas tidak tersedia"}
                      </strong>
                    </p>
                    <p className="mb-4">
                      <strong>
                        {localData.flights[0].pulang.flights[0]?.flightNum ||
                          "Nomor penerbangan tidak tersedia"}
                      </strong>
                    </p>
                    <div>
                      <strong>Fasilitas:</strong>
                      <br />
                      {Array.isArray(
                        localData.flights[0].pulang.flights[0]?.facility
                      ) ? (
                        <ul>
                          {localData.flights[0].pulang.flights[0].facility.map(
                            (item, idx) => (
                              <li key={idx}>{item}</li>
                            )
                          )}
                        </ul>
                      ) : (
                        localData.flights[0].pulang.flights[0]?.facility ||
                        "Fasilitas tidak tersedia"
                      )}
                    </div>
                    <hr className="my-4" />
                    <p>
                      <strong>
                        {localData.flights[0].pulang.flights[0]?.arrival.time ||
                          "Waktu tidak tersedia"}
                      </strong>
                      <span className="float-right text-purple-500">
                        Kedatangan
                      </span>
                    </p>
                    <p>
                      {localData.flights[0].pulang.flights[0]?.arrival.date ||
                        "Tanggal tidak tersedia"}
                    </p>
                    <p>
                      {localData.flights[0].pulang.flights[0]?.arrival
                        .airport || "Bandara tidak tersedia"}{" "}
                      -{" "}
                      {localData.flights[0].pulang.flights[0]?.arrival
                        .terminal || "Terminal tidak tersedia"}
                    </p>
                  </div>
                )
              ) : (
                <p>Data penerbangan tidak tersedia.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/*total pulang pergi*/}

        <div className="mt-4 text-sm">
          {/* Voucher Section */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <span className="font-bold">Voucher:</span>
              <span className="text-purple-600">
                {selectedVoucher ? selectedVoucher.code : "Tidak ada"}
              </span>
            </div>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="bg-purple-500 text-white px-4 py-1 rounded">
                    {isFetchingVouchers ? "Loading..." : "Cek"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="bg-white shadow-md rounded-lg p-4 w-64 dark:text-black">
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
              {selectedVoucher && (
                <button
                  onClick={handleCancelVoucher}
                  className="bg-red-500 text-white px-4 py-1 rounded"
                >
                  Batalkan
                </button>
              )}
            </div>
          </div>

          {/* Pricing Section berdasarkan flight id*/}
          <p>
            {passengerCount?.adult || "Penumpang dewasa tidak ada"} Adult
            <span className="float-right">
              IDR{" "}
              {calculatePassengerPrice(
                localData?.flights[0]?.pergi,
                localData?.flights[0]?.pulang,
                passengerCount?.adult || 0
              ).toLocaleString()}
            </span>
          </p>
          <p>
            {passengerCount?.child || "Penumpang anak tidak ada"} Child
            <span className="float-right">
              IDR{" "}
              {calculatePassengerPrice(
                localData?.flights[0]?.pergi,
                localData?.flights[0]?.pulang,
                passengerCount?.child || 0
              ).toLocaleString()}
            </span>
          </p>
          <p>
            {passengerCount?.infant || "Penumpang bayi tidak ada"} Baby
            <span className="float-right">
              IDR{" "}
              {calculatePassengerPrice(
                localData?.flights[0]?.pergi,
                localData?.flights[0]?.pulang,
                passengerCount?.infant || 0
              ).toLocaleString()}
            </span>
          </p>
          <p>
            Tax<span className="float-right">11%</span>
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
          <button
            className="mt-6 bg-[#FF0000] text-white px-6 py-3 rounded-lg w-full shadow-[0px_4px_4px_0px_#00000040]"
            onClick={onPaymentRedirect}
          >
            Lanjut Bayar
          </button>
        )}

        <ToastViewport />
      </div>
    </ToastProvider>
  );
}

FlightDetail.propTypes = {
  isSubmitted: PropTypes.bool.isRequired,
};
