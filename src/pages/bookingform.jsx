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
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [parsedData, setParsedData] = useState({});
  const [currentFlights, setCurrentFlights] = useState([]);
  const [currentFlightIndex, setCurrentFlightIndex] = useState(0);
  const [currentFlightId, setCurrentFlightId] = useState(null);
  const [flightSeatSelections, setFlightSeatSelections] = useState({});
  const [currentFlightSeatPhase, setCurrentFlightSeatPhase] = useState(0);

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
      // Combine all seat selections into a single array
      const allSelectedSeats = Object.values(flightSeatSelections).flat();

      // Prepare final submission data
      const finalSubmissionData = {
        bookingDetails: formState,
        seatSelections: flightSeatSelections,
        allSelectedSeats: allSelectedSeats,
      };

      // Validate using the existing schema, but with combined seats
      bookingSchema.parse({
        ...formState,
        selectedSeats: allSelectedSeats,
      });

      if (onFormSubmit) {
        onFormSubmit(finalSubmissionData);
        setIsSubmitted(true);

        // Console log the final submission data
        console.log("Booking Submission Successful:", {
          bookingDetails: {
            ...formState,
            // Optionally mask sensitive information
            passengers: formState.passengers.map((p) => ({
              ...p,
              passport: p.passport ? "*".repeat(p.passport.length) : "",
              fullname: p.fullname,
            })),
          },
          seatSelections: flightSeatSelections,
          allSelectedSeats: allSelectedSeats,
        });
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
  // In the initial useEffect
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("cartTicket"));
    if (storedData) {
      const flightData = storedData.flights[0];
      setParsedData(flightData);

      // Combine flights from both going and return trips
      const totalFlights = [
        ...(flightData.pergi?.flights || []),
        ...(flightData.pulang?.flights || []),
      ];

      console.log("Total Flights Detected:", totalFlights.length);

      // Initialize seat selections for all flights
      const initialSeatSelections = totalFlights.reduce(
        (acc, flight, index) => {
          acc[index] = [];
          return acc;
        },
        {}
      );

      setFlightSeatSelections(initialSeatSelections);

      // Load first flight data
      loadFlightData(flightData, 0);
      setCurrentFlights(storedData.flights || []);
    }
  }, []);

  // Modify loadFlightData to handle multiple flight types
  const loadFlightData = (flights, index) => {
    // Combine flights from both going and return trips
    const allFlights = [
      ...(flights.pergi?.flights || []),
      ...(flights.pulang?.flights || []),
    ];

    const flightSegment = allFlights[index];

    console.log("Loading Flight Data:", {
      index,
      flightSegment,
    });

    const flightId = flightSegment?.flightId;

    if (flightId) {
      setCurrentFlightId(flightId);
      queryClient.prefetchQuery({
        queryKey: ["seats", flightId],
        queryFn: () => Seat(flightId),
        staleTime: 1000 * 60 * 5,
      });
    }

    // Generate passengers based on the current flight
    const passengers = generatePassengers(
      flights?.pergi?.passengerCount || flights?.pulang?.passengerCount
    );

    setFormState((prev) => ({
      ...prev,
      flightNum: flightSegment?.flightNum || "",
      passengers: passengers,
    }));
  };

  const generatePassengers = (passengerCount) => {
    const { adult = 0, child = 0, infant = 0 } = passengerCount;
    const passengers = [];

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
  const handleSaveCurrentFlight = () => {
    // Simpan data formState saat ini ke currentFlights
    setCurrentFlights((prev) => [...prev, formState]);

    // Cek apakah masih ada flightId berikutnya untuk dirender
    const nextIndex = currentFlightIndex + 1;

    if (parsedData.pergi?.flights[nextIndex]) {
      setCurrentFlightIndex(nextIndex);
      loadFlightData(parsedData, nextIndex);
    } else if (
      parsedData.pulang?.flights[nextIndex - parsedData.pergi?.flights.length]
    ) {
      setCurrentFlightIndex(nextIndex);
      loadFlightData(parsedData, nextIndex - parsedData.pergi?.flights.length);
    }
  };

  const allFlightsSaved = () => {
    const totalFlights =
      (parsedData.pergi?.flights?.length || 0) +
      (parsedData.pulang?.flights?.length || 0);
    return currentFlights.length === totalFlights;
  };

  //Seat

  // Fetch seats using TanStack Query

  const {
    data: seatData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["seats", currentFlightId], // Use the flightId for unique seat query
    queryFn: () => Seat(currentFlightId), // Adjust Seat function to accept flightId
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <p>Loading seats...</p>;
  if (isError) return <p>Failed to load seats. Please try again.</p>;

  const seatRows = Math.max(
    ...(seatData?.map((seat) => parseInt(seat.position[0])) || [1])
  );
  const seatColumns = ["A", "B", "C", "", "D", "E", "F"];
  const reservedSeats = seatData
    .filter((seat) => !seat.isAvailable)
    .map((seat) => seat.position);

  const toggleSeatSelection = (seat) => {
    // Use currentFlightSeatPhase as the key for current flight
    setFlightSeatSelections((prev) => {
      const currentFlightKey = currentFlightSeatPhase;
      const currentSeats = prev[currentFlightKey] || [];

      // Log seat selection details
      console.log(
        `Seat Selection - Flight: ${currentFlightKey + 1}, Seat: ${seat}, Flight Number: ${formState.flightNum}`
      );

      // If seat is already selected, remove it
      if (currentSeats.includes(seat)) {
        console.log(
          `Deselected Seat: ${seat} on Flight ${currentFlightKey + 1}`
        );
        return {
          ...prev,
          [currentFlightKey]: currentSeats.filter((s) => s !== seat),
        };
      }

      // Add seat to selections
      console.log(`Selected Seat: ${seat} on Flight ${currentFlightKey + 1}`);
      return {
        ...prev,
        [currentFlightKey]: [...currentSeats, seat],
      };
    });
  };
  // New method to handle moving to next flight's seat selection
  const handleNextFlightSeatSelection = () => {
    // Validate seat selection for current flight
    const currentSeats = flightSeatSelections[currentFlightSeatPhase];
    if (!currentSeats || currentSeats.length === 0) {
      alert("Please select at least one seat for this flight.");
      return;
    }

    // Determine total flights from both going and return trips
    const totalFlights = [
      ...(parsedData.pergi?.flights || []),
      ...(parsedData.pulang?.flights || []),
    ];

    console.log("Current Flight Phase:", currentFlightSeatPhase);
    console.log("Total Flights:", totalFlights.length);

    // Move to next flight's seat selection
    const nextPhase = currentFlightSeatPhase + 1;

    if (nextPhase < totalFlights.length) {
      setCurrentFlightSeatPhase(nextPhase);

      // Load next flight's data
      loadFlightData(parsedData, nextPhase);
    } else {
      // All flights' seats selected, proceed to final submission
      handleSubmit();
    }
  };

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
            {seatData.length - reservedSeats.length} Seats Available
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
                    // Handle the empty column separately
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
                    const isReserved = reservedSeats.includes(seatId);

                    // Get current flight's selected seats
                    const currentSeats =
                      flightSeatSelections[currentFlightSeatPhase] || [];
                    const isSelected = currentSeats.includes(seatId);

                    // Only render seats that exist in the data
                    if (!seatData.some((seat) => seat.position === seatId)) {
                      return (
                        <div
                          key={seatId}
                          className="w-10 h-10 bg-gray-100 border flex items-center justify-center"
                        />
                      );
                    }

                    return (
                      <button
                        key={seatId}
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
                          toggleSeatSelection(seatId)
                        }
                        disabled={isReserved || isSubmitted}
                      >
                        {isSelected
                          ? `P${currentSeats.indexOf(seatId) + 1}`
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
        {/* Buttons */}
        <div className="mt-4 flex gap-4">
          <button
            onClick={handleSaveCurrentFlight}
            className="bg-blue-500 text-white"
          >
            Simpan Penerbangan Saat Ini {formState.flightNum}
          </button>

          {/* New button for multi-flight seat selection */}
          <button
            onClick={handleNextFlightSeatSelection}
            className="bg-blue-500 text-white"
          >
            {(() => {
              const totalFlights = [
                ...(parsedData.pergi?.flights || []),
                ...(parsedData.pulang?.flights || []),
              ];
              return currentFlightSeatPhase < totalFlights.length - 1
                ? `Pilih Kursi Penerbangan ${currentFlightSeatPhase + 2}`
                : "Simpan dan Lanjut";
            })()}
          </button>

          {/* Keep the existing conditional rendering for all flights saved */}
          {allFlightsSaved() && (
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
          )}
        </div>
        {allFlightsSaved() && (
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
        )}
      </div>
    </div>
  );
}

BookingForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
};
