export const getNotificationsById = async () => {
  const url = `${import.meta.env.VITE_API_URL}/notifications/`;
  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch bookings");
  }

  const result = await response.json();
  // ("Bookings", result);
  return result?.data;
};

export const updateNotificationReadStatus = async (notificationId) => {
  notificationId;
  const url = `${import.meta.env.VITE_API_URL}/notifications/${notificationId}`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to update notification status");
  }

  const data = await response.json();
  return data; // Returning updated notification status and message
};

export const deleteNotifications = async (notificationId) => {
  notificationId;
  const url = `${import.meta.env.VITE_API_URL}/notifications/${notificationId}/soft-delete`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to update notification status");
  }

  const data = await response.json();
  return data; // Returning updated notification status and message
};
