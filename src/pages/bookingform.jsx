import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function BookingForm() {
  const [passengers, setPassengers] = useState([1]); // Array for passengers
  const [selectedSeats, setSelectedSeats] = useState([]); // Selected seats

  const seatRows = 12;
  const seatColumns = ["A", "B", "C", "D", "E", "F"];
  const reservedSeats = ["3D", "3E"]; // Reserved seats
  const maxSelectableSeats = passengers.length;

  // Calculate available seats dynamically
  const totalSeats = seatRows * seatColumns.length;
  const availableSeats = totalSeats - reservedSeats.length;

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
    <div className="w-full md:w-2/3 mx-auto space-y-6">
      {/* Data Diri Pemesan */}
      <div className="border p-6 rounded-lg shadow-md bg-white">
        <h3 className="text-xl font-semibold mb-4">Isi Data Pemesan</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullname">Nama Lengkap</Label>
            <Input id="fullname" placeholder="Masukkan nama lengkap" />
          </div>
          <div>
            <Label htmlFor="phone">Nomor Telepon</Label>
            <Input id="phone" placeholder="Masukkan nomor telepon" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="Contoh: johndoe@gmail.com"
              type="email"
            />
          </div>
        </div>
      </div>

      {/* Data Diri Penumpang */}
      <div className="border p-6 rounded-lg shadow-md bg-white">
        <h3 className="text-xl font-semibold mb-4">Isi Data Penumpang</h3>
        <Accordion type="single" collapsible>
          {passengers.map((passenger, index) => (
            <AccordionItem key={index} value={`passenger-${index}`}>
              <AccordionTrigger>
                Data Diri Penumpang {index + 1} - Adult
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`title-${index}`}>Title</Label>
                    <Input id={`title-${index}`} placeholder="Mr./Mrs./Miss" />
                  </div>
                  <div>
                    <Label htmlFor={`fullname-${index}`}>Nama Lengkap</Label>
                    <Input
                      id={`fullname-${index}`}
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Punya Nama Keluarga?</Label>
                    <Checkbox />
                  </div>
                  <div>
                    <Label htmlFor={`birthdate-${index}`}>Tanggal Lahir</Label>
                    <Input
                      id={`birthdate-${index}`}
                      placeholder="dd/mm/yyyy"
                      type="date"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`citizenship-${index}`}>
                      Kewarganegaraan
                    </Label>
                    <Input
                      id={`citizenship-${index}`}
                      placeholder="Indonesia"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`passport-${index}`}>KTP/Paspor</Label>
                    <Input
                      id={`passport-${index}`}
                      placeholder="Masukkan nomor KTP atau paspor"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`expiry-${index}`}>Berlaku Sampai</Label>
                    <Input
                      id={`expiry-${index}`}
                      placeholder="dd/mm/yyyy"
                      type="date"
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
        <div className="text-center text-lg font-bold mb-4">
          Economy - {availableSeats} Seats Available
        </div>
        <div className="flex justify-center">
          <div className="grid grid-cols-7 gap-2 justify-center items-center">
            <div></div>
            {seatColumns.map((col) => (
              <div key={col} className="text-center font-bold">
                {col}
              </div>
            ))}
            {Array.from({ length: seatRows }).map((_, rowIndex) => (
              <>
                <div key={`row-${rowIndex}`} className="text-center font-bold">
                  {rowIndex + 1}
                </div>
                {seatColumns.map((col) => {
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
                        : ""}
                    </button>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      </div>

      <button className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg w-full">
        Simpan
      </button>
    </div>
  );
}
