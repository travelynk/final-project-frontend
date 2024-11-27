import { createLazyFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Bell, Filter, Search } from "lucide-react";
import { Separator } from "../../components/ui/separator";

export const Route = createLazyFileRoute("/notification/")({
  component: Notification,
});

function Notification() {
  return (
    <>
      <div className="container max-w-[1024px] mx-auto pt-8 px-8">
        {/* Header Section */}
        <div className="flex justify-between items-center -ms-5 mt-5 mb-10">
          <h2 className="text-xl font-bold">Notifikasi</h2>
        </div>

        <div className="space-y-4">
          {/* Flex container to align Card and Filter button */}
          <div className="flex items-center ">
            <Card className="p-4 rounded-[12px] flex justify-between items-center bg-[#A06ECE] h-[50px] w-[777px]">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-8 h-8 text-white rounded-full">
                  <Button variant="link" size="icon" className="p-0">
                    <ArrowLeft
                      style={{ width: "24px", height: "24px", color: "white" }}
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

            {/* Filter Button */}
            <Button
              variant="outline"
              className="ml-4 w-[86px] h-[36px] rounded-[18px] border border-[#7126B5]"
            >
              <Filter />
              Filter
            </Button>

            <Button variant="link" size="icon" className="p-0 ml-[10px]">
              <Search
                style={{ width: "34px", height: "34px", color: "#7126B5" }}
              />
            </Button>
          </div>
        </div>
      </div>

      <Separator className="mt-[25px] shadow" />
      <div className="container max-w-[1024px] mx-auto pt-8 px-8">
        <div className=" mt-[40px]">
          <Card className="flex justify-between items-center h-auto w-[777px] shadow-none border-none p-4 relative">
            <div className="flex items-start space-x-4">
              {/* Icon */}
              <div
                className="flex items-center justify-center w-6 h-6 rounded-full bg-[#A06ECE]"
                style={{ minWidth: "30px", minHeight: "30px" }}
              >
                <Bell className="w-4 h-4 text-white" />
              </div>
              {/* Content */}
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Promosi</span>
                <span className="text-base text-black">
                  Dapatkan Potongan 50% Tiket!
                </span>
                <span className="text-sm text-gray-500">
                  Syarat dan Ketentuan berlaku!
                </span>
              </div>
            </div>
            {/* Timestamp */}
            <div className="flex items-center space-x-2 mb-9">
              <span className="text-sm text-gray-400">20 Maret, 14:04</span>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
          </Card>
        </div>
        <Separator className="m-0 p-0 w-[777px] shadow-xl" />
      </div>
    </>
  );
}
