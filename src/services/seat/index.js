export const Seat = async (flightId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/seats/${flightId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    }
  );

  if (!response.ok) {
    const errorResult = await response.json();
    throw new Error(errorResult.message || "Failed to fetch Seat");
  }

  const data = await response.json();
  console.log("Seat Data:", data); // Debug log untuk melihat data
  return data?.data;
  // return response.json().then((data) => data?.data);
};
