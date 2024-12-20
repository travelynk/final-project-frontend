import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useLocation, useNavigate } from "@tanstack/react-router";
import PropTypes from "prop-types"; // Import PropTypes
import { useQueryClient, useQuery } from "@tanstack/react-query"; // Import React Query Client
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
} from "../components/ui/toast";
import { useToast } from "@/hooks/use-toast.js";
import { ToastAction } from "@/components/ui/toast";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { z } from "zod";
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
// New function for booking API call
const storeBooking = async (bookingData) => {
  const token = localStorage.getItem("token");

  try {
    console.log("Booking Request Body:", JSON.stringify(bookingData, null, 2));

    const response = await fetch(
      "https://api-tiketku-travelynk-145227191319.asia-southeast1.run.app/api/v1/bookings",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      }
    );

    const responseBody = await response.json();

    if (!response.ok) {
      console.error("Booking API Error Response:", responseBody);
      throw new Error(responseBody.message || "Booking failed");
    }

    console.log("Booking successful:", responseBody);

    // Mengembalikan data yang dikirim dan respons
    return {
      sentData: bookingData, // Data yang dikirim
      response: responseBody, // Respons API
    };
  } catch (error) {
    console.error("Booking error:", error);
    throw error;
  }
};

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
      passport: z
        .string()
        .regex(/^\d{16}$/, "KTP/Paspor harus berupa angka 16 digit"),
      negarapenerbit: z.string().nonempty("Negara penerbit harus diisi"),
      expiry: z.string().nonempty("Berlaku sampai harus diisi"),
    })
  ),
  selectedSeats: z
    .array(
      z.object({
        id: z.number(), // id should be a number
        position: z.string(), // position should be a string
      })
    )
    .min(1, "Setidaknya satu kursi harus dipilih"),
});

