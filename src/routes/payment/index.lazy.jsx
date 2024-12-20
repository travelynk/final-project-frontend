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

  // console.log(bookingInfo);

  const [creditValue, setCredit] = useState({
    card_number: "",
    card_exp_month: "",
    card_exp_year: "",
    card_cvv: "",
  });
  const [cardHolderName, setCardHolderName] = useState("");
  const isFormValid = () => {
    return (
      creditValue.card_number &&
      cardHolderName &&
      creditValue.card_cvv &&
      creditValue.card_exp_month &&
      creditValue.card_exp_year
    );
  };

  const [bankValue, setBank] = useState({
    bank: "",
  });
  const [vaNumber, setVaNumber] = useState("");
  const [loading, setLoading] = useState("");
  const [selectedBank, setSelectedBank] = useState("");

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

  const changeBank = (e) => {
    setBank(e.target.value);
    setSelectedBank(e.target.value);
  };

  const handleVa = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (bookingId) {
        const response = await CreateVa(bookingId, bankValue);
        // console.log("response sampai ke front end: ", response);
        const vaNum = response.data.data.paymentUrl.va_numbers[0].va_number;
        const trxId = response.data.data.paymentUrl.transaction_id;
        const trxStatus = response.data.data.paymentUrl.transaction_status;
        // console.log("dapat transaction id:", trxId);
        // console.log("dapat transaction status:", trxStatus);
        // console.log("dapat va number:", vaNum);
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

  return (
    <>
      {/*navigationbreadcr disini*/}
      <NavigationBreadCr
        initialTime={300}
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
                      disabled={!selectedBank} // Disable the button if no bank is selected
                      className={`w-full mt-4 py-3 rounded-lg text-center transition-colors ${
                        selectedBank
                          ? "bg-darkblue05 text-white hover:bg-darkblue06"
                          : "bg-black text-white"
                      }`}
                    >
                      Pilih
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
                        value={cardHolderName}
                        onChange={(e) => setCardHolderName(e.target.value)}
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
                        className={`w-full mt-4 py-3 rounded-lg text-center transition-colors ${
                          isFormValid()
                            ? "bg-darkblue05 text-white hover:bg-darkblue06"
                            : "bg-black text-white"
                        }`}
                        onClick={handleCredit}
                        disabled={!isFormValid()} // Disable the button if any field is empty
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
                <div className="mt-4 text-sm ">
                  {bookingInfo.data.segments.map((segment, index) => (
                    <div key={index}>
                      <strong className="text-lg text-darkblue05">
                        {index === 0
                          ? "Penerbangan Awal"
                          : segment.isReturn
                            ? "Penerbangan Pulang"
                            : `Transit ke-${index}`}
                      </strong>
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
                  {bookingInfo?.data?.voucherCode && (
                    <p className="text-lg font-bold">
                      Voucher Code:{" "}
                      <span className="text-darkblue05">
                        {bookingInfo.data.voucherCode}
                      </span>
                    </p>
                  )}
                  <strong className="text-lg">Rincian Harga</strong>
                  <p>
                    {bookingInfo.data.passengerCount.adult} Adults
                    <span className="float-right">
                      IDR{" "}
                      {bookingInfo.data.adultTotalPrice.toLocaleString("id-ID")}
                    </span>
                  </p>
                  <p>
                    {bookingInfo.data.passengerCount.child} Childs
                    <span className="float-right">
                      IDR{" "}
                      {bookingInfo.data.childTotalPrice.toLocaleString("id-ID")}
                    </span>
                  </p>
                  <p>
                    {bookingInfo.data.passengerCount.infant} Baby
                    <span className="float-right">IDR 0</span>
                  </p>
                  {/* <p>
                    Diskon Voucher
                    <span className="float-right">
                      IDR{" "}
                      {bookingInfo.data.voucher?.value
                        ? bookingInfo.data.voucher.value.toLocaleString("id-ID")
                        : "0"}
                    </span>
                  </p> */}
                  <p>
                    Tax
                    <span className="float-right">
                      {bookingInfo.data.tax}
                      {" %"}
                    </span>
                  </p>
                  <hr className="my-4 border-2 border-gray-800" />
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
