export const getAirlines = async () => {
  const token = localStorage.getItem("token");
  const url = new URL(`${import.meta.env.VITE_API_URL}/airlines`);

  const response = await fetch(url, {
    headers: { authorization: `Bearer ${token}` },
    method: "GET",
  });

  const result = await response.json();
  return result?.data;
};
