import { createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "../../components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { Checkbox } from "../../components/ui/checkbox";
import { Slider } from "../../components/ui/slider";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Progress } from "../../components/ui/progress";
import { Skeleton } from "../../components/ui/skeleton";

export const Route = createLazyFileRoute("/flights/$params")({
  component: Flight,
});

function Flight() {
  return (
    <>
      <div className="container mx-auto lg:px-28 sm:px-10">
        <HeaderComponent />
        <BodyComponent />
      </div>
    </>
  );
}

const HeaderComponent = () => {
  return (
    <>
      <div className="flex flex-col gap-3 my-5">
        <h1 className="font-bold text-2xl py-5 text-center sm:text-left">
          Pilih Penerbangan
        </h1>
        <div className="navigation px-2 grid grid-cols-1 sm:grid-cols-7 gap-3 text-white">
          <div className="labels col-span-1 sm:col-span-6 flex gap-x-3 bg-darkblue03 p-3 rounded-lg">
            <img src="/src/assets/arrow-left.svg" alt="" />
            <p className="text-sm sm:text-base">
              JKT {">"} MLB - 2 Penumpang - Economy
            </p>
          </div>
          <Button className="bg-[#73CA5C] hover:bg-[#73CA5C]/70 h-full px-4 py-2 rounded-lg">
            Ubah Penerbangan
          </Button>
        </div>
        <div className="list-date flex px-3 overflow-x-auto gap-2">
          <div className="border border-gray-300 p-3 flex flex-col justify-center items-center min-w-[150px] sm:max-w-[120px] rounded-lg hover:bg-darkblue03 transition text-xl  cursor-pointer">
            <span className="text-sm sm:text-xl ">Senin</span>
            <p className="bg-none text-xs sm:text-sm">23/12/2023</p>
          </div>
          <div className="border border-gray-300 p-3 flex flex-col justify-center items-center min-w-[150px] sm:max-w-[120px] rounded-lg hover:bg-darkblue03 transition text-xl  cursor-pointer">
            <span className="text-sm sm:text-xl ">Selasa</span>
            <p className="bg-none text-xs sm:text-sm">24/12/2023</p>
          </div>
          <div className="border border-gray-300 p-3 flex flex-col justify-center items-center min-w-[150px] sm:max-w-[120px] rounded-lg hover:bg-darkblue03 transition text-xl  cursor-pointer">
            <span className="text-sm sm:text-xl ">Rabu</span>
            <p className="bg-none text-xs sm:text-sm">25/12/2023</p>
          </div>
          <div className="border border-gray-300 p-3 flex flex-col justify-center items-center min-w-[150px] sm:max-w-[120px] rounded-lg hover:bg-darkblue03 transition text-xl  cursor-pointer">
            <span className="text-sm sm:text-xl ">Kamis</span>
            <p className="bg-none text-xs sm:text-sm">26/12/2023</p>
          </div>
          <div className="border border-gray-300 p-3 flex flex-col justify-center items-center min-w-[150px] sm:max-w-[120px] rounded-lg hover:bg-darkblue03 transition text-xl  cursor-pointer">
            <span className="text-sm sm:text-base">Jumat</span>
            <p className="bg-none text-xs sm:text-sm">27/12/2023</p>
          </div>
        </div>
        <div className="filter flex justify-end ">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="bg-transparent border border-darkblue03 px-3 text-darkblue05 hover:text-white rounded-full  hover:fill-white text-lg transition">
                <img src="/src/assets/fitler.svg" alt="" />
                Termurah
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96">
              <div className="grid gap-4 ">
                <div className="flex justify-end border-b-2 border-gray-100 pb-2 ">
                  <Button>X</Button>
                </div>
                <div className="grid gap-2 transition  cursor-pointer group">
                  <div className="flex justify-between hover:text-white hover:bg-darkblue05  px-5 rounded-xl transition   gap-4  border-b-2 border-gray-100  py-5 items-center ">
                    <h1>
                      <span className="font-bold">Harga</span> - Termurah
                    </h1>
                    <img src="/src/assets/verification.svg" alt="" />
                  </div>
                  <div className="flex justify-between hover:text-white hover:bg-darkblue05  px-5 rounded-xl transition   gap-4  border-b-2 border-gray-100  py-5 items-center ">
                    <h1>
                      <span className="font-bold">Keberangkatan</span> - Paling
                      Awal
                    </h1>
                    <img src="/src/assets/verification.svg" alt="" />
                  </div>
                  <div className="flex justify-between hover:text-white hover:bg-darkblue05  px-5 rounded-xl transition   gap-4  border-b-2 border-gray-100  py-5 items-center ">
                    <h1>
                      <span className="font-bold">Keberangkatan</span> - Paling
                      Akhir
                    </h1>
                    <img src="/src/assets/verification.svg" alt="" />
                  </div>
                  <div className="flex justify-between hover:text-white hover:bg-darkblue05  px-5 rounded-xl transition   gap-4  border-b-2 border-gray-100  py-5 items-center ">
                    <h1>
                      <span className="font-bold">Kedatangan</span> - Paling
                      Awal
                    </h1>
                    <img src="/src/assets/verification.svg" alt="" />
                  </div>
                  <div className="flex justify-between hover:text-white hover:bg-darkblue05  px-5 rounded-xl transition   gap-4  border-b-2 border-gray-100  py-5 items-center ">
                    <h1>
                      <span className="font-bold">Kedatangan</span> - Paling
                      AKhir
                    </h1>
                    <img src="/src/assets/verification.svg" alt="" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Simpan</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  );
};

