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
        <div className="flex justify-between items-center mt-5 sm:mb-10 mb-4">
          <h2 className="text-xl font-bold text-center sm:text-left">Akun</h2>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Beranda Card */}
            <Card className="p-4 rounded-[12px] flex justify-between items-center bg-[#A06ECE] h-[50px] w-full sm:w-[777px]">
              <div className="flex items-center space-x-4">
                <Button variant="link" size="icon" className="p-0">
                  <ArrowLeft className="w-6 h-6 text-white" />
                </Button>
                <h1 className="font-normal text-lg text-white text-center flex-grow">
                  Beranda
                </h1>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Separator className="mt-[25px] shadow" />

      <div className="flex justify-center items-center min-h-screen">
        <div className="flex w-3/4 rounded-lg bg-white">
          {/* Left Menu */}
          <div className="w-1/4 border-r border-gray-200 p-4">
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
          <div className="w-3/4 p-6 shadow-lg ml-4 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Ubah Data Profil
            </h2>

            <div className="bg-purple-100 p-4 rounded-md text-purple-800 font-semibold mb-4">
              Data Diri
            </div>

            <form className="space-y-6">
              <div>
                <Label htmlFor="nama">Nama Lengkap</Label>
                <Input
                  type="text"
                  id="nama"
                  defaultValue="Harry"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="telepon">Nomor Telepon</Label>
                <Input
                  type="tel"
                  id="telepon"
                  defaultValue="+62 897823232"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  defaultValue="Johndoe@gmail.com"
                  className="mt-2"
                />
              </div>

              <Button type="submit" variant="default">
                Simpan
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
