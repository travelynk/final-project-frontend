import axios from "axios";

export const createCredit = async (bookingId, card) => {
  try {
    console.log("masuk");
    const token = localStorage.getItem("token");
    const url = new URL(`${import.meta.env.VITE_API_URL}/payments/credit-card`);
    // bookingId = 9;
    const data = {
      bookingId: bookingId,
      card_number: card.card_number,
      card_exp_month: card.card_exp_month,
      card_exp_year: card.card_exp_year,
      card_cvv: card.card_cvv,
    };

    console.log(data);
    // const response = await fetch(url, {
    //   headers: {
    //     Authorization: `${token}`,
    //     "Content-Type": "application/json",
    //   },
    //   method: "POST",
    //   body: JSON.stringify(data),
    // });
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    console.log("dapat response", response.data);
    return response;
  } catch (err) {
    return err;
  }
};

export const CreateVa = async (bookingId, bank) => {
  try {
    const token = localStorage.getItem("token");
    const url = new URL(
      `${import.meta.env.VITE_API_URL}/payments/virtual-account`
    );
    // bookingId = 9;
    const data = {
      bookingId: bookingId,
      bank: bank,
    };
    console.log(data);
    // const response = await fetch(url, {
    //   headers: {
    //     Authorization: `${token}`,
    //     "Content-Type": "application/json",
    //   },
    //   method: "POST",
    //   body: JSON.stringify(data),
    // });
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    // console.log(await response.json());
    console.log(response);
    return response;
  } catch (err) {
    return err;
  }
};

export const checkPayment = async (params) => {
  const token = localStorage.getItem("token");
  const url = new URL(`${import.meta.env.VITE_API_URL}/payments/${params}`);

  const response = await fetch(url, {
    headers: { authorization: `bearer ${token}` },
    method: "GET",
  });
  const data = await response.json();

  return data.data.transaction_status;
};
