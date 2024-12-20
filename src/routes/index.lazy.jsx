import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { MyCalendar } from "../components/ui/myCalendar";
import { Switch } from "../components/ui/switch";
import { Toggle } from "../components/ui/toggle";
import { Combobox } from "../components/ui/combobox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { format, set, setQuarter } from "date-fns";
import { getAirpots } from "../services/airports";
import { useQuery } from "@tanstack/react-query";
import { getCities } from "../services/cities";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { useParams } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { getFlights } from "../services/flights";
import Loading from "../components/Utils/Loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";

export const Route = createLazyFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="px-5 md:px-0">
      <HeroSection />
      <div className="relative flex justify-center">
        <div className="absolute px-4 sm:px-6 lg:px-8 -top-24 z-10 flex flex-col justify-center items-center gap-y-5 max-w-full md:max-w-[55rem] lg:max-w-[80rem]">
          <MenuSection />
          <ResultSection />
        </div>
      </div>
    </div>
  );
}

const HeroSection = () => {
  return (
    <>
      <div className="bg-gradient-to-r from-darkblue04 to-darkblue03 my-16 md:my-28 relative h-32 w-full flex justify-center items-center  ">
        <div className="hero absolute container mx-auto rounded-2xl overflow-hidden z-10 bg-[#ffe9ca] ">
          <div className="flex  md:flex-row justify-between h-auto md:h-72 bg-gradient-to-r from-[#ffe9ca] md:from-25% to-transparent ">
            <div className="w-full md:w-1/4 h-full p-6 md:p-10 z-10 text-center md:text-left flex flex-col justify-center ">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold italic text-white dark:text-black">
                Diskon Hari Ini
              </h1>
              <span className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-darkblue03">
                85%!
              </span>
            </div>
            <div className="flex justify-center md:justify-end bg-[url('/img/bangkok.png')] h-48 md:h-auto w-full md:w-9/12 bg-no-repeat bg-cover bg-left -z-10"></div>
          </div>
        </div>
      </div>
    </>
  );
};

