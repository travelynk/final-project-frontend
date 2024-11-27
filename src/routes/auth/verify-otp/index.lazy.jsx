import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useState, useEffect, useRef } from "react";

export const Route = createLazyFileRoute("/auth/verify-otp/")({
  component: verifyOTP,
});

function verifyOTP() {
  const [countdown, setCountdown] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const navigate = useNavigate();

  const inputRefs = useRef([]); // Store references to input fields

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendEnabled(true);
    }
  }, [countdown]);

  const handleResend = () => {
    setCountdown(30);
    setIsResendEnabled(false);
    // Add logic here to resend OTP
    console.log("Resending OTP...");
  };

  const handleInputChange = (event, index) => {
    if (
      event.target.value.length === 1 &&
      index < inputRefs.current.length - 1
    ) {
      inputRefs.current[index + 1].focus();
    }

    if (event.target.value.length === 0 && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (event, index) => {
    event.preventDefault();

    const pastedValue = event.clipboardData.getData("Text").slice(0, 6);
    const inputArray = pastedValue.split("");

    inputArray.forEach((char, idx) => {
      if (inputRefs.current[idx]) {
        inputRefs.current[idx].value = char;
      }
    });

    if (inputArray.length > 0 && inputRefs.current[inputArray.length - 1]) {
      inputRefs.current[inputArray.length - 1].focus();
    }
  };

  return (
    <>
      <div className="flex justify-center min-h-screen">
        <Card className="w-full max-w-lg relative border border-white shadow-none">
          {/* Arrow Button */}
          <div className="absolute top-4 -ml-40">
            <Button
              onClick={() => {
                navigate({ to: `/auth/send-otp` });
              }}
              variant="ghost"
              size="icon"
              className="p-0"
            >
              <ArrowLeft style={{ width: "24px", height: "24px" }} />
            </Button>
          </div>

          {/* Card Content */}
          <CardHeader className="mt-12">
            <CardTitle className="text-2xl font-bold mb-8">
              Masukkan OTP
            </CardTitle>
            <CardDescription className="flex justify-center mt-2 ">
              Ketik 6 digit kode yang dikirimkan ke J*****@gmail.com
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 mt-6">
            <div className="grid grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Input
                  key={index}
                  type="text"
                  maxLength="1"
                  required
                  ref={(el) => (inputRefs.current[index] = el)}
                  onInput={(e) => handleInputChange(e, index)}
                  onPaste={(e) => handlePaste(e, index)}
                  className="col-span-1 border border-gray-300 p-3 rounded-[16px] text-center"
                  style={{ width: "40px", height: "40px" }}
                />
              ))}
            </div>
            <div className="flex items-center justify-center mt-4">
              {isResendEnabled ? (
                <Button
                  variant="link"
                  onClick={handleResend}
                  style={{ color: "#FF0000", fontWeight: "bold" }}
                >
                  Kirim Ulang
                </Button>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Kirim Ulang OTP dalam{" "}
                  <span className="font-bold">
                    {countdown < 10 ? `0${countdown}` : countdown}
                  </span>{" "}
                  detik
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter>
            <Button className="w-full py-2 mt-16 bg-[#7126B5] text-white font-semibold rounded-[16px] hover:bg-purple-600">
              Simpan
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
