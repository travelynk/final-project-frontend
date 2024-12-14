import { createLazyFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { createCredit, CreateVa, checkPayment } from "../../services/payment";
import NavigationBreadCr from "../../pages/navigationBreadCr";
import { useState } from "react";

export const Route = createLazyFileRoute("/payment/")({
  component: Payment,
});

function Payment() {
  const bookingData = new URLSearchParams(window.location.search);
  const bookingId = bookingData.get("bookingId");

  console.log(bookingId);

  const [creditValue, setCredit] = useState({
    card_number: "",
    card_exp_month: "",
    card_exp_year: "",
    card_cvv: "",
  });
  const [bankValue, setBank] = useState({
    bank: "",
  });
  const [vaNumber, setVaNumber] = useState("");
  const [loading, setLoading] = useState("");
  // const [bookingId, setBookingId] = useState("null");

  // useEffect(() => {
  //   const fetchBookingData = async () => {
  //     if (id) {
  //       try {
  //         const data = await getBookingData(id); // Fetch booking data
  //         setBookingId(data.bookingId); // Set bookingId from fetched data
  //       } catch (error) {
  //         console.error("Error fetching booking data:", error);
  //       }
  //     } else {
  //       console.log("Booking ID is not available in the URL");
  //     }
  //   };
  //   console.log(id);
  //   fetchBookingData();
  // }, [id]);

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s+/g, ""); // Hilangkan spasi
    value = value.slice(0, 16); // Batasi maksimum 16 karakter
    value = value.match(/.{1,4}/g)?.join(" ") || value; // Tambahkan spasi setiap 4 karakter

    setCredit({
      ...creditValue,
      card_number: value,
    });
  };

  const handleCredit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (bookingId) {
        const createPayment = await createCredit(bookingId, creditValue);
        console.log("Pembayaran Berhasil: ", createPayment);
        console.log("Navigating to /success...");
        window.location.href = "/success";
        console.log("Navigation complete.");
      } else {
        console.error("Booking ID tidak ditemukan");
      }
    } catch (error) {
      console.error(error.message); // Jika error atau timeout
    } finally {
      setLoading(false);
    }
  };

  const handleVa = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (bookingId) {
        const response = await CreateVa(bookingId, bankValue);
        console.log("response sampai ke front end: ", response);
        const vaNum = response.data.data.paymentUrl.va_numbers[0].va_number;
        const trxId = response.data.data.paymentUrl.transaction_id;
        const trxStatus = response.data.data.paymentUrl.transaction_status;
        console.log("dapat transaction id:", trxId);
        console.log("dapat transaction status:", trxStatus);
        console.log("dapat va number:", vaNum);
        setVaNumber(vaNum);

        const paymentStatus = async () => {
          const checkStatus = await checkPayment(trxId);
          console.log("Status dari transaction_id saat ini: ", checkStatus);

          if (checkStatus === "settlement") {
            // Clear the interval
            clearInterval(intervalId);
            // Redirect to success page
            window.location.href = "/success";
          } else {
            console.log("Payment is still pending...");
          }
        };

        const intervalId = setInterval(paymentStatus, 3000);
      } else {
        console.error("Booking ID tidak ditemukan");
      }
    } catch (error) {
      console.error(error.message); // Jika error atau timeout
    } finally {
      setLoading(false);
    }
  };

  const changeBank = (e) => {
    setBank(e.target.value);
  };
  return (
    <>
      {/*navigationbreadcr disini*/}
      <NavigationBreadCr
        initialTime={1000}
        label="Selesaikan Pembayaran Dalam"
        expirationMessage="Maaf, Waktu pembayaran habis. Silahkan ulangi lagi!"
        redirectPath="/"
      />{" "}
      {loading && (
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-lg font-semibold">Mohon tunggu...</p>
        </div>
      )}
      {!loading && (
        <main className="container mx-auto max-w-4xl mt-8 px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mt-8">
            {/* Left Section */}
            <div className="md:col-span-3">
              <h2 className="text-lg font-bold mb-4">
                Pilih Metode Pembayaran
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {/* Virtual Account */}
                {/* Virtual Account */}
                <AccordionItem value="virtual-account">
                  <AccordionTrigger
                    className="flex justify-between items-center w-full px-4 py-2 rounded-lg bg-gray-800 text-white 
              hover:bg-purple-500 data-[state=open]:bg-purple-600 transition-colors"
                  >
                    Virtual Account
                  </AccordionTrigger>
                  <AccordionContent>
                    <form className="bg-white rounded-lg p-4">
                      <label
                        for="banks"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Pilih Bank
                      </label>
                      <select
                        value={bankValue}
                        onChange={changeBank}
                        id="bank"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option selected>Bank</option>
                        <option value="bni">BNI</option>
                        <option value="bca">BCA</option>
                        <option value="bri">BRI</option>
                        {/* <option value="permata">Permata</option> */}
                      </select>
                      <p class="block mb-2 text-sm font-medium text-gray-900 dark:text-white mt-2.5">
                        Nomor VA
                      </p>
                      <input
                        type="text"
                        value={vaNumber}
                        readOnly
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      />
                      <button
                        type="submit"
                        onClick={handleVa}
                        className="w-full mt-4 py-3 bg-purple-600 text-white rounded-lg text-center hover:bg-purple-700 transition-colors"
                      >
                        Bayar
                      </button>
                    </form>
                  </AccordionContent>
                </AccordionItem>

                {/* Credit/debit Card */}
                <AccordionItem value="credit-card">
                  <AccordionTrigger
                    className="flex justify-between items-center w-full px-4 py-2 rounded-lg bg-gray-800 text-white 
                                hover:bg-purple-500 data-[state=open]:bg-purple-600 transition-colors"
                  >
                    Credit/debit Card
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex justify-evenly mb-4">
                        <img
                          src="/visa-payment.svg"
                          alt="Visa"
                          className="h-8"
                        />
                        <img
                          src="/mastercard-payment.svg"
                          alt="MasterCard"
                          className="h-8"
                        />
                        <img
                          src="/paypal-payment.svg"
                          alt="PayPal"
                          className="h-8"
                        />
                      </div>
                      <div className="space-y-4">
                        <p className="font-medium">Card Number</p>
                        <input
                          type="text"
                          placeholder="1234 1234 1234 1234"
                          value={creditValue.card_number}
                          onChange={handleCardNumberChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        />
                        <p className="font-medium">Card Holder Name</p>
                        <input
                          type="text"
                          placeholder="Budi Galon Bunglon"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        />
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="font-medium mb-2">CVV</p>
                            <input
                              type="text"
                              placeholder="000"
                              value={creditValue.card_cvv}
                              onChange={(e) =>
                                setCredit({
                                  ...creditValue,
                                  card_cvv: e.target.value,
                                })
                              }
                              maxLength={3}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2"
                            />
                          </div>
                          <div>
                            <p className="font-medium mb-2">Expiry Month</p>
                            <input
                              type="text"
                              placeholder="MM"
                              value={creditValue.card_exp_month}
                              onChange={(e) =>
                                setCredit({
                                  ...creditValue,
                                  card_exp_month: e.target.value,
                                })
                              }
                              maxLength={2}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2"
                            />
                          </div>
                          <div>
                            <p className="font-medium mb-2">Expiry Year</p>
                            <input
                              type="text"
                              placeholder="YYYY"
                              value={creditValue.card_exp_year}
                              onChange={(e) =>
                                setCredit({
                                  ...creditValue,
                                  card_exp_year: e.target.value,
                                })
                              }
                              maxLength={4}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2"
                            />
                          </div>
                        </div>
                        <button
                          className="w-full mt-4 py-3 bg-purple-600 text-white rounded-lg text-center hover:bg-purple-700"
                          onClick={handleCredit}
                        >
                          Bayar
                        </button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Right Section */}
            <div className="md:col-span-2 bg-white rounded-lg p-4">
              <h2 className="text-lg font-bold">
                Booking Id: <span className="text-purple-600">6723y2GHK</span>
              </h2>
              <div className="mt-4 text-sm">
                <p>
                  <strong>07:00</strong>
                  <span className="float-right text-purple-500">
                    Keberangkatan
                  </span>
                </p>
                <p>3 Maret 2023</p>
                <p>Soekarno Hatta - Terminal 1A Domestik</p>
                <hr className="my-4" />
                <p className="mt-4">
                  <strong>Jet Air - Economy</strong>
                </p>
                <p className="mb-4">
                  <strong>JT - 203</strong>
                </p>
                <p>
                  <strong>Informasi:</strong>
                  <br />
                  Baggage 20 kg
                  <br />
                  Cabin baggage 7 kg
                  <br />
                  In-Flight Entertainment
                </p>
                <hr className="my-4" />
                <p className="mt-4">
                  <strong>11:00</strong>
                  <span className="float-right text-purple-500">
                    Keberangkatan
                  </span>
                </p>
                <p>3 Maret 2023</p>
                <p>Melbourne International Airport</p>
                <hr className="my-4" />
                <p>
                  2 Adults<span className="float-right">IDR 9.550.000</span>
                </p>
                <p>
                  1 Baby<span className="float-right">IDR 0</span>
                </p>
                <p>
                  Tax<span className="float-right">IDR 300.000</span>
                </p>
                <hr className="my-4" />
                <p className="text-lg font-bold">
                  Total
                  <span className="float-right text-purple-600">
                    IDR 9.850.000
                  </span>
                </p>
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
}
