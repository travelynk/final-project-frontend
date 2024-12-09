import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../../components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { Checkbox } from "../../components/ui/checkbox";
import { Slider } from "../../components/ui/slider";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Progress } from "../../components/ui/progress";
import { Skeleton } from "../../components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getFlights } from "../../services/flights";
import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";

export const Route = createFileRoute("/flights/$params")({
  component: Flight,
});

function Flight() {
  const [sort, setSort] = useState("1");

  const { rf, dt, ps, sc } = Route.useSearch();

  const search = { rf, dt, ps, sc };

  const [origin, destination] = rf.split(".");

  const totalPassengers = ps
    .split(".")
    .reduce((sum, current) => sum + +current, 0);

  const flightDetails = {
    origin,
    destination,
    totalPassengers,
    sc,
  };

  return (
    <>
      <div className="container mx-auto lg:px-28 px-2">
        <HeaderComponent
          flightDetails={flightDetails}
          sort={sort}
          setSort={setSort}
        />
        <BodyComponent filters={search} sort={sort} />
      </div>
    </>
  );
}

const HeaderComponent = ({ flightDetails, sort, setSort }) => {
  const [sliderValue, setSliderValue] = useState(3000000);
  const navigate = useNavigate();
  const handleSliderChange = (value) => {
    setSliderValue(value[0]);
  };

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
              {flightDetails.origin} {">"} {flightDetails.destination} -{" "}
              {flightDetails.totalPassengers} Penumpang - {flightDetails.sc}
            </p>
          </div>
          <Button
            className="bg-[#73CA5C] hover:bg-[#73CA5C]/70 h-full px-4 py-2 rounded-lg"
            onClick={() => navigate({ to: "/" })}
          >
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
        <div className="filter flex justify-between lg:justify-end ">
          <div className="md:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <Button className="bg-transparent border border-darkblue03 px-3 text-darkblue05 hover:text-white rounded-full  hover:fill-white text-lg transition">
                  <img src="/src/assets/fitler.svg" alt="" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="mx-5">
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
              </PopoverContent>
            </Popover>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button className="bg-transparent border border-darkblue03 px-3 text-darkblue05 hover:text-white rounded-full  hover:fill-white text-lg transition">
                <img src="/src/assets/fitler.svg" alt="" />
                Termurah
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[30rem]">
              <div className="grid gap-4 ">
                <RadioGroup
                  defaultValue={sort}
                  onValueChange={(value) => setSort(value)}
                >
                  <div className="flex items-center gap-5 py-3 hover:bg-darkblue05 px-5 rounded-sm transition  cursor-pointer  group">
                    <Label
                      htmlFor="harga-murah"
                      className=" group-hover:text-white  gap-4  border-b-2 border-gray-100 pb-2 w-full text-xl"
                    >
                      <h1>
                        <span className="font-bold">Harga-murah</span> -
                        Termurah
                      </h1>
                    </Label>
                    <RadioGroupItem value="1" id="harga-murah" />
                  </div>
                  <div className="flex items-center gap-5 py-3 hover:bg-darkblue05 px-5 rounded-sm transition  cursor-pointer  group">
                    <Label
                      htmlFor="harga-mahal"
                      className=" group-hover:text-white  gap-4  border-b-2 border-gray-100 pb-2 w-full text-xl"
                    >
                      <h1>
                        <span className="font-bold">Harga</span> - Mahal
                      </h1>
                    </Label>
                    <RadioGroupItem value="2" id="harga-mahal" />
                  </div>
                  <div className="flex items-center gap-5 py-3 hover:bg-darkblue05 px-5 rounded-sm transition  cursor-pointer  group">
                    <Label
                      htmlFor="keberangakatan-awal"
                      className=" group-hover:text-white  gap-4  border-b-2 border-gray-100 pb-2 w-full text-xl"
                    >
                      <h1>
                        <span className="font-bold">Keberangkatan</span> -
                        Paling Awal
                      </h1>
                    </Label>
                    <RadioGroupItem value="3" id="keberangakatan-awal" />
                  </div>
                  <div className="flex items-center gap-5 py-3 hover:bg-darkblue05 px-5 rounded-sm transition  cursor-pointer  group">
                    <Label
                      htmlFor="keberangakatan-akhir"
                      className=" group-hover:text-white  gap-4  border-b-2 border-gray-100 pb-2 w-full text-xl"
                    >
                      <h1>
                        <span className="font-bold">Keberangkatan</span> -
                        Paling Akhir
                      </h1>
                    </Label>
                    <RadioGroupItem value="4" id="keberangakatan-akhir" />
                  </div>

                  <div className="flex items-center gap-5 py-3 hover:bg-darkblue05 px-5 rounded-sm transition  cursor-pointer  group">
                    <Label
                      htmlFor="kedatangan-awal"
                      className=" group-hover:text-white  gap-4  border-b-2 border-gray-100 pb-2 w-full text-xl"
                    >
                      <h1>
                        <span className="font-bold">Kedatangan</span> - Paling
                        Awal
                      </h1>
                    </Label>
                    <RadioGroupItem value="5" id="kedatangan-awal" />
                  </div>
                  <div className="flex items-center gap-5 py-3 hover:bg-darkblue05 px-5 rounded-sm transition  cursor-pointer  group">
                    <Label
                      htmlFor="kedatangan-akhir"
                      className=" group-hover:text-white  gap-4  border-b-2 border-gray-100 pb-2 w-full text-xl"
                    >
                      <h1>
                        <span className="font-bold">Kedatangan</span> - Paling
                        Akhir
                      </h1>
                    </Label>
                    <RadioGroupItem value="6" id="kedatangan-akhir" />
                  </div>
                </RadioGroup>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  );
};

