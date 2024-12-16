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
  console.log(result);

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
  console.log(result);
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
  console.log(email);
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
  console.log(result);

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

export const exchangeGoogleToken = async (googleToken) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/google/callback`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: googleToken }), // Send the Google token to the backend
      }
    );

    const result = await response.json();

    // Handle errors if the response is not successful
    if (!response.ok) {
      const error = new Error(
        result?.message || "Failed to exchange Google token"
      );
      error.response = { data: result };
      throw error;
    }

    return result.data; // Return the app's JWT token
  } catch (error) {
    console.error("Google token exchange error:", error);
    throw error;
  }
};

export const googleLogin = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/google`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    // Handle errors if the response is not successful
    if (!response.ok) {
      const error = new Error(
        result?.message || "Failed to get Google Authorization URL"
      );
      error.response = { data: result };
      throw error;
    }

    return result.data; // Return the Google authorization URL
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
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
  console.log("Profile data received:", result); // Debug untuk melihat respons data
  return result;
};