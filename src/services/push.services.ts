const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

export const subscribeToPush = async () => {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service workers not supported");
  }

  // 1️⃣ Ask permission
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission denied");
  }

  // 2️⃣ Wait for SW
  const registration = await navigator.serviceWorker.ready;

  // Clear any stale subscription so we always register a fresh endpoint
  const existingSubscription = await registration.pushManager.getSubscription();
  if (existingSubscription) {
    try {
      await existingSubscription.unsubscribe();
    } catch (error) {
      // If we fail to unsubscribe, continue with a fresh subscribe attempt
      console.warn("Unable to unsubscribe existing push subscription", error);
    }
  }

  // 3️⃣ Convert VAPID key correctly
  const vapidKey = urlBase64ToUint8Array(
    import.meta.env.VITE_VAPID_PUBLIC_KEY
  );

  // 4️⃣ Subscribe
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: vapidKey,
  });

  return subscription;
};

export const deleteExpiredSubscription = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      console.log("❌ Deleted expired/invalid subscription from browser");
      
      // Also notify backend to delete the subscription
      await fetch("/api/notifications/", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }).catch(() => {
        // Backend deletion failure is non-critical
      });
    }
  } catch (error) {
    console.error("Error deleting subscription:", error);
  }
};

export const checkSubscriptionStatus = async (): Promise<boolean> => {
  try {
    if (!("serviceWorker" in navigator)) {
      return false;
    }
    
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription !== null;
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return false;
  }
};