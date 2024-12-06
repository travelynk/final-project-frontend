import * as React from "react";

import { createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import NavigationBreadCr from "../pages/navigationBreadCr";

export const Route = createLazyFileRoute("/success")({
  component: Success,
});

function Success() {
  return (
    <>
      {/*navigationbreadcr disini*/}
      <NavigationBreadCr
        successMessage="Terimakasih atas pembayaran transaksi"
        showSuccess={true}
      />
      <main className="container mx-auto max-w-5xl mt-8 px-4">
        <div className="flex justify-center mt-36">
          <img src="/picture-success.svg" alt="icon" />
        </div>
        <div className="flex flex-col items-center mt-4">
          <p className="text-purple-600">Selamat!</p>
          <p>Transaksi pembayaran tiket sukses!</p>
        </div>
        <div className="flex flex-col items-center mt-4">
          <button className="w-full max-w-64 mt-4 py-2 bg-purple-600 text-white rounded-lg text-center hover:bg-purple-700">
            Terbitkan Tiket
          </button>
          <button
            className="w-full max-w-64 mt-4 py-2 bg-purple-400 text-white rounded-lg text-center"
            disabled
          >
            Cari Penerbangan Lain
          </button>
        </div>
      </main>
    </>
  );
}