export default function BookingForm({ onFormSubmit }) {
  const [socket, setSocket] = useState(null);
  const [notification, setNotification] = useState("");
  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(
      "https://api-tiketku-travelynk-145227191319.asia-southeast1.run.app"
    );

    // Event when connected
    socketInstance.on("connect", () => {
      console.log("Connected to server");
    });

    // Event for Unpaid status
    socketInstance.on("Status Pembayaran (Unpaid)", (data) => {
      setNotification(data.message); // Set notification message
      console.log("isi pesan :", data.message);
      console.log("tanggal pemesanan:", data.createdAt);
    });

    // Handle connection error
    socketInstance.on("connect_error", (err) => {
      console.log("Connection error:", err.message);
    });

    setSocket(socketInstance); // Save socket instance to state

    // Cleanup on component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);
  // console.log(notification);

  const Notification = ({ message, onDismiss }) => {
    if (!message) return null;
    return (
      message && (
        <div className="absolute right-28 top-18 max-w-sm border bg-white text-black py-4 rounded-lg shadow-lg">
          <div className="px-4">
            <p>Segera Selesaikan Pembayaran!</p>
          </div>
          <div className="flex items-start border-y border-gray-400">
            <div className="flex items-start px-4 py-2">
              <p>{message}</p>
              <button onClick={onDismiss} className="text-black">
                {/* SVG icon for the "X" mark */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )
    );
  };

  const handleDismissNotification = () => {
    setNotification(""); // Clear the notification
  };

  const queryClient = useQueryClient();
  const profileData = queryClient.getQueryData(["profile"]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState("default");
  const [toastTitle, setToastTitle] = useState("");
  const [toastDescription, setToastDescription] = useState("");
  const { toast } = useToast();

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

  //from localstorage
  const [flightId, setFlightId] = useState(null); // State to store the dynamic flightId
  const [currentFlightIndex, setCurrentFlightIndex] = useState(0); // Flight aktif
  const [selectedSeats, setSelectedSeats] = useState([]); // Kursi yang dipilih
  const [seatSelectionComplete, setSeatSelectionComplete] = useState([]); // Track seat completion per flight

  // Clear seat selection data on refresh
  useEffect(() => {
    // Reset seat selection data on page refresh
    localStorage.removeItem("seatSelection");
  }, []);

  useEffect(() => {
    const cartTicket = localStorage.getItem("cartTicket");
    if (cartTicket) {
      try {
        const cartData = JSON.parse(cartTicket);

        const pergiFlights = cartData?.flights?.[0]?.pergi?.flights || [];
        const pulangFlights = cartData?.flights?.[0]?.pulang?.flights || [];

        const pergiFlightIds = pergiFlights.map((f) => ({
          flightId: f.flightId,
          isReturn: false,
        }));

        const pulangFlightIds = pulangFlights.map((f) => ({
          flightId: f.flightId,
          isReturn: true,
        }));

        const allFlightIds = [...pergiFlightIds, ...pulangFlightIds];

        if (allFlightIds.length > 0) {
          setFlightId(allFlightIds);
        } else {
          console.warn("No valid flight IDs found in localStorage");
        }

        const pergiPassengerCount =
          cartData?.flights[0]?.pergi?.passengerCount || 0;

        const pergiPassengers = generatePassengers(pergiPassengerCount);
        const pulangPassengers =
          pulangFlights.length > 0 ? pergiPassengers : [];

        // Debugging: Pastikan jumlah penumpang benar
        console.log("Passengers for Outbound Flight:", pergiPassengers);
        console.log("Passengers for Return Flight:", pulangPassengers);
        console.log("Combined Passengers:", [...pergiPassengers]);

        setFormState((prev) => ({
          ...prev,
          passengers:
            pulangFlights.length > 0 ? pergiPassengers : [...pergiPassengers],
        }));
      } catch (error) {
        console.error("Failed to parse cartTicket:", error);
      }
    } else {
      console.warn("No cartTicket found in localStorage");
    }
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = location.pathname;

    // Jika bukan di halaman "/flights/booking", hapus cartTicket dan seatSelection dari localStorage
    if (!currentPath.startsWith("/flights/booking")) {
      localStorage.removeItem("cartTicket");
      localStorage.removeItem("seatSelection");
    }

    // Jika di halaman "/flights/booking" tapi cartTicket tidak ada, redirect ke "/auth/login"
    if (currentPath.startsWith("/flights/booking")) {
      const cartTicket = localStorage.getItem("cartTicket");
      if (!cartTicket) {
        navigate({ to: "/" });
      }
    }
  }, [location, navigate]);

  //generatePassengers untuk Isi Data Penumpang
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

    // Iterasi untuk setiap flightId
    for (const { flightId } of flightIds) {
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
  // console.log("Seat Data:", seatData);

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
      toast({
        variant: "info",
        title: "Pemilihan Tempat Duduk.",
        description: "Pemilihan Telah Mencapai Batas.",
        action: <ToastAction altText="Try again">OK</ToastAction>,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      // Retrieve seat selection data from localStorage
      const seatSelectionData =
        JSON.parse(localStorage.getItem("seatSelection")) || [];

      console.log("seatSelectionData:", seatSelectionData);

      // Validate if seatSelectionData matches the flights
      if (seatSelectionData.length !== flightId.length) {
        throw new Error(
          "Seat selection data does not match the number of flights."
        );
      }

      // Construct flightSegments from seatSelectionData
      const flightSegments = seatSelectionData.flatMap((flightData) =>
        flightData.seats.map((seat) => ({
          flightId: flightData.flightId.flightId, // Get the flightId from seatSelectionData
          isReturn: flightData.flightId.isReturn, // Use isReturn from seatSelectionData
          seatId: seat.seatId,
          passenger: {
            title: seat.passenger.title,
            identityNumber: seat.passenger.passport,
            fullName: seat.passenger.fullname,
            familyName: seat.passenger.namakeluarga, // Assuming you have this field
            dob: seat.passenger.birthdate,
            nationality: seat.passenger.citizenship,
            issuingCountry: seat.passenger.negarapenerbit,
            identityExp: seat.passenger.expiry,
          },
        }))
      );

      // Construct the booking payload
      const bookingData = {
        roundTrip: flightId.some((f) => f.isReturn), // Determine if it's a round trip
        passengerCount: {
          adult: formState.passengers.filter((p) => p.type === "Adult").length,
          child: formState.passengers.filter((p) => p.type === "Child").length,
          infant: formState.passengers.filter((p) => p.type === "Infant")
            .length,
        },
        flightSegments,
      };

      console.log(
        "Booking Request Body:",
        JSON.stringify(bookingData, null, 2)
      );

      // Call the storeBooking API function
      const response = await storeBooking(bookingData);

      // Notify user of successful booking

      // Handle successful booking
      console.log("Booking successful:", response);

      // Notify parent component or reset state
      if (onFormSubmit) {
        onFormSubmit({ bookingResult: response }); // Notify the parent component
      }

      localStorage.removeItem("cartTicket");
      localStorage.removeItem("seatSelection");

      // Reset formState or navigate to confirmation page
      setFormState({
        fullname: "",
        namakeluarga: "",
        phone: "",
        email: "",
        passengers: [],
        selectedSeats: [],
      });
      setIsSubmitted(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        alert(
          error.errors
            .map((err) => `${err.path.join(" -> ")}: ${err.message}`)
            .join("\n")
        );
      } else {
        // Handle other errors
        console.error("Error during booking submission:", error);
        alert(error.message || "An unexpected error occurred.");
      }
    }
  };

  const handleSaveAndContinue = () => {
    // Check if the number of selected seats matches the number of passengers
    if (selectedSeats.length !== formState.passengers.length) {
      toast({
        variant: "info",
        title: "Jumlah Kursi Tidak Sesuai.",
        description:
          "Pastikan jumlah kursi yang dipilih sesuai dengan jumlah penumpang.",
        action: <ToastAction altText="Try again">OK</ToastAction>,
      });
      return; // Stop execution if validation fails
    }

    // Add selectedSeats to formState for validation
    const updatedFormState = {
      ...formState,
      selectedSeats: selectedSeats, // Ensure it's included
    };

    console.log("Selected Seats before validation:", selectedSeats);

    // Validate formState using bookingSchema
    try {
      bookingSchema.parse(updatedFormState); // Will throw if validation fails

      const activeFlightId = flightId[currentFlightIndex];

      // Retrieve the existing seat selection data from localStorage
      let seatSelectionData =
        JSON.parse(localStorage.getItem("seatSelection")) || [];

      // Save the selected seats for the current flight along with passenger details
      const selectedSeatData = selectedSeats.map((seat, index) => {
        return {
          flightId: activeFlightId,
          isReturn: flightId[currentFlightIndex].isReturn, // Determining the return status
          seatId: seat.id,
          passenger: formState.passengers[index], // Assuming passenger order matches seat order
        };
      });

      // Check if the seat data for this flightId already exists
      const existingFlightData = seatSelectionData.find(
        (data) => data.flightId === activeFlightId
      );

      if (existingFlightData) {
        // If it exists, append the new seats to the existing data
        existingFlightData.seats =
          existingFlightData.seats.concat(selectedSeatData);
      } else {
        // If it doesn't exist, add new data for this flightId
        seatSelectionData.push({
          flightId: activeFlightId,
          seats: selectedSeatData,
        });
      }
      // Check if seatSelectionData exceeds total flights
      if (seatSelectionData.length > flightId.length) {
        console.warn("Too many seat selections, trimming excess data...");
        seatSelectionData = seatSelectionData.slice(0, flightId.length);
      }

      console.log("Saving seat selection data:", seatSelectionData);

      // Save the updated seat selection data to localStorage
      localStorage.setItem("seatSelection", JSON.stringify(seatSelectionData));

      // Mark current flight as completed
      const updatedSeatCompletion = [...seatSelectionComplete];
      updatedSeatCompletion[currentFlightIndex] = true;
      setSeatSelectionComplete(updatedSeatCompletion);

      // Move to the next flight or finish if all are processed
      if (currentFlightIndex < flightId.length - 1) {
        // Reset seat selection and move to the next flight
        setSelectedSeats([]); // Only reset if there are more flights
        setCurrentFlightIndex((prev) => prev + 1);
      } else {
        toast({
          variant: "success",
          title: "Berhasil Disimpan",
          description: "Silahkan Lanjutkan untuk Booking !",
          action: <ToastAction altText="Try again">OK</ToastAction>,
        });
        // Additional logic if needed
      }
    } catch (error) {
      // Handle validation error
      console.error("Form validation failed:", error.errors);

      // Iterate over validation errors and display them as toast messages
      error.errors.forEach((err) => {
        toast({
          variant: "error",
          title: "Validasi Gagal",
          description: err.message,
          action: <ToastAction altText="Try again">OK</ToastAction>,
        });
      });
    }
  };

  const isButtonDisabled =
    seatSelectionComplete.length !== flightId.length ||
    seatSelectionComplete.includes(false);

  return (
    <ToastProvider>
      {notification && (
        <Notification
          message={notification}
          onDismiss={handleDismissNotification}
        />
      )}
      <div className="max-w-[550px] md:w-2/3  space-y-6 py-[6px] px-4">
        {/* Data Diri Pemesan */}
        <div className="border p-6 rounded-lg shadow-md bg-white text-black">
          <p className="text-xl font-bold mb-4">Isi Data Pemesan</p>
          <div className="bg-[#3C3C3C] text-white rounded-t-lg px-4 py-2 max-h-[40px]">
            <p className="text-xl font-semibold">Data Diri Pemesan</p>
          </div>

          <div className="space-y-4 p-4 dark:text-white">
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
              <Label className="dark:text-black">Punya Nama Keluarga</Label>
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
          <div className="border p-6 rounded-lg shadow-md bg-white dark:text-black">
            <h3 className="text-xl font-bold mb-4">Isi Data Penumpang</h3>
            <Accordion type="single" collapsible>
              {formState.passengers?.map((passenger, index) => (
                <AccordionItem key={index} value={`passenger-${index}`}>
                  <AccordionTrigger className="bg-[#3C3C3C] text-white rounded-lg px-4 py-2 mb-1">
                    Data Diri Penumpang {index + 1} - {passenger.type} Flight:{" "}
                    {formState.flightNum}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 p-4 dark:text-white">
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
                          onChange={(e) =>
                            handleChange("fullname", e.target.value, index)
                          }
                          disabled={isSubmitted}
                        />
                      </div>
                      <div className="flex items-center justify-between mb-4 dark:text-black">
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
                            handleChange(
                              "negarapenerbit",
                              e.target.value,
                              index
                            )
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
          <div className="border p-6 rounded-lg shadow-md bg-white mt-5 dark:text-black">
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
        <div className=" flex gap-4">
          {seatSelectionComplete.length < flightId.length ||
          seatSelectionComplete.includes(false) ? (
            // Tombol Simpan Penerbangan Saat Ini
            <button
              className="mt-1 bg-blue-500 text-white px-6 py-3 rounded-lg w-full shadow-[0px_4px_4px_0px_#00000040]"
              onClick={handleSaveAndContinue}
              disabled={isSubmitted}
            >
              Simpan Penerbangan Saat Ini
            </button>
          ) : (
            // Tombol Booking Pesanan
            <button
              onClick={handleSubmit}
              className={`mt-1 bg-purple-600 text-white px-6 py-3 rounded-lg w-full shadow-[0px_4px_4px_0px_#00000040] ${
                isSubmitted
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white"
              }`}
              disabled={isSubmitted || isButtonDisabled}
            >
              Booking Pesanan
            </button>
          )}
        </div>

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

BookingForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
};
