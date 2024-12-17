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
<<<<<<< HEAD
=======

export const getFlightsById = async (flightId) => {
  const token = localStorage.getItem("token");
  const url = new URL(`${import.meta.env.VITE_API_URL}/flights/${flightId}`);

  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${token}`,
    },
    method: "GET",
  });

  const result = await response.json();
  return result?.data;
};
>>>>>>> development
