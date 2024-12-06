import { createLazyFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card } from "../../../components/ui/card";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "../../../redux/slices/auth";
import { login } from "../../../service/auth";
import { useSelector } from "react-redux";
import { useToast } from "../../../hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

export const Route = createLazyFileRoute("/auth/login/")({
  component: Login,
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  useEffect(() => {
    if (token) {
      navigate({ to: "/" });
    }
  }, [token, navigate]);

  // Mutation is used for POST, PUT, PATCH and DELETE
  const { mutate: loginUser } = useMutation({
    mutationFn: (body) => {
      return login(body);
    },
    onSuccess: (data) => {
      console.log(data);
      // set token to global state
      dispatch(setToken(data?.token));

      // redirect to home
      navigate({ to: "/" });
    },
    onError: (err) => {
      // Handle different response formats
      const errorMessage =
        // Format 1: err.response.data.status.message
        err?.response?.data?.status?.message ||
        // Format 2: err.response.data.message
        err?.response?.data?.message ||
        // Default fallback message
        "An unexpected error occurred.";

      // Display the error in a toast notification
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    /* hit the login API */
    // define the request body
    const body = {
      email,
      password,
    };

    // hit the login API with the data
    loginUser(body);
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
          <h2 className="text-2xl font-bold">Masuk</h2>
          <form className="space-y-4" onSubmit={onSubmit}>
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

            {/* Password Input */}
            <div>
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 flex justify-between items-center"
              >
                Password
                <Link
                  to="/auth/send-otp"
                  className="text-purple-600"
                  style={{ fontWeight: "semibold" }}
                >
                  Lupa Kata Sandi
                </Link>
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Masukkan password"
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
              Masuk
            </Button>
          </form>

          {/* Don't have account */}
          <p className="text-center text-sm text-gray-600">
            Belum punya akun?{" "}
            <Link
              to="/auth/register"
              className="text-purple-600"
              style={{ fontWeight: "bold" }}
            >
              Daftar di sini
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
