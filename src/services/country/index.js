export const getCountries = async () => {
  const token = localStorage.getItem("token");

  let url = `${import.meta.env.VITE_API_URL}/countries
  `;

  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${token}`,
    },
    method: "GET",
  });

  const result = await response.json();
  return result?.data;
};