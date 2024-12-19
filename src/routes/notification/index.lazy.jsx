import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { ArrowLeft, Bell, Filter, Search } from "lucide-react";
import {
  getNotificationsById,
  updateNotificationReadStatus,
} from "../../services/notifications";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const Route = createLazyFileRoute("/notification/")({
  component: Notification,
});

function Notification() {
  const { token } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const { data, isSuccess, isPending } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotificationsById(),
    enabled: !!token,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateNotificationReadStatus,
    onSuccess: (data, variables) => {
      console.log("Notification updated successfully", data); // Log data on success
      queryClient.setQueryData(["notifications"], (oldNotifications) => {
        return oldNotifications.map((notif) =>
          notif.id === variables ? { ...notif, isRead: true } : notif
        );
      });
    },
    onError: (error) => {
      console.error("Error updating notification status:", error.message); // Log error message
      alert("Failed to update notification status"); // Optionally, show an alert to the user
    },
  });

  const handleNotificationClick = (notification) => {
    console.log("Notification clicked:", notification); // Log the entire notification object

    if (notification && notification.id) {
      // Pass only the notification.id (not as an object)
      mutation.mutate(notification.id); // Directly pass notification.id
    } else {
      console.error("Invalid notification data", notification); // Log an error if data is invalid
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setNotifications(data);
    }
  }, [data, isSuccess]);

  // Function to format the date in the required format
  function formatDate(dateString) {
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
  }

  return (
    <>
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Notifikasi</h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <Card className="lg:col-span-9 p-4 rounded-xl bg-darkblue05 h-[50px] flex items-center">
              <div className="flex items-center w-full">
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
                <h1 className="flex-1 text-lg text-white text-center">
                  Beranda
                </h1>
              </div>
            </Card>

            <div className="lg:col-span-3 flex justify-end items-center gap-2">
              <div className="flex w-full lg:hidden justify-between">
                <Button
                  variant="outline"
                  className="w-24 h-9 rounded-full border-darkblue05"
                >
                  <Filter className="mr-2" />
                  Filter
                </Button>
                <Button variant="link" size="icon" className="h-9 w-9">
                  <Search className="w-6 h-6 text-darkblue05" />
                </Button>
              </div>
              <div className="hidden lg:flex items-center gap-2">
                <Button
                  variant="outline"
                  className="w-24 h-9 rounded-full border-darkblue05"
                >
                  <Filter className="mr-2" />
                  Filter
                </Button>
                <Button variant="link" size="icon">
                  <Search className="w-6 h-6 text-darkblue05" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="container max-w-4xl mx-auto px-4">
        {notifications?.map((notification) => (
          <Card
            key={notification.id}
            onClick={() => handleNotificationClick(notification)} // Mark as read on click
            className={`w-full p-6 border-none shadow-none rounded-none transition-all duration-300 ease-in-out ${
              notification.isRead
                ? "bg-gray-200 shadow-md opacity-70" // Read notifications style
                : "bg-white hover:bg-gray-50" // Unread notifications have white bg and hover effect
            }`} // Conditional styling for bright and dim notifications
          >
            <div className="flex items-start justify-between w-full">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-darkblue05 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-white" />
                </div>

                <div className="flex flex-col">
                  <span className="text-base font-medium text-gray-900">
                    {notification.title}
                  </span>
                  <span className="text-sm text-gray-500 mt-0.5">
                    {notification.message}
                  </span>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-500 min-w-[120px] justify-end">
                <div
                  className={`w-2 h-2 rounded-full ${
                    notification.isRead ? "bg-gray-500" : "bg-green-500"
                  }`} // Change the indicator color based on read status
                />
              </div>
            </div>

            <div className="flex justify-end text-xs">
              {formatDate(notification.createdAt)}
            </div>

            <Separator className="absolute bottom-0 left-0 w-full border-t-2" />
          </Card>
        ))}
      </div>
    </>
  );
}
