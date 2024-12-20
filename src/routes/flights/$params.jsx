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
import { useEffect, useRef, useState } from "react";
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
  const [roundTrip, setRoundTrip] = useState(false);

  const [airlines, setAirlines] = useState([]);
  const [sliderValue, setSliderValue] = useState();
  const [listFlights, setListFlights] = useState([]);
  const [minPrize, setMinprize] = useState();
  const [maxPrize, setMaxprize] = useState();
  const [checkedAirlines, setCheckedAirlines] = useState([]);
  const [sort, setSort] = useState("1");
  const [cartDepartureFlight, setCartDepartureFlight] = useState(null);
  const [cartArrivalFlight, setCartArrivalFlight] = useState(null);
  const [transitFilter, setTransitFilter] = useState({
    isDirect: true,
    isOneTransit: true,
    isTwoPlusTransit: true,
  });

  const searchQuery = { ...Route.useSearch() };

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ["flights", searchQuery],
    queryFn: () => getFlights(searchQuery),
    enabled: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cartTicket")) || {
      pessanger: null,
      flights: [{ pergi: null, pulang: null }],
    };

    if (storedCart.flights.length > 0) {
      const { pergi, pulang } = storedCart.flights[0];

      if (pergi) {
        setCartDepartureFlight(pergi);
      }

      if (pulang) {
        setCartArrivalFlight(pulang);
      }

      if (pulang) {
        setRoundTrip(true);
      }
    }

    if (isSuccess) {
      if (data === null) {
        return <NotFound />;
      }

      const flights = !roundTrip
        ? data.outboundFlights || []
        : data.returnFlights || [];

      if (flights) {
        const airlines = flights
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

        const prices = flights.map((flight) =>
          parseInt(flight.price.replace(/[^0-9]/g, ""), 10)
        );

        setAirlines(airlines);
        setListFlights(flights);
        setMinprize(Math.min(...prices));
        setMaxprize(Math.max(...prices));
        setSliderValue(Math.min(...prices));
        setCheckedAirlines(airlines.map((airline) => airline.name));
      }
    }
  }, [
    isSuccess,
    data,
    roundTrip,
    searchQuery.ps,
    searchQuery.sc,
    setRoundTrip,
    cartArrivalFlight,
  ]);

  const flightFilter = {
    airlines,
    minPrize,
    maxPrize,
    sliderValue,
    checkedAirlines,
    setSliderValue,
    setCheckedAirlines,
    sort,
    transitFilter,
    setTransitFilter,
  };
  const cart = {
    cartDepartureFlight,
    cartArrivalFlight,
    setCartArrivalFlight,
    setCartDepartureFlight,
  };

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

  return (
    <>
      <div className="container mx-auto lg:px-28 px-2">
        <HeaderComponent
          flightDetails={searchQuery}
          filters={flightFilter}
          setSort={setSort}
          handleCheckboxChange={handleCheckboxChange}
          handleTransitChange={handleTransitChange}
          listFlights={listFlights}
          roundTrip={roundTrip}
        />
        <BodyComponent
          listFlights={listFlights}
          sort={sort}
          filters={flightFilter}
          isLoading={isLoading}
          handleCheckboxChange={handleCheckboxChange}
          handleTransitChange={handleTransitChange}
          roundTrip={roundTrip}
          setRoundTrip={setRoundTrip}
          cart={cart}
        />
      </div>
    </>
  );
}

