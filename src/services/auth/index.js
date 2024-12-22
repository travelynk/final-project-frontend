export const login = async (request) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    body: JSON.stringify(request),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // get the data if fetching succeed!
  const result = await response.json();
  console.log("data login:", result);
  result;

  // Check if the response is not successful and throw the full result
  if (!response.ok) {
    // Attach the entire result to the error for better handling
    const error = new Error(result?.message || "Login failed");
    error.response = { data: result };
    throw error;
  }

  return result?.data;
};

export const register = async (request) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Explicitly send JSON
      },
      body: JSON.stringify(request),
    }
  );

  const result = await response.json();
  result;
  if (!response.ok) {
    const error = new Error(result?.message || "Register failed");
    error.response = { data: result };
    throw error;
  }

  return result;
};

export const verifyOtp = async (request) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/verify-otp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Explicitly send JSON
      },
      body: JSON.stringify({
        email: request.email,
        otp: request.otp,
      }),
    }
  );

  const result = await response.json(); // Get the response JSON data

  // Check if the response is not successful and throw an error with the result
  if (!response.ok) {
    const error = new Error(result?.message || "OTP verification failed");
    error.response = { data: result };
    throw error;
  }

  return result?.data;
};

export const sendOtp = async (email) => {
  email;
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/reset-password/send-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Explicitly send JSON
      },
      body: JSON.stringify({ email }), // Send email as a JSON object
    }
  );

  // Parse the response JSON
  const result = await response.json();
  result;

  // Handle errors if the response is not successful
  if (!response.ok) {
    const error = new Error(result?.message || "Failed to send OTP");
    error.response = { data: result };
    throw error;
  }

  return result; // Return success message if available
};

export const resetPassword = async ({
  token,
  newPassword,
  confirmPassword,
}) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/reset-password?token=${token}`, // Send token as query parameter
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Explicitly send JSON
      },
      body: JSON.stringify({ newPassword, confirmPassword }), // Send both newPassword and confirmPassword in the body
    }
  );

  const result = await response.json();

  if (!response.ok) {
    const error = new Error(result?.message || "Reset password failed");
    error.response = { data: result };
    throw error;
  }

  return result; // Return the successful response
};

export const googleLogin = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`);

  // Parse the response
  const result = await response.json();

  if (!response.ok) {
    const error = new Error(
      result?.message || "Failed to get Google authorization URL"
    );
    error.response = { data: result };
    throw error;
  }
  result;
  return result?.data; // Return the Google Auth URL
};

export const profile = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${import.meta.env.VITE_API_URL}/profiles`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
    method: "GET",
  });

  // Cek apakah respons berhasil
  if (!response.ok) {
    const errorResult = await response.json(); // Ambil detail error
    console.error("Error:", errorResult); // Log error dari API
    throw new Error(errorResult.message || "Error fetching profile");
  }

  const result = await response.json();
  //  ("Profile data received:", result); // Debug untuk melihat respons data
  return result?.data;
};

export const ProfileUpdate = async (profileData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${import.meta.env.VITE_API_URL}/profiles`, {
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify(profileData), // Kirim data sebagai JSON
  });

  if (!response.ok) {
    const errorResult = await response.json();
    console.error("Error:", errorResult);
    throw new Error(errorResult.message || "Error updating profile");
  }

  const result = await response.json();
  "Profile updated successfully:", result;
  return result?.data;
};

// src/services/auth.js
import { decodeToken } from "@/utils/decodeToken"; // Import the decodeToken function

export const deleteUser = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token is missing");
  }

  const role = decodeToken(token);

  if (!role) {
    throw new Error("Role not found in token");
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/users/destroy`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Tambahkan ini
      },
      body: JSON.stringify({ role }), // Pastikan format sesuai dengan yang diharapkan backend
    }
  );

  if (!response.ok) {
    const errorResult = await response.json();
    console.error("Error:", errorResult);
    throw new Error(errorResult.message || "Error deleting user");
  }

  return await response.json();
};
