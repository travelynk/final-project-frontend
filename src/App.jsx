import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div class="bg-blue-500 text-white p-4 rounded-lg">
        Tailwind is working!
      </div>
    </>
  );
}

export default App;
