import { useState } from "react";
import PropTypes from "prop-types";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getVouchers, getVoucherByCode } from "../services/vouchers";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/ui/popover";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
} from "../components/ui/toast";

export default function FlightDetail({ isSubmitted }) {
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [totalPrice, setTotalPrice] = useState(9850000); // Base total price
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState("default");
  const [toastTitle, setToastTitle] = useState("");
  const [toastDescription, setToastDescription] = useState("");

  // Fetch vouchers
  const { data: vouchers = [], isLoading: isFetchingVouchers } = useQuery({
    queryKey: ["vouchers"],
    queryFn: getVouchers,
    staleTime: 1000 * 60 * 5, // Cache data 5 minutes
  });

  // Apply voucher mutation
  const applyVoucherMutation = useMutation({
    mutationFn: ({ code }) => getVoucherByCode(code, totalPrice),
    onSuccess: (data) => {
      console.log("Voucher applied successfully:", data); // Log data yang berhasil diterima

      setSelectedVoucher(data);
      setTotalPrice(data.updatedTotalPrice);

      setToastVariant("success");
      setToastTitle("Voucher Applied");
      setToastDescription(`New total: IDR ${data.updatedTotalPrice}`);
      setShowToast(true);
    },
    onError: (error) => {
      console.error("Error applying voucher:", error); // Log error

      setToastVariant("error");
      setToastTitle("Error");
      setToastDescription(error.message);
      setShowToast(true);
    },
  });

  const handleVoucherSelect = (voucher) => {
    console.log("Voucher selected:", voucher); // Log voucher yang dipilih

    applyVoucherMutation.mutate({ code: voucher.code });
  };

  return (
    <ToastProvider>
      <div className="bg-white rounded-lg p-4">
        <h2 className="text-lg font-bold">
          Booking Code: <span className="text-purple-600">6723y2GHK</span>
        </h2>
        <div className="mt-4 text-sm">
          <p>
            <strong>07:00</strong>
            <span className="float-right text-purple-500">Keberangkatan</span>
          </p>
          <p>3 Maret 2023</p>
          <p>Soekarno Hatta - Terminal 1A Domestik</p>
          <hr className="my-4" />
          <p>
            <strong>Jet Air - Economy</strong>
          </p>
          <p className="mb-4">
            <strong>JT - 203</strong>
          </p>
          <hr className="my-4" />
        </div>

        {/* Voucher Section */}
        <div className="text-sm">
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <span className="font-bold">Voucher:</span>
              <span className="text-purple-600">
                {selectedVoucher ? selectedVoucher.code : "Tidak ada"}
              </span>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <button className="bg-purple-500 text-white px-4 py-1 rounded">
                  {isFetchingVouchers ? "Loading..." : "Cek"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="bg-white shadow-md rounded-lg p-4 w-64">
                <h3 className="font-bold text-lg mb-2">Daftar Voucher</h3>
                <ul className="space-y-2">
                  {vouchers.map((voucher) => (
                    <li
                      key={voucher.id}
                      onClick={() => handleVoucherSelect(voucher)}
                      className="p-2 border rounded-lg hover:bg-purple-100 cursor-pointer"
                    >
                      <div className="font-semibold">{voucher.code}</div>
                      <div className="text-sm text-gray-600">
                        {voucher.description}
                      </div>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
          </div>

          {/* Pricing Section */}
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
              IDR {totalPrice.toLocaleString()}
            </span>
          </p>
        </div>

        {isSubmitted && (
          <button className="mt-6 bg-[#FF0000] text-white px-6 py-3 rounded-lg w-full shadow-[0px_4px_4px_0px_#00000040]">
            Lanjut Bayar
          </button>
        )}
        {showToast && (
          <Toast variant={toastVariant}>
            <ToastTitle>{toastTitle}</ToastTitle>
            <ToastDescription>{toastDescription}</ToastDescription>
          </Toast>
        )}
        <ToastViewport />
      </div>
    </ToastProvider>
  );
}

FlightDetail.propTypes = {
  isSubmitted: PropTypes.bool.isRequired,
};