const MenuSection = () => {
  const [departureDate, setDepartureDate] = useState(new Date());
  const [arrivalDate, setArivalDate] = useState(new Date());
  const [openFrom, setOpenFrom] = useState(false);
  const [originCity, setOriginCity] = useState(null);
  const [destinationCity, setDestinationCity] = useState(null);
  const [openTo, setOpenTo] = useState(false);
  const [countAdult, setCountAdult] = useState(0);
  const [countChild, setCountChild] = useState(0);
  const [countBaby, setCountBaby] = useState(0);
  const [returnCity, setReturnCity] = useState(true);
  const [listCities, setListCities] = useState([]);
  const [isToggled, setIsToggled] = useState(false);
  const [classSeat, setClassSeat] = useState(null);

  const navigate = useNavigate();

  const { data, isSuccess } = useQuery({
    queryKey: ["airpots"],
    queryFn: () => getCities(),
    enabled: true,
  });

  useEffect(() => {
    if (isSuccess) {
      setListCities(data);
    }
  }, [isSuccess, listCities, data]);
  const handleToggle = () => {
    setIsToggled(!isToggled);
    let temp = originCity;
    setOriginCity(destinationCity);
    setDestinationCity(temp);
  };

  return (
    <Card className="max-w-full  md:max-w-[55rem] lg:min-w-[80rem] ">
      <CardHeader>
        <CardTitle className="text-start text-lg sm:text-md lg:text-2xl">
          Pilih Jadwal Penerbangan spesial di
          <i className="text-darkblue04">TraveLynk!</i>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-y-3 gap-x-4">
            <div className="flex flex-col gap-2 col-span-1 md:col-span-3">
              <Label
                htmlFor="from"
                className="flex align-middle items-center gap-1"
              >
                <img src="/svg/pesawat.svg" alt="pesawat.icon" />
                Kota Keberangkatan
              </Label>
              <Combobox
                className="w-full"
                data={listCities}
                open={openFrom}
                setOpen={setOpenFrom}
                value={originCity}
                setValue={setOriginCity}
                placeholder="City"
              />
            </div>

            <div className="flex justify-center col-span-1 md:col-span-1 items-center">
              <Toggle
                onClick={handleToggle}
                checked={isToggled}
                className="hover:animate-spin rounded-full p-0"
              >
                <img src="/svg/change.svg" alt="toggle.icon" />
              </Toggle>
            </div>

            <div className="flex flex-col gap-2 col-span-1 md:col-span-3">
              <Label
                htmlFor="to"
                className="flex align-middle items-center gap-1"
              >
                <img src="/svg/pesawat.svg" alt="pesawat.icon" /> Kota Tujuan
              </Label>
              <Combobox
                className="w-full"
                data={listCities}
                open={openTo}
                setOpen={setOpenTo}
                value={destinationCity}
                setValue={setDestinationCity}
                placeholder="City"
              />
            </div>

            <div className="flex flex-col gap-4 col-span-1 md:col-span-3">
              <Label
                htmlFor="date"
                className="flex align-middle items-center gap-1"
              >
                <img src="/svg/calendar.svg" alt="calendar.icon" /> Tanggal
                Kepergian
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="depature">Depature</Label>
                  <MyCalendar
                    mode="single"
                    date={departureDate}
                    setDate={setDepartureDate}
                    className="rounded-md border"
                  />
                </div>
                <div
                  className={`flex-col gap-3 ${returnCity ? "flex" : "hidden"}`}
                >
                  <Label htmlFor="return">Tanggal Kepulangan</Label>
                  <MyCalendar
                    mode="single"
                    date={arrivalDate}
                    setDate={setArivalDate}
                    className="rounded-md border"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center col-span-1 md:col-span-1">
              <Switch
                checked={returnCity}
                onCheckedChange={(checked) => setReturnCity(checked)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-1 md:col-span-3 items-end">
              <div className="flex flex-col ">
                <Label htmlFor="passengers">
                  <img
                    src="/svg/passengers.svg"
                    alt="passengers.icon"
                    className="inline-block"
                  />
                  Penumpang
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      {countAdult + countChild + countBaby !== 0
                        ? `${countAdult + countBaby + countChild}  Penumpang`
                        : "Penumpang"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-96">
                    <div className="grid gap-4 ">
                      <div className="flex justify-end border-b-2 border-gray-100 pb-2 ">
                        {/* <Button>X</Button> */}
                      </div>
                      <div className="grid gap-2">
                        <div className="grid grid-cols-2   gap-4  border-b-2 border-gray-100 pb-2 ">
                          <div className="grid grid-cols-6  ">
                            <img
                              src="/svg/adult.svg"
                              alt="adult"
                              className="w-4 "
                            />
                            <Label
                              htmlFor="width"
                              className="col-span-5 text-lg p-0"
                            >
                              Dewasa
                            </Label>
                            <p className="font-light col-span-5 col-end-7 text-sm ">
                              (12 Tahun Keatas)
                            </p>
                          </div>
                          <div className="grid grid-cols-3 gap-x-2 items-center justify-center">
                            <Button
                              onClick={() => {
                                countAdult != 0 &&
                                  setCountAdult(countAdult - 1);
                              }}
                            >
                              -
                            </Button>
                            <Input
                              id="width"
                              value={countAdult}
                              className="text-center"
                            />
                            <Button
                              onClick={() => setCountAdult(countAdult + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2   gap-4 border-b-2 border-gray-100 pb-2 ">
                          <div className="grid grid-cols-6  ">
                            <img
                              src="/svg/child.svg"
                              alt="adult"
                              className="w-4 "
                            />
                            <Label
                              htmlFor="width"
                              className="col-span-5 text-lg p-0"
                            >
                              Anak-Anak
                            </Label>
                            <p className="font-light col-span-5 col-end-7 text-sm ">
                              (2 - 11 Tahun Keatas)
                            </p>
                          </div>
                          <div className="grid grid-cols-3 gap-x-2 items-center justify-center">
                            <Button
                              onClick={() => {
                                countChild != 0 &&
                                  setCountChild(countChild - 1);
                              }}
                            >
                              -
                            </Button>

                            <Input
                              id="width"
                              value={countChild}
                              className="text-center"
                            />
                            <Button
                              onClick={() => setCountChild(countChild + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2   gap-4  border-b-2 border-gray-100 pb-2 ">
                          <div className="grid grid-cols-6  ">
                            <img
                              src="/svg/baby.svg"
                              alt="adult"
                              className="w-4 "
                            />
                            <Label
                              htmlFor="width"
                              className="col-span-5 text-lg p-0"
                            >
                              Bayi
                            </Label>
                            <p className="font-light col-span-5 col-end-7 text-sm ">
                              (Dibawahh 2 tahun)
                            </p>
                          </div>
                          <div className="grid grid-cols-3 gap-x-2 items-center justify-center">
                            <Button
                              onClick={() => {
                                countBaby != 0 && setCountBaby(countBaby - 1);
                              }}
                            >
                              -
                            </Button>
                            <Input
                              id="width"
                              value={countBaby}
                              className="text-center"
                            />
                            <Button onClick={() => setCountBaby(countBaby + 1)}>
                              +
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end"></div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="seat-class">Jenis Penerbangan</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      {classSeat ? classSeat : "Kelas"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-96">
                    <div className="grid gap-4 ">
                      <RadioGroup
                        defaultValue={classSeat}
                        onValueChange={(value) => setClassSeat(value)}
                      >
                        <div className="flex items-center gap-5 py-3 hover:bg-darkblue05 px-5 rounded-sm transition  cursor-pointer  group">
                          <Label
                            htmlFor="Economy"
                            className=" group-hover:text-white  gap-4  border-b-2 border-gray-100 pb-2 w-full text-xl"
                          >
                            <h1>Economy</h1>
                          </Label>
                          <RadioGroupItem value="Economy" id="Economy" />
                        </div>
                        <div className="flex items-center gap-5 py-3 hover:bg-darkblue05 px-5 rounded-sm transition  cursor-pointer  group">
                          <Label
                            htmlFor="Business"
                            className=" group-hover:text-white  gap-4  border-b-2 border-gray-100 pb-2 w-full text-xl"
                          >
                            <h1>Business</h1>
                          </Label>
                          <RadioGroupItem value="Business" id="Business" />
                        </div>
                        <div className="flex items-center gap-5 py-3 hover:bg-darkblue05 px-5 rounded-sm transition  cursor-pointer  group">
                          <Label
                            htmlFor="firstClass"
                            className=" group-hover:text-white  gap-4  border-b-2 border-gray-100 pb-2 w-full text-xl"
                          >
                            <h1>First Class</h1>
                          </Label>
                          <RadioGroupItem value="First Class" id="firstClass" />
                        </div>
                        <div className="flex items-center gap-5 py-3 hover:bg-darkblue05 px-5 rounded-sm transition  cursor-pointer  group">
                          <Label
                            htmlFor="premiumEconomy"
                            className=" group-hover:text-white  gap-4  border-b-2 border-gray-100 pb-2 w-full text-xl"
                          >
                            <h1>Premium Economy</h1>
                          </Label>
                          <RadioGroupItem
                            value="Premium Economy"
                            id="premiumEconomy"
                          />
                        </div>
                      </RadioGroup>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="w-full">
        <Button
          disabled={
            (returnCity &&
              originCity &&
              arrivalDate &&
              departureDate &&
              countAdult > 0 &&
              classSeat) ||
            (!returnCity &&
              originCity &&
              departureDate &&
              countAdult > 0 &&
              classSeat)
              ? false
              : true
          }
          onClick={() =>
            navigate({
              to: "/flights/search",
              search: {
                rf: `${originCity}.${destinationCity}`,
                dt: returnCity
                  ? `${format(new Date(departureDate), "yyyy-MM-dd")}.${format(new Date(arrivalDate), "yyyy-MM-dd")}`
                  : `${format(new Date(departureDate), "yyyy-MM-dd")}`,

                ps: `${countAdult}.${countChild}.${countBaby}`,
                sc: classSeat,
              },
            })
          }
          className="w-full bg-darkblue04 text-white block text-center py-2 rounded"
        >
          Cari Penerbangan
        </Button>
      </CardFooter>
    </Card>
  );
};

const ResultSection = () => {
  const [listFlight, setListFlight] = useState([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState();
  const [countAdult, setCountAdult] = useState(0);
  const [countChild, setCountChild] = useState(0);
  const [countBaby, setCountBaby] = useState(0);
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ["flights", searchQuery],
    queryFn: () => getFlights(searchQuery),
    enabled: !!searchQuery,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!searchQuery) {
      setSearchQuery({
        rf: "JKT.DPS",
        dt: "2024-12-30",
        ps: "1.0.0",
        sc: "Economy",
      });
    }
    isSuccess && setListFlight(data?.outboundFlights);
  }, [data?.outboundFlights, isSuccess, searchQuery]);

  const handleDestination = (rf, dt, ps, sc) => {
    setSearchQuery({ rf, dt, ps, sc });
  };
  if (isLoading) {
    return <Loading />;
  }

  const handlePay = (pessanger, data) => {
    const storedCart = JSON.parse(localStorage.getItem("cartTicket")) || {
      pessanger: null,
      flights: [{ pergi: null, pulang: null }],
    };
    const [countAdult, countChild, countBaby] = pessanger
      .split(".")
      .map(Number);

    const updatedCart = {
      ...storedCart,
      flights: [{ pergi: data, pulang: null }],
      pessanger: { adult: countAdult, child: countChild, babby: countBaby },
    };

    localStorage.setItem("cartTicket", JSON.stringify(updatedCart));

    navigate({ to: "/flights/booking" });
  };
  return (
    <div className="flex flex-col items-center w-full gap-3 py-5">
      <div className="w-full">
        <h1 className="font-bold text-3xl">Destinasi Favorit</h1>
        <div className="filter text-white grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-7 gap-5">
          <Button
            className="bg-darkblue03 py-4 px-6 rounded-lg w-fit"
            onClick={() => {
              handleDestination("JKT.DPS", "2024-12-30", "1.0.0", "Economy");
            }}
          >
            <img src="/svg/search.svg" alt="" /> Bali
          </Button>
          <Button
            className="bg-darkblue03 py-4 px-6 rounded-lg "
            onClick={() => {
              handleDestination("JKT.SUB", "2024-12-30", "1.0.0", "Economy");
            }}
          >
            <img src="/svg/search.svg" alt="" /> Surabaya
          </Button>
          <Button
            className="bg-darkblue03 py-4 px-6 rounded-lg w-fit"
            onClick={() => {
              handleDestination("JKT.JOG", "2024-12-30", "1.0.0", "Economy");
            }}
          >
            <img src="/svg/search.svg" alt="" /> Yogyakarta
          </Button>
        </div>
      </div>

      <div className="card grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-4 font-semibold ">
        {listFlight?.map((flight, i) => {
          return (
            <Dialog key={i} className="text-start ">
              <DialogTrigger className="border-0">
                <Card
                  className="p-2 text-start hover:bg-darkblue02/50 transition-colors"
                  key={i}
                >
                  <img src="img/bangkokCard.png" alt="" className="w-full" />
                  <CardHeader>
                    <CardTitle>
                      {flight.flights[0].departure.city.name} {">"}{" "}
                      {
                        flight.flights[flight.flights.length - 1].arrival.city
                          .name
                      }
                    </CardTitle>
                    {flight.isTransit && <i>Transit</i>}
                    <CardDescription className="text-darkblue05 text-lg p-0">
                      {flight.flights[0].airline.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="py-0">
                    <p>{flight.schedule.date}</p>
                  </CardContent>
                  <CardFooter>
                    <span className="text-red-500">{flight.price}</span>
                  </CardFooter>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {" "}
                    {flight.flights[0].departure.city.name} {">"}{" "}
                    {
                      flight.flights[flight.flights.length - 1].arrival.city
                        .name
                    }
                  </DialogTitle>
                  <DialogDescription className="lg:max-h-[50rem] max-h-[25rem]  overflow-y-auto overflow-x-hidden ">
                    {flight.flights.map((data) => {
                      return (
                        <div key={data.flightId}>
                          <div className="depature text-lg grid grid-cols-10 justify-items-stretch">
                            <h1 className="text-darkblue05  font-bold col-span-10   mb-1 ">
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
                              <h1 className="font-bold ">{data.flightNum}</h1>

                              <span className="font-bold text-lg">
                                Informasi
                              </span>

                              <ul className="px-10">
                                <li> {data.facility}</li>
                              </ul>
                            </div>
                          </div>

                          <div className="return text-lg grid grid-cols-10 justify-items-stretch">
                            <h1 className="text-darkblue05  font-bold col-span-10  mb-1">
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
                                {data.arrival.airport} -{data.arrival.terminal}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div className="action flex gap-2 items-center ">
                      <div className="flex flex-col ">
                        <Popover className="z-50">
                          <PopoverTrigger asChild>
                            <Button variant="outline">
                              {countAdult + countChild + countBaby !== 0
                                ? `${countAdult + countBaby + countChild}  Penumpang`
                                : "Penumpang"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-96 ">
                            <div className="grid gap-4 z-50">
                              <div className="flex justify-end border-b-2 border-gray-100 pb-2 ">
                                {/* <Button>X</Button> */}
                              </div>
                              <div className="grid gap-2">
                                <div className="grid grid-cols-2   gap-4  border-b-2 border-gray-100 pb-2 ">
                                  <div className="grid grid-cols-6  ">
                                    <img
                                      src="/svg/adult.svg"
                                      alt="adult"
                                      className="w-4 "
                                    />
                                    <Label
                                      htmlFor="width"
                                      className="col-span-5 text-lg p-0"
                                    >
                                      Dewasa
                                    </Label>
                                    <p className="font-light col-span-5 col-end-7 text-sm ">
                                      (12 Tahun Keatas)
                                    </p>
                                  </div>
                                  <div className="grid grid-cols-3 gap-x-2 items-center justify-center">
                                    <Button
                                      onClick={() => {
                                        countAdult != 0 &&
                                          setCountAdult(countAdult - 1);
                                      }}
                                    >
                                      -
                                    </Button>
                                    <Input
                                      id="width"
                                      value={countAdult}
                                      className="text-center"
                                    />
                                    <Button
                                      onClick={() =>
                                        setCountAdult(countAdult + 1)
                                      }
                                    >
                                      +
                                    </Button>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2   gap-4 border-b-2 border-gray-100 pb-2 ">
                                  <div className="grid grid-cols-6  ">
                                    <img
                                      src="/svg/child.svg"
                                      alt="adult"
                                      className="w-4 "
                                    />
                                    <Label
                                      htmlFor="width"
                                      className="col-span-5 text-lg p-0"
                                    >
                                      Anak-Anak
                                    </Label>
                                    <p className="font-light col-span-5 col-end-7 text-sm ">
                                      (2 - 11 Tahun Keatas)
                                    </p>
                                  </div>
                                  <div className="grid grid-cols-3 gap-x-2 items-center justify-center">
                                    <Button
                                      onClick={() => {
                                        countChild != 0 &&
                                          setCountChild(countChild - 1);
                                      }}
                                    >
                                      -
                                    </Button>

                                    <Input
                                      id="width"
                                      value={countChild}
                                      className="text-center"
                                    />
                                    <Button
                                      onClick={() =>
                                        setCountChild(countChild + 1)
                                      }
                                    >
                                      +
                                    </Button>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2   gap-4  border-b-2 border-gray-100 pb-2 ">
                                  <div className="grid grid-cols-6  ">
                                    <img
                                      src="/svg/baby.svg"
                                      alt="adult"
                                      className="w-4 "
                                    />
                                    <Label
                                      htmlFor="width"
                                      className="col-span-5 text-lg p-0"
                                    >
                                      Bayi
                                    </Label>
                                    <p className="font-light col-span-5 col-end-7 text-sm ">
                                      (Dibawahh 2 tahun)
                                    </p>
                                  </div>
                                  <div className="grid grid-cols-3 gap-x-2 items-center justify-center">
                                    <Button
                                      onClick={() => {
                                        countBaby != 0 &&
                                          setCountBaby(countBaby - 1);
                                      }}
                                    >
                                      -
                                    </Button>
                                    <Input
                                      id="width"
                                      value={countBaby}
                                      className="text-center"
                                    />
                                    <Button
                                      onClick={() =>
                                        setCountBaby(countBaby + 1)
                                      }
                                    >
                                      +
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-end"></div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <Button
                        className="w-full mx-2"
                        disabled={!countAdult > 0}
                        onClick={() =>
                          handlePay(
                            `${countAdult}.${countChild}.${countBaby}`,
                            flight
                          )
                        }
                      >
                        Booking
                      </Button>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
    </div>
  );
};
