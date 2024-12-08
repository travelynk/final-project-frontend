import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card } from "../../../components/ui/card";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { register } from "../../../service/auth";
import { setEmailRegister, setUser } from "../../../redux/slices/auth";
import { useToast } from "../../../hooks/use-toast";

export const Route = createLazyFileRoute("/auth/register/")({
  component: Register,
});

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  useEffect(() => {
    if (token) {
      navigate({ to: "/" });
    }
  }, [token, navigate]);

  const { mutate: registerUser } = useMutation({
    mutationFn: (body) => {
      return register(body);
    },
    onSuccess: (result) => {
      console.log("Register Success:", result);
      toast({
        description: result.status.message,
        variant: "info",
      });
      dispatch(setUser(email));
      navigate({ to: "/auth/verify-otp/" });
    },
    onError: (err) => {
      toast({
        description: err.message || "Registrasi Sukses!",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    // hit API here
    const request = {
      fullName,
      email,
      phone,
      password,
    };
    registerUser(request);
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
          <h2 className="text-2xl font-bold">Daftar</h2>
          <form className="space-y-4" onSubmit={onSubmit}>
            {/* Name Input */}
            <div>
              <Label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Nama
              </Label>
              <Input
                id="fullName"
                type="fullName"
                placeholder="Nama Lengkap"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-[16px] shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            {/* Phone Number Input */}
            <div>
              <Label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Nomor Telepon
              </Label>
              <div className="relative mt-1">
                {/* Phone Number Input without the +62 visible */}
                <Input
                  id="phone"
                  type="tel"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-[16px] shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 pl-10"
                  required
                  value={phone.replace(/^62/, "")} // Only show the number after '62'
                  onChange={(e) => {
                    const input = e.target.value;
                    // Automatically add '62' prefix but hide it from the user input field
                    if (input.startsWith("62")) {
                      setPhone(input); // Keep the input as is if it starts with '62'
                    } else {
                      setPhone("62" + input.replace(/^62/, "")); // Automatically add '62' as the prefix
                    }
                  }}
                />
                {/* Hidden +62 */}
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 text-sm">
                  +62
                </span>
              </div>
            </div>

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
                type="email"
                placeholder="Contoh: johndoe@gmail.com"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-[16px] shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Create Password */}
            <div>
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 flex justify-between items-center"
              >
                Buat Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Buat Password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-[16px] shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 rounded-e-md focus:outline-none focus:text-purple-600"
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
            <Button
              type="submit"
              className="w-full py-2 mt-4 bg-purple-500 text-white font-semibold rounded-[16px] hover:bg-purple-600"
            >
              Daftar
            </Button>
          </form>

          {/* Don't have account */}
          <p className="text-center text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link
              to="/auth/login"
              className="text-purple-600"
              style={{ fontWeight: "bold" }}
            >
              Masuk di sini
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
