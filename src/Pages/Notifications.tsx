import React from 'react'
import { useAuth } from '../Hooks/useAuth'
import axios from 'axios'
import { age } from '../Utils/datetime'
import { FaRegEnvelope } from 'react-icons/fa'
import Header from '../Components/Header'
import { subscribeToPush, deleteExpiredSubscription, checkSubscriptionStatus } from "../services/push.services";

export default function Notifications() {
  const [pushEnabled, setPushEnabled] = React.useState(false);
  const [pushLoading, setPushLoading] = React.useState(false);
  const { user } = useAuth()
  const [notifications, setNotifications] = React.useState<{ id: string, message: string, createdAt: string }[]>([])
  const [loading, setLoading] = React.useState(false)

  // Check subscription status on mount
  React.useEffect(() => {
    const checkStatus = async () => {
      const isSubscribed = await checkSubscriptionStatus();
      setPushEnabled(isSubscribed);
    };
    checkStatus();
  }, []);

  const enablePushNotifications = async () => {
    try {
      setPushLoading(true);

      // 1️⃣ Subscribe in browser
      const subscription = await subscribeToPush();

      // 2️⃣ Send subscription to backend
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(subscription),
      });

      if (!response.ok) {
        throw new Error(`Failed to save subscription: ${response.status}`);
      }

      setPushEnabled(true);
      alert("Push notifications enabled ✅");
    } catch (err) {
      console.error("❌ Push notification error:", err);
      // If subscription failed to save, clean it up from browser
      await deleteExpiredSubscription();
      setPushEnabled(false);
      alert("Failed to enable push notifications");
    } finally {
      setPushLoading(false);
    }
  };

  React.useEffect(() => {
    if (!user) {
      return
    }

    setLoading(true)

    axios.get('/api/notifications')
      .then(response => setNotifications(response.data.data))
      .catch(error => console.error(error))
      .finally(() => setLoading(false))
  }, [user])

  return (
    <div className='p-4 bg-neutral-100 min-h-screen'>
      <Header />
<div className='flex justify-between items-center'>
      <h1 className='mt-4 text-2xl text-green-600 font-semibold mb-4'>
        Notifications
      </h1>
       <div className="mb-4">
      <button
  onClick={enablePushNotifications}
  disabled={pushEnabled || pushLoading}
  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white ${
    pushEnabled
      ? "bg-gray-400"
      : "bg-green-600 hover:bg-green-700"
  }`}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0"
    />
  </svg>

  {pushEnabled
    ? "Push Notifications Enabled"
    : pushLoading
      ? "Enabling..."
      : "Enable Push Notifications"}
</button>
      </div>

</div>
      <ul>
        {loading ? <li>Loading...</li> : notifications.length === 0 && <li>No notifications</li>}

        {notifications.map(notification => (
          <li key={notification.id} className='bg-white p-2 mb-2 shadow rounded-lg'>
            <FaRegEnvelope className='text-neutral-600 inline-block mr-3' />
            {notification.message}

            <div className='text-right text-sm text-neutral-600'>
              {age(Date.now() - new Date(notification.createdAt).getTime())}
            </div>
          </li>
        ))}
      </ul>
     
    </div>
  )
}
