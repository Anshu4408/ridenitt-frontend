import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import AvailableRidesComponent from "./Pages/Availablerides";
import ProfileComponent from "./Pages/Profile.tsx";
import Start from "./Pages/Start";
import Login from "./Pages/Login";
import Start1 from "./Pages/Start1";
import Start2 from "./Pages/Start2";
import NotFound from "./Pages/NotFound";
import Requests from "./Pages/Requests/Index";
import MyRides from "./Pages/MyRides";
import { ToastContainer } from "react-toastify";
import { AuthProvider, useAuth } from "./Hooks/useAuth";
import Navigation from "./Components/Navigation";
import LocationForm from "./Components/LocationForm";
import Notifications from "./Pages/Notifications";
import FaqAccordion from "./Pages/Faq";
import AccountPage from "./Pages/Account";
import LoadingScreen from "./Components/LoadingScreen";
import React from "react";
import NewAccountSignup from "./Pages/NewAccountSignup.tsx";
import Redirect from "./Components/Redirect.tsx";

const App: React.FC = () => {
  useEffect(() => {
    let deferredPrompt: any = null;

    const installBtn = document.getElementById("installBtn") as HTMLButtonElement;

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();                         
      deferredPrompt = e;                         
      installBtn.style.display = "block";          
    });

    installBtn?.addEventListener("click", async () => {
      if (!deferredPrompt) return;

      deferredPrompt.prompt();                     // show install dialog
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        console.log("App installed");
      } else {
        console.log("Install dismissed");
      }

      deferredPrompt = null;
      installBtn.style.display = "none";           // hide button
    });

  }, []);
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.log("Service Worker registration failed: ", err);
          });
      });
    }
  }, []);
  return (
    <AuthProvider>
      <CustomRouter />
      <ToastContainer />
    </AuthProvider>
  );
};

const CustomRouter = () => {
  const { authLoading, user, hasSignedUp } = useAuth();

  return (
    <BrowserRouter>
      <LoadingScreen isOpen={authLoading} />

      <Routes>
        <Route path="/start" element={<Start />} />
        <Route path="/start1" element={<Start1 />} />
        <Route path="/start2" element={<Start2 />} />
        <Route path="/faq" element={<FaqAccordion />} />

        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<NewAccountSignup />} />

        {authLoading ? null : !user ? (
          <>
            <Route path="*" element={<Redirect to="/start" />} />
          </>
        ) : !hasSignedUp ? (
          <>
            <Route path="*" element={<Redirect to="/sign-up" />} />
          </>
        ) : (
          <>
            <Route element={<Layout />}>
              <Route index element={<AvailableRidesComponent />} />

              <Route path="/create-ride" element={<LocationForm />} />
              <Route
                path="/suggestions"
                element={<AvailableRidesComponent />}
              />
              <Route path="/requests" element={<Requests />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/profile" element={<ProfileComponent />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/my-rides" element={<MyRides />} />
            </Route>
          </>
        )}

        <Route path="*" element={authLoading ? null : <NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const Layout = () => {
  return (
    <div>
      <Outlet />
      <Navigation />
    </div>
  );
};

export default App;
