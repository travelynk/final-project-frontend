import { createLazyFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaPen, FaCog, FaSignOutAlt } from "react-icons/fa";
import { ArrowLeft, Bell, Filter, Search } from "lucide-react";
import { Separator } from "../../../components/ui/separator";

export const Route = createLazyFileRoute("/auth/profile/")({
  component: Profile,
});

function Profile() {
  return (
    <>
      <div className="container max-w-[1024px] mx-auto sm:pt-8 pt-2 px-4">
        {/* Header Section */}
        <div className="flex justify-between items-center ms-0 lg:-ms-5 mt-5 sm:mb-10 mb-4">
          <h2 className="text-xl font-bold text-center sm:text-left">Akun</h2>
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
          </div>
        </div>
      </div>

      <Separator className="mt-[25px] shadow" />

      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="flex w-3/4 shadow-lg rounded-lg bg-white overflow-hidden">
          {/* Left Menu */}
          <div className="w-1/4 bg-gray-50 border-r border-gray-200 p-4">
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-gray-700 cursor-pointer hover:text-purple-600">
                <FaPen />
                <span>Ubah Profil</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-700 cursor-pointer hover:text-purple-600">
                <FaCog />
                <span>Pengaturan Akun</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-700 cursor-pointer hover:text-purple-600">
                <FaSignOutAlt />
                <span>Keluar</span>
              </li>
            </ul>
            <div className="mt-20 text-gray-400 text-sm">Version 1.1.0</div>
          </div>

          {/* Profile Form */}
          <div className="w-3/4 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Ubah Data Profil
            </h2>

            <div className="bg-purple-100 p-4 rounded-md text-purple-800 font-semibold mb-4">
              Data Diri
            </div>

            <form className="space-y-6">
              <div>
                <label
                  htmlFor="nama"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="nama"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                  defaultValue="Harry"
                />
              </div>

              <div>
                <label
                  htmlFor="telepon"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  id="telepon"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                  defaultValue="+62 897823232"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                  defaultValue="Johndoe@gmail.com"
                />
              </div>

              <button
                type="submit"
                className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-300"
              >
                Simpan
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
