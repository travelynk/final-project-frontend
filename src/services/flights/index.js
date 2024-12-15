export const getFlights = async (filters) => {
  const token = localStorage.getItem("token");
  const url = new URL(`${import.meta.env.VITE_API_URL}/flights/search`);

  Object.keys(filters).forEach((key) => {
    if (filters[key]) {
      url.searchParams.append(key, filters[key]);
    }
  });
  const response = await fetch(url, {
    headers: { authorization: `Bearer ${token}` },
    method: "GET",
  });

  const result = await response.json();
  return result?.data;
};

export const getFlightDetails = async (flightId) => {
  const token = localStorage.getItem("token");

  console.log(`Fetching flight details for ID: ${flightId}`);
  console.log(`API URL: ${import.meta.env.VITE_API_URL}/flights/${flightId}`);

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/flights/${flightId}`,
    {
      headers: { authorization: `Bearer ${token}` },
      method: "GET",
    }
  );

  if (!response.ok) {
    console.error("Error fetching flight details:", response.statusText);
    return null; // or handle the error in a better way
  }

  const result = await response.json();
  return result?.data;
};
