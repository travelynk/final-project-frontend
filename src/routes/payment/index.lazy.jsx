import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  createCredit,
  CreateVa,
  checkPayment,
  getBookingData,
} from "../../services/payment";
import NavigationBreadCr from "../../pages/navigationBreadCr";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

export const Route = createLazyFileRoute("/payment/")({
  component: Payment,
});

function Payment() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const bookingId = urlParams.get("bookingId");

  useEffect(() => {
    if (!token) {
      navigate({ to: "/auth/login" });
    }
  }, [navigate, token]);

  const [bookingInfo, setBookingInfo] = useState(null);
  const [socket, setSocket] = useState(null);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const fetchBookingData = async () => {
      if (bookingId) {
        try {
          const data = await getBookingData(bookingId);
          setBookingInfo(data);
          const status = data.data.status;
          if (status === "Issued" || status === "Cancelled") {
            navigate({ to: "/ticket-history" });
          }
        } catch (error) {
          console.error("Error fetching booking data: ", error);
        }
      } else {
        console.log("Booking id is not available in the URL");
      }
    };

    fetchBookingData();
  }, [bookingId, navigate]);

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(
      "https://api-tiketku-travelynk-145227191319.asia-southeast1.run.app"
    );

    // Event when connected
    socketInstance.on("connect", () => {
      console.log("Connected to server");
    });

    // Event for payment status
    socketInstance.on("Payment", (data) => {
      setNotification(data.message); // Set notification message
      console.log(data.message);
      console.log(data.createdAt);
    });

    // Handle connection error
    socketInstance.on("connect_error", (err) => {
      console.log("Connection error:", err.message);
    });

    setSocket(socketInstance); // Save socket instance to state

    // Cleanup on component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);
  console.log(notification);

  const Notification = ({ message, onDismiss }) => {
    return (
      <div className="absolute right-28 top-18 max-w-sm border bg-white text-black py-4 rounded-lg shadow-lg">
        <div className="px-4">
          <p>Segera Selesaikan Pembayaran!</p>
        </div>
        <div className="flex items-start border-y border-gray-400">
          <div className="flex items-start px-4 py-2">
            <p>{message}</p>
            <button onClick={onDismiss} className="text-black">
              {/* SVG icon for the "X" mark */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleDismissNotification = () => {
    setNotification(""); // Clear the notification
  };

  // console.log(bookingInfo);

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
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const changeBank = (e) => {
    setBank(e.target.value);
  };
  return (
    <>
      {notification && (
        <Notification
          message={notification}
          onDismiss={handleDismissNotification}
        />
      )}
      {/*navigationbreadcr disini*/}
      <NavigationBreadCr
        initialTime={1000}
        label="Selesaikan Pembayaran Dalam"
        expirationMessage="Maaf, Waktu pembayaran habis. Silahkan ulangi lagi!"
        redirectPath="/ticket-history"
      />{" "}
      {loading && (
        <div className="flex flex-col justify-center items-center mt-5">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-darkblue05"></div>
          <p className="mt-4 text-lg font-semibold">Mohon tunggu...</p>
        </div>
      )}
      <main className="container mx-auto max-w-4xl mt-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mt-8">
          {/* Pembayaran */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-bold mb-4">Pilih Metode Pembayaran</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {/* Virtual Account */}
              <AccordionItem value="virtual-account">
                <AccordionTrigger
                  className="flex justify-between items-center w-full px-4 py-2 rounded-lg bg-gray-800 text-white 
              hover:bg-darkblue05 data-[state=open]:bg-darkblue05 transition-colors"
                >
                  Virtual Account
                </AccordionTrigger>
                <AccordionContent>
                  <form className="bg-white rounded-lg p-4 ">
                    <label
                      htmlFor="banks"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
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
                    <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-black mt-2.5">
                      Nomor VA
                    </p>
                    <input
                      type="text"
                      value={vaNumber}
                      readOnly
                      className="w-full border border-gray-300 text-black rounded-lg px-4 py-2"
                    />
                    <button
                      type="submit"
                      onClick={handleVa}
                      className="w-full mt-4 py-3 bg-darkblue05 dark:text-white rounded-lg text-center hover:bg-darkblue06 transition-colors"
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
                                hover:bg-darkblue05 data-[state=open]:bg-darkblue05 transition-colors"
                >
                  Credit/debit Card
                </AccordionTrigger>
                <AccordionContent>
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex justify-evenly mb-4">
                      <img
                        src="/svg/visa-payment.svg"
                        alt="Visa"
                        className="h-8"
                      />
                      <img
                        src="/svg/mastercard-payment.svg"
                        alt="/svgMasterCard"
                        className="h-8"
                      />
                      <img
                        src="/svg/paypal-payment.svg"
                        alt="PayPal"
                        className="h-8"
                      />
                    </div>
                    <div className="space-y-4 dark:text-black">
                      <p className="font-medium ">Card Number</p>
                      <input
                        type="text"
                        placeholder="1234 1234 1234 1234"
                        value={creditValue.card_number}
                        onChange={handleCardNumberChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      />
                      <p className="font-medium ">Card Holder Name</p>
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
                          <p className="font-medium mb-2">Exp Month</p>
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
                          <p className="font-medium mb-2">Exp Year</p>
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
                        className="w-full mt-4 py-3 bg-darkblue05 text-white rounded-lg text-center hover:bg-darkblue06"
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

          {/* Booking Details */}
          <div className="md:col-span-3 bg-white dark:text-darkblue05 rounded-lg p-4">
            {bookingInfo ? (
              <>
                <strong className="text-lg">
                  Booking Code:{" "}
                  <span className="text-darkblue05">
                    {bookingInfo.data.bookingCode}
                  </span>
                </strong>
                <div className="mt-4 text-sm">
                  {bookingInfo.data.segments.map((segment, index) => (
                    <div key={index}>
                      <strong>
                        {segment?.flight?.departureTime && (
                          <p>
                            {new Date(
                              segment.flight.departureTime
                            ).toLocaleString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}{" "}
                            <span className="float-right text-darkblue05">
                              Keberangkatan
                            </span>
                          </p>
                        )}
                      </strong>
                      <p>
                        {segment?.flight?.departureTerminal?.airport?.name} -{" "}
                        {segment?.flight?.departureTerminal.name}
                      </p>
                      <hr className="my-4 border-1 border-gray-400" />
                      <div className="my-4 flex items-center">
                        <div className="flex-shrink-0">
                          <img
                            className="h-[24px] w-[24px]"
                            src={
                              segment?.flight?.airline?.image ||
                              "/path/to/default-image.png"
                            }
                            alt="airline logo"
                          />
                        </div>

                        <div className="ml-2">
                          <strong>
                            {segment?.flight?.airline?.name} -{" "}
                            {segment?.flight?.seatClass}
                          </strong>
                          <div>
                            <strong>{segment?.flight?.flightNum}</strong>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p>
                          <strong>Informasi:</strong>
                          <br />
                          Baggage 20 kg
                          <br />
                          Cabin baggage 7 kg
                          <br />
                          In-Flight Entertainment
                        </p>
                      </div>
                      <hr className="my-4 border-1 border-gray-400" />
                      <strong>
                        {segment?.flight?.arrivalTime && (
                          <p className="font-bold">
                            {new Date(
                              segment.flight.arrivalTime
                            ).toLocaleString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}{" "}
                            <span className="float-right text-darkblue05">
                              Kedatangan
                            </span>
                          </p>
                        )}
                      </strong>
                      <p>
                        {segment?.flight?.arrivalTerminal?.airport?.name} -{" "}
                        {segment?.flight?.arrivalTerminal.name}
                      </p>
                      <hr className="my-4 border-2 border-gray-800" />
                    </div>
                  ))}
                  <strong className="text-lg">Rincian Harga</strong>
                  <p>
                    {bookingInfo.data.passengerCount.adult} Adults
                    <span className="float-right">IDR 9.550.000</span>
                  </p>
                  <p>
                    {bookingInfo.data.passengerCount.child} Childs
                    <span className="float-right">IDR 0</span>
                  </p>
                  <p>
                    {bookingInfo.data.passengerCount.infant} Baby
                    <span className="float-right">IDR 0</span>
                  </p>
                  <p>
                    Tax
                    <span className="float-right">
                      {bookingInfo.data.tax}
                      {" %"}
                    </span>
                  </p>
                  <hr className="my-4 border-2 border-gray-400" />
                  <strong className="text-lg">
                    Total
                    <span className="float-right text-darkblue05">
                      IDR {bookingInfo.data.totalPrice.toLocaleString("id-ID")}
                    </span>
                  </strong>
                </div>
              </>
            ) : (
              <p>Loading booking information...</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
