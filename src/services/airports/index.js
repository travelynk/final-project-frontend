export const getAirpots = async () => {
  const token = localStorage.getItem("token");

  let url = `${import.meta.env.VITE_API_URL}/airports`;

  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${token}`,
    },
    method: "GET",
  });

  const result = await response.json();
  return result?.data;
};

// export const getDetailModel = async (id) => {
//   const token = localStorage.getItem("token");

//   let url = `${import.meta.env.VITE_API_URL}/models/${id}`;

//   const response = await fetch(url, {
//     headers: {
//       authorization: `Bearer ${token}`,
//     },
//     method: "GET",
//   });

//   // get data
//   const result = await response.json();
//   return result;
// };

//   export const createModel = async (request) => {
//     const token = localStorage.getItem("token");

//     const formData = new FormData();
//     formData.append("model_name", request.modelName);
//     formData.append("transmission_id", request.transmissionId);
//     formData.append("capacity", request.capacity);
//     formData.append("type_id", request.typeId);
//     formData.append("manufacture_id", request.manufactureId);

//     request.optionIds.forEach((optionId) =>
//       formData.append("option_id", optionId)
//     );
//     request.specIds.forEach((specId) => formData.append("spec_id", specId));

//     const response = await fetch(`${import.meta.env.VITE_API_URL}/models`, {
//       headers: {
//         authorization: `Bearer ${token}`,
//       },
//       method: "POST",
//       body: formData,
//     });

//     // get the data if fetching succeed!
//     const result = await response.json();
//     if (!result?.success) {
//       throw new Error(result?.message);
//     }
//     return result;
//   };

//   export const updateModel = async (id, request) => {
//     const token = localStorage.getItem("token");

//     const formData = new FormData();
//     formData.append("model_name", request.modelName);
//     formData.append("transmission_id", request.transmissionId);
//     formData.append("capacity", request.capacity);
//     formData.append("type_id", request.typeId);
//     formData.append("manufacture_id", request.manufactureId);
//     request.optionIds.forEach((optionId) =>
//       formData.append("option_id", optionId)
//     );
//     request.specIds.forEach((specId) => formData.append("spec_id", specId));

//     const response = await fetch(`${import.meta.env.VITE_API_URL}/models/${id}`, {
//       headers: {
//         authorization: `Bearer ${token}`,
//       },
//       method: "PUT",
//       body: formData,
//     });

//     // get the data if fetching succeed!
//     const result = await response.json();
//     if (!result?.success) {
//       throw new Error(result?.message);
//     }
//     return result;
//   };

//   export const deleteModel = async (id) => {
//     const token = localStorage.getItem("token");

//     let url = `${import.meta.env.VITE_API_URL}/models/${id}`;

//     const response = await fetch(url, {
//       headers: {
//         authorization: `Bearer ${token}`,
//       },
//       method: "DELETE",
//     });

//     // get data
//     const result = await response.json();
//     return result;
//   };
