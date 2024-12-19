import React, { useState, useEffect } from "react";
import {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";
import { useSelector } from "react-redux";

import { createLazyFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaPen, FaCog, FaSignOutAlt } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useDispatch } from "react-redux";
import { ProfileUpdate } from "../../../services/auth"; // Assuming profile function is in src/service/auth
import { useQueryClient } from "@tanstack/react-query";
import { setToken } from "../../../redux/slices/auth";

export const Route = createLazyFileRoute("/user/account/")({
  component: Profile,
});

function Profile() {
  const [toastVisible, setToastVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Cek token saat komponen pertama kali di-render
  useEffect(() => {
    if (!token) {
      navigate({ to: "/" });
    }
  }, [token, navigate]);

  const queryClient = useQueryClient();
  const profileData = queryClient.getQueryData(["profile"]); // Retrieve cached profile data

  const handleSubmit = async (e) => {
    e.preventDefault();

    const profileData = {
      fullName: e.target.fullName.value,
      phone: e.target.phone.value,
      email: e.target.email.value,
    };

    try {
      const updatedProfile = await ProfileUpdate(profileData);
      console.log("Updated profile:", updatedProfile);
      setSuccessMessage("Profil berhasil diperbarui!");
      setToastVisible(true);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Gagal memperbarui profil. Silakan coba lagi.");
    }
  };

  const handleLogout = () => {
    dispatch(setToken(null));

    navigate({ to: "/" });
  };

  return (
    <>
      <ToastProvider>
        <div className="container max-w-[1024px] mx-auto sm:pt-8 pt-2 px-4">
          {/* Header Section */}
          <div className="flex justify-between items-center mt-5 sm:mb-6 mb-4">
            <h2 className="text-xl font-bold text-center sm:text-left">Akun</h2>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Beranda Card */}
              <Card className="p-4 rounded-[12px] flex justify-between items-center bg-darkblue05 w-full sm:w-[968px] h-[50px] mx-auto">
                <div className="flex items-center space-x-4 w-full">
                  <Button variant="link" size="icon" className="p-0">
                    <Link to="/" className="flex items-center">
                      <ArrowLeft
                        style={{
                          width: "24px",
                          height: "24px",
                          color: "white",
                        }}
                      />
                    </Link>
                  </Button>
                  <h1 className="font-normal text-lg text-white text-left flex-grow">
                    Beranda
                  </h1>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <Separator className="mt-[25px] shadow" />

        <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start mt-10 space-y-6 lg:space-y-0 lg:space-x-6 max-w-[936px] mx-auto mb-10">
          <div className="flex flex-col w-[370px] lg:w-1/3 rounded-lg bg-white">
            {/* Left Menu */}
            <div className="border-gray-200 p-4 w-full">
              <ul className="space-y-4">
                <li className="flex items-center space-x-4 text-gray-700 cursor-pointer hover:text-darkblue05 border-b w-full p-2">
                  <FaPen />
                  <span>Ubah Profil</span>
                </li>
                <li className="flex items-center space-x-4 text-gray-700 cursor-pointer hover:text-darkblue05 border-b w-full p-2">
                  <FaCog />
                  <span>Pengaturan Akun</span>
                </li>
                <li
                  onClick={handleLogout}
                  className="flex items-center space-x-4 text-gray-700 cursor-pointer hover:text-darkblue05 border-b w-full p-2"
                >
                  <FaSignOutAlt />
                  <span>Keluar</span>
                </li>
              </ul>
              <div className="mt-4 text-gray-400 text-sm text-center">
                Version 1.1.0
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className=" w-full sm:w-[550px] lg:w-2/3 px-6 pt-6 pb-4 border rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Ubah Data Profil
            </h2>

            <div className="bg-darkblue05 p-4 rounded-t-[12px] text-white mb-2 font-bold">
              Data Diri
            </div>

            <form className="space-y-4 px-4 pt-2" onSubmit={handleSubmit}>
              <div>
                <Label className="font-bold text-darkblue05" htmlFor="fullName">
                  Nama Lengkap
                </Label>
                <Input
                  type="text"
                  id="fullName"
                  defaultValue={profileData?.fullName}
                  className="mt-2"
                  placeholder="masukan nama lengkap"
                />
              </div>

              <div>
                <Label className="font-bold text-darkblue05" htmlFor="phone">
                  Nomor Telepon
                </Label>
                <Input
                  type="tel"
                  id="phone"
                  defaultValue={profileData?.phone}
                  className="mt-2"
                  placeholder="masukan phone"
                />
              </div>

              <div>
                <Label className="font-bold text-darkblue05" htmlFor="email">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  defaultValue={profileData?.email}
                  className="mt-2"
                  placeholder="masukan email"
                />
              </div>

              <div className="flex justify-center p-2 mt-8">
                <Button
                  type="submit"
                  variant="default"
                  className="w-[150px] bg-darkblue05 rounded-[12px]"
                >
                  Simpan
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Toast Notification */}
        {toastVisible && (
          <Toast variant="success" onOpenChange={setToastVisible}>
            <ToastTitle>Berhasil!</ToastTitle>
            <ToastDescription>{successMessage}</ToastDescription>
          </Toast>
        )}
        <ToastViewport />
      </ToastProvider>
    </>
  );
}

export default Profile;