const BodyComponent = () => {
  const [sliderValue, setSliderValue] = useState(3000000);
  const handleSliderChange = (value) => {
    setSliderValue(value[0]);
  };
  return (
    <>
      <div className="flex   flex-col lg:flex-row gap-3 pb-5">
        <div className="w-full lg:w-1/4 filter p-5 border border-darkblue02 rounded-xl shadow-sm text-lg  ">
          <h1 className="text-2xl font-semibold">Filter</h1>
          <div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                value="item-1"
                className="border-b border-gray-400"
              >
                <AccordionTrigger className="w-full bg-transparent ">
                  <div className="flex gap-3">
                    <img src="/src/assets/box.svg" alt="" />
                    <span>Transit</span>
                  </div>
                  <img src="/src/assets/collaps.svg" alt="" />
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" defaultChecked disabled />

                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Direct
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      1 Transit
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      2+ Transit
                    </label>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                value="item-1"
                className="border-b border-gray-400"
              >
                <AccordionTrigger className="w-full bg-transparent ">
                  <div className="flex gap-3">
                    <img src="/src/assets/pesawat.svg" alt="" />
                    <span>Maskapai</span>
                  </div>
                  <img src="/src/assets/collaps.svg" alt="" />
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <img src="/src/assets/logo-plane.svg" alt="" />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Garuda Indonesia
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <img src="/src/assets/logo-plane.svg" alt="" />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Garuda Indonesia
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <img src="/src/assets/logo-plane.svg" alt="" />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Garuda Indonesia
                    </label>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                value="item-1"
                className="border-b border-gray-400"
              >
                <AccordionTrigger className="w-full bg-transparent ">
                  <div className="flex gap-3">
                    <img src="/src/assets/dollar.svg" alt="" />
                    <span>Harga</span>
                  </div>
                  <img src="/src/assets/collaps.svg" alt="" />
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2">
                  <div className="flex justify-end text-gray-500">
                    <span>IDR {sliderValue}</span>
                  </div>
                  <Slider
                    value={[sliderValue]}
                    onValueChange={handleSliderChange}
                    max={5000000}
                    min={2500000}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-gray-500">
                    <span>IDR 2.500.000</span>
                    <span>IDR 5.000/00</span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <div className="listt-flights w-full md:w-3/4">
          <ul className="flex flex-col gap-2">
            <li>
              <Accordion
                type="single"
                collapsible
                className="p-5 border border-darkblue02 rounded-xl shadow-sm "
              >
                <AccordionItem value="item-1 ">
                  <AccordionTrigger className="w-full bg-transparent hover:bg-transparent">
                    <div className="w-full">
                      <div className="header flex justify-between">
                        <div className="flex gap-2">
                          <img src="/src/assets/logo-plane.svg" alt="" />
                          <span>Jet Air - Economy </span>
                        </div>
                        <img src="/src/assets/collaps.svg" alt="" />
                      </div>
                      <div className="content grid grid-cols-7">
                        <div className="route flex col-span-5 lg:col-span-6 px-5 justify-start font-bold text-lg md:text-xl items-center gap-3">
                          <div>
                            <span>07.00</span>
                            <p className="font-semibold text-lg">JKT</p>
                          </div>
                          <div className="flex flex-col justify-center items-center  text-sm md:text-xl  w-full font-semibold text-gray-400 text-center">
                            <span>4h 0m</span>
                            <img
                              src="/src/assets/route.svg"
                              alt=""
                              className="w-full"
                            />
                            <span>Direct</span>
                          </div>
                          <div>
                            <span>07.00</span>
                            <p className="font-semibold text-lg">JKT</p>
                          </div>

                          <img
                            src="/src/assets/bagasi.svg"
                            alt=""
                            className="w-10"
                          />
                        </div>
                        <div className="price  text-xl font-bold text-darkblue04 w-full col-span-2 lg:col-span-1">
                          <h1>4.950.000</h1>
                          <Button className="w-full rounded-2xl">Pilih</Button>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <h1 className="text-darkblue05 text-xl font-bold">
                      Detail Penerbangan
                    </h1>
                    <div className="depature text-lg grid grid-cols-10 justify-items-stretch">
                      <h1 className="text-darkblue05  font-bold col-end-10 px-5">
                        Keberangkatan
                      </h1>
                      <div className="col-span-9 ">
                        <h1 className="font-bold ">07.00</h1>
                        <p>3 Maret</p>
                        <span className="font-semibold text-lg">
                          Sokearno Hatta - Terminal 1A Domestik
                        </span>
                      </div>
                    </div>
                    <div className="detail px-10 text-lg grid grid-cols-10 justify-items-stretch">
                      <h1 className="text-darkblue05  font-bold col-end-10">
                        Keberangkatan
                      </h1>
                      <div className="col-span-9 ">
                        <h1 className="font-bold ">Jet Air - Ekonomi</h1>
                        <h1 className="font-bold ">JT-301</h1>
                        <div className="flex gap-1">
                          <img src="/src/assets/logo-plane.svg" alt="" />
                          <span className="font-bold text-lg">Informasi</span>
                        </div>
                        <ul className="px-10">
                          <li>Baggage 20 kg</li>
                          <li>Cabin baggage 7 kg In Flight</li>
                          <li>Entertainment</li>
                        </ul>
                      </div>
                    </div>
                    <div className="return text-lg grid grid-cols-10 justify-items-stretch">
                      <h1 className="text-darkblue05  font-bold col-end-10 px-5">
                        Kedatangan
                      </h1>
                      <div className="col-span-9 ">
                        <h1 className="font-bold ">01.00</h1>
                        <p>3 Maret</p>
                        <span className="font-semibold text-lg">
                          Melbourne International Airport
                        </span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </li>
          </ul>
          {/* <Loading /> */}
        </div>
      </div>
    </>
  );
};

