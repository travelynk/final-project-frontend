import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import PropTypes from "prop-types"; // Import PropTypes

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { z } from "zod";

// Schema Validasi Zod
const bookingSchema = z.object({
  fullname: z.string().min(1, "Nama lengkap wajib diisi"),
  hasLastName: z.boolean().refine((val) => val === true, {
    message: "Harap pilih apakah memiliki nama keluarga.",
  }),
  selectedSeats: z
    .array(z.string())
    .min(1, "Harap pilih setidaknya satu kursi."),
});
export default function BookingForm({ onFormSubmit }) {
  const [passengers, setPassengers] = useState([1]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      fullname: e.target.fullname.value,
      hasLastName: e.target.lastNameSwitch.checked,
      selectedSeats,
    };

    // Validasi menggunakan Zod
    const validation = bookingSchema.safeParse(formData);
    if (!validation.success) {
      const errorMessages = validation.error.flatten();
      setErrors(errorMessages.fieldErrors);
      return;
    }

    setErrors({}); // Reset error jika validasi lolos

    if (onFormSubmit) {
      onFormSubmit(formData);
    }
  };

  const seatRows = 12;
  const seatColumns = ["A", "B", "C", "", "D", "E", "F"];
  const reservedSeats = ["3D", "3E", "1D"];
  const maxSelectableSeats = passengers.length;

  const toggleSeatSelection = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else if (selectedSeats.length < maxSelectableSeats) {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const addPassenger = () => {
    setPassengers([...passengers, passengers.length + 1]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-[550px] md:w-2/3  space-y-6 py-[6px] px-4"
    >
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
              required
              id="fullname"
              name="fullname"
              placeholder="Masukkan nama lengkap"
              className="mb-2"
              onInvalid={(e) =>
                e.target.setCustomValidity("Tolong isi fullname field.")
              }
              onInput={(e) => e.target.setCustomValidity("")}
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <Label>Punya Nama Keluarga</Label>
            <Switch required />
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
            />
          </div>
        </div>
      </div>

      {/* Data Diri Penumpang */}
      <div className="border p-6 rounded-lg shadow-md bg-white">
        <h3 className="text-xl font-bold mb-4">Isi Data Penumpang</h3>
        <Accordion type="single" collapsible>
          {passengers.map((passenger, index) => (
            <AccordionItem key={index} value={`passenger-${index}`}>
              <AccordionTrigger className="bg-[#3C3C3C]  text-white rounded-lg px-4 py-2 mb-1 ">
                Data Diri Penumpang {index + 1} - Adult
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
                      required
                      id={`title-${index}`}
                      placeholder="Mr./Mrs./Miss"
                      className="mb-2"
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
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <button
          onClick={addPassenger}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Tambah Penumpang
        </button>
      </div>

      {/* Seat Selection */}
      <div className="border p-6 rounded-lg shadow-md bg-white">
        <h3 className="text-xl font-semibold mb-4">Pilih Kursi</h3>
        <div className="flex items-center justify-center text-center p-2 text-lg font-sm mb-4 bg-[#73CA5C] border-b rounded-[4px] text-white h-10">
          Economy - {seatRows * (seatColumns.length - 1) - reservedSeats.length}{" "}
          Seats Available
        </div>
        <div className="flex justify-center">
          <div className="grid grid-cols-7 gap-2 justify-center items-center">
            {seatColumns.map((col, colIndex) => (
              <div key={colIndex} className="text-center font-bold">
                {col}
              </div>
            ))}
            {Array.from({ length: seatRows }).map((_, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {seatColumns.map((col, colIndex) => {
                  if (col === "") {
                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className="text-center font-bold"
                      >
                        {rowIndex + 1}
                      </div>
                    );
                  }
                  const seatId = `${rowIndex + 1}${col}`;
                  const isReserved = reservedSeats.includes(seatId);
                  const isSelected = selectedSeats.includes(seatId);

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
                      onClick={() => !isReserved && toggleSeatSelection(seatId)}
                      disabled={isReserved}
                    >
                      {isSelected
                        ? `P${selectedSeats.indexOf(seatId) + 1}`
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

      <button
        type="submit"
        className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg w-full shadow-[0px_4px_4px_0px_#00000040]"
      >
        Simpan
      </button>
    </form>
  );
}

BookingForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired, // onFormSubmit is a required function
};
