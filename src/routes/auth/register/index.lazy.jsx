import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card } from "../../../components/ui/card";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { register, googleLogin } from "../../../services/auth";
import { setUser, setToken } from "../../../redux/slices/auth";
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
      "Register Success:", result;
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

  const handleGoogleLogin = async () => {
    try {
      const googleAuthUrl = await googleLogin();
      const popup = window.open(
        googleAuthUrl,
        "_blank",
        "width=600,height=600"
      );

      // Listen for messages from the popup
      const messageHandler = (event) => {
        event;
        event.origin;
        const apiOrigin = new URL(import.meta.env.VITE_API_URL).origin;
        if (event.origin !== apiOrigin) return; // Ensure the message is from the same origin
        event.data;
        const { result, error } = event.data;
        result;
        if (result) {
          const parsedResult = JSON.parse(result);

          // Handle successful login
          dispatch(setToken(parsedResult.token)); // Save token to Redux
          localStorage.setItem("token", parsedResult.token); // Optionally save token to localStorage
          navigate({ to: "/" }); // Redirect to the home page
        } else if (error) {
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          });
        }

        // Close the popup and clean up the event listener
        popup.close();
        window.removeEventListener("message", messageHandler);
      };

      window.addEventListener("message", messageHandler);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.message ||
          "An error occurred while trying to log in with Google.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Image Cover */}
      <div className="hidden lg:flex lg:w-[719px] h-screen relative">
        <div className="w-full h-full bg-gradient-to-b from-darkblue05 to-[#ffff] relative">
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
          <h2 className="text-2xl font-bold dark:text-darkblue05">Daftar</h2>
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-[16px] shadow-sm focus:outline-none focus:ring-2 focus:ring-darkblue05"
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
                  className="block w-full px-3 py-2 border border-gray-300 rounded-[16px] shadow-sm focus:outline-none focus:ring-2 focus:ring-darkblue05 pl-10"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-[16px] shadow-sm focus:outline-none focus:ring-2 focus:ring-darkblue05"
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-[16px] shadow-sm focus:outline-none focus:ring-2 focus:ring-darkblue05"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            <Button
              type="submit"
              className="w-full py-2 mt-4  text-white font-semibold rounded-[16px] "
            >
              Daftar
            </Button>

            {/* Google Login Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full py-2 border border-gray-300 text-gray-700 font-semibold rounded-[16px] hover:bg-gray-100 flex items-center justify-center"
              onClick={handleGoogleLogin}
            >
              <svg
                className="w-5 h-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                />
                <path
                  fill="#FF3D00"
                  d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                />
              </svg>
              Daftar dengan Google
            </Button>
          </form>

          {/* Don't have account */}
          <p className="text-center text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link
              to="/auth/login"
              className="text-darkblue05"
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
