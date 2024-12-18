import { createLazyFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import NavigationBreadCr from "../../pages/navigationBreadCr";
import { Button } from "../../components/ui/button";

export const Route = createLazyFileRoute("/success/")({
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
        <div className="flex justify-center mt-20">
          <img src="/svg/picture-success.svg" alt="icon" />
        </div>
        <div className="flex flex-col items-center mt-4">
          <p className="text-darkblue05">Selamat!</p>
          <p>Transaksi pembayaran tiket sukses!</p>
        </div>
        <div className="flex flex-col items-center mt-4">
          <Link
            to="/ticket-history"
            className="w-full max-w-64 mt-4 py-2 bg-darkblue05 text-white rounded-lg text-center hover:bg-darkblue06"
          >
            Terbitkan Tiket
          </Link>
          <Button
            className="w-full max-w-64 mt-4 py-2  text-white rounded-lg text-center"
            disabled
          >
            Cari Penerbangan Lain
          </Button>
        </div>
      </main>
    </>
  );
}
