import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card } from "../../../components/ui/card";
import { useState } from "react";
import { useToast } from "../../../hooks/use-toast";
import { resetPassword } from "../../../services/auth";

export const Route = createLazyFileRoute("/auth/reset-password/")({
  component: ResetPassword,
});

function ResetPassword() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Assuming the token is passed as a query parameter
  const token = new URLSearchParams(window.location.search).get("token");

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/;
    return password.length >= 8 && passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "The new password and confirm password do not match.",
        variant: "error",
      });
      return;
    }

    if (!validatePassword(newPassword)) {
      toast({
        title: "Invalid Password",
        description:
          "Password must be at least 8 characters long, with one uppercase letter, one lowercase letter, and one number.",
        variant: "error",
      });
      return;
    }

    try {
      const response = await resetPassword({
        token,
        newPassword,
        confirmPassword,
      });

      toast({
        title: "Password telah berhasil direset, silahkan login ulang",
        description: response.message,
        variant: "success",
      });

      navigate({ to: "/auth/login/" });
    } catch (error) {
      toast({
        title: "Error Resetting Password",
        description: error.message || "Failed to reset password.",
        variant: "error",
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Image Cover */}
      <div className="hidden lg:flex lg:w-[719px] h-screen relative">
        <div className="w-full h-full bg-gradient-to-b from-darkblue05 to-[#ffff]">
          <div
            className="absolute left-1/2 -translate-x-1/2 top-1/4 flex flex-col justify-center items-center font-semibold text-darkblue05 text-3xl
          "
          >
            <img
              src="/img/rm-logo-travelynk-crop.png"
              alt="Cover Image"
              // style={{ marginLeft: "100px", marginTop: "200px" }}
              className="h-auto w-96 rounded-full  "
            />
            <span>Travelynk</span>
          </div>
          {/* <img
            src="/img/leaves.png"
            alt="Cover Image"
            style={{ marginTop: "-80px" }}
          /> */}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-full lg:w-[50%] px-6 py-12">
        <Card className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg lg:ms-24 lg:mb-12 border-none">
          <h2 className="text-2xl font-bold">Reset Password</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* New Password Input */}
            <div>
              <Label
                htmlFor="newPassword"
                className="text-sm font-medium text-gray-700 flex justify-between items-center"
              >
                Masukkan Password Baru
              </Label>
              <div className="relative mt-1">
                <Input
                  id="newPassword"
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Password Baru"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-[16px] shadow-sm focus:outline-none focus:ring-2 focus:ring-darkblue05"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 rounded-e-md focus:outline-none focus:text-darkblue05"
                  onClick={togglePasswordVisibility}
                >
                  {isPasswordVisible ? (
                    // Eye icon (password visible)
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    // Eye with slash icon (password hidden)
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" y1="2" x2="22" y2="22" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700 flex justify-between items-center"
              >
                Ulangi Password Baru
              </Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Ulangi Password Baru"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-[16px] shadow-sm focus:outline-none focus:ring-2 focus:ring-darkblue05"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 rounded-e-md focus:outline-none focus:text-darkblue05"
                  onClick={togglePasswordVisibility}
                >
                  {isPasswordVisible ? (
                    // Eye icon (password visible)
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    // Eye with slash icon (password hidden)
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" y1="2" x2="22" y2="22" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button className="w-full py-2 mt-4 bg-darkblue05 text-white font-semibold rounded-[16px] hover:bg-darkblue05">
              Simpan
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
