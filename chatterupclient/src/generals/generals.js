export const handleNotifications = ({
  title = "Notification",
  body,
  icon = null,
  onPermissionDenied,
  onPermissionGranted,
}) => {
  // Check if the browser supports notifications
  if (!("Notification" in window)) {
    console.error("This browser does not support desktop notifications.");
    return;
  }

  // Function to trigger the notification
  const showNotification = () => {
    new Notification(title, { body, icon, requireInteraction: false });
  };

  // Check the current permission status
  if (Notification.permission === "granted") {
    // Permission already granted, trigger notification
    showNotification();
  } else if (Notification.permission === "default") {
    // Request permission if it's in the default state
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        // If granted, trigger notification and execute callback if provided
        showNotification();
        if (onPermissionGranted) onPermissionGranted();
      } else if (permission === "denied") {
        // If denied, execute error callback or default behavior
        console.error(
          "Notification permission is required to send notifications."
        );
        if (onPermissionDenied) {
          onPermissionDenied();
        } else {
          alert(
            "Please enable notification permissions in your browser settings."
          );
        }
      }
    });
  } else if (Notification.permission === "denied") {
    // Permission previously denied
    console.error(
      "Notification permission was denied. Enable it in browser settings."
    );
    if (onPermissionDenied) {
      onPermissionDenied();
    } else {
      alert(
        "Notification permission is required. Please enable it in your browser settings."
      );
    }
  }
};