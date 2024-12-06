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
