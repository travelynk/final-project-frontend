import { createLazyFileRoute, Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import NavigationBreadCr from "../pages/navigationBreadCr";

export const Route = createLazyFileRoute("/payment")({
  component: Payment,
});

function Payment() {
  return (
    <>
      {/*navigationbreadcr disini*/}
      <NavigationBreadCr
        initialTime={300}
        label="Selesaikan Pembayaran Dalam"
        expirationMessage="Maaf, Waktu pembayaran habis. Silahkan ulangi lagi!"
        redirectPath="/"
      />{" "}
      {/* 3 menit */}
      <main className="container mx-auto max-w-5xl mt-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {/* Left Section */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-bold mb-4">Isi Data Pembayaran</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {/* Debit */}
              <AccordionItem value="debit-card">
                <AccordionTrigger
                  className="flex justify-between items-center w-full px-4 py-2 rounded-lg bg-gray-800 text-white 
                                hover:bg-purple-500 data-[state=open]:bg-purple-600 transition-colors"
                >
                  Debit Card
                </AccordionTrigger>
                <AccordionContent>
                  <div className="bg-white rounded-lg p-4">
                    <form class="max-w-sm">
                      <label
                        for="bank"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Pembayaran
                      </label>
                      <select
                        id="banks"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option selected>Pilih Bank</option>
                        <option value="bca">BCA</option>
                        <option value="bri">BRI</option>
                        <option value="bni">BNI</option>
                        <option value="mandiri">Mandiri</option>
                      </select>
                    </form>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Credit Card */}
              <AccordionItem value="credit-card">
                <AccordionTrigger
                  className="flex justify-between items-center w-full px-4 py-2 rounded-lg bg-gray-800 text-white 
                                hover:bg-purple-500 data-[state=open]:bg-purple-600 transition-colors"
                >
                  Credit Card
                </AccordionTrigger>
                <AccordionContent>
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex justify-evenly mb-4">
                      <img src="/visa-payment.svg" alt="Visa" className="h-8" />
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
                        placeholder="4444 55555 55555 55555"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      />
                      <p className="font-medium">Card Holder Name</p>
                      <input
                        type="text"
                        placeholder="Budi Galon Bunglon"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <p className="font-medium">CVV</p>
                        <p className="font-medium">Expiry Date</p>
                        <input
                          type="text"
                          placeholder="000"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        />
                        <input
                          type="text"
                          placeholder="07/24"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        />
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <button className="w-full mt-4 py-3 bg-purple-600 text-white rounded-lg text-center hover:bg-purple-700">
              Bayar
            </button>
          </div>

          {/* Right Section */}
          <div className="bg-white rounded-lg p-4">
            <h2 className="text-lg font-bold">
              Booking Code: <span className="text-purple-600">6723y2GHK</span>
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
              <p className="font-bold">
                Total
                <span className="float-right text-purple-600">
                  IDR 9.850.000
                </span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
