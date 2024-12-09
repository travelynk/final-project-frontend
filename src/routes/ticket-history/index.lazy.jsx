import { createLazyFileRoute } from "@tanstack/react-router";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { ArrowLeft, Filter, Search } from "lucide-react";

export const Route = createLazyFileRoute("/ticket-history/")({
  component: TicketHistory,
});

function TicketHistory() {
  return (
    <>
      <div className="container max-w-[1024px] mx-auto sm:pt-8 pt-2 px-4">
        {/* Header Section */}
        <div className="flex justify-between items-center ms-0 lg:-ms-5 mt-2 sm:mb-8 mb-4">
          <h2 className="text-xl font-bold text-center sm:text-left">
            Riwayat Pemesanan
          </h2>
        </div>

        <div className="space-y-4">
          {/* Flex container to align Card and Filter/Search buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Beranda Card */}
            <Card className="p-4 rounded-[12px] flex justify-between items-center bg-[#A06ECE] h-[50px] w-full sm:w-[777px]">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-8 h-8 text-white rounded-full">
                  <Button variant="link" size="icon" className="p-0">
                    <ArrowLeft
                      style={{
                        width: "24px",
                        height: "24px",
                        color: "white",
                      }}
                    />
                  </Button>
                </div>

                <div className="flex flex-grow justify-center">
                  <h1 className="font-normal text-lg text-white text-center">
                    Beranda
                  </h1>
                </div>
              </div>
            </Card>

            {/* Filter and Search Buttons */}
            <div className="flex sm:flex-row items-center gap-4 sm:gap-2">
              {/* Filter and Search (Mobile Only) */}
              <div className="flex justify-between w-full sm:hidden">
                <Button
                  variant="outline"
                  className="w-[86px] h-[36px] flex items-center justify-center rounded-[18px] border border-[#7126B5]"
                >
                  <Filter />
                  Filter
                </Button>
                <Button
                  variant="link"
                  size="icon"
                  className="h-[36px] w-[36px] flex items-center justify-center"
                >
                  <Search
                    style={{ width: "24px", height: "24px", color: "#7126B5" }}
                  />
                </Button>
              </div>

              {/* Filter and Search (Large Screens) */}
              <div className="hidden sm:flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="w-[86px] h-[36px] rounded-[18px] border border-[#7126B5]"
                >
                  <Filter />
                  Filter
                </Button>
                <Button variant="link" size="icon" className="p-0">
                  <Search
                    style={{ width: "24px", height: "24px", color: "#7126B5" }}
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="mt-[25px] shadow" />
      <div className="container mx-auto max-w-5xl mt-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-[550px_370px] gap-2 mt-8">
          {/* First Column (Fixed at 550px) */}

          <div className="bg-white rounded-lg p-4">
            <div className="font-bold lg:-mt-5 mb-5">Maret 2024</div>
            <Card className="border shadow h-[204px] w-full rounded-lg p-4">
              {/* Status Badge */}
              <div className="flex">
                <div className="flex justify-center items-center text-white w-[70px] h-[28px] bg-[#73CA5C] rounded-full">
                  Issued
                </div>
              </div>

              {/* Flight Route */}
              <div className="grid grid-cols-7 mt-4 items-center">
                {/* Departure Info */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <img
                      src="/src/assets/live-area.svg"
                      alt="Departure Icon"
                      className="w-[20px] h-[20px]"
                    />
                    <span className="text-sm font-bold">Jakarta</span>
                  </div>
                  <div className=" text-xs mt-1 ms-7">
                    <p>5 Maret 2023</p>
                    <p>19:10</p>
                  </div>
                </div>

                {/* Route Image */}
                <div className="col-span-3 flex flex-col items-center">
                  <span className=" text-xs mt-1">4h 0m</span>
                  <img
                    src="/src/assets/route.svg"
                    alt="Flight Route"
                    className="w-full"
                  />
                </div>

                {/* Arrival Info */}
                <div className="col-span-2 text-right">
                  <div className="flex justify-end items-center gap-2">
                    <img
                      src="/src/assets/live-area.svg"
                      alt="Arrival Icon"
                      className="w-[20px] h-[20px]"
                    />
                    <span className="text-sm font-bold">Melbourne</span>
                  </div>
                  <div className=" text-xs mt-1">
                    <p>5 Maret 2023</p>
                    <p>21:10</p>
                  </div>
                </div>
              </div>

              <Separator className="mt-4"></Separator>

              {/* Booking Details */}
              <div className="flex justify-between text-xs">
                <div>
                  <p className="md:text-base">
                    <strong>Booking Code:</strong> <br></br>6723y2GHK
                  </p>
                </div>
                <div>
                  <p className="md:text-base">
                    <strong>Class:</strong> <br></br>Economy
                  </p>
                </div>
                <div className="text-right">
                  <p className="md:text-base font-bold text-purple-700">
                    IDR 9.850.000
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Second Column (Remaining Space) */}
          <div className="bg-white rounded-lg py-4 pr-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Detail Pesanan</h2>
              <div className="flex justify-center items-center text-white w-[70px] h-[28px] bg-[#73CA5C] rounded-full">
                Issued
              </div>
            </div>
            <h2 className="text-lg">
              Booking Code:{" "}
              <span className="text-purple-600 font-bold">6723y2GHK</span>
            </h2>
            <div className="mt-4 text-sm">
              <p>
                <strong>07:00</strong>
                <span className="float-right text-purple-500">
                  Keberangkatan
                </span>
              </p>
              <p>3 Maret 2023</p>
              <p>Soekarno Hatta - Terminal 1A Domestik</p>
              <hr className="my-4" />
              <p className="mt-4">
                <strong>Jet Air - Economy</strong>
              </p>
              <p className="mb-4">
                <strong>JT - 203</strong>
              </p>
              <p>
                <strong>Informasi:</strong>
                <br />
                Penumpang 1: Mr. Harry Potter
                <br />
                ID: 18398429
                <br />
                Penumpang 2: Ms. Hermione Granger
                <br />
                ID: 13929303
              </p>
              <hr className="my-4" />
              <p className="mt-4">
                <strong>11:00</strong>
                <span className="float-right text-purple-500">
                  Keberangkatan
                </span>
              </p>
              <p>3 Maret 2023</p>
              <p>Melbourne International Airport</p>
              <hr className="my-4" />
              <p>
                2 Adults<span className="float-right">IDR 9.550.000</span>
              </p>
              <p>
                1 Baby<span className="float-right">IDR 0</span>
              </p>
              <p>
                Tax<span className="float-right">IDR 300.000</span>
              </p>
              <hr className="my-4" />
              <p className="font-bold">
                Total
                <span className="float-right text-purple-600">
                  IDR 9.850.000
                </span>
              </p>
            </div>
            <div>
              <Button className="w-full h-[42px] mt-4 py-3 bg-purple-600 text-white rounded-lg text-center hover:bg-purple-700">
                Bayar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
