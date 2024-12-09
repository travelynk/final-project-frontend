import { useLocation } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import { Link } from "@tanstack/react-router";

const NavigationBar = () => {
  const { token } = useSelector((state) => state.auth);

  const location = useLocation();
  const shouldHideNavbar = location.pathname.startsWith("/auth/");

  if (shouldHideNavbar) {
    return null; // Don't render the navbar if path starts with 'auth/'
  }

  return (
    <header className="bg-white shadow-md py-3 border-b-2">
      <div className="container mx-auto flex flex-col md:flex-row md:justify-between md:px-4">
        <div className="hidden md:flex items-center space-x-2 mb-3 md:mb-0">
          <Link as={Link} to="/">
            <img src="/binar.svg" alt="TraveLynk" className="w-24 h-8" />
          </Link>
        </div>
        <div className="flex flex-1 justify-between mx-6 mb-1 md:mb-0">
          <div className="w-full max-w-xs flex">
            <input
              type="text"
              placeholder="Cari di sini ..."
              className="flex-grow px-2 py-2 rounded-l-lg bg-gray-100 border border-gray-300"
            />
            <button className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 transform transition-transform duration-300 hover:scale-125"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </div>

          {token ? (
            // If logged in
            <div className="flex justify-center md:justify-end w-full md:w-auto space-x-4">
              <Link
                as={Link}
                to="/ticket-history"
                className="p-2 rounded-full hover:bg-gray-200"
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
              <Link
                as={Link}
                to="/notification"
                className="p-2 rounded-full hover:bg-gray-200"
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
              </Link>
              <Link
                as={Link}
                to="/profile"
                className="p-2 rounded-full hover:bg-gray-200"
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
              as={Link}
              to="/auth/login"
              className="flex items-center space-x-2 bg-purple-600 text-white px-5 py-2 rounded-full ms-2 md:ms-0 hover:bg-purple-700"
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
