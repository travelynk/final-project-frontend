import { createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card } from "../../../components/ui/card";
import { useToast } from "../../../hooks/use-toast";
import { sendOtp } from "../../../service/auth";

export const Route = createLazyFileRoute("/auth/send-reset-password/")({
  component: sendOTP,
});

function sendOTP() {
  const { toast } = useToast();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;

    try {
      // Call the sendOtp API
      const response = await sendOtp(email);

      // Show success toast
      toast({
        title: "OTP Sent!",
        description: "Please check your email for the OTP.",
        variant: "success",
      });
    } catch (error) {
      // Show error toast
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send OTP",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Image Cover */}
      <div className="hidden lg:flex lg:w-[719px] h-screen relative">
        <div className="w-full h-full bg-gradient-to-b from-[#DEC9FF] to-[#ffff]">
          <img
            src="/img/logo.png"
            alt="Cover Image"
            style={{ marginLeft: "100px", marginTop: "200px" }}
          />
          <img
            src="/img/leaves.png"
            alt="Cover Image"
            style={{ marginTop: "-80px" }}
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-full lg:w-[50%] px-6 py-12">
        <Card className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg lg:ms-24 lg:mb-12 border-none">
          <h2 className="text-2xl font-bold">Kirim OTP</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Contoh: johndoe@gmail.com"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-[16px] shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-2 mt-4 bg-purple-500 text-white font-semibold rounded-[16px] hover:bg-purple-600"
            >
              Kirim
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
