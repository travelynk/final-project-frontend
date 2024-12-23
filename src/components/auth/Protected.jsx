import { useNavigate } from "@tanstack/react-router";
import { useSelector } from "react-redux";

const Protected = ({ children }) => {
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.auth);

  // if token not found It will redirect it to login
  if (!token) {
    navigate({ to: "/auth/login" });
    return;
  }

  return children;
};

export default Protected;
