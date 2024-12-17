import { useState } from "react";
import { Card } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Button } from "../components/ui/button";

const BookingList = ({
  setSelectedBooking,
  isLoading,
  error,
  groupedBookings,
  openMonth,
  setOpenMonth,
}) => {
  // New state to hold the filter value (issued, cancelled, unpaid, or all)
  const [statusFilter, setStatusFilter] = useState("All");

  // Filter the bookings based on the selected status
  const filteredGroupedBookings = Object.keys(groupedBookings).reduce(
    (acc, monthYear) => {
      const filteredBookings = groupedBookings[monthYear].filter(
        (booking) => statusFilter === "All" || booking.status === statusFilter
      );
      if (filteredBookings.length > 0) {
        acc[monthYear] = filteredBookings;
      }
      return acc;
    },
    {}
  );

  return (
    <div className="bg-white rounded-lg p-4">
      {/* Buttons for filtering by status */}
      <div className="flex flex-wrap justify-start space-x-2 mb-4">
        {["All", "Issued", "Unpaid", "Cancelled"].map((status) => (
          <Button
            key={status}
            className={`px-4 py-2 rounded-[18px] mb-2 md:mb-0 ${
              statusFilter === status
                ? "bg-[#A06ECE] text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setStatusFilter(status)}
          >
            {status}
          </Button>
        ))}
      </div>

      {!isLoading && !error && (
        <>
          {Object.keys(filteredGroupedBookings)
            .sort((a, b) => new Date(b) - new Date(a)) // Sort months by newest first
            .map((monthYear) => (
              <div key={monthYear} className="mb-4">
                <div
                  className="font-bold p-3 border-2 rounded-lg cursor-pointer flex justify-between items-center"
                  onClick={() =>
                    setOpenMonth((prev) =>
                      prev === monthYear ? null : monthYear
                    )
                  }
                >
                  <span>{monthYear}</span>
                  <span>
                    {openMonth === monthYear ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </span>
                </div>
                {openMonth === monthYear && (
                  <div className="mt-2">
                    {filteredGroupedBookings[monthYear]
                      .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                      ) // Sort bookings by createdAt (newest first)
                      .map((booking) => (
                        <Card
                          key={booking.id}
                          className="border shadow h-auto w-full rounded-lg p-4 mb-4"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          {/* Status Badge */}
                          <div className="flex mb-4">
                            <div
                              className={`flex justify-center items-center text-white w-auto h-[28px] px-4 rounded-full ${
                                booking.status === "Issued"
                                  ? "bg-[#73CA5C]"
                                  : booking.status === "Unpaid"
                                    ? "bg-[#FF0000]"
                                    : booking.status === "Cancelled"
                                      ? "bg-[#B2BEB5]"
                                      : "bg-[#FF0000]"
                              }`}
                            >
                              {booking.status || "N/A"}
                            </div>
                          </div>

                          {/* Flight Route */}
                          <div className="grid grid-cols-1 gap-6 mt-4">
                            {booking.segments.map((segment, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-12 gap-4 items-center border-b-2 border-[#B2BEB5] pb-4 last:border-b-0"
                              >
                                {/* Departure Info */}
                                <div className="lg:col-span-3 col-span-4">
                                  {/* First row: Live area icon, city name */}
                                  <div className="flex items-center gap-2">
                                    <img
                                      src="/svg/live-area.svg"
                                      alt="Departure Icon"
                                      className="w-[20px] h-[20px]"
                                    />
                                    <span className="lg:text-sm text-xs font-bold w-full break-words">
                                      {segment.flight.departure.city.name ||
                                        "Departure City"}
                                    </span>
                                  </div>
                                  {/* Second row: Schedule */}
                                  <div className="text-xs mt-2 lg:ms-7 ms-[15px]">
                                    {segment.flight.departure.schedule ? (
                                      <>
                                        <div>
                                          {
                                            segment.flight.departure.schedule.split(
                                              " "
                                            )[0]
                                          }
                                        </div>
                                        <div>
                                          {
                                            segment.flight.departure.schedule.split(
                                              " "
                                            )[1]
                                          }
                                        </div>
                                      </>
                                    ) : (
                                      <div>N/A</div>
                                    )}
                                  </div>
                                </div>

                                {/* Route Image */}
                                <div className="lg:col-span-6 col-span-4 flex flex-col items-center">
                                  <div>
                                    <span className="flex justify-center text-xs mt-1 text-gray-500">
                                      {`${segment.flight.estimatedDuration} Jam` ||
                                        "N.A"}
                                    </span>
                                    <img
                                      src="/svg/route.svg"
                                      alt="Flight Route"
                                      className="w-full max-w-[250px] my-2"
                                    />
                                  </div>
                                </div>

                                {/* Arrival Info */}
                                <div className="lg:col-span-3 col-span-4">
                                  {/* First row: Live area icon, city name */}
                                  <div className="flex items-center gap-2">
                                    <img
                                      src="/svg/live-area.svg"
                                      alt="Arrival Icon"
                                      className="w-[20px] h-[20px]"
                                    />
                                    <span className="lg:text-sm text-xs font-bold w-full break-words">
                                      {segment.flight.arrival.city.name ||
                                        "Arrival City"}
                                    </span>
                                  </div>
                                  {/* Second row: Schedule */}
                                  <div className="text-xs mt-2 lg:ms-7 ms-[24px]">
                                    {segment.flight.arrival.schedule ? (
                                      <>
                                        <div>
                                          {
                                            segment.flight.arrival.schedule.split(
                                              " "
                                            )[0]
                                          }
                                        </div>
                                        <div>
                                          {
                                            segment.flight.arrival.schedule.split(
                                              " "
                                            )[1]
                                          }
                                        </div>
                                      </>
                                    ) : (
                                      <div>N/A</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <Separator className="mt-4"></Separator>

                          {/* Booking Details */}
                          <div className="flex justify-between text-xs mt-4">
                            <div>
                              <p className="md:text-base">
                                <strong>Booking Code:</strong> <br />
                                {booking.bookingCode || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="md:text-base">
                                <strong>Class:</strong> <br />
                                {booking.segments[0].flight?.seatClass || "N/A"}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="md:text-base font-bold text-purple-700">
                                {`IDR ${booking.totalPrice?.toLocaleString() || "N/A"}`}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                )}
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default BookingList;
