import React, { createContext, useCallback, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { getEnterAnimationClass, getExitAnimationClass } from "../../constant/constant";

const NotificationContext = createContext(undefined);

const NotificationContextApiProvider = ({ children }) => {
  const [notificationInfoArray, setNotificationInfoArray] = useState([]);

  const handelNotification = useCallback((data, direction = "top-right", timeOut = 3000) => {
    if (!data || !data.message) return;

    const notificationId = uuidv4();

    setNotificationInfoArray((previous) => [
      ...previous,
      {
        id: notificationId,
        success: data.success,
        message: data.message,
        notificationDirection: direction || "top-right",
        showNotification: true,
      },
    ]);

    setTimeout(() => {
      const element = document.getElementById(notificationId);
      if (!element) return;

      element.classList.remove(getEnterAnimationClass[direction || "top-right"]);
      element.classList.add(getExitAnimationClass[direction || "top-right"]);

      const onAnimationEnd = () => {
        setNotificationInfoArray((previous) => previous.filter((item) => item.id !== notificationId));
        element.removeEventListener("animationend", onAnimationEnd);
      };

      element.addEventListener("animationend", onAnimationEnd);
    }, timeOut || 3000);
  }, []);

  const NotificationContextValue = useMemo(
    () => ({
      notificationInfoArray,
      handelNotification,
    }),
    [notificationInfoArray, handelNotification]
  );

  return <NotificationContext.Provider value={NotificationContextValue}>{children}</NotificationContext.Provider>;
};

export { NotificationContext, NotificationContextApiProvider };
