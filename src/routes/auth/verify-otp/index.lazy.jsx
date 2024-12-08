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
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../../../hooks/use-toast";
import { verifyOtp } from "../../../service/auth";
import { useSelector, useDispatch } from "react-redux";
import { setEmailRegister } from "../../../redux/slices/auth";

export const Route = createLazyFileRoute("/auth/verify-otp/")({
  component: verifyOTP,
});

function verifyOTP() {
  const [otp, setOtp] = useState(""); // Store OTP value as a string of 6 digits
  const [countdown, setCountdown] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRefs = useRef([]); // Store references to input fields
  const { toast } = useToast();
  const email = useSelector((state) => state.auth.user);

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
    let newOtp = otp.split(""); // Convert OTP string to array for easier manipulation
    newOtp[index] = event.target.value; // Update the value at the given index
    setOtp(newOtp.join("")); // Join the array back into a string

    // Move to the next input field when the user types a value
    if (
      event.target.value.length === 1 &&
      index < inputRefs.current.length - 1
    ) {
      inputRefs.current[index + 1].focus();
    }
    // Move to the previous input field if the current value is deleted
    if (event.target.value.length === 0 && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedValue = event.clipboardData.getData("Text").slice(0, 6);
    setOtp(pastedValue); // Directly set OTP when the user pastes the value
  };

  // Use mutation for OTP verification
  const { mutate: verifyOtpMutation } = useMutation({
    mutationFn: (data) => verifyOtp(data),
    onSuccess: (data) => {
      dispatch(setEmailRegister(null));
      toast({
        description: "Akun berhasil diverifikasi, silahkan login kembali!",
        variant: "info",
      });
      navigate({ to: "/auth/login/" });
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }

    const request = {
      email: email, // Use email from Redux
      otp: otp, // Use OTP state
    };
    console.log(request);

    verifyOtpMutation(request); // Trigger OTP verification
  };

  return (
    <>
      <div className="flex justify-center min-h-screen">
        <Card className="w-full max-w-lg relative border border-white shadow-none">
          {/* Arrow Button */}
          <div className="absolute top-4 -ml-40">
            <Button
              onClick={() => {
                navigate({ to: `/auth/register` });
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
            <CardDescription className="flex justify-center mt-2">
              Ketik 6 digit kode yang dikirimkan ke {email}{" "}
              {/* Display the email */}
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
                  value={otp[index] || ""} // Set the current value of the OTP input
                  onInput={(e) => handleInputChange(e, index)}
                  onPaste={handlePaste}
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
            <Button
              onClick={handleSubmit}
              className="w-full py-2 mt-16 bg-[#7126B5] text-white font-semibold rounded-[16px] hover:bg-purple-600"
            >
              Simpan
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
