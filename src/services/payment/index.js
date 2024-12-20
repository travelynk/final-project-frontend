import axios from "axios";

export const createCredit = async (bookingId, card) => {
  try {
    console.log("masuk");
    const token = localStorage.getItem("token");
    const url = new URL(`${import.meta.env.VITE_API_URL}/payments/credit-card`);

    const data = {
      bookingId: bookingId,
      card_number: card.card_number,
      card_exp_month: card.card_exp_month,
      card_exp_year: card.card_exp_year,
      card_cvv: card.card_cvv,
    };

    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
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
    const data = {
      bookingId: bookingId,
      bank: bank,
    };

    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    console.log(response);
    return response;
  } catch (err) {
    return err;
  }
};

export const checkPayment = async (params) => {
  const token = localStorage.getItem("token");
  const url = `${import.meta.env.VITE_API_URL}/payments/${params}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data.transaction_status;
  } catch (error) {
    console.error("Error checking payment:", error);
    throw error;
  }
};

export const getBookingData = async (params) => {
  const token = localStorage.getItem("token");
  const url = new URL(`${import.meta.env.VITE_API_URL}/bookings/${params}`);

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error getting booking data:", error);
    throw error;
  }
};
