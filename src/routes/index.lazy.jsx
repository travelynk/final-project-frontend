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
import { format, setQuarter } from "date-fns";
import { getAirpots } from "../services/airports";
import { useQuery } from "@tanstack/react-query";
import { getCities } from "../services/cities";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { useParams } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

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
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold italic">
                Diskon Hari Ini
              </h1>
              <span className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-darkblue03">
                85%!
              </span>
            </div>
            <div className="flex justify-center md:justify-end bg-[url('img/bangkok.png')] h-48 md:h-auto w-full md:w-9/12 bg-no-repeat bg-cover bg-left -z-10"></div>
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
  const [originCity, setOriginCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [openTo, setOpenTo] = useState(false);
  const [countAdult, setCountAdult] = useState(0);
  const [countChild, setCountChild] = useState(0);
  const [countBaby, setCountBaby] = useState(0);
  const [returnCity, setReturnCity] = useState("true");
  const [listCities, setListCities] = useState([]);
  const [isToggled, setIsToggled] = useState(false);
  const [classSeat, setClassSeat] = useState("");

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
        <CardTitle className="text-start text-lg sm:text-xl lg:text-2xl">
          Pilih Jadwal Penerbangan spesial di
          <i className="text-darkblue04">Tiketku!</i>
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
                <img src="/src/assets/pesawat.svg" alt="pesawat.icon" /> From
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
              <Toggle onClick={handleToggle} checked={isToggled}>
                <img src="/src/assets/change.svg" alt="toggle.icon" />
              </Toggle>
            </div>

            <div className="flex flex-col gap-2 col-span-1 md:col-span-3">
              <Label
                htmlFor="to"
                className="flex align-middle items-center gap-1"
              >
                <img src="/src/assets/pesawat.svg" alt="pesawat.icon" /> To
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
                <img src="/src/assets/calendar.svg" alt="calendar.icon" /> Date
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
                  <Label htmlFor="return">Return</Label>
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
                    src="/src/assets/passengers.svg"
                    alt="passengers.icon"
                    className="inline-block"
                  />
                  Passengers
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
                              src="/src/assets/adult.svg"
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
                              src="/src/assets/child.svg"
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
                              src="/src/assets/baby.svg"
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
                      <div className="flex justify-end">
                        {/* <PopoverTrigger asChild>
                            <Button>simpan</Button>
                          </PopoverTrigger> */}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="seat-class">Seat Class</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      {classSeat ? classSeat : "Class"}
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
  return (
    <div className="flex flex-col items-center w-full gap-3 py-5">
      <div className="w-full">
        <h1 className="font-bold text-3xl">Destinasi Favorit</h1>
        <div className="filter text-white grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-7 gap-5">
          <Button className="bg-darkblue03 py-4 px-6 rounded-lg">
            <img src="/src/assets/search.svg" alt="" /> Semua
          </Button>
          <Button className="bg-darkblue03 py-4 px-6 rounded-lg">
            <img src="/src/assets/search.svg" alt="" /> Asia
          </Button>
          <Button className="bg-darkblue03 py-4 px-6 rounded-lg">
            <img src="/src/assets/search.svg" alt="" /> Amerika
          </Button>
          <Button className="bg-darkblue03 py-4 px-6 rounded-lg">
            <img src="/src/assets/search.svg" alt="" /> Eropa
          </Button>
        </div>
      </div>

      <div className="card grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-4 font-semibold">
        <Card className="p-2">
          <img src="img/bangkokCard.png" alt="" className="w-full" />
          <CardHeader>
            <CardTitle>Jakarta {">"} Bangkok</CardTitle>
            <CardDescription className="text-darkblue05 text-lg p-0">
              Air Asia
            </CardDescription>
          </CardHeader>
          <CardContent className="py-0">
            <p>20 - 30 Maret 2023</p>
          </CardContent>
          <CardFooter>
            <p>
              Mulai Dari <span className="text-red-500">IDR 950.000</span>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