const HeaderComponent = ({
  flightDetails,
  setSort,
  filters,
  handleCheckboxChange,
  handleTransitChange,
  listFlights,
  roundTrip,
}) => {
  const [dates, setDates] = useState([]);
  const [departureDate, setDepartureDate] = useState();
  const [returnDate, setReturnDate] = useState();
  const navigate = useNavigate();
  const prevRfRef = useRef();
  const prevRoundTripRef = useRef();
  const { rf, dt, ps, sc } = flightDetails;

  if (dt.includes(".")) {
    const [departure, returnDt] = dt.split(".");
    if (departure !== departureDate) setDepartureDate(departure);
    if (returnDt !== returnDate) setReturnDate(returnDt);
  }

  const [origin, destination] = rf.split(".");
  const [countAdult, countChild, countBaby] = ps.split(".").map(Number);

  const {
    airlines,
    minPrize,
    maxPrize,
    sliderValue,
    checkedAirlines,
    setCheckedAirlines,
    sort,
    transitFilter,
    setTransitFilter,
  } = filters;

  useEffect(() => {
    const listDates = (startDate) => {
      const dates = [];
      const length =
        !roundTrip && returnDate
          ? Math.ceil(
              (new Date(returnDate) - new Date(departureDate)) /
                (1000 * 3600 * 24)
            ) + 1
          : 8;

      for (let i = 0; i < length; i++) {
        const newDate = new Date(
          new Date(startDate).setDate(new Date(startDate).getDate() + i)
        )
          .toISOString()
          .split("T")[0];
        dates.push(newDate);
      }

      return dates;
    };

    if (rf !== prevRfRef.current || roundTrip !== prevRoundTripRef.current) {
      if (dt.includes(".")) {
        setDates(listDates(roundTrip ? returnDate : departureDate));
      } else {
        setDates(listDates(dt));
      }
      prevRoundTripRef.current = roundTrip;
      prevRfRef.current = rf;
    }
  }, [rf, dt, roundTrip, returnDate, departureDate]);

  return (
    <>
      <div className="flex flex-col gap-3 my-5">
        <h1 className="font-bold text-2xl py-5 text-center sm:text-left">
          Pilih Penerbangan
        </h1>
        <div className="navigation px-2 grid grid-cols-1 sm:grid-cols-7 gap-3 text-white">
          <div className="labels col-span-1 sm:col-span-6 flex gap-x-3 bg-darkblue03 p-3 rounded-lg">
            <img src="/svg/arrow-left.svg" alt="" />
            <p className="text-sm sm:text-base">
              {`${origin} > ${destination} - ${countAdult + countChild + countBaby} Penumpang - ${sc}`}
            </p>
          </div>
          <Button
            className="bg-[#73CA5C] hover:bg-[#73CA5C]/70 h-full px-4 py-2 rounded-lg"
            onClick={() => {
              navigate({ to: "/" });
              localStorage.removeItem("cartTicket");
            }}
          >
            Ubah Penerbangan
          </Button>
        </div>
        <div className="list-date flex px-3 overflow-x-auto gap-2 ">
          {dates.map((day, i) => {
            return (
              <Button
                onClick={() => {
                  navigate({
                    to: "/flights/search",
                    search: {
                      rf: `${origin}.${destination}`,
                      dt: dt.includes(".")
                        ? `${format(new Date(!roundTrip ? day : departureDate), "yyyy-MM-dd")}.${format(new Date(!roundTrip ? returnDate : day), "yyyy-MM-dd")}`
                        : `${format(new Date(day), "yyyy-MM-dd")}`,
                      ps: `${countAdult}.${countChild}.${countBaby}`,
                      sc,
                    },
                  });
                }}
                key={i}
                className="border border-gray-300 bg-white h-auto text-black p-3 flex flex-col justify-center items-center min-w-[150px] sm:max-w-[120px] rounded-lg hover:bg-darkblue03 transition text-xl cursor-pointer dark:text-black"
              >
                <span className="text-sm sm:text-xl ">
                  {new Date(day).toLocaleDateString("id-ID", {
                    weekday: "long",
                  })}
                </span>
                <p className="bg-none text-xs sm:text-sm">{day}</p>
              </Button>
            );
          })}
        </div>
        <div className="filter flex justify-between lg:justify-end ">
          <div className="md:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <Button className="bg-transparent border border-darkblue03 px-3 text-darkblue05 hover:text-white rounded-full  hover:fill-white text-lg transition">
                  <img src="/svg/fitler.svg" alt="" />
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
                        <img src="/svg/box.svg" alt="" />
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
                          onCheckedChange={() =>
                            handleTransitChange("isDirect")
                          }
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
                        <img src="/svg/pesawat.svg" alt="" />
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
                        <img src="/svg/dollar.svg" alt="" />
                        <span>Harga</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-2">
                      <div className="flex justify-end text-gray-500">
                        <span>
                          IDR{" "}
                          {new Intl.NumberFormat("id-ID").format(sliderValue)}
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
              </PopoverContent>
            </Popover>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button className="bg-transparent border border-darkblue03 px-3 text-darkblue05 hover:text-white rounded-full  hover:fill-white text-lg transition">
                <img src="/svg/fitler.svg" alt="" />
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
                        <span className="font-bold">Harga</span> - Termurah
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

const BodyComponent = ({
  cart,
  listFlights,
  filters,
  isLoading,
  handleCheckboxChange,
  handleTransitChange,
  roundTrip,
  setRoundTrip,
}) => {
  // const [cart, setCart] = useState([]);
  const [hovered, setHovered] = useState(false);
  const {
    airlines,
    minPrize,
    maxPrize,
    sliderValue,
    setSliderValue,
    checkedAirlines,
    setCheckedAirlines,
    sort,
    transitFilter,
    setTransitFilter,
  } = filters;
  const {
    cartDepartureFlight,
    cartArrivalFlight,
    setCartArrivalFlight,
    setCartDepartureFlight,
  } = cart;
  const searchQuery = { ...Route.useSearch() };
  const navigate = useNavigate();

  const handleCart = (event, data) => {
    event.preventDefault();

    const storedCart = JSON.parse(localStorage.getItem("cartTicket")) || {
      pessanger: null,
      flights: [{ pergi: null, pulang: null }],
    };

    const updatedFlights = !roundTrip
      ? [{ pergi: data, pulang: storedCart.flights[0].pulang }]
      : [{ pergi: storedCart.flights[0].pergi, pulang: data }];

    const updatedCart = { ...storedCart, flights: updatedFlights };
    localStorage.setItem("cartTicket", JSON.stringify(updatedCart));

    if (!roundTrip) {
      setCartDepartureFlight(data);
      if (searchQuery.dt.includes(".") && !roundTrip) {
        setRoundTrip(true);
      }
    } else {
      setCartArrivalFlight(data);
    }
  };

  const deleteHandle = (flightNumber) => {
    const storedCart = JSON.parse(localStorage.getItem("cartTicket")) || {
      pessanger: null,
      flights: [{ pergi: null, pulang: null }],
    };

    if (flightNumber === 1) {
      storedCart.flights[0].pergi = null;
      setCartDepartureFlight(null);
      setRoundTrip(false);
    } else if (flightNumber === 2) {
      storedCart.flights[0].pulang = null;
      setCartArrivalFlight(null);
    }

    localStorage.setItem("cartTicket", JSON.stringify(storedCart));
  };

  const handlePay = (pessanger) => {
    const storedCart = JSON.parse(localStorage.getItem("cartTicket")) || {
      pessanger: null,
      flights: [{ pergi: null, pulang: null }],
    };
    const [countAdult, countChild, countBaby] = pessanger
      .split(".")
      .map(Number);

    const updatedCart = {
      ...storedCart,
      pessanger: { adult: countAdult, child: countChild, babby: countBaby },
    };

    localStorage.setItem("cartTicket", JSON.stringify(updatedCart));

    navigate({ to: "/flights/booking" });
  };
  return (
    <>
      <div className="flex   flex-col lg:flex-row gap-3 pb-5">
        <div className=" w-full lg:w-1/4 flex flex-col gap-5 ">
          <div className="cart p-5 border border-darkblue02 rounded-xl shadow-sm text-lg h-fit flex flex-col gap-3 ">
            <h1 className="text-2xl font-semibold">Penerbangan Anda</h1>
            <div className="flex flex-col gap-1">
              <div className=" flex gap-3 items-center ">
                <Button
                  className="px-4 py-1 text-white bg-darkblue05 rounded-xl shadow-md"
                  onClick={() => deleteHandle(1)}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  {hovered ? "x" : "1"}
                </Button>
                <div className="flex flex-col font-semibold">
                  <h1>
                    {cartDepartureFlight &&
                      cartDepartureFlight.flightDate &&
                      new Date(
                        cartDepartureFlight.flightDate
                      ).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                  </h1>
                  <p className="font-light">
                    {cartDepartureFlight &&
                    cartDepartureFlight.flights &&
                    cartDepartureFlight.flights.length > 0
                      ? `${cartDepartureFlight.flights[0]?.departure?.city?.name} - ${cartDepartureFlight?.flights?.[cartDepartureFlight.flights.length - 1]?.arrival?.city?.name}`
                      : ""}
                  </p>
                </div>
              </div>
              {roundTrip && (
                <div className="flex gap-3 items-center">
                  <Button
                    className="px-4 py-1 text-white bg-darkblue05 rounded-xl shadow-md"
                    onClick={() => deleteHandle(2)}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                  >
                    {hovered ? "x" : "2"}
                  </Button>
                  <div className="flex flex-col font-semibold">
                    <h1>
                      {cartArrivalFlight &&
                        cartArrivalFlight.flightDate &&
                        new Date(
                          cartArrivalFlight.flightDate
                        ).toLocaleDateString("id-ID", {
                          weekday: "long",
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                    </h1>
                    <p className="font-light">
                      {cartArrivalFlight &&
                      cartArrivalFlight.flights &&
                      cartArrivalFlight.flights.length > 0
                        ? `${cartArrivalFlight.flights[0]?.departure?.city?.name} - ${cartArrivalFlight?.flights?.[cartArrivalFlight.flights.length - 1]?.arrival?.city?.name}`
                        : ""}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <Button
              onClick={() => handlePay(searchQuery.ps)}
              disabled={
                (roundTrip && !!cartArrivalFlight && !!cartDepartureFlight) ||
                (!roundTrip && !!cartDepartureFlight) //true
                  ? false
                  : true
              }
            >
              Pembayaran
            </Button>
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
                    <img src="/svg/box.svg" alt="" />
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
                    <img src="/svg/pesawat.svg" alt="" />
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
                    <img src="/svg/dollar.svg" alt="" />
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

                  const departureTimeA = new Date(a.departureTime).getTime();
                  const departureTimeB = new Date(b.departureTime).getTime();

                  const arrivalTimeA = new Date(a.arrivalTime).getTime();
                  const arrivalTimeB = new Date(b.arrivalTime).getTime();

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
                ?.map((data, i) => {
                  return (
                    <li key={i}>
                      <Accordion
                        type="single"
                        collapsible
                        className="p-5 border border-darkblue02 rounded-xl shadow-sm w-full"
                      >
                        <AccordionItem
                          value={`flight-${data.id}`}
                          className="py-2"
                        >
                          <div className="w-full bg-transparent hover:bg-transparent grid grid-cols-12 ">
                            <div className="header flex gap-2 h-[2rem] w-auto col-span-12">
                              <img src={data.flights[0].airline.image} alt="" />
                              <span>
                                {data.flights[0].airline.name} -{" "}
                                {data.seatClass}
                              </span>
                            </div>
                            <div className="content   flex col-span-9 lg:col-span-10 px-5 justify-start font-bold text-sm md:text-xl items-center lg:gap-3 gap-1">
                              <AccordionTrigger>
                                <div className="flex  w-full px-5 justify-start font-bold text-sm md:text-xl items-center lg:gap-3 gap-1">
                                  <div>
                                    <span>
                                      {new Date(data.departureTime)
                                        .toISOString()
                                        .slice(11, 16)}
                                    </span>
                                    <p className="font-semibold text-lg">
                                      {data.flights[0].departure.city.code}
                                    </p>
                                  </div>
                                  <div className="flex flex-col justify-center items-center  text-sm md:text-xl  w-full font-semibold text-gray-400 text-center">
                                    <span>{data.estimatedDuration}</span>
                                    <img
                                      src="/svg/route.svg"
                                      alt=""
                                      className="w-full"
                                    />
                                    <span>
                                      {data.isTransit ? "Transit" : "Langsung"}
                                    </span>
                                  </div>
                                  <div>
                                    <span>
                                      {new Date(data.arrivalTime)
                                        .toISOString()
                                        .slice(11, 16)}
                                    </span>
                                    <p className="font-semibold text-lg">
                                      {
                                        data.flights[data.flights.length - 1]
                                          .arrival.city.code
                                      }
                                    </p>
                                  </div>

                                  <img
                                    src="/svg/bagasi.svg"
                                    alt=""
                                    className="w-10"
                                  />
                                </div>
                              </AccordionTrigger>
                            </div>

                            <div className="price text-sm  lg:text-lg font-bold text-darkblue04  col-span-3 lg:col-span-2 ">
                              <h1>{data.price}</h1>
                              <Button
                                className="w-full rounded-2xl"
                                onClick={(event) => handleCart(event, data)}
                              >
                                Pilih
                              </Button>
                            </div>
                          </div>
                          <AccordionContent>
                            <h1 className="text-darkblue05 text-xl font-bold">
                              Detail Penerbangan
                            </h1>

                            {data.flights.map((data) => {
                              return (
                                <div key={data.flightId}>
                                  <div className="depature text-lg grid grid-cols-10 justify-items-stretch">
                                    <h1 className="text-darkblue05  font-bold lg:col-end-10 col-end-7 px-5">
                                      Keberangkatan
                                    </h1>
                                    <div className="col-span-9 ">
                                      <h1 className="font-bold ">
                                        {data.departure.time}
                                      </h1>
                                      <p>
                                        {/* {new Date(data.departure.date)} */}
                                        {/* {format(data.departure.date, "d MMMM")} */}
                                        {new Date(
                                          data.departure.date
                                        ).toLocaleDateString("id-ID", {
                                          day: "numeric",
                                          month: "long",
                                        })}
                                        {/* {new Date(data.departure.date)} */}
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
                                          {data.airline.name} - {data.seatClass}
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
                                    <h1 className="text-darkblue05  font-bold lg:col-end-10 col-end-7 px-5">
                                      Kedatangan
                                    </h1>
                                    <div className="col-span-9 ">
                                      <h1 className="font-bold ">
                                        {data.arrival.time}
                                      </h1>
                                      <p>
                                        {/* {format(data.arrival.date, "d MMMM")} */}
                                      </p>
                                      <span className="font-semibold text-lg">
                                        {data.arrival.airport} -
                                        {data.arrival.terminal}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </li>
                  );
                })
            ) : (
              <SoldOut />
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
        <img src="/svg/sold-out.svg" alt="" />
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
              <img src="/svg/verification.svg" alt="" />
              <div className="flex flex-col gap-1 col-span-11">
                <div className="animate-pulse rounded-md bg-muted w-full  h-3" />
                <div className="animate-pulse rounded-md bg-muted w-8/12  h-3" />
              </div>
            </Skeleton>
            <Skeleton className=" p-2 grid grid-cols-12 w-full">
              <img src="/svg/verification.svg" alt="" />
              <div className="flex flex-col gap-1 col-span-11">
                <div className="animate-pulse rounded-md bg-muted w-full  h-3" />
                <div className="animate-pulse rounded-md bg-muted w-8/12  h-3" />
              </div>
            </Skeleton>{" "}
            <Skeleton className=" p-2 grid grid-cols-12 w-full">
              <img src="/svg/verification.svg" alt="" />
              <div className="flex flex-col gap-1 col-span-11">
                <div className="animate-pulse rounded-md bg-muted w-full  h-3" />
                <div className="animate-pulse rounded-md bg-muted w-8/12  h-3" />
              </div>
            </Skeleton>
          </div>
          <img src="/svg/man2.svg" alt="" className="w-20 mt-10" />
        </div>
        <h1>Maaf, pencarian Anda tidak ditemukan</h1>
        <span className="text-darkblue04"> Coba cari perjalanan lainnya!</span>
      </div>
    </>
  );
};
