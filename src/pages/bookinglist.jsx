import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Skeleton } from "../components/ui/skeleton";

const BookingList = ({
  setSelectedBooking,
  error,
  groupedBookings,
  openMonth,
  setOpenMonth,
}) => {
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBooking, setSelectedBookingState] = useState(null);
  const [filteredGroupedBookings, setFilteredGroupedBookings] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isComponentMounted = true; // Prevent state update on unmounted component

    setIsLoading(true); // Start loading

    // Simulate fetching and processing filtered bookings
    const timeout = setTimeout(() => {
      const filtered = Object.keys(groupedBookings).reduce((acc, monthYear) => {
        const filteredBookings = groupedBookings[monthYear].filter(
          (booking) => statusFilter === "All" || booking.status === statusFilter
        );
        if (filteredBookings.length > 0) {
          acc[monthYear] = filteredBookings;
        }
        return acc;
      }, {});

      if (isComponentMounted) {
        setFilteredGroupedBookings(filtered);
        setIsLoading(false); // Finish loading after data is processed
      }
    }, 500); // Optional delay for realistic loading feedback

    return () => {
      isComponentMounted = false; // Cleanup
      clearTimeout(timeout);
    };
  }, [groupedBookings, statusFilter]);

  return (
    <div className=" rounded-lg p-4">
      {/* Buttons for filtering by status */}
      <div className="flex flex-wrap justify-start space-x-2 mb-4">
        {["All", "Issued", "Unpaid", "Cancelled"].map((status) => (
          <Button
            key={status}
            className={`px-4 py-2 rounded-[18px] mb-2 md:mb-0 ${
              statusFilter === status
                ? "bg-darkblue05 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setStatusFilter(status)}
          >
            {status}
          </Button>
        ))}
      </div>

      {/* Error Handling */}
      {error && (
        <div className="flex justify-center text-red-500">
          <h1>Error: {error.message || "An unknown error occurred."}</h1>
        </div>
      )}

      {/* Loading Indicator */}
      {!error && isLoading && (
        <div>
          <div className="flex flex-col items-center">
            <h1>Mencari Riwayat Pemesanan</h1>
            <span className="mt-2">Loading...</span>{" "}
          </div>

          <div className="flex justify-center w-1/2">
            <Progress value={65} />
          </div>
        </div>
      )}

      {/* No Bookings Found */}
      {!isLoading &&
        !error &&
        Object.keys(filteredGroupedBookings).length === 0 &&
        Object.keys(groupedBookings).length > 0 && ( // Ensure data has been fetched
          <div className="flex flex-col items-center ">
            <div className="flex  gap-2 w-full justify-center">
              <div className="skeleton flex flex-col gap-3 w-1/4">
                <Skeleton className=" p-2 grid grid-cols-12 w-full">
                  <img src="/svg/verification.svg" alt="" />
                  <div className="flex flex-col gap-1 col-span-11">
                    <div className="animate-pulse rounded-md bg-muted w-full  h-3" />
                    <div className="animate-pulse rounded-md bg-muted w-8/12  h-3" />
                  </div>
                </Skeleton>
                <Skeleton className=" p-2 grid grid-cols-12 w-full">
                  <img src="/svg/verification.svg" alt="" />
                  <div className="flex flex-col gap-1 col-span-11">
                    <div className="animate-pulse rounded-md bg-muted w-full  h-3" />
                    <div className="animate-pulse rounded-md bg-muted w-8/12  h-3" />
                  </div>
                </Skeleton>{" "}
                <Skeleton className=" p-2 grid grid-cols-12 w-full">
                  <img src="/svg/verification.svg" alt="" />
                  <div className="flex flex-col gap-1 col-span-11">
                    <div className="animate-pulse rounded-md bg-muted w-full  h-3" />
                    <div className="animate-pulse rounded-md bg-muted w-8/12  h-3" />
                  </div>
                </Skeleton>
              </div>
              <img src="/svg/man2.svg" alt="" className="w-20 mt-10" />
            </div>
            <h1>Maaf, pencarian Anda tidak ditemukan</h1>
          </div>
        )}

      {/* Render Filtered Bookings */}
      {!isLoading &&
        !error &&
        Object.keys(filteredGroupedBookings).length > 0 && (
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
                          (a, b) =>
                            new Date(b.createdAt) - new Date(a.createdAt)
                        ) // Sort bookings by createdAt (newest first)
                        .map((booking) => (
                          <Card
                            key={booking.id}
                            className={`border shadow h-auto w-full rounded-lg p-4 mb-4 cursor-pointer ${
                              selectedBooking?.id === booking.id
                                ? "bg-slate-200"
                                : ""
                            }`}
                            onClick={() => {
                              setSelectedBooking(booking);
                              setSelectedBookingState(booking);
                            }}
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

                            {booking.segments.length > 0 && (
                              <div className="grid grid-cols-1 gap-6 mt-4">
                                {/* Group segments by isReturn */}
                                {["false", "true"].map((isReturnValue) => {
                                  // Filter segments by isReturn value and ensure no consecutive flightId duplication
                                  const filteredSegments = booking.segments
                                    .filter(
                                      (segment) =>
                                        segment.isReturn.toString() ===
                                        isReturnValue
                                    )
                                    .reduce((acc, current, index, array) => {
                                      // If the current flightId is the same as the previous one, skip it
                                      if (
                                        index > 0 &&
                                        current.flight.id ===
                                          array[index - 1].flight.id
                                      ) {
                                        return acc;
                                      }
                                      acc.push(current);
                                      return acc;
                                    }, []);

                                  console.log(
                                    "filteredSegments:",
                                    filteredSegments
                                  );

                                  // If there are multiple segments, group them as a single transit route
                                  if (filteredSegments.length > 1) {
                                    // Grouping logic: Transit for outbound and return flights
                                    const transit = {
                                      departure:
                                        filteredSegments[0].flight.departure
                                          .city.name, // Departure from the first segment
                                      arrival:
                                        filteredSegments[
                                          filteredSegments.length - 1
                                        ].flight.arrival.city.name, // Arrival from the last segment
                                      scheduleDeparture:
                                        filteredSegments[0].flight.departure
                                          .schedule,
                                      scheduleArrival:
                                        filteredSegments[
                                          filteredSegments.length - 1
                                        ].flight.arrival.schedule,
                                      duration: filteredSegments.reduce(
                                        (acc, current, index) => {
                                          // Calculate total duration including layovers
                                          const flightDuration =
                                            current.flight.estimatedDuration;
                                          let layoverDuration = 0;

                                          if (
                                            index <
                                            filteredSegments.length - 1
                                          ) {
                                            const currentArrival = new Date(
                                              current.flight.arrival.schedule
                                            );
                                            const nextDeparture = new Date(
                                              filteredSegments[
                                                index + 1
                                              ].flight.departure.schedule
                                            );
                                            layoverDuration =
                                              (nextDeparture - currentArrival) /
                                              (1000 * 60 * 60); // Layover duration in hours
                                          }
                                          return (
                                            acc +
                                            flightDuration +
                                            layoverDuration
                                          );
                                        },
                                        0
                                      ), // Total duration of the transit including layovers
                                    };

                                    // Calculate total hours and minutes
                                    const totalHours = Math.floor(
                                      transit.duration
                                    ); // Extract the whole hours
                                    const totalMinutes = Math.round(
                                      (transit.duration - totalHours) * 60
                                    ); // Convert fractional hours to minutes

                                    console.log("transit:", transit);

                                    return (
                                      <div
                                        key={isReturnValue}
                                        className="grid grid-cols-1 gap-6"
                                      >
                                        <div className="grid grid-cols-12 gap-4 items-center border-b-2 border-[#B2BEB5] pb-4 last:border-b-0">
                                          {/* Departure Info */}
                                          <div className="lg:col-span-3 col-span-4 ">
                                            <div className="flex items-center gap-2">
                                              <img
                                                src="/svg/live-area.svg"
                                                alt="Departure Icon"
                                                className="w-[20px] h-[20px]"
                                              />
                                              <span className="lg:text-sm text-xs font-bold w-full break-words">
                                                {transit.departure ||
                                                  "Departure City"}
                                              </span>
                                            </div>
                                            <div className="text-xs mt-2 lg:ms-7 ms-[15px]">
                                              {transit.scheduleDeparture ? (
                                                <>
                                                  <div>
                                                    {
                                                      transit.scheduleDeparture.split(
                                                        " "
                                                      )[0]
                                                    }
                                                  </div>
                                                  <div>
                                                    {
                                                      transit.scheduleDeparture.split(
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
                                          <div className="lg:col-span-6 col-span-4 flex flex-col items-center ">
                                            <div>
                                              <span className="flex justify-center text-xs mt-1 text-gray-500">
                                                {transit.duration % 1 === 0
                                                  ? `${transit.duration} Jam`
                                                  : `${transit.duration.toFixed(2)} Jam`}{" "}
                                              </span>

                                              <img
                                                src="/svg/route.svg"
                                                alt="Flight Route"
                                                className="w-full max-w-[250px] my-2"
                                              />
                                              {/* Display number of transits */}
                                              <span className="flex justify-center text-xs text-gray-700 mt-2">
                                                Transit
                                              </span>
                                            </div>
                                          </div>

                                          {/* Arrival Info */}
                                          <div className="lg:col-span-3 col-span-4">
                                            <div className="flex items-center gap-2">
                                              <img
                                                src="/svg/live-area.svg"
                                                alt="Arrival Icon"
                                                className="w-[20px] h-[20px]"
                                              />
                                              <span className="lg:text-sm text-xs font-bold w-full break-words">
                                                {transit.arrival ||
                                                  "Arrival City"}
                                              </span>
                                            </div>
                                            <div className="text-xs mt-2 lg:ms-7 ms-[24px]">
                                              {transit.scheduleArrival ? (
                                                <>
                                                  <div>
                                                    {
                                                      transit.scheduleArrival.split(
                                                        " "
                                                      )[0]
                                                    }
                                                  </div>
                                                  <div>
                                                    {
                                                      transit.scheduleArrival.split(
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
                                      </div>
                                    );
                                  } else {
                                    // Direct flight logic
                                    return booking.segments
                                      .filter(
                                        (segment) =>
                                          segment.isReturn.toString() ===
                                          isReturnValue
                                      )
                                      .reduce((acc, segment, index, array) => {
                                        // If the current flightId is the same as the previous one, skip it
                                        if (
                                          index > 0 &&
                                          segment.flight.id ===
                                            array[index - 1].flight.id
                                        ) {
                                          return acc;
                                        }
                                        acc.push(segment);
                                        return acc;
                                      }, [])
                                      .map((segment, index) => (
                                        <div
                                          key={index}
                                          className="grid grid-cols-12 gap-4 items-center border-b-2 border-[#B2BEB5] pb-4 last:border-b-0"
                                        >
                                          {/* Departure Info */}
                                          <div className="lg:col-span-3 col-span-4">
                                            <div className="flex items-center gap-2">
                                              <img
                                                src="/svg/live-area.svg"
                                                alt="Departure Icon"
                                                className="w-[20px] h-[20px]"
                                              />
                                              <span className="lg:text-sm text-xs font-bold w-full break-words">
                                                {segment.flight.departure.city
                                                  .name || "Departure City"}
                                              </span>
                                            </div>
                                            <div className="text-xs mt-2 lg:ms-7 ms-[15px]">
                                              {segment.flight.departure
                                                .schedule ? (
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
                                              <span className="flex justify-center text-xs text-gray-700 mt-2">
                                                {"Penerbangan Langsung"}
                                              </span>
                                            </div>
                                          </div>

                                          {/* Arrival Info */}
                                          <div className="lg:col-span-3 col-span-4">
                                            <div className="flex items-center gap-2">
                                              <img
                                                src="/svg/live-area.svg"
                                                alt="Arrival Icon"
                                                className="w-[20px] h-[20px]"
                                              />
                                              <span className="lg:text-sm text-xs font-bold w-full break-words">
                                                {segment.flight.arrival.city
                                                  .name || "Arrival City"}
                                              </span>
                                            </div>
                                            <div className="text-xs mt-2 lg:ms-7 ms-[24px]">
                                              {segment.flight.arrival
                                                .schedule ? (
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
                                      ));
                                  }
                                })}
                              </div>
                            )}

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
                                  {booking.segments[0].flight?.seatClass ||
                                    "N/A"}
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
