import { createLazyFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaPen, FaCog, FaSignOutAlt } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const Route = createLazyFileRoute("/auth/profile/")({
  component: Profile,
});

function Profile() {
  return (
    <>
      <div className="container max-w-[1024px] mx-auto sm:pt-8 pt-2 px-4">
        {/* Header Section */}
        <div className="flex justify-between items-center mt-5 sm:mb-6 mb-4">
          <h2 className="text-xl font-bold text-center sm:text-left">Akun</h2>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Beranda Card */}
            <Card className="p-4 rounded-[12px] flex justify-between items-center bg-[#A06ECE] w-full sm:w-[968px] h-[50px] mx-auto">
              <div className="flex items-center space-x-4 w-full">
                <Button variant="link" size="icon" className="p-0">
                  <ArrowLeft className="w-6 h-6 text-white" />
                </Button>
                <h1 className="font-normal text-lg text-white text-left flex-grow">
                  Beranda
                </h1>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Separator className="mt-[25px]  shadow" />

      <div className="flex justify-center items-center mt-10 ">
        <div className="flex w-3/4 rounded-lg bg-white max-w-[936px] mb-4">
          {/* Left Menu */}
          <div className="  border-gray-200 p-4 w-[370px] mr-4">
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-gray-700 cursor-pointer hover:text-purple-600 border-b w-[328px] p-2 ">
                <FaPen />
                <span>Ubah Profil</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-700 cursor-pointer hover:text-purple-600 border-b w-[328px] p-2">
                <FaCog />
                <span>Pengaturan Akun</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-700 cursor-pointer hover:text-purple-600 border-b w-[328px] p-2">
                <FaSignOutAlt />
                <span>Keluar</span>
              </li>
            </ul>
            <div className="mt-4 text-gray-400 text-sm text-center">
              Version 1.1.0
            </div>
          </div>

          {/* Profile Form */}
          <div className="w-3/4 p-6 border  rounded-lg shadow-lg max-w-[550px] ml-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Ubah Data Profil
            </h2>

            <div className="bg-[#A06ECE] p-4 rounded-t-[12px] text-white  mb-2 font-bold">
              Data Diri
            </div>

            <form className="space-y-4 p-4">
              <div>
                <Label className="font-bold text-[#4B1979]" htmlFor="nama">
                  Nama Lengkap
                </Label>
                <Input
                  type="text"
                  id="nama"
                  defaultValue="Harry"
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="font-bold text-[#4B1979]" htmlFor="telepon">
                  Nomor Telepon
                </Label>
                <Input
                  type="tel"
                  id="telepon"
                  defaultValue="+62 897823232"
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="font-bold text-[#4B1979]" htmlFor="email">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  defaultValue="Johndoe@gmail.com"
                  className="mt-2"
                />
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  variant="default"
                  className="w-[150px] bg-[#4B1979] mt-4 rounded-[12px]"
                >
                  Simpan
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
