import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import PropTypes from "prop-types"; // Import PropTypes
import { useQueryClient, useQuery } from "@tanstack/react-query"; // Import React Query Client

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { z } from "zod";
import { Seat } from "@/services/seat";

const storeBooking = async (bookingData) => {};

// Schema Validasi Zod
const bookingSchema = z.object({
  fullname: z.string().nonempty("Nama lengkap harus diisi"),
  namakeluarga: z.string().optional(),
  phone: z.string().min(10, "Nomor telepon minimal 10 karakter"),
  email: z.string().email("Email tidak valid"),
  passengers: z.array(
    z.object({
      title: z.string().nonempty("Title harus diisi"),
      fullname: z.string().nonempty("Nama lengkap harus diisi"),
      namakeluarga: z.string().optional(),
      birthdate: z.string().nonempty("Tanggal lahir harus diisi"),
      citizenship: z.string().nonempty("Kewarganegaraan harus diisi"),
      passport: z.string().nonempty("KTP/Paspor harus diisi"),
      negarapenerbit: z.string().nonempty("Negara penerbit harus diisi"),
      expiry: z.string().nonempty("Berlaku sampai harus diisi"),
    })
  ),
  selectedSeats: z
    .array(z.string())
    .min(1, "Setidaknya satu kursi harus dipilih"),
});
export default function BookingForm({ onFormSubmit }) {
  const queryClient = useQueryClient();
  const profileData = queryClient.getQueryData(["profile"]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formState, setFormState] = useState({
    fullname: profileData?.fullName || "",
    namakeluarga: "",
    phone: profileData?.phone || "",
    email: profileData?.email || "",
    passengers: [
      {
        title: "",
        fullname: "",
        namakeluarga: "",
        birthdate: "",
        citizenship: "",
        passport: "",
        negarapenerbit: "",
        expiry: "",
      },
    ],
    selectedSeats: [],
  });

  const handleChange = (field, value, index = null) => {
    if (index !== null) {
      setFormState((prev) => {
        const passengers = [...prev.passengers];
        passengers[index][field] = value;
        return { ...prev, passengers };
      });
    } else {
      setFormState((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = () => {
    try {
      bookingSchema.parse({ ...formState, selectedSeats });
      if (onFormSubmit) {
        onFormSubmit();
        setIsSubmitted(true);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        alert(
          error.errors
            .map((err) => `${err.path.join(" -> ")}: ${err.message}`)
            .join("\n")
        );
      }
    }
  };
  //from localstorage
  const [flightId, setFlightId] = useState(null); // State to store the dynamic flightId
  const [currentFlightIndex, setCurrentFlightIndex] = useState(0); // Flight aktif
  const [selectedSeats, setSelectedSeats] = useState([]); // Kursi yang dipilih

  useEffect(() => {
    if (flightId && flightId[currentFlightIndex]) {
      console.log(
        `Fetching seats for flightId: ${flightId[currentFlightIndex]}`
      );
      refetch(); // Fetch data untuk flight aktif
    }
  }, [currentFlightIndex, flightId]);

  useEffect(() => {
    const cartTicket = localStorage.getItem("cartTicket");
    if (cartTicket) {
      try {
        const cartData = JSON.parse(cartTicket);

        // Debugging: Inspect the parsed data
        console.log("Parsed cart data:", cartData);

        const pergiFlights = cartData?.flights?.[0]?.pergi?.flights || [];
        const pulangFlights = cartData?.flights?.[0]?.pulang?.flights || [];

        // Ambil semua flightId untuk pergi
        const pergiFlightIds =
          cartData?.flights[0]?.pergi?.flights?.map((f) => f.flightId) || [];

        // Ambil semua flightId untuk pulang
        const pulangFlightIds =
          cartData?.flights[0]?.pulang?.flights?.map((f) => f.flightId) || [];

        // Gabungkan semua flightId (pergi + pulang)
        const allFlightIds = [...pergiFlightIds, ...pulangFlightIds];

        if (allFlightIds.length > 0) {
          setFlightId(allFlightIds); // Simpan semua flightId
        } else {
          console.warn("No valid flight IDs found in localStorage");
        }
        // Mengambil data passengerCount untuk pergi
        const pergiPassengerCount =
          cartData?.flights[0]?.pergi?.passengerCount || 0;

        // Tentukan passengerCount pulang
        let pulangPassengerCount = 0;

        // Jika ada penerbangan pulang, bagi passengerCount menjadi dua
        if (pulangFlights.length > 0) {
          pulangPassengerCount = Math.floor(pergiPassengerCount / 2);
        } else {
          pulangPassengerCount = pergiPassengerCount; // Jika tidak ada pulang, gunakan yang sama
        }

        // Menghasilkan penumpang berdasarkan passengerCount
        const pergiPassengers = generatePassengers(pergiPassengerCount);
        const pulangPassengers = generatePassengers(pulangPassengerCount);

        // Update formState untuk penumpang pergi dan pulang
        setFormState((prev) => ({
          ...prev,
          passengers: [...pergiPassengers, ...pulangPassengers], // Gabungkan penumpang pergi dan pulang
        }));
      } catch (error) {
        console.error("Failed to parse cartTicket:", error);
      }
    } else {
      console.warn("No cartTicket found in localStorage");
    }
  }, []);

  const generatePassengers = (passengerCount) => {
    const { adult = 0, child = 0, infant = 0 } = passengerCount;
    const passengers = [];

    // Generate passengers based on type
    for (let i = 0; i < adult; i++) {
      passengers.push(createPassengerObject("Adult"));
    }
    for (let i = 0; i < child; i++) {
      passengers.push(createPassengerObject("Child"));
    }
    for (let i = 0; i < infant; i++) {
      passengers.push(createPassengerObject("Infant"));
    }

    return passengers;
  };

  const createPassengerObject = (type) => ({
    title: "",
    fullname: "",
    birthdate: "",
    citizenship: "",
    passport: "",
    negarapenerbit: "",
    expiry: "",
    type,
  });

  //Seat

  // Fetch seats using TanStack Query

  const fetchSeatsByFlightIds = async (flightIds) => {
    if (!flightIds || flightIds.length === 0) {
      throw new Error("No valid flight IDs provided.");
    }

    const token = localStorage.getItem("token"); // Pastikan token ada
    if (!token) {
      throw new Error("Authorization token is missing");
    }

    const allSeatData = []; // Array untuk menampung semua data seat

    // Iterasi untuk setiap flightId secara berurutan
    for (const flightId of flightIds) {
      console.log(`Fetching seats for flightId: ${flightId}`);
      const response = await fetch(
        `https://api-tiketku-travelynk-145227191319.asia-southeast1.run.app/api/v1/seats/${flightId}`, // Menggunakan path parameter
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Sertakan token di header
          },
        }
      );

      if (!response.ok) {
        console.error(
          `Failed to fetch seats for flightId ${flightId}: ${response.statusText}`
        );
        continue; // Lanjutkan ke flightId berikutnya jika ada error
      }

      const data = await response.json();
      allSeatData.push(data); // Tambahkan data seat ke array
    }

    return allSeatData; // Kembalikan semua data seat
  };

  // Menggunakan TanStack Query
  const {
    data: seatData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: flightId?.[currentFlightIndex]
      ? ["seats", flightId[currentFlightIndex]]
      : [], // Gunakan array kosong jika tidak valid
    queryFn: async () => {
      return await fetchSeatsByFlightIds([flightId[currentFlightIndex]]);
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!flightId && currentFlightIndex < flightId.length, // Pastikan query hanya berjalan jika kondisi valid
  });

  if (isLoading) return <p>Loading seats...</p>;
  if (isError) return <p>Failed to load seats. Please try again.</p>;

  // Ensure seatData is available before using map
  if (!seatData || seatData.length === 0) {
    return <p>No seats available for this flight.</p>;
  }

  // Process seat data
  console.log("Seat Data:", seatData);

  if (!seatData || !Array.isArray(seatData)) {
    console.error("seatData is not valid:", seatData);
    return <p>Invalid seat data.</p>;
  }

  const allSeats = seatData.flatMap((item) => {
    if (!item.data || !Array.isArray(item.data)) {
      console.warn("Invalid seat data item:", item);
      return [];
    }
    return item.data;
  });

  const seatRows =
    allSeats.length > 0
      ? Math.max(
          ...allSeats
            .filter((seat) => {
              if (!seat.position) {
                console.warn("Missing position in seat data:", seat);
                return false;
              }
              return true;
            })
            .map((seat) => parseInt(seat.position.match(/\d+/)?.[0] || "1"))
        )
      : 1; // Default jika tidak ada data

  // console.log("Calculated seat rows:", seatRows);

  const seatColumns = ["A", "B", "C", "", "D", "E", "F"];
  const reservedSeats = allSeats
    .filter((seat) => !seat.isAvailable)
    .map((seat) => seat.position);

  // Ensure seat selection respects passenger limits
  const toggleSeatSelection = (seat) => {
    const totalPassengers = formState.passengers.length;

    // Check if the seat is already selected
    if (selectedSeats.some((s) => s.id === seat.id)) {
      // If seat is selected, deselect it
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
      console.log(`Deselected Seat ID: ${seat.id}, Position: ${seat.position}`);
    } else if (selectedSeats.length < totalPassengers) {
      // If seat is not selected, select it
      setSelectedSeats([
        ...selectedSeats,
        { id: seat.id, position: seat.position },
      ]);
      console.log(`Selected Seat ID: ${seat.id}, Position: ${seat.position}`);
    } else {
      console.log("Maximum number of seats selected");
    }
  };

  const handleSaveAndContinue = () => {
    const activeFlightId = flightId[currentFlightIndex];

    console.log(`Data saved for flightId: ${activeFlightId}`);
    console.log("Selected seats:", selectedSeats);

    // Reset kursi terpilih
    setSelectedSeats([]);

    // Pindah ke flight berikutnya jika ada
    if (currentFlightIndex < flightId.length - 1) {
      setCurrentFlightIndex((prev) => prev + 1);
    } else {
      console.log("All flights have been processed!");
    }
  };
  if (currentFlightIndex >= flightId.length) {
    return <p>All flights have been successfully processed!</p>;
  }

  return (
    <div className="max-w-[550px] md:w-2/3  space-y-6 py-[6px] px-4">
      {/* Data Diri Pemesan */}
      <div className="border p-6 rounded-lg shadow-md bg-white">
        <p className="text-xl font-bold mb-4">Isi Data Pemesan</p>
        <div className="bg-[#3C3C3C] text-white rounded-t-lg px-4 py-2 max-h-[40px]">
          <p className="text-xl font-semibold">Data Diri Pemesan</p>
        </div>

        <div className="space-y-4 p-4">
          <div>
            <Label
              className="text-darkblue05 font-bold text-[14px]"
              htmlFor="fullname"
            >
              Nama Lengkap
            </Label>
            <Input
              id="fullname"
              placeholder="Masukkan nama lengkap"
              className="mb-2"
              value={formState.fullname}
              onChange={(e) => handleChange("fullname", e.target.value)}
              disabled={isSubmitted}
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <Label>Punya Nama Keluarga</Label>
            <Switch required id="lastNameSwitch" name="lastNameSwitch" />
          </div>
          <div>
            <Label
              className="text-darkblue05 font-bold text-[14px]"
              htmlFor="namakeluarga"
            >
              Nama Keluarga
            </Label>
            <Input
              required
              id="namakeluarga"
              placeholder="Masukan nama keluarga"
              className="mb-2"
            />
          </div>
          <div>
            <Label
              className="text-darkblue05 font-bold text-[14px]"
              htmlFor="phone"
            >
              Nomor Telepon
            </Label>
            <Input
              required
              id="phone"
              placeholder="Masukkan nomor telepon"
              className="mb-2"
              value={formState.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              disabled={isSubmitted}
            />
          </div>
          <div>
            <Label
              className="text-darkblue05 font-bold text-[14px]"
              htmlFor="email"
            >
              Email
            </Label>
            <Input
              required
              id="email"
              placeholder="Contoh: johndoe@gmail.com"
              type="email"
              className="mb-2"
              value={formState.email}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={isSubmitted}
            />
          </div>
        </div>
      </div>
      {/*komponen data diri penumpang dan seat selection harus dirender ulang berdasarkan jumlah penerbangan saat pergi dan pulang berdasarkan flightId baik itu isTransit = true atau langsung*/}
      <div>
        {/* Data Diri Penumpang */}
        <div className="border p-6 rounded-lg shadow-md bg-white">
          <h3 className="text-xl font-bold mb-4">Isi Data Penumpang</h3>
          <Accordion type="single" collapsible>
            {formState.passengers?.map((passenger, index) => (
              <AccordionItem key={index} value={`passenger-${index}`}>
                <AccordionTrigger className="bg-[#3C3C3C] text-white rounded-lg px-4 py-2 mb-1">
                  Data Diri Penumpang {index + 1} - {passenger.type} Flight:{" "}
                  {formState.flightNum}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 p-4">
                    <div>
                      <Label
                        className="text-darkblue05 font-bold text-[14px]"
                        htmlFor={`title-${index}`}
                      >
                        Title
                      </Label>
                      <Input
                        id={`title-${index}`}
                        placeholder="Mr./Mrs./Miss"
                        className="mb-2"
                        value={formState.passengers[index]?.title}
                        onChange={(e) =>
                          handleChange("title", e.target.value, index)
                        }
                        disabled={isSubmitted}
                      />
                    </div>
                    <div>
                      <Label
                        className="text-darkblue05 font-bold text-[14px]"
                        htmlFor={`fullname-${index}`}
                      >
                        Nama Lengkap
                      </Label>
                      <Input
                        required
                        id={`fullname-${index}`}
                        placeholder="Masukkan nama lengkap"
                        className="mb-2"
                        value={passenger.fullname}
                        onChange={(e) => {
                          const newPassengers = [...formState.passengers];
                          newPassengers[index].fullname = e.target.value;
                          setFormState({
                            ...formState,
                            passengers: newPassengers,
                          });
                        }}
                        disabled={isSubmitted}
                      />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <Label>Punya Nama Keluarga?</Label>
                      <Switch required />
                    </div>
                    <div>
                      <Label
                        className="text-darkblue05 font-bold text-[14px]"
                        htmlFor={`namakeluarga-${index}`}
                      >
                        Nama Keluarga
                      </Label>
                      <Input
                        required
                        id={`namakeluarga-${index}`}
                        placeholder="Masukan Nama Keluarga"
                        className="mb-2"
                      />
                    </div>
                    <div>
                      <Label
                        className="text-darkblue05 font-bold text-[14px]"
                        htmlFor={`birthdate-${index}`}
                      >
                        Tanggal Lahir
                      </Label>
                      <Input
                        required
                        id={`birthdate-${index}`}
                        placeholder="dd/mm/yyyy"
                        type="date"
                        className="mb-2"
                        value={formState.passengers[index]?.birthdate}
                        onChange={(e) =>
                          handleChange("birthdate", e.target.value, index)
                        }
                        disabled={isSubmitted}
                      />
                    </div>
                    <div>
                      <Label
                        className="text-darkblue05 font-bold text-[14px]"
                        htmlFor={`citizenship-${index}`}
                      >
                        Kewarganegaraan
                      </Label>
                      <Input
                        required
                        id={`citizenship-${index}`}
                        placeholder="Indonesia"
                        className="mb-2"
                        value={formState.passengers[index]?.citizenship}
                        onChange={(e) =>
                          handleChange("citizenship", e.target.value, index)
                        }
                        disabled={isSubmitted}
                      />
                    </div>
                    <div>
                      <Label
                        className="text-darkblue05 font-bold text-[14px]"
                        htmlFor={`passport-${index}`}
                      >
                        KTP/Paspor
                      </Label>
                      <Input
                        required
                        id={`passport-${index}`}
                        placeholder="Masukkan nomor KTP atau paspor"
                        className="mb-2"
                        value={formState.passengers[index]?.passport}
                        onChange={(e) =>
                          handleChange("passport", e.target.value, index)
                        }
                        disabled={isSubmitted}
                      />
                    </div>
                    <div>
                      <Label
                        className="text-darkblue05 font-bold text-[14px]"
                        htmlFor={`negarapenerbit-${index}`}
                      >
                        Negara Penerbit
                      </Label>
                      <Input
                        required
                        id={`negarapenerbit-${index}`}
                        placeholder="Masukan Negara Penerbit"
                        className="mb-2"
                        value={formState.passengers[index]?.negarapenerbit}
                        onChange={(e) =>
                          handleChange("negarapenerbit", e.target.value, index)
                        }
                        disabled={isSubmitted}
                      />
                    </div>
                    <div>
                      <Label
                        className="text-darkblue05 font-bold text-[14px]"
                        htmlFor={`expiry-${index}`}
                      >
                        Berlaku Sampai
                      </Label>
                      <Input
                        required
                        id={`expiry-${index}`}
                        placeholder="dd/mm/yyyy"
                        type="date"
                        className="mb-2"
                        value={formState.passengers[index]?.expiry}
                        onChange={(e) =>
                          handleChange("expiry", e.target.value, index)
                        }
                        disabled={isSubmitted}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Seat Selection */}
        <div className="border p-6 rounded-lg shadow-md bg-white mt-5">
          <h3 className="text-xl font-semibold mb-4">Pilih Kursi</h3>
          <div className="flex items-center justify-center text-center p-2 text-lg font-sm mb-4 bg-[#73CA5C] border-b rounded-[4px] text-white h-10">
            Penerbangan {formState.flightNum} -{" "}
            {allSeats.length - reservedSeats.length} Seats Available
          </div>
          <div className="flex justify-center">
            <div className="grid grid-cols-7 gap-2 justify-center items-center">
              {/* Render columns */}
              {seatColumns.map((col, colIndex) => (
                <div key={colIndex} className="text-center font-bold">
                  {col}
                </div>
              ))}

              {/* Render rows */}
              {Array.from({ length: seatRows }).map((_, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  {seatColumns.map((col, colIndex) => {
                    if (col === "") {
                      return (
                        <div
                          key={colIndex}
                          className="w-10 h-10 flex items-center justify-center font-semibold"
                        >
                          {rowIndex + 1}
                        </div>
                      );
                    }

                    const seatId = `${rowIndex + 1}${col}`;
                    const seat = allSeats.find(
                      (seat) => seat.position === seatId
                    ); // Dapatkan objek seat berdasarkan position
                    // Handle case when seat is not found
                    if (!seat) {
                      return (
                        <div
                          key={seatId}
                          className="w-10 h-10 bg-gray-100 border flex items-center justify-center"
                        />
                      );
                    }
                    const isReserved = reservedSeats.includes(seatId);
                    const isSelected = selectedSeats.some(
                      (s) => s.id === seat.id
                    );

                    // Only render seats that exist in the data
                    if (!allSeats.some((seat) => seat.position === seatId)) {
                      return (
                        <div
                          key={seatId}
                          className="w-10 h-10 bg-gray-100 border flex items-center justify-center"
                        />
                      );
                    }

                    // Skip rendering seats that are not in seatData
                    // if (!allSeats.some((seat) => seat.position === seatId)) {

                    //   return null;
                    // }

                    return (
                      <button
                        key={seat.id} // Gunakan id kursi sebagai key
                        className={`w-10 h-10 rounded-md text-white font-semibold flex items-center justify-center ${
                          isReserved
                            ? "bg-green-500 cursor-not-allowed"
                            : isSelected
                              ? "bg-purple-500"
                              : "bg-gray-200"
                        }`}
                        onClick={() =>
                          !isReserved &&
                          !isSubmitted &&
                          toggleSeatSelection(seat)
                        }
                        disabled={isReserved || isSubmitted}
                      >
                        {isSelected
                          ? `P${selectedSeats.findIndex((s) => s.id === seat.id) + 1}`
                          : !isReserved
                            ? "X"
                            : ""}
                      </button>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Buttons */}
      <div className="mt-4 flex gap-4">
        <button className="bg-blue-500 text-white">
          Simpan Penerbangan Saat Ini {formState.flightNum}
        </button>
        <button
          onClick={handleSubmit}
          className={`mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg w-full shadow-[0px_4px_4px_0px_#00000040] ${
            isSubmitted
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
          disabled={isSubmitted}
        >
          Simpan dan lanjut
        </button>
      </div>
    </div>
  );
}

BookingForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
};
