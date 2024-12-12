export const getVouchers = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${import.meta.env.VITE_API_URL}/vouchers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorResult = await response.json();
    throw new Error(errorResult.message || "Failed to fetch vouchers");
  }

  const data = await response.json();
  console.log("Vouchers data:", data); // Debug log untuk melihat data
  return data?.data;
  // return response.json().then((data) => data?.data);
};

// export const getVoucherByCode = async (code, totalPrice) => {
//   const token = localStorage.getItem("token");
//   const response = await fetch(
//     `${import.meta.env.VITE_API_URL}/vouchers/${code}?totalPrice=${encodeURIComponent(totalPrice)}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       method: "GET", // Jangan gunakan body dengan metode GET
//     }
//   );

//   if (!response.ok) {
//     const errorResult = await response.json();
//     throw new Error(errorResult.message || "Failed to fetch voucher details");
//   }

//   const data = await response.json();
//   console.log("Voucher by code response data:", data); // Log data response
//   return data?.data;
// };

export const getVoucherByCode = async (code, totalPrice) => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/vouchers/${code}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ totalPrice }),
    }
  );

  if (!response.ok) {
    const errorResult = await response.json();
    throw new Error(errorResult.message || "Failed to fetch voucher details");
  }

  // return response.json().then((data) => data?.data);
  const data = await response.json();
  console.log("Voucher by code data:", data); // Debug log untuk melihat data
  return data?.data;
};
