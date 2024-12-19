import { useEffect, useRef, useState } from "react";
import { Toggle } from "../ui/toggle";

// import "./DarkMode.css";

const DarkMode = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const handleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  useEffect(() => {
    if (darkMode) {
      document.querySelector("html").classList.add("dark");
    } else {
      document.querySelector("html").classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);
  return (
    <div className="dark_mode">
      <Toggle
        onClick={handleDarkMode}
        checked={darkMode}
        className={`toggle-button rounded-full  shadow-inner  dark:bg-white bg-gray-300 hover:bg-gray-500  transition hover:shadow-lg`}
      >
        {darkMode ? (
          <img src="/svg/Sun.svg" alt="toggle.icon" />
        ) : (
          <img src="/svg/Moon.svg" alt="toggle.icon" />
        )}
      </Toggle>
    </div>
  );
};

export default DarkMode;
