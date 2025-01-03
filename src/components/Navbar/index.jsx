import { useQuery } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import { Link } from "@tanstack/react-router";
import DarkMode from "../DarkMode";
import { profile } from "../../services/auth"; // Ensure this is the correct path to your API function
import { getNotificationsById } from "../../services/notifications";

const NavigationBar = () => {
  // const { token } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");

  const location = useLocation();
  const shouldHideNavbar = location.pathname.startsWith("/auth/");

  // Fetch profile data once
  const { data: profileData } = useQuery({
    queryKey: ["profile"], // Cache key
    queryFn: profile, // Query function
    enabled: !!token, // Only fetch if the user is logged in
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const {
    data: notifications,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotificationsById,
    enabled: !!token,
  });

  const unreadCount =
    notifications?.filter((notification) => !notification.isRead).length || 0;

  if (shouldHideNavbar) {
    return null; // Don't render the navbar if path starts with 'auth/'
  }

  return (
    <header className="shadow-md py-3 border-b-2  dark:border-white">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-2 ms-5">
          <Link
            to="/"
            className="flex items-center dark:text-darkblue05 gap-3 font-semibold"
          >
            <img
              src="/img/logo-travelynk.png"
              alt="TraveLynk"
              className="w-12 h-auto rounded-full"
            />
            <span className="hidden lg:flex text-2xl">TraveLynk</span>
          </Link>
        </div>

        {/* Navbar Items */}
        <div className="flex items-center space-x-6">
          <DarkMode />

          {token ? (
            // If logged in
            <div className="flex justify-end items-center">
              {/* Ticket History */}
              <Link
                to="/ticket-history"
                className="p-2 rounded-full hover:bg-gray-200 mx-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </Link>

              {/* Notifications */}
              <Link
                to="/notification"
                className="relative p-2 rounded-full hover:bg-gray-200 mx-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full px-1">
                    {unreadCount}
                  </span>
                )}
              </Link>

              {/* Profile */}
              <Link
                as={Link}
                to="/user/account"
                className="p-2 rounded-full hover:bg-gray-200 mx-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </Link>
            </div>
          ) : (
            // If not logged in
            <Link
              to="/auth/login"
              className="flex items-center space-x-2 bg-darkblue05 text-white px-5 py-2 rounded-full hover:bg-darkblue04"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                />
              </svg>
              <span className="text-sm">Masuk</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;