const Loading = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center w-full gap-2 text-gray-500 font-semibold ">
        <h1>Mencari Penerbangan terbaik</h1>
        <span>Loading...</span>

        <div className="w-1/2">
          <Progress value={65} />
        </div>
      </div>
    </>
  );
};
const SoldOut = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center w-full gap-2 text-gray-500 font-semibold ">
        <img src="/src/assets/sold-out.svg" alt="" />
        <h1>Maaf, Tiket terjual habis!</h1>
        <span>Coba cari perjalanan lainnya!</span>
      </div>
    </>
  );
};

const NotFound = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center w-full gap-2 text-gray-500 font-semibold ">
        <div className="flex  gap-2 w-full justify-center">
          <div className="skeleton flex flex-col gap-3 w-1/4">
            <Skeleton className=" p-2 grid grid-cols-12 w-full">
              <img src="/src/assets/verification.svg" alt="" />
              <div className="flex flex-col gap-1 col-span-11">
                <div className="animate-pulse rounded-md bg-muted w-full  h-3" />
                <div className="animate-pulse rounded-md bg-muted w-8/12  h-3" />
              </div>
            </Skeleton>
            <Skeleton className=" p-2 grid grid-cols-12 w-full">
              <img src="/src/assets/verification.svg" alt="" />
              <div className="flex flex-col gap-1 col-span-11">
                <div className="animate-pulse rounded-md bg-muted w-full  h-3" />
                <div className="animate-pulse rounded-md bg-muted w-8/12  h-3" />
              </div>
            </Skeleton>{" "}
            <Skeleton className=" p-2 grid grid-cols-12 w-full">
              <img src="/src/assets/verification.svg" alt="" />
              <div className="flex flex-col gap-1 col-span-11">
                <div className="animate-pulse rounded-md bg-muted w-full  h-3" />
                <div className="animate-pulse rounded-md bg-muted w-8/12  h-3" />
              </div>
            </Skeleton>
          </div>
          <img src="/src/assets/man2.svg" alt="" className="w-20 mt-10" />
        </div>
        <h1>Maaf, pencarian Anda tidak ditemukan</h1>
        <span className="text-darkblue04"> Coba cari perjalanan lainnya!</span>
      </div>
    </>
  );
};
