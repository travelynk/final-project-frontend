// src/utils/decodeToken.js
export const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));

    // console.log("Decoded token:", decoded);
    // console.log("Role extracted:", decoded.role);
    // console.log("UserId extracted:", decoded.id);

    return {
      role: decoded.role,
      userId: decoded.id,
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
