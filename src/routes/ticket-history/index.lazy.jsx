import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { ArrowLeft, Filter, X } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar } from "../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { getBookings, getBookingsByDate } from "../../services/bookings";
import { getFlightsById } from "../../services/flights";
import { cn } from "../../lib/utils";
import BookingList from "../../pages/bookinglist";
import BookingDetails from "../../pages/bookingDetails";

export const Route = createLazyFileRoute("/ticket-history/")({
  component: TicketHistory,
});

function TicketHistory() {
  const { token } = useSelector((state) => state.auth);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openMonth, setOpenMonth] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: null,
    to: null,
  });

  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile mode
  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  // Determine which booking fetch function to use based on date range
  const fetchBookingsQuery = useQuery({
    queryKey: [
      "bookings",
      dateRange.from?.toISOString(),
      dateRange.to?.toISOString(),
    ],
    queryFn: () => {
      if (dateRange.from && dateRange.to) {
        return getBookingsByDate(
          format(dateRange.from, "yyyy-MM-dd"),
          format(dateRange.to, "yyyy-MM-dd")
        );
      }
      return getBookings();
    },
    enabled: !!token,
  });

  const fetchFlightDetails = async (flightId) => {
    try {
      const flightDetails = await getFlightsById(flightId);
      return flightDetails;
    } catch (error) {
      console.error(
        `Failed to fetch flight details for ID ${flightId}:`,
        error
      );
      return null;
    }
  };

  useEffect(() => {
    const { data: responseData, isSuccess } = fetchBookingsQuery;
    if (isSuccess && responseData) {
      const bookingsData = Array.isArray(responseData)
        ? responseData
        : responseData.data
          ? [responseData.data]
          : [responseData];

      const fetchAllFlightDetails = async () => {
        const updatedBookings = await Promise.all(
          bookingsData.map(async (booking) => {
            const segmentsWithDetails = await Promise.all(
              booking.segments.map(async (segment) => {
                const flightDetails = await fetchFlightDetails(
                  segment.flightId
                );
                return {
                  ...segment,
                  flight: {
                    ...segment.flight,
                    ...flightDetails,
                  },
                };
              })
            );

            return {
              ...booking,
              segments: segmentsWithDetails,
            };
          })
        );

        setBookings(updatedBookings);
      };

      fetchAllFlightDetails();
    }
  }, [fetchBookingsQuery.data, fetchBookingsQuery.isSuccess]);

  const handleDateSelect = (selectedRange) => {
    // Reset the selected booking when a new date range is selected
    setSelectedBooking(null);

    // Ensure the selected range is always an object with from and to
    setDateRange({
      from: selectedRange?.from ?? null,
      to: selectedRange?.to ?? null,
    });
  };

  // Reset date range filter
  const handleResetFilter = () => {
    setDateRange({ from: null, to: null });
  };

  // Formatting and grouping functions remain the same as in previous implementation
  const formatDate = (date) => {
    const options = { year: "numeric", month: "long" };
    return new Date(date).toLocaleDateString("id-ID", options);
  };

  const groupBookingsByMonth = (bookings) => {
    const groupedBookings = {};

    bookings.forEach((booking) => {
      const monthYear = formatDate(booking.createdAt);

      if (!groupedBookings[monthYear]) {
        groupedBookings[monthYear] = [];
      }
      groupedBookings[monthYear].push(booking);
    });

    return groupedBookings;
  };

  const groupedBookings = useMemo(
    () => groupBookingsByMonth(bookings),
    [bookings]
  );

  return (
    <>
      <div className="container max-w-[1024px] mx-auto sm:pt-8 pt-2 px-4">
        <div className="flex justify-between items-center ms-0 lg:-ms-5 mt-2 sm:mb-8 mb-4">
          <h2 className="text-xl font-bold text-center sm:text-left">
            Riwayat Pemesanan
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Card className="p-4 rounded-[12px] flex justify-between items-center bg-darkblue05 h-[50px]  w-full sm:w-[777px]">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-8 h-8 text-white rounded-full">
                  <Button variant="link" size="icon" className="p-0">
                    <Link to="/" className="flex items-center">
                      <ArrowLeft
                        style={{
                          width: "24px",
                          height: "24px",
                          color: "white",
                        }}
                      />
                    </Link>
                  </Button>
                </div>

                <div className="flex flex-grow justify-center">
                  <h1 className="font-normal text-lg text-white text-center">
                    Beranda
                  </h1>
                </div>
              </div>
            </Card>

            <div className="flex sm:flex-row items-center gap-4 sm:gap-2">
              <div className="flex justify-between w-full sm:flex-row items-center gap-2">
                {/* Date Range Picker */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-auto justify-start text-left font-normal rounded-[18px] border border-darkblue05",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          `${format(dateRange.from, "LLL dd, y")} - ${format(
                            dateRange.to,
                            "LLL dd, y"
                          )}`
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Filter</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={handleDateSelect}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>

                {/* Reset Filter Button - Only show if a filter is applied */}
                {(dateRange.from || dateRange.to) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleResetFilter}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Separator className="mt-[25px] shadow" />

      <div className="container mx-auto max-w-5xl mt-8 px-4">
        {fetchBookingsQuery.isLoading && <div>Loading bookings...</div>}
        {fetchBookingsQuery.error && (
          <div>{fetchBookingsQuery.error.message}</div>
        )}
        {/* Conditional rendering for mobile mode */}
        <div className="grid grid-cols-1 md:grid-cols-[550px_370px] gap-2 mt-8">
          {isMobile ? (
            selectedBooking ? (
              <div>
                <Button
                  variant="outline"
                  className="mb-4  bg-darkblue05 text-white rounded-[12px]"
                  onClick={() => setSelectedBooking(null)}
                >
                  Back to List
                </Button>
                <BookingDetails selectedBooking={selectedBooking} />
              </div>
            ) : (
              <BookingList
                bookings={bookings}
                setSelectedBooking={setSelectedBooking}
                isLoading={fetchBookingsQuery.isLoading}
                error={fetchBookingsQuery.error}
                groupedBookings={groupedBookings}
                openMonth={openMonth}
                setOpenMonth={setOpenMonth}
              />
            )
          ) : (
            <>
              <BookingList
                bookings={bookings}
                setSelectedBooking={setSelectedBooking}
                isLoading={fetchBookingsQuery.isLoading}
                error={fetchBookingsQuery.error}
                groupedBookings={groupedBookings}
                openMonth={openMonth}
                setOpenMonth={setOpenMonth}
              />
              {selectedBooking && (
                <BookingDetails selectedBooking={selectedBooking} />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
