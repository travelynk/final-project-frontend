import PropTypes from "prop-types";
export default function FlightDetail({ isSubmitted }) {
  return (
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
          <span className="float-right text-purple-500">Keberangkatan</span>
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
          <span className="float-right text-purple-600">IDR 9.850.000</span>
        </p>
      </div>
      {isSubmitted && (
        <button className="mt-6 bg-[#FF0000] text-white px-6 py-3 rounded-lg w-full shadow-[0px_4px_4px_0px_#00000040]">
          Lanjut Bayar
        </button>
      )}
    </div>
  );
}

FlightDetail.propTypes = {
  isSubmitted: PropTypes.bool.isRequired,
};
