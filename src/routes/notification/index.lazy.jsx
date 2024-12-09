import { createLazyFileRoute } from "@tanstack/react-router";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { ArrowLeft, Bell, Filter, Search } from "lucide-react";

export const Route = createLazyFileRoute("/notification/")({
  component: Notification,
});

function Notification() {
  return (
    <>
      <div className="container max-w-[1024px] mx-auto sm:pt-8 pt-2 px-4">
        {/* Header Section */}
        <div className="flex justify-between items-center ms-0 lg:-ms-5 mt-5 sm:mb-10 mb-4">
          <h2 className="text-xl font-bold text-center sm:text-left">
            Notifikasi
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
      <div className="container max-w-[1024px] mx-auto pt-2 px-4">
        <div className="lg:mt-[20px]">
          <Card className="flex flex-col sm:flex-row justify-between items-start sm:items-center h-auto w-full lg:w-[777px] shadow-none border-none p-4 relative">
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
            <div className="flex items-center space-x-2 mt-2 lg:-mt-8 sm:ml-0 ml-auto">
              <span className="text-sm text-gray-400">20 Maret, 14:04</span>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
          </Card>
        </div>
        <Separator className="m-0 p-0 w-full lg:w-[777px] shadow-xl" />
      </div>
    </>
  );
}
