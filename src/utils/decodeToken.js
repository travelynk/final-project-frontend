// src/utils/decodeToken.js
export const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1]; // JWT payload is in the second part
    const decoded = JSON.parse(atob(payload)); // Decode and parse the payload

    console.log("Decoded token:", decoded); // Log the decoded token
    console.log("Role extracted:", decoded.role); // Log the extracted role

    return decoded.role; // Return the role
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
