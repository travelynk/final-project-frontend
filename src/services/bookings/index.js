// Fetch all bookings
export const getBookings = async () => {
  const url = `${import.meta.env.VITE_API_URL}/bookings/`;
  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch bookings");
  }

  const result = await response.json();
  //console.log("Bookings", result);
  return result?.data;
};

// Fetch a specific booking by booking ID
export const getBooking = async (bookingId) => {
  const url = `${import.meta.env.VITE_API_URL}/bookings/${bookingId}`; // Route includes userId and bookingId

  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch bookings");
  }

  const result = await response.json();
  return result?.data; // Assuming the response contains 'data' with the booking details
};

export const getBookingsByDate = async (startDate, endDate) => {
  const url = `${import.meta.env.VITE_API_URL}/bookings/filter?startDate=${startDate}&endDate=${endDate}`;

  console.log(startDate, endDate);

  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Failed to fetch bookings by date range"
    );
  }

  const result = await response.json();
  return result?.data; // Adjust based on your actual API response structure
};