const BodyComponent = ({ filters, sort }) => {
  const [sliderValue, setSliderValue] = useState();
  const [listFlights, setListFlights] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [checkedAirlines, setCheckedAirlines] = useState([]);
  const [minPrize, setMinprize] = useState();
  const [maxPrize, setMaxprize] = useState();
  const [transitFilter, setTransitFilter] = useState({
    isDirect: true,
    isOneTransit: true,
    isTwoPlusTransit: true,
  });

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ["flights"],
    queryFn: () => getFlights(filters),
    enabled: true,
  });

  useEffect(() => {
    if (isSuccess) {
      const airlines = data?.outboundFlights
        .flatMap((flight) =>
          flight.flights.map((f) => ({
            name: f.airline.name,
            image: f.airline.image,
          }))
        )
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.name === value.name)
        );

      const prices = data?.outboundFlights.map((flight) => {
        const priceString = flight.price.replace(/[^0-9]/g, "");
        return parseInt(priceString, 10);
      });

      setListFlights(data?.outboundFlights);
      setAirlines(airlines);
      setCheckedAirlines(airlines?.map((airline) => airline.name));
      if (prices?.length > 0) {
        setMinprize(Math.min(...prices));
        setMaxprize(Math.max(...prices));
        setSliderValue(minPrize);
      }
    }
  }, [data?.outboundFlights, isSuccess, minPrize]);

  const handleCheckboxChange = (event, airlineName) => {
    if (event) {
      setCheckedAirlines([...checkedAirlines, airlineName]);
    } else {
      setCheckedAirlines(
        checkedAirlines.filter((name) => name !== airlineName)
      );
    }
  };

  const handleTransitChange = (type) => {
    setTransitFilter((prevState) => ({
      ...prevState,
      [type]: !prevState[type],
    }));
  };
  console.log(transitFilter);

  return (
    <>
      <div className="flex   flex-col lg:flex-row gap-3 pb-5">
        <div className=" w-full lg:w-1/4 flex flex-col gap-5 ">
          <div className="cart p-5 border border-darkblue02 rounded-xl shadow-sm text-lg h-fit hidden md:block ">
            <h1 className="text-2xl font-semibold">Penerbangan Anda</h1>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                value="item-1"
                className="border-b border-gray-400"
              >
                <AccordionTrigger className="w-full bg-transparent ">
                  <div className="flex gap-3 items-center">
                    <div className="px-4 py-1 text-white bg-darkblue05 rounded-xl shadow-md">
                      1
                    </div>
                    <span>Transit</span>
                  </div>
                </AccordionTrigger>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="filter p-5 border border-darkblue02 rounded-xl shadow-sm text-lg h-fit hidden md:block ">
            <h1 className="text-2xl font-semibold">Filter</h1>

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
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="direct"
                      defaultChecked
                      disabled
                      checked={transitFilter.isDirect}
                      onCheckedChange={() => handleTransitChange("isDirect")}
                    />

                    <label
                      htmlFor="direct"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Direct
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="1"
                      checked={transitFilter.isOneTransit}
                      onCheckedChange={() =>
                        handleTransitChange("isOneTransit")
                      }
                    />
                    <label
                      htmlFor="1"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      1 Transit
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="2+"
                      checked={transitFilter.isTwoPlusTransit}
                      onCheckedChange={() =>
                        handleTransitChange("isTwoPlusTransit")
                      }
                    />
                    <label
                      htmlFor="2+"
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
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2">
                  {airlines?.map((data, i) => {
                    return (
                      <div className="flex items-center space-x-2" key={i}>
                        <Checkbox
                          id={`checkbox-${data.name}`}
                          checked={checkedAirlines.includes(data.name)}
                          onCheckedChange={(checked) => {
                            handleCheckboxChange(checked, data.name);
                          }}
                        />
                        <img
                          src={data.image}
                          alt="logo-airlines"
                          className="h-auto w-5"
                        />
                        <label
                          htmlFor={`checkbox-${data.name}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {data.name}
                        </label>
                      </div>
                    );
                  })}
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
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2">
                  <div className="flex justify-end text-gray-500">
                    <span>
                      IDR {new Intl.NumberFormat("id-ID").format(sliderValue)}
                    </span>
                  </div>
                  <Slider
                    value={[sliderValue]}
                    onValueChange={(value) => setSliderValue(value[0])}
                    max={maxPrize}
                    min={minPrize}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-gray-500">
                    <span>
                      IDR{" "}
                      {minPrize
                        ? new Intl.NumberFormat("id-ID").format(minPrize)
                        : "0"}
                    </span>
                    <span>
                      IDR{" "}
                      {maxPrize
                        ? new Intl.NumberFormat("id-ID").format(maxPrize)
                        : "0"}
                    </span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div className="list-flights w-full lg:w-3/4">
          <ul className="flex flex-col gap-2">
            {isLoading ? (
              <Loading />
            ) : listFlights === null || listFlights?.length > 0 ? (
              listFlights
                .filter((data) => {
                  const price = parseFloat(
                    data.price.replace(/[^\d,-]/g, "").replace(/,/g, "")
                  );
                  const isPriceMatch = price >= sliderValue;

                  const isAirlineMatch =
                    checkedAirlines.length === 0 ||
                    checkedAirlines.includes(data.flights[0].airline.name);

                  const isDirectMatch =
                    transitFilter.isDirect && data.flights.length === 1;
                  const isOneTransitMatch =
                    transitFilter.isOneTransit && data.flights.length === 2;
                  const isTwoPlusTransitMatch =
                    transitFilter.isTwoPlusTransit && data.flights.length > 2;

                  return (
                    isPriceMatch &&
                    isAirlineMatch &&
                    (isDirectMatch ||
                      isOneTransitMatch ||
                      isTwoPlusTransitMatch)
                  );
                })
                .sort((a, b) => {
                  const priceA = parseFloat(
                    a.price.replace(/[^\d,-]/g, "").replace(/,/g, "")
                  );
                  const priceB = parseFloat(
                    b.price.replace(/[^\d,-]/g, "").replace(/,/g, "")
                  );

                  const departureTimeA = new Date(
                    `1970-01-01T${a.departureTime}:00`
                  ).getTime();
                  const departureTimeB = new Date(
                    `1970-01-01T${b.departureTime}:00`
                  ).getTime();

                  const arrivalTimeA = new Date(
                    `1970-01-01T${a.arrivalTime}:00`
                  ).getTime();
                  const arrivalTimeB = new Date(
                    `1970-01-01T${b.arrivalTime}:00`
                  ).getTime();

                  return sort == "1"
                    ? priceA - priceB
                    : sort == "2"
                      ? priceB - priceA
                      : sort == "3"
                        ? departureTimeA - departureTimeB
                        : sort == "4"
                          ? departureTimeB - departureTimeA
                          : sort == "5"
                            ? arrivalTimeA - arrivalTimeB
                            : sort == "6" && arrivalTimeB - arrivalTimeA;
                })
                ?.map((data) => {
                  return (
                    <li key={data.id}>
                      <Accordion
                        type="single"
                        collapsible
                        className="p-5 border border-darkblue02 rounded-xl shadow-sm "
                      >
                        <AccordionItem value="item-1 ">
                          <AccordionTrigger className="w-full bg-transparent hover:bg-transparent">
                            <div className="w-full">
                              <div className="header flex justify-between items-center">
                                <div className="flex gap-2 h-[2rem] w-auto">
                                  <img
                                    src={data.flights[0].airline.image}
                                    alt=""
                                  />
                                  <span>
                                    {data.flights[0].airline.name} -{" "}
                                    {data.seatClass}
                                  </span>
                                </div>
                              </div>
                              <div className="content grid grid-cols-7">
                                <div className="route flex col-span-5 lg:col-span-6 px-5 justify-start font-bold text-sm md:text-xl items-center lg:gap-3 gap-1">
                                  <div>
                                    <span>{data.departureTime}</span>
                                    <p className="font-semibold text-lg">
                                      {data.flights[0].departure.city.code}
                                    </p>
                                  </div>
                                  <div className="flex flex-col justify-center items-center  text-sm md:text-xl  w-full font-semibold text-gray-400 text-center">
                                    <span>{data.estimatedDuration}</span>
                                    <img
                                      src="/src/assets/route.svg"
                                      alt=""
                                      className="w-full"
                                    />
                                    <span>
                                      {data.isTransit ? "Transit" : "Langsung"}
                                    </span>
                                  </div>
                                  <div>
                                    <span>{data.arrivalTime}</span>
                                    <p className="font-semibold text-lg">
                                      {
                                        data.flights[data.flights.length - 1]
                                          .arrival.city.code
                                      }
                                    </p>
                                  </div>

                                  <img
                                    src="/src/assets/bagasi.svg"
                                    alt=""
                                    className="w-10"
                                  />
                                </div>
                                <div className="price text-md  lg:text-lg font-bold text-darkblue04 w-full col-span-2 lg:col-span-1 ">
                                  <h1>{data.price}</h1>
                                  <Button className="w-full rounded-2xl ">
                                    Pilih
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <h1 className="text-darkblue05 text-xl font-bold">
                              Detail Penerbangan
                            </h1>
                            {data.flights.length === 1 ? (
                              <>
                                <div className="depature text-lg grid grid-cols-10 justify-items-stretch">
                                  <h1 className="text-darkblue05  font-bold col-end-10 px-5">
                                    Keberangkatan
                                  </h1>
                                  <div className="col-span-9 ">
                                    <h1 className="font-bold ">
                                      {data.flights[0].departure.time}
                                    </h1>
                                    <p>
                                      {format(
                                        data.flights[0].departure.date,
                                        "d MMMM"
                                      )}
                                    </p>
                                    <span className="font-semibold text-lg">
                                      {data.flights[0].departure.airport} -
                                      {data.flights[0].departure.terminal}
                                    </span>
                                  </div>
                                </div>
                                <div className="detail px-10 text-lg grid grid-cols-10 justify-items-stretch">
                                  <div className="col-span-9 ">
                                    <div className="flex gap-2">
                                      <img
                                        src={data.flights[0].airline.image}
                                        alt="logo airlines"
                                        className="h-auto w-7"
                                      />
                                      <h1 className="font-bold ">
                                        {data.flights[0].airline.name} -{" "}
                                        {data.seatClass}
                                      </h1>
                                    </div>
                                    <h1 className="font-bold ">
                                      {data.flights[0].flightNum}
                                    </h1>

                                    <span className="font-bold text-lg">
                                      Informasi
                                    </span>

                                    <ul className="px-10">
                                      <li> {data.flights[0].facility}</li>
                                    </ul>
                                  </div>
                                </div>
                                <div className="return text-lg grid grid-cols-10 justify-items-stretch">
                                  <h1 className="text-darkblue05  font-bold col-end-10 px-5">
                                    Kedatangan
                                  </h1>
                                  <div className="col-span-9 ">
                                    <h1 className="font-bold ">
                                      {data.flights[0].arrival.time}
                                    </h1>
                                    <p>
                                      {format(
                                        data.flights[0].arrival.date,
                                        "d MMMM"
                                      )}
                                    </p>
                                    <span className="font-semibold text-lg">
                                      {data.flights[0].arrival.airport} -
                                      {data.flights[0].arrival.terminal}
                                    </span>
                                  </div>
                                </div>
                              </>
                            ) : (
                              data.flights.map((data) => {
                                return (
                                  <div key={data.id}>
                                    <div className="depature text-lg grid grid-cols-10 justify-items-stretch">
                                      <h1 className="text-darkblue05  font-bold col-end-10 px-5">
                                        Keberangkatan
                                      </h1>
                                      <div className="col-span-9 ">
                                        <h1 className="font-bold ">
                                          {data.departure.time}
                                        </h1>
                                        <p>
                                          {format(
                                            data.departure.date,
                                            "d MMMM"
                                          )}
                                        </p>
                                        <span className="font-semibold text-lg">
                                          {data.departure.airport} -
                                          {data.departure.terminal}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="detail px-10 text-lg grid grid-cols-10 justify-items-stretch">
                                      <div className="col-span-9 ">
                                        <div className="flex gap-2">
                                          <img
                                            src={data.airline.image}
                                            alt="logo airlines"
                                            className="h-auto w-7"
                                          />
                                          <h1 className="font-bold ">
                                            {data.airline.name} -{" "}
                                            {data.seatClass}
                                          </h1>
                                        </div>
                                        <h1 className="font-bold ">
                                          {data.flightNum}
                                        </h1>

                                        <span className="font-bold text-lg">
                                          Informasi
                                        </span>

                                        <ul className="px-10">
                                          <li> {data.facility}</li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="return text-lg grid grid-cols-10 justify-items-stretch">
                                      <h1 className="text-darkblue05  font-bold col-end-10 px-5">
                                        Kedatangan
                                      </h1>
                                      <div className="col-span-9 ">
                                        <h1 className="font-bold ">
                                          {data.arrival.time}
                                        </h1>
                                        <p>
                                          {format(data.arrival.date, "d MMMM")}
                                        </p>
                                        <span className="font-semibold text-lg">
                                          {data.arrival.airport} -
                                          {data.arrival.terminal}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </li>
                  );
                })
            ) : (
              <NotFound />
            )}
          </ul>
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
