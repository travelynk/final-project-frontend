import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import {
  ArrowLeft,
  Bell,
  Filter,
  Search,
  Trash2,
  CheckSquare,
  X,
} from "lucide-react";
import {
  getNotificationsById,
  updateNotificationReadStatus,
  deleteNotifications,
} from "../../services/notifications";
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar } from "../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { cn } from "../../lib/utils";

export const Route = createLazyFileRoute("/notification/")({
  component: Notification,
});

function Notification() {
  const { token } = useSelector((state) => state.auth);
  const [showDeleteButtons, setShowDeleteButtons] = useState(false);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [checkedNotifications, setCheckedNotifications] = useState([]);

  const queryClient = useQueryClient();

  const {
    data: notifications,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotificationsById,
    enabled: !!token,
  });

  const readMutation = useMutation({
    mutationFn: updateNotificationReadStatus,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["notifications"], (oldNotifications) =>
        oldNotifications.map((notif) =>
          notif.id === variables ? { ...notif, isRead: true } : notif
        )
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotifications,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["notifications"], (oldNotifications) =>
        oldNotifications.filter((notif) => notif.id !== variables)
      );
    },
  });

  // Function to toggle individual notification selection
  const toggleNotificationSelection = (id) => {
    setCheckedNotifications((prev) =>
      prev.includes(id)
        ? prev.filter((notifId) => notifId !== id)
        : [...prev, id]
    );
  };

  // Function to check/uncheck all notifications
  const toggleSelectAll = () => {
    if (checkedNotifications.length === filteredNotifications.length) {
      setCheckedNotifications([]);
    } else {
      setCheckedNotifications(filteredNotifications.map((notif) => notif.id));
    }
  };

  // Function to delete all selected notifications
  const deleteSelectedNotifications = () => {
    checkedNotifications.forEach((id) => {
      deleteMutation.mutate(id);
    });
    setCheckedNotifications([]);
    setShowDeleteButtons(false);
  };

  const filteredNotifications = useMemo(() => {
    if (!notifications) return [];

    let result = [...notifications];

    // Normalize date for comparison (removing time component)
    const normalizeDate = (date) => {
      return new Date(date).setHours(0, 0, 0, 0);
    };

    if (dateRange.from || dateRange.to) {
      const fromDate = dateRange.from ? normalizeDate(dateRange.from) : null;
      const toDate = dateRange.to ? normalizeDate(dateRange.to) : null;

      result = result.filter((notification) => {
        const notifDate = normalizeDate(notification.createdAt);

        // Check if the notification's date falls within the range
        return (
          (!fromDate || notifDate >= fromDate) &&
          (!toDate || notifDate <= toDate)
        );
      });
    }

    if (searchTerm) {
      result = result.filter(
        (notification) =>
          notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return result;
  }, [notifications, dateRange, searchTerm]);

  const handleNotificationClick = (notification) => {
    if (notification && !notification.isRead) {
      readMutation.mutate(notification.id);
    }
  };

  const handleDateSelect = (range) =>
    setDateRange(range || { from: null, to: null });
  const handleResetFilter = () => setDateRange({ from: null, to: null });
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const formatDate = (dateString) => {
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${day} ${month} ${year}, ${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
  };

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
                      {dateRange.from
                        ? `${format(dateRange.from, "LLL dd, y")} - ${
                            dateRange.to
                              ? format(dateRange.to, "LLL dd, y")
                              : ""
                          }`
                        : "Filter"}
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

                {/* Search Button */}
                <div className="relative w-full sm:w-[180px]">
                  <input
                    type="text"
                    className="border border-darkblue05 dark:bg-transparent rounded-[18px] p-2 pl-10 pr-2 w-full"
                    placeholder="Cari Notifikasi"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="container max-w-4xl mx-auto px-4">
        <div className="container flex flex-wrap justify-between items-center px-4 mb-6 gap-4">
          <Button
            variant="outline"
            className={
              showDeleteButtons
                ? "text-red-500 border-red-500 rounded-[18px]"
                : "text-darkblue05 border-darkblue05 rounded-[18px]"
            }
            onClick={() => setShowDeleteButtons(!showDeleteButtons)}
          >
            <Trash2 />
            {showDeleteButtons ? "Cancel" : "Delete"}
          </Button>

          {showDeleteButtons && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={toggleSelectAll}
                className="text-darkblue05 border-darkblue05 rounded-[18px]"
              >
                <CheckSquare />
                {checkedNotifications.length === filteredNotifications.length
                  ? "Uncheck All"
                  : "Check All"}
              </Button>
              <Button
                variant="outline"
                onClick={deleteSelectedNotifications}
                className="text-red-500 border-red-500 rounded-[18px]"
              >
                Delete Selected
              </Button>
            </div>
          )}
        </div>
        {filteredNotifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Tidak ada notifikasi tersedia
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              onClick={() =>
                !showDeleteButtons && handleNotificationClick(notification)
              }
              className={`w-full p-6 mb-2 border-darkblue05 shadow-none rounded-lg transition-all duration-300 ease-in-out relative ${
                notification.isRead
                  ? "bg-gray-200 dark:bg-slate-800 shadow-md opacity-70"
                  : "bg-white dark:bg-slate-800 hover:bg-gray-50"
              } cursor-pointer`}
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-darkblue05 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-white" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                      {notification.title}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-slate-100 mt-0.5">
                      {notification.message}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {showDeleteButtons ? (
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={checkedNotifications.includes(notification.id)}
                      onChange={() =>
                        toggleNotificationSelection(notification.id)
                      }
                    />
                  ) : (
                    <div
                      className={`flex items-center text-sm text-gray-500 w-[20px] justify-end ${
                        showDeleteButtons ? "hidden" : ""
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          notification.isRead ? "bg-gray-500" : "bg-green-500"
                        }`}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end text-xs">
                {formatDate(notification.createdAt)}
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
