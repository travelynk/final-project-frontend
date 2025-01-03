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
import { Calendar, CalendarIcon } from "lucide-react";
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
import { getFavoriteFlights, getFlights } from "../services/flights";
import Loading from "../components/Utils/Loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { ScrollArea } from "../components/ui/scroll-area";

export const Route = createLazyFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="px-5 md:px-0  ">
      <ScrollArea className="h-[89vh] ">
        <HeroSection />
        <div className="relative flex justify-center">
          <div className="absolute px-4 sm:px-6 lg:px-8 -top-24 z-10 flex flex-col justify-center items-center gap-y-5 max-w-full md:max-w-[55rem] lg:max-w-[80rem]">
            <MenuSection />
            <ResultSection />
          </div>
        </div>
      </ScrollArea>
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
  const [departureDate, setDepartureDate] = useState(
    new Date().setDate(new Date().getDate() + 1)
  );
  const [arrivalDate, setArrivalDate] = useState(
    new Date().setDate(new Date().getDate() + 1)
  );
  const [openFrom, setOpenFrom] = useState(false);
  const [originCity, setOriginCity] = useState(null);
  const [destinationCity, setDestinationCity] = useState(null);
  const [openTo, setOpenTo] = useState(false);
  const [countAdult, setCountAdult] = useState(1);
  const [countChild, setCountChild] = useState(0);
  const [countBaby, setCountBaby] = useState(0);
  const [returnCity, setReturnCity] = useState(false);
  const [listCities, setListCities] = useState([]);
  const [isToggled, setIsToggled] = useState(false);
  const [classSeat, setClassSeat] = useState("Economy");

  const navigate = useNavigate();

  const { data, isSuccess } = useQuery({
    queryKey: ["airpots"],
    queryFn: () => getCities(),
    enabled: true,
  });

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("lastSearch"));
    if (isSuccess) {
      setListCities(data);
      setOriginCity(data[14]?.code);
      setDestinationCity(data[13]?.code);
    }

    if (history) {
      setDepartureDate(new Date(history.departureDate));
      setArrivalDate(
        history.arrivalDate ? new Date(history.arrivalDate) : null
      );
      setOriginCity(history.originCity);
      setDestinationCity(history.destinationCity);
      setCountAdult(history.passengers.adults || 0);
      setCountChild(history.passengers.children || 0);
      setCountBaby(history.passengers.babies || 0);
      setClassSeat(history.classSeat);
    }
  }, [isSuccess, listCities, data]);

  const handleToggle = () => {
    setIsToggled(!isToggled);
    let temp = originCity;
    setOriginCity(destinationCity);
    setDestinationCity(temp);
  };

  const handleSearch = () => {
    const searchData = {
      originCity,
      destinationCity,
      departureDate: format(new Date(departureDate), "yyyy-MM-dd"),
      arrivalDate: returnCity
        ? format(new Date(arrivalDate), "yyyy-MM-dd")
        : null,
      passengers: {
        adults: countAdult,
        children: countChild,
        babies: countBaby,
      },
      classSeat,
    };

    localStorage.setItem("lastSearch", JSON.stringify(searchData));

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
    });
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
          <div className="grid grid-cols-1 md:grid-cols-7 gap-y-5 gap-x-4">
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
                <img src="/svg/flight-change.svg" alt="toggle.icon" />
              </Toggle>
            </div>

            <div className="flex flex-col gap-2 col-span-1 md:col-span-3">
              <Label
                htmlFor="to"
                className="flex align-middle items-center gap-1"
              >
                <img src="/svg/flight-land.svg" alt="pesawat.icon" /> Kota
                Tujuan
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="depature" className="flex items-center">
                    {" "}
                    <CalendarIcon className="text-darkblue05 " />
                    Tanggal Pergi
                  </Label>
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
                  <Label htmlFor="return" className="flex items-center">
                    {" "}
                    <CalendarIcon className="text-darkblue05 " /> Tanggal Pulang
                  </Label>
                  <MyCalendar
                    mode="single"
                    date={arrivalDate}
                    setDate={setArrivalDate}
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
              <div className="flex flex-col  gap-3 ">
                <Label htmlFor="passengers" className="flex items-center">
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
              <div className="flex flex-col gap-3 ">
                <Label htmlFor="seat-class " className="flex items-center">
                  <img
                    src="/svg/flight-class.svg"
                    alt="adult"
                    className="inline-block"
                  />
                  Kelas Penerbangan
                </Label>
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
          onClick={handleSearch}
          className="w-full bg-darkblue04 text-white  text-center py-2 rounded flex gap-3"
        >
          <span>Cari Penerbangan</span>
          <img src="/svg/flight-search.svg" alt="flight-search" />
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
  const [city, setCity] = useState();
  const [active, setActive] = useState(true);
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ["favorite-flights"],
    queryFn: getFavoriteFlights,
    enabled: true,
  });

  useEffect(() => {
    if (isSuccess) {
      setListFlight(data);
      // setCity(data[0]?.flights[0]?.arrival?.city?.name);
    }
  }, [data, isSuccess]);

  if (isLoading) {
    return <Loading />;
  }
  city;

  const handleSearch = (data) => {
    const [date, time] = data.departure.schedule.split(" ");
    setActive(false);
    const searchData = {
      originCity: data.departure.city.code,
      destinationCity: data.arrival.city.code,
      departureDate: format(new Date(`${date}T${time}:00`), "yyyy-MM-dd"),
      arrivalDate: null,
      passengers: {
        adults: countAdult,
        children: countChild,
        babies: countBaby,
      },
      classSeat: data.seatClass,
    };

    localStorage.setItem("lastSearch", JSON.stringify(searchData));

    navigate({
      to: "/flights/search",
      search: {
        rf: `${searchData.originCity}.${searchData.destinationCity}`,
        dt: `${format(new Date(date), "yyyy-MM-dd")}`,
        ps: `${countAdult}.${countChild}.${countBaby}`,
        sc: searchData.classSeat,
      },
    });
  };

  return (
    <div className="flex flex-col items-center w-full gap-3 py-5">
      <div className="w-full">
        <h1 className="font-bold text-3xl">Destinasi Favorit</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <Button
            className="w-full bg-darkblue05 hover:bg-blue-800 text-white p-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            onClick={() => setCity("")}
          >
            <img src="/svg/search.svg" alt="" className="w-4 h-4" />
            <span className="truncate">Semua</span>
          </Button>
          {listFlight?.map((flight, i) => (
            <Button
              key={i}
              className="w-full bg-darkblue05 hover:bg-blue-800 text-white p-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              onClick={() => setCity(flight.city)}
            >
              <img src="/svg/search.svg" alt="" className="w-4 h-4" />
              <span className="truncate">{flight.city}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="card grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-4 font-semibold ">
        {listFlight
          ?.filter((flight) => (city ? flight.city === city : true)) // Filter berdasarkan city
          .map((filteredFlight, index) =>
            filteredFlight.flights.map((favFlight, i) => (
              <Dialog key={`${index}-${i}`} className="text-start ">
                <DialogTrigger className="border-0">
                  <Card className="flex flex-col h-full p-4 text-start hover:bg-darkblue02/50 transition-colors">
                    <img
                      src={favFlight.arrival.city.image}
                      alt=""
                      className="w-full h-32 object-cover" // Fixed height for the image
                    />
                    <CardHeader className="flex-grow">
                      <CardTitle className="text-md">
                        {favFlight.departure.city.name} {">"}{" "}
                        {favFlight.arrival.city.name}
                      </CardTitle>
                      <span className="text-red-500">
                        {favFlight.seatClass}
                      </span>
                      <CardDescription className="text-darkblue05 text-lg p-0 flex gap-3 items-center">
                        <img
                          src={favFlight.airline.image}
                          alt="airline"
                          className="h-auto w-5"
                        />
                        {favFlight.airline.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="py-0 flex-grow">
                      <p className="text-sm">{favFlight.schedule}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <span className="text-red-500">Rp {favFlight.price}</span>
                    </CardFooter>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {favFlight.departure.city.name} {">"}
                      {favFlight.arrival.city.name}
                    </DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    <ScrollArea className="lg:max-h-[30rem] max-h-[25rem]">
                      <div>
                        <div className="depature text-lg grid grid-cols-10 justify-items-stretch">
                          <h1 className="text-darkblue05  font-bold col-span-10   mb-1 ">
                            Keberangkatan
                          </h1>
                          <div className="col-span-9 ">
                            <h1 className="font-bold "></h1>
                            <p>{favFlight.departure.schedule}</p>
                            <span className="font-semibold text-lg">
                              {favFlight.departure.city.name}
                            </span>
                          </div>
                        </div>

                        <div className="detail px-10 text-lg grid grid-cols-10 justify-items-stretch">
                          <div className="col-span-9 ">
                            <div className="flex gap-2">
                              <img
                                src={favFlight.airline.image}
                                alt="logo airlines"
                                className="h-auto w-7"
                              />

                              <h1 className="font-bold ">
                                {favFlight.airline.name} - {favFlight.seatClass}
                              </h1>
                            </div>

                            <span className="font-bold text-lg">Informasi</span>

                            <ul className="px-10">
                              <li> {favFlight.facility}</li>
                            </ul>
                          </div>
                        </div>

                        <div className="return text-lg grid grid-cols-10 justify-items-stretch">
                          <h1 className="text-darkblue05  font-bold col-span-10  mb-1">
                            Kedatangan
                          </h1>
                          <div className="col-span-9 ">
                            <h1 className="font-bold ">
                              {favFlight.arrival.schedule}
                            </h1>
                            <span className="font-semibold text-lg">
                              {favFlight.arrival.city.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </DialogDescription>
                  <DialogFooter>
                    <div className="action flex gap-2 items-center ">
                      <div className="flex flex-col ">
                        <Popover modal={active}>
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
                        onClick={() => handleSearch(favFlight)}
                      >
                        Booking
                      </Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ))
          )}
      </div>
    </div>
  );
};
